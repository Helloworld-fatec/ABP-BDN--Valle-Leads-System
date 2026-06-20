/**
 * 02_import_csv.ts
 * Lê o CSV de 1000 linhas e popula as coleções do MongoDB,
 * deduplicando lojas, equipes, usuários e clientes.
 *
 * Colunas do CSV:
 *   lead_id, team_name, user_name, user_email, customer_name,
 *   customer_email, customer_phone, customer_cpf, source, subject,
 *   lead_created_at, first_interaction_at, negotiation_importance,
 *   negotiation_stage, negotiation_status, is_open,
 *   negotiation_created_at, negotiation_updated_at, finalization_reason
 *
 * Dependências:
 *   npm install mongodb csv-parse
 *   npx ts-node 02_import_csv.ts
 *
 * Variáveis de ambiente:
 *   MONGO_URI=mongodb://localhost:27017  (padrão se não definida)
 *   CSV_PATH=./dados_dashboard_ficticios.csv  (padrão se não definida)
 */

import fs from "fs";
import path from "path";
import { parse } from "csv-parse";
import {
  MongoClient,
  Db,
  ObjectId,
  Collection,
  OptionalId,
} from "mongodb";
import crypto from "crypto";

// ─── config ──────────────────────────────────────────────────────────────────

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017";
const DB_NAME   = process.env.DB_NAME   ?? "crm_dashboard";
const CSV_PATH  = process.env.CSV_PATH  ?? "./dados_dashboard_ficticios.csv";

// Loja fictícia (o CSV não traz endereço; use uma loja-raiz ou ajuste conforme necessário)
const LOJA_NOME    = "Loja Principal";
const LOJA_ADDRESS = "Endereço não informado";

// ─── tipos ────────────────────────────────────────────────────────────────────

interface CsvRow {
  lead_id:                 string;
  team_name:               string;
  user_name:               string;
  user_email:              string;
  customer_name:           string;
  customer_email:          string;
  customer_phone:          string;
  customer_cpf:            string;
  source:                  string;
  subject:                 string;
  lead_created_at:         string;
  first_interaction_at:    string;
  negotiation_importance:  string;
  negotiation_stage:       string;
  negotiation_status:      string;
  is_open:                 string;
  negotiation_created_at:  string;
  negotiation_updated_at:  string;
  finalization_reason:     string;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

/** Gera UUID v4 determinístico a partir de uma string (para equipes e teams_ids). */
function uuidFromString(value: string): string {
  const hash = crypto.createHash("md5").update(value).digest("hex");
  // Formato UUID: 8-4-4-4-12
  return [
    hash.substring(0,  8),
    hash.substring(8,  12),
    "4" + hash.substring(13, 16),                       // versão 4
    ((parseInt(hash[16], 16) & 0x3) | 0x8).toString(16) + hash.substring(17, 20), // variante
    hash.substring(20, 32),
  ].join("-");
}

/** Converte string "TRUE"/"FALSE" para boolean. */
function parseBool(value: string): boolean {
  return value?.trim().toUpperCase() === "TRUE";
}

/** Converte string ISO de data para Date (retorna now() se vazia). */
function parseDate(value: string): Date {
  if (!value || value.trim() === "") return new Date();
  const d = new Date(value.trim());
  return isNaN(d.getTime()) ? new Date() : d;
}

/** Hash simples para password (em produção use bcrypt). */
function fakeHash(email: string): string {
  return crypto.createHash("sha256").update(email + "_secret").digest("hex");
}

/** Lê o CSV e retorna um array de objetos. */
function readCsv(filePath: string): Promise<CsvRow[]> {
  return new Promise((resolve, reject) => {
    const rows: CsvRow[] = [];
    fs.createReadStream(filePath)
      .pipe(
        parse({
          columns: true,         // usa a 1ª linha como cabeçalho
          skip_empty_lines: true,
          trim: true,
        })
      )
      .on("data", (row: CsvRow) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  // Verifica se o CSV existe
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`\n❌  Arquivo CSV não encontrado em: ${path.resolve(CSV_PATH)}`);
    console.error("     Defina a variável CSV_PATH com o caminho correto.\n");
    process.exit(1);
  }

  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log(`\n✅  Conectado ao MongoDB em: ${MONGO_URI}`);
    console.log(`📦  Banco: ${DB_NAME}\n`);

    const db = client.db(DB_NAME);

    // ── Leitura do CSV ────────────────────────────────────────────────────────
    console.log(`📄  Lendo CSV: ${path.resolve(CSV_PATH)} …`);
    const rows = await readCsv(CSV_PATH);
    console.log(`    ${rows.length} linhas carregadas.\n`);

    // ── PASSO 1: descobrir equipes únicas ─────────────────────────────────────
    // Mapas de deduplicação (chave semântica → ObjectId / UUID)
    const teamNameToUuid     = new Map<string, string>();   // team_name → UUID
    const userEmailToId      = new Map<string, ObjectId>(); // user_email → ObjectId
    const customerCpfToId    = new Map<string, ObjectId>(); // cpf → ObjectId
    const customerEmailToId  = new Map<string, ObjectId>(); // fallback: email → ObjectId
    const leadRowToId        = new Map<string, ObjectId>(); // lead_id (csv) → ObjectId

    // Gera UUID estável para cada equipe
    for (const row of rows) {
      const name = row.team_name?.trim();
      if (name && !teamNameToUuid.has(name)) {
        teamNameToUuid.set(name, uuidFromString(name));
      }
    }

    // ── PASSO 2: inserir loja com equipes embutidas ───────────────────────────
    console.log("🏬  Inserindo coleção 'lojas' …");
    const lojasCol = db.collection("lojas");

    const equipes = Array.from(teamNameToUuid.entries()).map(([name, team_id]) => ({
      team_id,
      name,
      is_active: true,
    }));

    const lojaDoc: OptionalId<Document> = {
      name:      LOJA_NOME,
      address:   LOJA_ADDRESS,
      is_active: true,
      created_at: new Date(),
      equipes,
    } as any;

    const lojaRes = await lojasCol.insertOne(lojaDoc as any);
    console.log(`    ✔  Loja inserida com _id: ${lojaRes.insertedId}  (${equipes.length} equipes)\n`);

    // ── PASSO 3: inserir usuários (consultores) ───────────────────────────────
    console.log("👤  Inserindo coleção 'usuarios' …");
    const usuariosCol = db.collection("usuarios");
    const usuarioDocs: any[] = [];

    // Agrupa teams por usuário (um consultor pode atuar em várias equipes)
    const userTeams = new Map<string, Set<string>>(); // email → set de team_ids
    for (const row of rows) {
      const email  = row.user_email?.trim();
      const teamId = teamNameToUuid.get(row.team_name?.trim()) ?? "";
      if (!userTeams.has(email)) userTeams.set(email, new Set());
      userTeams.get(email)!.add(teamId);
    }

    for (const row of rows) {
      const email = row.user_email?.trim();
      if (!email || userEmailToId.has(email)) continue;

      const userId   = new ObjectId();
      userEmailToId.set(email, userId);

      const teamsIds = Array.from(userTeams.get(email) ?? []);

      usuarioDocs.push({
        _id:           userId,
        email,
        password_hash: fakeHash(email),
        name:          row.user_name?.trim(),
        role:          "consultor",
        is_active:     true,
        teams_ids:     teamsIds,
        created_at:    new Date(),
      });
    }

    if (usuarioDocs.length > 0) {
      await usuariosCol.insertMany(usuarioDocs);
    }
    console.log(`    ✔  ${usuarioDocs.length} usuários inseridos.\n`);

    // ── PASSO 4: inserir clientes ─────────────────────────────────────────────
    console.log("👥  Inserindo coleção 'clientes' …");
    const clientesCol = db.collection("clientes");
    const clienteDocs: any[] = [];

    for (const row of rows) {
      const cpf   = row.customer_cpf?.trim();
      const email = row.customer_email?.trim();

      // Deduplicação por CPF (primário) ou email (fallback)
      const dedupeKey = cpf || email;
      if (!dedupeKey || customerCpfToId.has(dedupeKey)) continue;

      const clienteId = new ObjectId();
      customerCpfToId.set(dedupeKey, clienteId);
      if (email) customerEmailToId.set(email, clienteId);

      const teamId = teamNameToUuid.get(row.team_name?.trim()) ?? null;

      clienteDocs.push({
        _id:        clienteId,
        name:       row.customer_name?.trim(),
        email:      email || null,
        cpf:        cpf || null,
        phone:      row.customer_phone?.trim() || null,
        is_active:  true,
        team_id:    teamId,
        created_at: parseDate(row.lead_created_at),
      });
    }

    if (clienteDocs.length > 0) {
      await clientesCol.insertMany(clienteDocs);
    }
    console.log(`    ✔  ${clienteDocs.length} clientes inseridos.\n`);

    // ── PASSO 5: inserir leads ────────────────────────────────────────────────
    console.log("📋  Inserindo coleção 'leads' …");
    const leadsCol       = db.collection("leads");
    const negociacoesCol = db.collection("negociacoes");

    const leadDocs:       any[] = [];
    const negociacaoDocs: any[] = [];

    for (const row of rows) {
      // Resolução de chaves estrangeiras
      const cpf        = row.customer_cpf?.trim();
      const emailCli   = row.customer_email?.trim();
      const dedupeKey  = cpf || emailCli;
      const customerId = dedupeKey ? (customerCpfToId.get(dedupeKey) ?? null) : null;

      const attendantId = row.user_email?.trim()
        ? (userEmailToId.get(row.user_email.trim()) ?? null)
        : null;

      const teamId = teamNameToUuid.get(row.team_name?.trim()) ?? null;
      const isOpen = parseBool(row.is_open);

      const leadId  = new ObjectId();
      leadRowToId.set(row.lead_id, leadId);

      // Mapeamento de status CSV → campo is_active / status do lead
      const statusMap: Record<string, string> = {
        "Aberto":               "aberto",
        "Em negociação":        "em_negociacao",
        "Finalizado com venda": "finalizado_com_venda",
        "Finalizado sem venda": "finalizado_sem_venda",
      };
      const leadStatus = statusMap[row.negotiation_status?.trim()] ?? row.negotiation_status?.trim().toLowerCase();

      leadDocs.push({
        _id:              leadId,
        source:           row.source?.trim(),
        status:           leadStatus,
        is_active:        isOpen,
        vehicle_interest: row.subject?.trim() || null,
        customer_id:      customerId,
        team_id:          teamId,
        attendant_id:     attendantId,
        created_at:       parseDate(row.lead_created_at),
      });

      // ── Negociação vinculada a este lead ─────────────────────────────────
      const negId       = new ObjectId();
      const negCreated  = parseDate(row.negotiation_created_at);
      const negUpdated  = parseDate(row.negotiation_updated_at);

      negociacaoDocs.push({
        _id:        negId,
        lead_id:    leadId,
        team_id:    teamId,
        created_at: negCreated,

        status_history: [
          {
            status: leadStatus,
            notes:  row.finalization_reason?.trim() || null,
            date:   negUpdated,
          },
        ],

        stage_history: [
          {
            old_status: null,
            new_status: row.negotiation_stage?.trim(),
            notes:      null,
            date:       negCreated,
          },
        ],

        importance_history: [
          {
            importance: row.negotiation_importance?.trim(),
            notes:      null,
            date:       negCreated,
          },
        ],
      });
    }

    if (leadDocs.length > 0) {
      await leadsCol.insertMany(leadDocs);
    }
    console.log(`    ✔  ${leadDocs.length} leads inseridos.\n`);

    // ── PASSO 6: inserir negociações ──────────────────────────────────────────
    console.log("🤝  Inserindo coleção 'negociacoes' …");
    if (negociacaoDocs.length > 0) {
      await negociacoesCol.insertMany(negociacaoDocs);
    }
    console.log(`    ✔  ${negociacaoDocs.length} negociações inseridas.\n`);

    // ── PASSO 7: gerar logs de importação ────────────────────────────────────
    console.log("📝  Inserindo coleção 'logs' …");
    const logsCol = db.collection("logs");

    const logDocs = [
      {
        action:      "IMPORT",
        module:      "etl",
        description: `Importação do CSV com ${rows.length} linhas`,
        ip_address:  "127.0.0.1",
        user_id:     null,
        created_at:  new Date(),
      },
      {
        action:      "CREATE",
        module:      "lojas",
        description: `Loja '${LOJA_NOME}' criada com ${equipes.length} equipes`,
        ip_address:  "127.0.0.1",
        user_id:     null,
        created_at:  new Date(),
      },
      {
        action:      "CREATE",
        module:      "usuarios",
        description: `${usuarioDocs.length} usuários importados`,
        ip_address:  "127.0.0.1",
        user_id:     null,
        created_at:  new Date(),
      },
      {
        action:      "CREATE",
        module:      "clientes",
        description: `${clienteDocs.length} clientes importados`,
        ip_address:  "127.0.0.1",
        user_id:     null,
        created_at:  new Date(),
      },
      {
        action:      "CREATE",
        module:      "leads",
        description: `${leadDocs.length} leads importados`,
        ip_address:  "127.0.0.1",
        user_id:     null,
        created_at:  new Date(),
      },
      {
        action:      "CREATE",
        module:      "negociacoes",
        description: `${negociacaoDocs.length} negociações importadas`,
        ip_address:  "127.0.0.1",
        user_id:     null,
        created_at:  new Date(),
      },
    ];

    await logsCol.insertMany(logDocs);
    console.log(`    ✔  ${logDocs.length} registros de log inseridos.\n`);

    // ── Resumo ────────────────────────────────────────────────────────────────
    console.log("═══════════════════════════════════════════════");
    console.log("🎉  Importação concluída!");
    console.log(`    Linhas do CSV   : ${rows.length}`);
    console.log(`    Lojas           : 1  (${equipes.length} equipes)`);
    console.log(`    Usuários        : ${usuarioDocs.length}`);
    console.log(`    Clientes        : ${clienteDocs.length}`);
    console.log(`    Leads           : ${leadDocs.length}`);
    console.log(`    Negociações     : ${negociacaoDocs.length}`);
    console.log(`    Logs            : ${logDocs.length}`);
    console.log("═══════════════════════════════════════════════\n");

  } catch (err) {
    console.error("\n❌  Erro durante a importação:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();

/**
 * 03_queries_aggregations.ts
 * Executa todas as queries e aggregations obrigatórias do projeto.
 *
 * Dependências:
 *   npm install mongodb
 *   npx ts-node 03_queries_aggregations.ts
 */

import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017";
const DB_NAME   = process.env.DB_NAME   ?? "crm_dashboard";

function separator(title: string): void {
  console.log("\n" + "═".repeat(60));
  console.log(`  ${title}`);
  console.log("═".repeat(60));
}

function printResult(label: string, docs: any[]): void {
  console.log(`\n▶  ${label}  (${docs.length} resultado(s)):`);
  if (docs.length === 0) {
    console.log("   (nenhum resultado)");
    return;
  }
  docs.slice(0, 3).forEach((d, i) => console.log(`   [${i + 1}]`, JSON.stringify(d)));
  if (docs.length > 3) console.log(`   … e mais ${docs.length - 3} documento(s).`);
}

async function main(): Promise<void> {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log(`\n✅  Conectado ao MongoDB em: ${MONGO_URI}`);

    const db    = client.db(DB_NAME);
    const leads = db.collection("leads");
    const neg   = db.collection("negociacoes");

    // ════════════════════════════════════════════════════════════
    // PARTE 1 – QUERIES
    // ════════════════════════════════════════════════════════════
    separator("QUERIES");

    // 1. $and – Leads ativos vindos do Instagram
    const andQuery = await leads
      .find({ $and: [{ source: "Instagram" }, { is_active: true }] })
      .toArray();
    printResult("$and  |  Leads ativos do Instagram", andQuery);

    // 2. $or – Leads de WhatsApp ou Telefone
    const orQuery = await leads
      .find({ $or: [{ source: "WhatsApp" }, { source: "Telefone" }] })
      .toArray();
    printResult("$or   |  Leads de WhatsApp ou Telefone", orQuery);

    // 3. $gt – Leads criados após 2026-01-01
    const gtQuery = await leads
      .find({ created_at: { $gt: new Date("2026-01-01") } })
      .toArray();
    printResult("$gt   |  Leads criados após 2026-01-01", gtQuery);

    // 4. $lt – Leads criados antes de 2025-06-01
    const ltQuery = await leads
      .find({ created_at: { $lt: new Date("2025-06-01") } })
      .toArray();
    printResult("$lt   |  Leads criados antes de 2025-06-01", ltQuery);

    // 5. $exists – Leads com campo vehicle_interest existente
    const existsQuery = await leads
      .find({ vehicle_interest: { $exists: true, $ne: null } })
      .toArray();
    printResult("$exists  |  Leads com vehicle_interest preenchido", existsQuery);

    // 6. Projeção – apenas source, status e created_at
    const projQuery = await leads
      .find(
        { is_active: true },
        { projection: { _id: 0, source: 1, status: 1, created_at: 1 } }
      )
      .limit(5)
      .toArray();
    printResult("Projeção |  source + status + created_at (ativos)", projQuery);

    // 7. Ordenação + Paginação – página 2 (skip 5, limit 5), mais recentes primeiro
    const pagQuery = await leads
      .find()
      .sort({ created_at: -1 })
      .skip(5)
      .limit(5)
      .toArray();
    printResult("sort + skip + limit  |  Página 2 dos leads (5 por página)", pagQuery);

    // ════════════════════════════════════════════════════════════
    // PARTE 2 – AGGREGATIONS (Dashboard Gerencial)
    // ════════════════════════════════════════════════════════════
    separator("AGGREGATIONS");

    // 8. Leads por origem
    const bySource = await leads
      .aggregate([
        { $group: { _id: "$source", total: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ])
      .toArray();
    printResult("Leads por origem", bySource);

    // 9. Leads por status
    const byStatus = await leads
      .aggregate([
        { $group: { _id: "$status", total: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ])
      .toArray();
    printResult("Leads por status", byStatus);

    // 10. Leads por atendente (attendant_id) – join com usuarios para exibir nome
    const byAttendant = await leads
      .aggregate([
        {
          $group: {
            _id:   "$attendant_id",
            total: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from:         "usuarios",
            localField:   "_id",
            foreignField: "_id",
            as:           "usuario",
          },
        },
        {
          $addFields: {
            nome_atendente: {
              $ifNull: [{ $arrayElemAt: ["$usuario.name", 0] }, "Desconhecido"],
            },
          },
        },
        {
          $project: { usuario: 0 },
        },
        { $sort: { total: -1 } },
      ])
      .toArray();
    printResult("Leads por atendente", byAttendant);

    // 11. Leads por importância (via negociacoes.importance_history)
    const byImportance = await neg
      .aggregate([
        { $unwind: "$importance_history" },
        {
          $group: {
            _id:   "$importance_history.importance",
            total: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ])
      .toArray();
    printResult("Leads por importância (negociacoes)", byImportance);

    // 12. BÔNUS – Leads por stage (estágio da negociação)
    const byStage = await neg
      .aggregate([
        { $unwind: "$stage_history" },
        {
          $group: {
            _id: "$stage_history.new_status",
            total: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ])
      .toArray();
    printResult("Leads por estágio (stage_history)", byStage);

    // 13. BÔNUS – Taxa de conversão por origem
    const conversionRate = await leads
      .aggregate([
        {
          $group: {
            _id:       "$source",
            total:     { $sum: 1 },
            vendas:    {
              $sum: {
                $cond: [{ $eq: ["$status", "finalizado_com_venda"] }, 1, 0],
              },
            },
          },
        },
        {
          $addFields: {
            taxa_conversao_pct: {
              $round: [
                { $multiply: [{ $divide: ["$vendas", "$total"] }, 100] },
                1,
              ],
            },
          },
        },
        { $sort: { taxa_conversao_pct: -1 } },
      ])
      .toArray();
    printResult("Taxa de conversão por origem (%)", conversionRate);

    console.log("\n🎉  Todas as queries e aggregations executadas com sucesso!\n");
  } catch (err) {
    console.error("\n❌  Erro:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();

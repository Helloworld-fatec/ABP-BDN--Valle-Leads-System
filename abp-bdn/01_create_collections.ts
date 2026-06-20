/**
 * 01_create_collections.ts
 * Cria as coleções do MongoDB com validação de schema e índices.
 *
 * Dependências:
 *   npm install mongodb
 *   npx ts-node 01_create_collections.ts
 *
 * Variável de ambiente:
 *   MONGO_URI=mongodb://localhost:27017  (padrão se não definida)
 */

import { MongoClient, Db } from "mongodb";

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME ?? "crm_dashboard";

// ─── helpers ────────────────────────────────────────────────────────────────

async function dropIfExists(db: Db, name: string): Promise<void> {
  const list = await db.listCollections({ name }).toArray();
  if (list.length > 0) {
    await db.dropCollection(name);
    console.log(`  ↳ coleção '${name}' existente removida.`);
  }
}

// ─── main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    console.log(`\n✅  Conectado ao MongoDB em: ${MONGO_URI}`);
    console.log(`📦  Banco de dados: ${DB_NAME}\n`);

    const db = client.db(DB_NAME);

    // ── 1. lojas ──────────────────────────────────────────────────────────────
    await dropIfExists(db, "lojas");
    await db.createCollection("lojas", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "is_active", "created_at"],
          properties: {
            name:       { bsonType: "string" },
            address:    { bsonType: ["string", "null"] },
            is_active:  { bsonType: "bool" },
            created_at: { bsonType: "date" },
            equipes: {
              bsonType: "array",
              items: {
                bsonType: "object",
                required: ["team_id", "name", "is_active"],
                properties: {
                  team_id:  { bsonType: "string" },   // UUID como string
                  name:     { bsonType: "string" },
                  is_active: { bsonType: "bool" },
                },
              },
            },
          },
        },
      },
    });
    await db.collection("lojas").createIndex({ name: 1 }, { unique: true });
    console.log("✔  Coleção 'lojas' criada.");

    // ── 2. usuarios ───────────────────────────────────────────────────────────
    await dropIfExists(db, "usuarios");
    await db.createCollection("usuarios", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["email", "name", "role", "is_active", "created_at"],
          properties: {
            email:         { bsonType: "string" },
            password_hash: { bsonType: ["string", "null"] },
            name:          { bsonType: "string" },
            role:          { bsonType: "string" },
            is_active:     { bsonType: "bool" },
            teams_ids:     { bsonType: "array", items: { bsonType: "string" } },
            created_at:    { bsonType: "date" },
          },
        },
      },
    });
    await db.collection("usuarios").createIndex({ email: 1 }, { unique: true });
    console.log("✔  Coleção 'usuarios' criada.");

    // ── 3. clientes ───────────────────────────────────────────────────────────
    await dropIfExists(db, "clientes");
    await db.createCollection("clientes", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["name", "is_active", "created_at"],
          properties: {
            name:       { bsonType: "string" },
            email:      { bsonType: ["string", "null"] },
            cpf:        { bsonType: ["string", "null"] },
            phone:      { bsonType: ["string", "null"] },
            is_active:  { bsonType: "bool" },
            team_id:    { bsonType: ["string", "null"] },  // UUID como string
            created_at: { bsonType: "date" },
          },
        },
      },
    });
    await db.collection("clientes").createIndex({ cpf: 1 }, { sparse: true });
    await db.collection("clientes").createIndex({ email: 1 }, { sparse: true });
    console.log("✔  Coleção 'clientes' criada.");

    // ── 4. leads ──────────────────────────────────────────────────────────────
    await dropIfExists(db, "leads");
    await db.createCollection("leads", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["source", "status", "is_active", "created_at"],
          properties: {
            source:           { bsonType: "string" },
            status:           { bsonType: "string" },
            is_active:        { bsonType: "bool" },
            vehicle_interest: { bsonType: ["string", "null"] },
            customer_id:      { bsonType: ["objectId", "null"] },
            team_id:          { bsonType: ["string", "null"] },
            attendant_id:     { bsonType: ["objectId", "null"] },
            created_at:       { bsonType: "date" },
          },
        },
      },
    });
    await db.collection("leads").createIndex({ source: 1 });
    await db.collection("leads").createIndex({ status: 1 });
    await db.collection("leads").createIndex({ is_active: 1 });
    await db.collection("leads").createIndex({ customer_id: 1 });
    await db.collection("leads").createIndex({ attendant_id: 1 });
    await db.collection("leads").createIndex({ created_at: -1 });
    console.log("✔  Coleção 'leads' criada.");

    // ── 5. negociacoes ────────────────────────────────────────────────────────
    await dropIfExists(db, "negociacoes");
    await db.createCollection("negociacoes", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["lead_id", "created_at"],
          properties: {
            lead_id:    { bsonType: "objectId" },
            team_id:    { bsonType: ["string", "null"] },
            created_at: { bsonType: "date" },
            status_history: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  status: { bsonType: "string" },
                  notes:  { bsonType: ["string", "null"] },
                  date:   { bsonType: "date" },
                },
              },
            },
            stage_history: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  old_status: { bsonType: ["string", "null"] },
                  new_status: { bsonType: "string" },
                  notes:      { bsonType: ["string", "null"] },
                  date:       { bsonType: "date" },
                },
              },
            },
            importance_history: {
              bsonType: "array",
              items: {
                bsonType: "object",
                properties: {
                  importance: { bsonType: "string" },
                  notes:      { bsonType: ["string", "null"] },
                  date:       { bsonType: "date" },
                },
              },
            },
          },
        },
      },
    });
    await db.collection("negociacoes").createIndex({ lead_id: 1 });
    await db.collection("negociacoes").createIndex({ team_id: 1 });
    await db.collection("negociacoes").createIndex({ created_at: -1 });
    console.log("✔  Coleção 'negociacoes' criada.");

    // ── 6. logs ───────────────────────────────────────────────────────────────
    await dropIfExists(db, "logs");
    await db.createCollection("logs", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["action", "module", "created_at"],
          properties: {
            action:      { bsonType: "string" },
            module:      { bsonType: "string" },
            description: { bsonType: ["string", "null"] },
            ip_address:  { bsonType: ["string", "null"] },
            user_id:     { bsonType: ["objectId", "null"] },
            created_at:  { bsonType: "date" },
          },
        },
      },
    });
    await db.collection("logs").createIndex({ user_id: 1 });
    await db.collection("logs").createIndex({ action: 1 });
    await db.collection("logs").createIndex({ created_at: -1 });
    console.log("✔  Coleção 'logs' criada.");

    console.log("\n🎉  Todas as coleções foram criadas com sucesso!\n");
  } catch (err) {
    console.error("\n❌  Erro:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

main();

import { neon } from "@neondatabase/serverless";

const DATABASE_URL =
  process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || process.env.POSTGRES_URL;

export function isDbConfigured() {
  return Boolean(DATABASE_URL);
}

let sqlClient = null;
function getSql() {
  if (!DATABASE_URL) {
    throw new Error(
      "No database is configured. Set DATABASE_URL (a Postgres connection string) in your environment."
    );
  }
  if (!sqlClient) sqlClient = neon(DATABASE_URL);
  return sqlClient;
}

let schemaReady = null;

// Lazily creates the tables on first use — no separate migration step needed.
export async function ensureSchema() {
  const sql = getSql();
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          pin_hash TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'learner',
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )
      `;
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS users_name_lower_idx ON users (lower(name))`;
      await sql`
        CREATE TABLE IF NOT EXISTS progress (
          user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          topic_id TEXT NOT NULL,
          passed BOOLEAN NOT NULL DEFAULT false,
          best_score INTEGER NOT NULL DEFAULT 0,
          last_attempt TIMESTAMPTZ NOT NULL DEFAULT now(),
          PRIMARY KEY (user_id, topic_id)
        )
      `;
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  await schemaReady;
  return sql;
}

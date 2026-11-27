import fs from "node:fs";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.resolve(process.cwd(), ".env.local"));
loadEnvFile(path.resolve(process.cwd(), ".env"));

// Runs automatically before every `npm run build` (the "prebuild" script) with --if-configured,
// so each Vercel deployment creates the tables and seeds the topic quizzes before pages are rendered.
// Without a database (CI, local builds) the build continues and pages render without quizzes.
const ifConfigured = process.argv.includes("--if-configured");
const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!connectionString) {
  if (ifConfigured) {
    console.warn("[migrate] No DATABASE_URL set: skipping database setup and quiz seeding.");
    process.exit(0);
  }
  console.error("Missing DATABASE_URL_UNPOOLED or DATABASE_URL. Run `neon deploy` first.");
  process.exit(1);
}

const sql = neon(connectionString);

await sql`
  CREATE TABLE IF NOT EXISTS concept_progress (
    profile_id TEXT NOT NULL DEFAULT 'default',
    concept_id TEXT NOT NULL,
    used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (profile_id, concept_id)
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS prereq_progress (
    profile_id TEXT NOT NULL DEFAULT 'default',
    prereq_id TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (profile_id, prereq_id)
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS quiz_sets (
    id BIGSERIAL PRIMARY KEY,
    concept_id TEXT NOT NULL,
    set_index INTEGER NOT NULL,
    UNIQUE (concept_id, set_index)
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS quiz_questions (
    id BIGSERIAL PRIMARY KEY,
    set_id BIGINT NOT NULL REFERENCES quiz_sets(id) ON DELETE CASCADE,
    question_index INTEGER NOT NULL,
    prompt TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer INTEGER NOT NULL CHECK (correct_answer BETWEEN 0 AND 3),
    explanation TEXT NOT NULL,
    UNIQUE (set_id, question_index)
  )
`;

// Topic quizzes are seeded by the app itself (src/lib/quizzes.ts) the first time a quiz is
// loaded, so every deployment gets the current question set without a manual step.
console.log("Migration complete: progress, auth and quiz tables are ready. Quizzes are seeded by the app.");

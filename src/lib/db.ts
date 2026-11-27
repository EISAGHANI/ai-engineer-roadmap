import { neon } from "@neondatabase/serverless";
import type { Quiz, QuizQuestion } from "@/content/schema";

export interface ProgressSnapshot {
  used: Record<string, string>;
  prereqs: Record<string, boolean>;
}

let schemaReady: Promise<void> | null = null;

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. Run `neon deploy` or `neon env pull` to populate .env.local.");
  }
  return url;
}

export function getSql() {
  return neon(getDatabaseUrl());
}

/**
 * Ensures the progress tables exist in Neon Postgres.
 * Safe to call repeatedly; runs once per server process.
 */
export async function ensureProgressTables(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
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
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

export type QuizRow = {
  set_index: number;
  question_index: number;
  prompt: string;
  options: unknown;
  correct_answer: number;
  explanation: string;
};

export function buildQuizFromRows(conceptId: string, rows: QuizRow[]): Quiz | null {
  if (rows.length === 0) return null;

  const sets = new Map<number, QuizQuestion[]>();
  for (const row of rows) {
    const options = Array.isArray(row.options)
      ? row.options
      : typeof row.options === "string"
        ? (() => {
            try {
              return JSON.parse(row.options);
            } catch {
              return [];
            }
          })()
        : [];
    if (options.length !== 4) continue;

    const question: QuizQuestion = {
      prompt: row.prompt,
      options: options.map((option: unknown) => String(option)),
      correctAnswer: row.correct_answer,
      explanation: row.explanation,
    };
    const set = sets.get(row.set_index) ?? [];
    set[row.question_index] = question;
    sets.set(row.set_index, set);
  }

  const orderedSets = [...sets.entries()]
    .sort(([a], [b]) => a - b)
    .map(([, set]) => set.filter((question): question is QuizQuestion => Boolean(question)));
  const [questions, ...retakes] = orderedSets;
  if (!questions || questions.length !== 5) return null;

  return {
    conceptId,
    questions,
    retakes: retakes.filter((set) => set.length === 5),
  };
}

export async function getQuizFromDb(conceptId: string): Promise<Quiz | null> {
  // Builds without a database (CI, local) render the page without a quiz instead of failing.
  if (!process.env.DATABASE_URL) return null;
  await ensureProgressTables();
  const sql = getSql();
  const quizRows = await sql`
    SELECT qs.set_index, qq.question_index, qq.prompt, qq.options,
           qq.correct_answer, qq.explanation
    FROM quiz_sets qs
    JOIN quiz_questions qq ON qq.set_id = qs.id
    WHERE qs.concept_id = ${conceptId}
    ORDER BY qs.set_index, qq.question_index
  `;
  return buildQuizFromRows(conceptId, quizRows as QuizRow[]);
}

export async function checkDbHealth(): Promise<{ ok: boolean; database: string; now: string }> {
  const sql = getSql();
  const rows = (await sql`
    SELECT current_database() AS database, NOW()::text AS now
  `) as Array<{ database: string; now: string }>;
  const row = rows[0];
  return {
    ok: true,
    database: row?.database ?? "unknown",
    now: row?.now ?? new Date().toISOString(),
  };
}

export async function getProgressFromDb(profileId: string): Promise<ProgressSnapshot> {
  await ensureProgressTables();
  const sql = getSql();

  const [rawConceptRows, rawPrereqRows] = await Promise.all([
    sql`
      SELECT concept_id, used_at
      FROM concept_progress
      WHERE profile_id = ${profileId}
    `,
    sql`
      SELECT prereq_id, completed
      FROM prereq_progress
      WHERE profile_id = ${profileId} AND completed = TRUE
    `,
  ]);

  const conceptRows = rawConceptRows as Array<{ concept_id: string; used_at: Date | string }>;
  const prereqRows = rawPrereqRows as Array<{ prereq_id: string; completed: boolean }>;

  const used: Record<string, string> = {};
  for (const row of conceptRows) {
    used[row.concept_id] =
      row.used_at instanceof Date ? row.used_at.toISOString() : new Date(row.used_at).toISOString();
  }

  const prereqs: Record<string, boolean> = {};
  for (const row of prereqRows) {
    prereqs[row.prereq_id] = Boolean(row.completed);
  }

  return { used, prereqs };
}

export async function setConceptUsedInDb(
  profileId: string,
  conceptId: string,
  value: boolean,
  usedAt?: string,
): Promise<void> {
  await ensureProgressTables();
  const sql = getSql();

  if (value) {
    const timestamp = usedAt ?? new Date().toISOString();
    await sql`
      INSERT INTO concept_progress (profile_id, concept_id, used_at)
      VALUES (${profileId}, ${conceptId}, ${timestamp})
      ON CONFLICT (profile_id, concept_id)
      DO UPDATE SET used_at = EXCLUDED.used_at
    `;
  } else {
    await sql`
      DELETE FROM concept_progress
      WHERE profile_id = ${profileId} AND concept_id = ${conceptId}
    `;
  }
}

export async function setPrereqInDb(profileId: string, prereqId: string, completed: boolean): Promise<void> {
  await ensureProgressTables();
  const sql = getSql();

  if (completed) {
    await sql`
      INSERT INTO prereq_progress (profile_id, prereq_id, completed, updated_at)
      VALUES (${profileId}, ${prereqId}, TRUE, NOW())
      ON CONFLICT (profile_id, prereq_id)
      DO UPDATE SET completed = TRUE, updated_at = NOW()
    `;
  } else {
    await sql`
      DELETE FROM prereq_progress
      WHERE profile_id = ${profileId} AND prereq_id = ${prereqId}
    `;
  }
}

export async function replaceProgressInDb(profileId: string, snapshot: ProgressSnapshot): Promise<void> {
  await ensureProgressTables();
  const sql = getSql();

  await sql`DELETE FROM concept_progress WHERE profile_id = ${profileId}`;
  await sql`DELETE FROM prereq_progress WHERE profile_id = ${profileId}`;

  const conceptEntries = Object.entries(snapshot.used);
  if (conceptEntries.length > 0) {
    const conceptIds = conceptEntries.map(([id]) => id);
    const usedAts = conceptEntries.map(([, ts]) => ts);
    await sql`
      INSERT INTO concept_progress (profile_id, concept_id, used_at)
      SELECT ${profileId}, c_id, u_at::timestamptz
      FROM UNNEST(${conceptIds}::text[], ${usedAts}::text[]) AS t(c_id, u_at)
      ON CONFLICT (profile_id, concept_id)
      DO UPDATE SET used_at = EXCLUDED.used_at
    `;
  }

  const prereqIds = Object.entries(snapshot.prereqs)
    .filter(([, done]) => Boolean(done))
    .map(([id]) => id);
  if (prereqIds.length > 0) {
    await sql`
      INSERT INTO prereq_progress (profile_id, prereq_id, completed, updated_at)
      SELECT ${profileId}, p_id, TRUE, NOW()
      FROM UNNEST(${prereqIds}::text[]) AS t(p_id)
      ON CONFLICT (profile_id, prereq_id)
      DO UPDATE SET completed = TRUE, updated_at = NOW()
    `;
  }
}

export async function mergeProgressInDb(profileId: string, snapshot: ProgressSnapshot): Promise<void> {
  await ensureProgressTables();
  const sql = getSql();

  const conceptEntries = Object.entries(snapshot.used);
  if (conceptEntries.length > 0) {
    const conceptIds = conceptEntries.map(([id]) => id);
    const usedAts = conceptEntries.map(([, ts]) => ts);
    await sql`
      INSERT INTO concept_progress (profile_id, concept_id, used_at)
      SELECT ${profileId}, c_id, u_at::timestamptz
      FROM UNNEST(${conceptIds}::text[], ${usedAts}::text[]) AS t(c_id, u_at)
      ON CONFLICT (profile_id, concept_id)
      DO NOTHING
    `;
  }

  const prereqIds = Object.entries(snapshot.prereqs)
    .filter(([, done]) => Boolean(done))
    .map(([id]) => id);
  if (prereqIds.length > 0) {
    await sql`
      INSERT INTO prereq_progress (profile_id, prereq_id, completed, updated_at)
      SELECT ${profileId}, p_id, TRUE, NOW()
      FROM UNNEST(${prereqIds}::text[]) AS t(p_id)
      ON CONFLICT (profile_id, prereq_id)
      DO UPDATE SET completed = TRUE, updated_at = NOW()
    `;
  }
}

export async function clearProgressInDb(profileId: string): Promise<void> {
  await ensureProgressTables();
  const sql = getSql();

  await Promise.all([
    sql`DELETE FROM concept_progress WHERE profile_id = ${profileId}`,
    sql`DELETE FROM prereq_progress WHERE profile_id = ${profileId}`,
  ]);
}

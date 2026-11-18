import { neon } from "@neondatabase/serverless";

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
    })().catch((err) => {
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
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

import { concepts } from "@/content";
import type { Quiz } from "@/content/schema";
import { ensureProgressTables, getQuizFromDb, getSql } from "@/lib/db";
import { QUIZ_SEED_VERSION, buildQuizSeedRows } from "@/lib/quiz-seed";

let seeded: Promise<void> | null = null;

/**
 * Makes sure the quiz tables hold the current question set. Runs once per server or build
 * process: if the stored version differs (or nothing was ever seeded), it upserts all
 * 2,400 questions inside one transaction guarded by an advisory lock, so parallel build
 * workers don't seed at the same time. This replaces the manual `npm run db:migrate` step.
 */
export function ensureQuizzesSeeded(): Promise<void> {
  if (!seeded) {
    seeded = (async () => {
      await ensureProgressTables();
      const sql = getSql();
      await sql`CREATE TABLE IF NOT EXISTS quiz_meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)`;
      const current = (await sql`SELECT value FROM quiz_meta WHERE key = 'seed_version'`) as Array<{ value: string }>;
      if (current[0]?.value === QUIZ_SEED_VERSION) return;

      const rows = JSON.stringify(buildQuizSeedRows(concepts));
      await sql.transaction([
        sql`SELECT pg_advisory_xact_lock(727274)`,
        sql`
          WITH input AS (
            SELECT * FROM jsonb_to_recordset(${rows}::jsonb)
              AS x("conceptId" TEXT, "setIndex" INTEGER, "questionIndex" INTEGER,
                   prompt TEXT, options JSONB, "correctAnswer" INTEGER, explanation TEXT)
          ),
          sets AS (
            INSERT INTO quiz_sets (concept_id, set_index)
            SELECT "conceptId", "setIndex" FROM input GROUP BY "conceptId", "setIndex"
            ON CONFLICT (concept_id, set_index) DO UPDATE SET set_index = EXCLUDED.set_index
            RETURNING id, concept_id, set_index
          )
          INSERT INTO quiz_questions (set_id, question_index, prompt, options, correct_answer, explanation)
          SELECT s.id, x."questionIndex", x.prompt, x.options, x."correctAnswer", x.explanation
          FROM input x JOIN sets s ON s.concept_id = x."conceptId" AND s.set_index = x."setIndex"
          ON CONFLICT (set_id, question_index) DO UPDATE SET
            prompt = EXCLUDED.prompt,
            options = EXCLUDED.options,
            correct_answer = EXCLUDED.correct_answer,
            explanation = EXCLUDED.explanation
        `,
        sql`
          INSERT INTO quiz_meta (key, value) VALUES ('seed_version', ${QUIZ_SEED_VERSION})
          ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
        `,
      ]);
      console.log(`[quiz] Seeded topic quizzes (version ${QUIZ_SEED_VERSION}).`);
    })().catch((err) => {
      seeded = null;
      throw err;
    });
  }
  return seeded;
}

/** The topic quiz for a concept, seeding the database first if needed. Null without a database. */
export async function getQuiz(conceptId: string): Promise<Quiz | null> {
  if (!process.env.DATABASE_URL) return null;
  await ensureQuizzesSeeded();
  return getQuizFromDb(conceptId);
}

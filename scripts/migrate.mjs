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

const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!connectionString) {
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

const areaNames = {
  llm: "LLM",
  rag: "RAG",
  agents: "AI Agents",
  evals: "Evals",
  "system-design": "AI System Design",
  security: "AI Security",
  deployment: "Deployment",
  backend: "Backend",
};

function readConceptSeeds() {
  const conceptsDir = path.resolve(process.cwd(), "src/content/concepts");
  const seeds = [];
  for (const fileName of fs.readdirSync(conceptsDir).filter((name) => name.endsWith(".ts"))) {
    const source = fs.readFileSync(path.join(conceptsDir, fileName), "utf8");
    const starts = [...source.matchAll(/\bid:\s*"([^"]+)"/g)];
    for (let index = 0; index < starts.length; index += 1) {
      const start = starts[index].index;
      const end = index + 1 < starts.length ? starts[index + 1].index : source.length;
      const block = source.slice(start, end);
      const id = starts[index][1];
      const nameMatch = block.match(/\bname:\s*"([^"]+)"/);
      const officialMatch = block.match(/\bofficial:\s*(?:\n\s*)?"([^"]+)"/);
      const kidMatch = block.match(/\bkid:\s*(?:\n\s*)?"([^"]+)"/);
      const area = id.slice(0, id.lastIndexOf("-"));
      if (!nameMatch || !officialMatch) continue;
      seeds.push({
        id,
        name: nameMatch[1],
        official: officialMatch[1],
        kid: kidMatch?.[1] ?? officialMatch[1],
        area,
        tier: block.includes('tier: "base"') ? "base" : "production",
      });
    }
  }
  return seeds.sort((a, b) => a.id.localeCompare(b.id));
}

function fourOptions(correct, distractors) {
  const unique = [...new Set([correct, ...distractors])].slice(0, 4);
  while (unique.length < 4) unique.push(`Not applicable: ${unique.length}`);
  return [unique[0], unique[1], unique[2], unique[3]];
}

function buildQuizRows(concepts) {
  const rows = [];
  const byArea = Object.values(areaNames);
  for (const concept of concepts) {
    const areaName = areaNames[concept.area] ?? concept.area;
    const otherAreas = byArea.filter((name) => name !== areaName);
    const nameOptions = concepts
      .filter((item) => item.id !== concept.id)
      .slice(concept.id.endsWith("-01") ? 0 : 20, concept.id.endsWith("-01") ? 4 : 24)
      .map((item) => item.name);

    const sets = [
      [
        {
          prompt: `What is ${concept.name}?`,
          options: fourOptions(concept.official, ["A database table name", "An unrelated deployment tool", "A JavaScript framework"]),
          correctAnswer: 0,
          explanation: concept.official,
        },
        {
          prompt: `Which learning area contains ${concept.name}?`,
          options: [areaName, otherAreas[0], otherAreas[1], otherAreas[2]],
          correctAnswer: 0,
          explanation: `${concept.name} belongs to the ${areaName} area.`,
        },
        {
          prompt: `Which roadmap tier is ${concept.name} assigned to?`,
          options: [concept.tier === "base" ? "The base tier" : "The production tier", "The executive tier", "The archive tier", "The project-only tier"],
          correctAnswer: 0,
          explanation: `${concept.name} is a ${concept.tier} roadmap concept.`,
        },
        {
          prompt: `What kind of learning objective is ${concept.name}?`,
          options: [concept.official, "A deployment incident", "A software license", "A project deadline"],
          correctAnswer: 0,
          explanation: concept.official,
        },
        {
          prompt: `Which statement is most useful for beginning ${concept.name}?`,
          options: [concept.kid, "Memorize all provider secrets", "Skip the prerequisites", "Deploy without testing"],
          correctAnswer: 0,
          explanation: concept.kid,
        },
      ],
      [
        {
          prompt: `Which description most accurately explains ${concept.name}?`,
          options: [concept.official, "It replaces every model", "It guarantees perfect outputs", "It removes the need for testing"],
          correctAnswer: 0,
          explanation: concept.official,
        },
        {
          prompt: `In the roadmap, which area should you study alongside ${concept.name}?`,
          options: [areaName, "Unrelated frontend styling", "Database backup only", "No area"],
          correctAnswer: 0,
          explanation: `${concept.name} is organized in the ${areaName} learning area.`,
        },
        {
          prompt: `Which concept is distinct from ${concept.name}?`,
          options: [nameOptions[0] ?? "A separate roadmap concept", concept.name, concept.name, concept.name],
          correctAnswer: 0,
          explanation: `${nameOptions[0] ?? "The alternate concept"} is a separate roadmap concept, while ${concept.name} is the current topic.`,
        },
        {
          prompt: `When applying ${concept.name}, what should come first?`,
          options: ["Understand its purpose and verify behavior", "Ignore the official definition", "Skip validation", "Assume every provider works identically"],
          correctAnswer: 0,
          explanation: `Start by understanding ${concept.name}, then test its behavior in the relevant application context.`,
        },
        {
          prompt: `Which statement is consistent with ${concept.name}?`,
          options: [concept.kid, "It has no practical use", "It is unrelated to AI engineering", "It should be used blindly"],
          correctAnswer: 0,
          explanation: concept.kid,
        },
      ],
      [
        {
          prompt: `Which implementation choice best fits ${concept.name}?`,
          options: ["Apply the concept where its stated purpose is needed", "Use it without measuring behavior", "Add it to every unrelated request", "Remove validation"],
          correctAnswer: 0,
          explanation: `${concept.name} is useful only when its stated purpose matches the application need.`,
        },
        {
          prompt: `How should you evaluate ${concept.name} in production?`,
          options: ["Measure behavior against a representative workload", "Trust the first example", "Disable monitoring", "Avoid repeatable tests"],
          correctAnswer: 0,
          explanation: `Measure ${concept.name} with representative inputs and preserve repeatable validation.`,
        },
        {
          prompt: `Which description belongs to ${concept.name} rather than another area?`,
          options: [concept.official, "A company reorganization policy", "A random CSS color", "An operating-system login screen"],
          correctAnswer: 0,
          explanation: concept.official,
        },
        {
          prompt: `What is a safe learning step for ${concept.name}?`,
          options: ["Build a small example and inspect the result", "Copy output without understanding", "Skip all prerequisites", "Treat one demo as universal proof"],
          correctAnswer: 0,
          explanation: `Small examples make ${concept.name} easier to understand and verify.`,
        },
        {
          prompt: `Which tier reflects ${concept.name}'s roadmap stage?`,
          options: [concept.tier === "base" ? "Base: establish the fundamentals" : "Production: apply it in real systems", "A separate course", "No roadmap tier"],
          correctAnswer: 0,
          explanation: `${concept.name} is assigned to the ${concept.tier} tier.`,
        },
      ],
    ];

    sets.forEach((questions, setIndex) => {
      questions.forEach((question, questionIndex) => {
        rows.push({
          conceptId: concept.id,
          setIndex,
          questionIndex,
          prompt: question.prompt,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
        });
      });
    });
  }
  return rows;
}

const conceptSeeds = readConceptSeeds();
const quizRows = buildQuizRows(conceptSeeds);
await sql`
  WITH input AS (
    SELECT * FROM jsonb_to_recordset(${JSON.stringify(quizRows)}::jsonb)
      AS x(
        "conceptId" TEXT,
        "setIndex" INTEGER,
        "questionIndex" INTEGER,
        prompt TEXT,
        options JSONB,
        "correctAnswer" INTEGER,
        explanation TEXT
      )
  ),
  sets AS (
    INSERT INTO quiz_sets (concept_id, set_index)
    SELECT "conceptId", "setIndex"
    FROM input
    GROUP BY "conceptId", "setIndex"
    ON CONFLICT (concept_id, set_index)
    DO UPDATE SET set_index = EXCLUDED.set_index
    RETURNING id, concept_id, set_index
  ),
  questions AS (
    SELECT s.id AS set_id, x."questionIndex", x.prompt, x.options,
           x."correctAnswer", x.explanation
    FROM input x
    JOIN sets s
      ON s.concept_id = x."conceptId" AND s.set_index = x."setIndex"
  )
  INSERT INTO quiz_questions (
    set_id, question_index, prompt, options, correct_answer, explanation
  )
  SELECT set_id, "questionIndex", prompt, options, "correctAnswer", explanation
  FROM questions
  ON CONFLICT (set_id, question_index)
  DO UPDATE SET
    prompt = EXCLUDED.prompt,
    options = EXCLUDED.options,
    correct_answer = EXCLUDED.correct_answer,
    explanation = EXCLUDED.explanation
`;

console.log(`Migration complete: progress, auth, and ${conceptSeeds.length * 3 * 5}-question database quiz seed are ready.`);

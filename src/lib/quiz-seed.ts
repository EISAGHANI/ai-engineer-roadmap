import type { Concept } from "@/content/schema";

/**
 * Builds the topic-check questions (3 sets x 5 questions) for every concept from the
 * typed content, so text with quotes is never cut off. Answer options are shuffled
 * deterministically per question, so the correct answer is not always in position A
 * but the order stays the same between builds.
 */

/** Bump this when the generator changes; the database is re-seeded once per version. */
export const QUIZ_SEED_VERSION = "2026-11-27.2";

const AREA_NAMES: Record<string, string> = {
  llm: "LLM",
  rag: "RAG",
  agents: "AI Agents",
  evals: "Evals",
  "system-design": "AI System Design",
  security: "AI Security",
  deployment: "Deployment",
  backend: "Backend",
};

export interface QuizSeedRow {
  conceptId: string;
  setIndex: number;
  questionIndex: number;
  prompt: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
}

interface Draft {
  prompt: string;
  correct: string;
  wrong: [string, string, string];
  explanation: string;
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic Fisher-Yates shuffle seeded by a string. */
function shuffle<T>(items: T[], seed: string): T[] {
  const out = [...items];
  let state = hash(seed) || 1;
  for (let i = out.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = (state >>> 16) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Picks `count` distinct values from `pool` that differ from every value in `exclude`. */
function pickDistinct(pool: string[], exclude: string[], count: number, seed: string): string[] {
  const banned = new Set(exclude.map((x) => x.toLowerCase()));
  const picked: string[] = [];
  for (const value of shuffle(pool, seed)) {
    const key = value.toLowerCase();
    if (banned.has(key)) continue;
    banned.add(key);
    picked.push(value);
    if (picked.length === count) break;
  }
  return picked;
}

export function buildQuizSeedRows(concepts: Concept[]): QuizSeedRow[] {
  const rows: QuizSeedRow[] = [];
  const allOfficial = concepts.map((c) => c.official);
  const allNames = concepts.map((c) => c.name);

  for (const c of concepts) {
    const areaName = AREA_NAMES[c.area] ?? c.area;
    const kid = c.kid ?? c.official;
    const otherAreas = Object.values(AREA_NAMES).filter((n) => n !== areaName);
    const sameArea = concepts.filter((x) => x.area === c.area && x.id !== c.id);
    const otherAreaConcepts = concepts.filter((x) => x.area !== c.area);
    const seed = (n: number) => `${c.id}:${n}`;

    const wrongOfficial = pickDistinct(
      sameArea.map((x) => x.official),
      [c.official],
      3,
      seed(1),
    ) as [string, string, string];
    const wrongOfficialAny = pickDistinct(allOfficial, [c.official], 3, seed(2)) as [string, string, string];
    const wrongAreas = pickDistinct(otherAreas, [areaName], 3, seed(3)) as [string, string, string];
    const wrongNamesSameArea = pickDistinct(
      sameArea.map((x) => x.name),
      [c.name],
      3,
      seed(4),
    ) as [string, string, string];
    const wrongNamesOtherAreas = pickDistinct(
      otherAreaConcepts.map((x) => x.name),
      [c.name, ...sameArea.map((x) => x.name)],
      3,
      seed(5),
    ) as [string, string, string];
    const pitfall = c.engineering?.pitfalls?.[0];
    const tierLabel = c.tier === "base" ? "The base (01-10)" : "Production level (11-20)";
    const otherTier = c.tier === "base" ? "Production level (11-20)" : "The base (01-10)";

    const sets: Draft[][] = [
      [
        {
          prompt: `What is ${c.name}?`,
          correct: c.official,
          wrong: wrongOfficial,
          explanation: c.official,
        },
        {
          prompt: `Which area of the roadmap does ${c.name} belong to?`,
          correct: areaName,
          wrong: wrongAreas,
          explanation: `${c.name} is concept ${String(c.number).padStart(2, "0")} of the ${areaName} area.`,
        },
        {
          prompt: `Which concept does this describe? "${c.official}"`,
          correct: c.name,
          wrong: wrongNamesSameArea,
          explanation: `That is the official one-liner for ${c.name}.`,
        },
        {
          prompt: `In which part of the ${areaName} area is ${c.name}?`,
          correct: tierLabel,
          wrong: [otherTier, "Prerequisites, before the roadmap starts", "The portfolio projects at the end"],
          explanation: `${c.name} is concept ${String(c.number).padStart(2, "0")}, so it is in ${tierLabel.toLowerCase()}.`,
        },
        {
          prompt: `Which simple explanation fits ${c.name}?`,
          correct: kid,
          wrong: pickDistinct(
            concepts.map((x) => x.kid ?? x.official),
            [kid],
            3,
            seed(6),
          ) as [string, string, string],
          explanation: kid,
        },
      ],
      [
        {
          prompt: `Which one-liner from the roadmap describes ${c.name}?`,
          correct: c.official,
          wrong: wrongOfficialAny,
          explanation: c.official,
        },
        {
          prompt: `Which of these concepts is also in the ${areaName} area, like ${c.name}?`,
          correct: wrongNamesSameArea[0] ?? areaName,
          wrong: wrongNamesOtherAreas,
          explanation: `${wrongNamesSameArea[0]} is in ${areaName}; the other options belong to other areas.`,
        },
        {
          prompt: `Which statement about ${c.name} is true?`,
          correct: c.official,
          wrong: [
            `${c.name} guarantees correct answers, so testing is not needed.`,
            `${c.name} only matters for teams that train their own models.`,
            `${c.name} was replaced by newer techniques and is no longer used.`,
          ],
          explanation: c.official,
        },
        {
          prompt: `When should you tick ${c.name} as done on this roadmap?`,
          correct: "When you have used it in code yourself",
          wrong: [
            "After watching a video about it",
            "As soon as you have read the one-liner",
            "Only after finishing every area",
          ],
          explanation: "The roadmap's rule: tick a concept only once you have used it in code.",
        },
        {
          prompt: `Which concept is NOT part of the ${areaName} area?`,
          correct: wrongNamesOtherAreas[0],
          wrong: [c.name, ...wrongNamesSameArea.slice(0, 2)] as [string, string, string],
          explanation: `${wrongNamesOtherAreas[0]} belongs to a different area; the others are in ${areaName}.`,
        },
      ],
      [
        {
          prompt: `A teammate asks what ${c.name} means. What is the best short answer?`,
          correct: c.official,
          wrong: pickDistinct(allOfficial, [c.official, ...wrongOfficialAny], 3, seed(7)) as [
            string,
            string,
            string,
          ],
          explanation: c.official,
        },
        pitfall
          ? {
              prompt: `Which of these is a real pitfall of ${c.name}?`,
              correct: pitfall,
              wrong: [
                `${c.name} has no failure modes once it is configured.`,
                `${c.name} makes evaluation and monitoring unnecessary.`,
                `${c.name} always lowers both cost and latency.`,
              ],
              explanation: pitfall,
            }
          : {
              prompt: `What is a safe way to learn ${c.name}?`,
              correct: "Build a small example and check the result",
              wrong: ["Copy output without reading it", "Skip the base concepts", "Treat one demo as proof"],
              explanation: `A small, checked example is the fastest way to understand ${c.name}.`,
            },
        {
          prompt: `How do you know ${c.name} is working in your app?`,
          correct: "Measure it on representative test cases",
          wrong: ["Trust the first output you see", "Turn off logging", "Ask the model if it worked"],
          explanation: `Check ${c.name} with repeatable tests on realistic inputs, not a single example.`,
        },
        {
          prompt: `Which concept name matches this simple explanation? "${kid}"`,
          correct: c.name,
          wrong: pickDistinct(allNames, [c.name, ...wrongNamesSameArea], 3, seed(8)) as [string, string, string],
          explanation: `That is the "Explain like I'm 8" line for ${c.name}.`,
        },
        {
          prompt: `Which area of the roadmap would you open to study ${c.name}?`,
          correct: areaName,
          wrong: pickDistinct(otherAreas, [areaName], 3, seed(9)) as [string, string, string],
          explanation: `${c.name} is in ${areaName}.`,
        },
      ],
    ];

    sets.forEach((set, setIndex) => {
      set.forEach((draft, questionIndex) => {
        const options = shuffle([draft.correct, ...draft.wrong], `${c.id}:${setIndex}:${questionIndex}`);
        rows.push({
          conceptId: c.id,
          setIndex,
          questionIndex,
          prompt: draft.prompt,
          options: options as [string, string, string, string],
          correctAnswer: options.indexOf(draft.correct),
          explanation: draft.explanation,
        });
      });
    });
  }
  return rows;
}

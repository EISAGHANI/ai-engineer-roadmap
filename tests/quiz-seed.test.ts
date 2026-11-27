import { describe, expect, it } from "vitest";
import { concepts } from "@/content";
import { buildQuizSeedRows } from "@/lib/quiz-seed";

describe("topic quiz generator", () => {
  const rows = buildQuizSeedRows(concepts);

  it("builds 3 sets of 5 questions for all 160 concepts", () => {
    expect(rows).toHaveLength(160 * 3 * 5);
  });

  it("gives every question four different, non-empty options and a valid answer", () => {
    for (const r of rows) {
      const id = `${r.conceptId} ${r.setIndex}.${r.questionIndex}`;
      expect(new Set(r.options).size, id).toBe(4);
      expect(r.options.every((o) => o.trim().length > 0), id).toBe(true);
      expect(r.correctAnswer, id).toBeGreaterThanOrEqual(0);
      expect(r.correctAnswer, id).toBeLessThan(4);
    }
  });

  it("spreads the correct answer over all four positions", () => {
    const counts = [0, 0, 0, 0];
    for (const r of rows) counts[r.correctAnswer] += 1;
    for (const n of counts) expect(n).toBeGreaterThan(rows.length * 0.15);
  });

  it("is deterministic between builds", () => {
    expect(buildQuizSeedRows(concepts)).toEqual(rows);
  });
});

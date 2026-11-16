import { describe, expect, it } from "vitest";
import { countUsed, streakDays } from "@/lib/progress-utils";

describe("progress helpers", () => {
  it("counts used concepts overall and per area", () => {
    const used = { "llm-01": "2026-11-16T10:00:00.000Z", "llm-02": "2026-11-16T10:00:00.000Z", "rag-01": "2026-11-15T10:00:00.000Z" };
    expect(countUsed(used)).toBe(3);
    expect(countUsed(used, "llm")).toBe(2);
    expect(countUsed(used, "rag")).toBe(1);
    expect(countUsed(used, "backend")).toBe(0);
  });

  it("computes a streak ending today", () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const used = { "llm-01": today.toISOString(), "llm-02": yesterday.toISOString() };
    expect(streakDays(used)).toBe(2);
    expect(streakDays({})).toBe(0);
  });
});

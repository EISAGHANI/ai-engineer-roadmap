import { describe, expect, it } from "vitest";
import {
  areas,
  concepts,
  phases,
  projects,
  getConcept,
  getProject,
  areasInLearningOrder,
} from "@/content";
import { AREA_IDS } from "@/content/schema";

describe("roadmap content", () => {
  it("has 8 areas with 20 concepts each (160 total)", () => {
    expect(areas).toHaveLength(8);
    expect(concepts).toHaveLength(160);
    for (const areaId of AREA_IDS) {
      const list = concepts.filter((c) => c.area === areaId);
      expect(list, areaId).toHaveLength(20);
      const numbers = list.map((c) => c.number).sort((a, b) => a - b);
      expect(numbers).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
    }
  });

  it("has unique ids and slugs", () => {
    const ids = new Set(concepts.map((c) => c.id));
    expect(ids.size).toBe(160);
    const slugs = new Set(concepts.map((c) => `${c.area}/${c.slug}`));
    expect(slugs.size).toBe(160);
  });

  it("uses the base/production tier split 01-10 / 11-20", () => {
    for (const c of concepts) {
      expect(c.tier, c.id).toBe(c.number <= 10 ? "base" : "production");
    }
  });

  it("keeps every official one-liner non-empty", () => {
    for (const c of concepts) {
      expect(c.official.trim().length, c.id).toBeGreaterThan(10);
    }
  });

  it("resolves every related concept and project id", () => {
    for (const c of concepts) {
      for (const r of c.related) {
        expect(getConcept(r), `${c.id} -> related ${r}`).toBeDefined();
        expect(r, `${c.id} links to itself`).not.toBe(c.id);
      }
      for (const p of c.projects) {
        expect(getProject(p), `${c.id} -> project ${p}`).toBeDefined();
      }
    }
    for (const p of projects) {
      for (const cid of p.concepts) {
        expect(getConcept(cid), `${p.id} -> concept ${cid}`).toBeDefined();
      }
    }
  });

  it("gives every area a build-this project", () => {
    for (const a of areas) {
      const p = getProject(a.buildThis);
      expect(p, a.id).toBeDefined();
      expect(p?.kind).toBe("build-this");
      expect(p?.area).toBe(a.id);
    }
  });

  it("covers all 8 areas across phases 0-7", () => {
    expect(phases.map((p) => p.number)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    const covered = new Set(phases.flatMap((p) => p.areas));
    for (const areaId of AREA_IDS) expect(covered.has(areaId), areaId).toBe(true);
  });

  it("orders areas for learning by phase (Backend first, Security last)", () => {
    expect(areasInLearningOrder[0]?.id).toBe("backend");
    expect(areasInLearningOrder.at(-1)?.id).toBe("security");
  });

  it("keeps kid explanations short and plain", () => {
    const jargon = [
      "token",
      "vector",
      "embedding",
      "api",
      "cache",
      "latency",
      "schema",
      "protocol",
      "database",
      "parameter",
      "inference",
      "endpoint",
      "container",
      "cluster",
      "json",
      "http",
      "jwt",
      "gpu",
    ];
    for (const c of concepts) {
      if (!c.kid) continue;
      expect(c.kid.length, c.id).toBeLessThanOrEqual(220);
      const own = c.name.toLowerCase();
      for (const word of jargon) {
        if (own.includes(word)) continue;
        expect(new RegExp(`\\b${word}s?\\b`, "i").test(c.kid), `${c.id} uses "${word}"`).toBe(false);
      }
    }
  });
});

import { describe, expect, it } from "vitest";
import { concepts, areas, phases, projects, prerequisites } from "@/content";
import { getContent } from "@/content/localized";
import de from "@/content/i18n/de";
import en from "@/i18n/messages/en";
import deMessages from "@/i18n/messages/de";
import { localePath, stripLocale } from "@/i18n/config";

/** Recursively collect the key paths of a dictionary object. */
function keyPaths(obj: unknown, prefix = ""): string[] {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) return [prefix];
  return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => keyPaths(v, prefix ? `${prefix}.${k}` : k));
}

describe("German locale", () => {
  it("translates every concept with all three layers", () => {
    for (const c of concepts) {
      const t = de.concepts[c.id];
      expect(t, `${c.id} has no German translation`).toBeDefined();
      expect(t?.official, `${c.id} official`).toBeTruthy();
      expect(t?.kid, `${c.id} kid`).toBeTruthy();
      expect(t?.realWorld, `${c.id} realWorld`).toBeDefined();
      expect(t?.engineering?.text, `${c.id} engineering`).toBeTruthy();
      expect(t?.engineering?.pitfalls?.length ?? 0, `${c.id} pitfalls`).toBe(c.engineering?.pitfalls?.length ?? 0);
    }
    const known = new Set(concepts.map((c) => c.id));
    for (const id of Object.keys(de.concepts)) expect(known.has(id), `unknown id ${id}`).toBe(true);
  });

  it("keeps German kid lines short: at most 220 characters and 2 sentences", () => {
    for (const [id, t] of Object.entries(de.concepts)) {
      const kid = t.kid ?? "";
      expect(kid.length, id).toBeLessThanOrEqual(220);
      const sentences = kid.split(/[.!?](?=\s|$)/).filter((s) => s.trim()).length;
      expect(sentences, `${id} has ${sentences} sentences`).toBeLessThanOrEqual(2);
    }
  });

  it("builds valid German content and never changes ids, slugs, code or the official line", () => {
    const content = getContent("de");
    expect(content.concepts).toHaveLength(160);
    for (const c of content.concepts) {
      const original = concepts.find((x) => x.id === c.id)!;
      expect(c.slug).toBe(original.slug);
      expect(c.official).toBe(original.official);
      expect(c.engineering?.code).toEqual(original.engineering?.code);
      expect(c.officialTranslation, c.id).toBeTruthy();
    }
    expect(content.areas.map((a) => a.id)).toEqual(areas.map((a) => a.id));
    expect(content.phases).toHaveLength(phases.length);
    expect(content.projects.map((p) => p.id)).toEqual(projects.map((p) => p.id));
    expect(content.prerequisites).toHaveLength(prerequisites.length);
  });

  it("translates every area summary, phase, prerequisite and project", () => {
    for (const a of areas) expect(de.areas[a.id]?.summary, a.id).toBeTruthy();
    for (const p of phases) expect(de.phases[p.number], `phase ${p.number}`).toBeDefined();
    for (const p of prerequisites) expect(de.prerequisites[p.id], p.id).toBeDefined();
    for (const p of projects) expect(de.projects[p.id], p.id).toBeDefined();
  });

  it("has the same UI dictionary keys in English and German", () => {
    expect(keyPaths(deMessages).sort()).toEqual(keyPaths(en).sort());
  });

  it("builds locale paths and strips them again", () => {
    expect(localePath("en", "/rag")).toBe("/rag");
    expect(localePath("de", "/rag")).toBe("/de/rag");
    expect(localePath("de", "/")).toBe("/de");
    expect(localePath("de", "/progress#account")).toBe("/de/progress#account");
    expect(stripLocale("/de/rag/embeddings")).toEqual({ locale: "de", path: "/rag/embeddings" });
    expect(stripLocale("/de")).toEqual({ locale: "de", path: "/" });
    expect(stripLocale("/en/rag")).toEqual({ locale: "en", path: "/rag" });
    expect(stripLocale("/rag")).toEqual({ locale: "en", path: "/rag" });
  });
});

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { concepts } from "@/content";

/**
 * Every `demo` / `illustration` key used in content must exist in its registry.
 * The registries are client components, so we read them as text rather than importing them.
 */
function keysIn(file: string) {
  const src = readFileSync(join(process.cwd(), "src", "components", file), "utf8");
  const body = src.slice(src.indexOf("= {"));
  return Array.from(body.matchAll(/^\s{2}([A-Za-z0-9_]+)\s*[:,]/gm)).map((m) => m[1]);
}

describe("demo and illustration registries", () => {
  const demoKeys = new Set(keysIn("demos/index.tsx"));
  const illustrationKeys = new Set(keysIn("illustrations/index.tsx"));

  it("registers every demo referenced by a concept", () => {
    for (const c of concepts) {
      if (c.demo) expect(demoKeys.has(c.demo), `${c.id} -> demo ${c.demo}`).toBe(true);
    }
  });

  it("registers every illustration referenced by a concept", () => {
    for (const c of concepts) {
      if (c.illustration) expect(illustrationKeys.has(c.illustration), `${c.id} -> illustration ${c.illustration}`).toBe(true);
    }
  });

  it("has at least the four LLM demos", () => {
    expect(demoKeys.size).toBeGreaterThanOrEqual(4);
  });
});

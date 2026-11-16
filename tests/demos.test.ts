import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { concepts } from "@/content";

/**
 * Every `demo` key used in content must exist in its area's registry, and every
 * registry entry must point at an existing file. Registries are read as text.
 */
const demosDir = join(process.cwd(), "src", "components", "demos");

function registryEntries(area: string) {
  const file = join(demosDir, area, "registry.ts");
  if (!existsSync(file)) return new Map<string, string>();
  const src = readFileSync(file, "utf8");
  return new Map(Array.from(src.matchAll(/^\s{2}(\w+): \(\) => import\("\.\/([\w-]+)"\)/gm)).map((m) => [m[1], m[2]]));
}

function illustrationKeys() {
  const src = readFileSync(join(process.cwd(), "src", "components", "illustrations", "index.tsx"), "utf8");
  const body = src.slice(src.indexOf("= {"));
  return new Set(Array.from(body.matchAll(/^\s{2}([A-Za-z0-9_]+)\s*[:,]/gm)).map((m) => m[1]));
}

describe("demo and illustration registries", () => {
  it("registers every demo referenced by a concept in its area registry", () => {
    for (const c of concepts) {
      if (!c.demo) continue;
      const entries = registryEntries(c.area);
      expect(entries.has(c.demo), `${c.id} -> ${c.area}/registry.ts is missing ${c.demo}`).toBe(true);
    }
  });

  it("points every registry entry at an existing file", () => {
    const areas = new Set(concepts.map((c) => c.area));
    for (const area of areas) {
      for (const [name, file] of registryEntries(area)) {
        expect(existsSync(join(demosDir, area, `${file}.tsx`)), `${area}/${file}.tsx for ${name}`).toBe(true);
      }
    }
  });

  it("lists every area with demos in the top-level loader", () => {
    const index = readFileSync(join(demosDir, "index.tsx"), "utf8");
    const areas = new Set(concepts.filter((c) => c.demo).map((c) => c.area));
    for (const area of areas) {
      expect(index.includes(`import("./${area}/registry")`), `index.tsx is missing the ${area} registry`).toBe(true);
    }
  });

  it("registers every illustration referenced by a concept", () => {
    const keys = illustrationKeys();
    for (const c of concepts) {
      if (c.illustration) expect(keys.has(c.illustration), `${c.id} -> illustration ${c.illustration}`).toBe(true);
    }
  });
});

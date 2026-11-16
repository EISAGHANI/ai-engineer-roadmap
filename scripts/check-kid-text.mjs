#!/usr/bin/env node
/**
 * Plain-language check for the "kid" explanation of every concept.
 * Reads src/content/concepts/*.ts as text (no build needed) and reports:
 *  - kid lines longer than 220 characters or with more than 2 sentences
 *  - jargon words from scripts/jargon.json (unless the word is in the concept's own name)
 *  - a warning when no everyday noun from scripts/everyday.json appears
 * Exit code 1 on any error so it can run in CI.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, "..", "src", "content", "concepts");
const jargon = JSON.parse(readFileSync(join(here, "jargon.json"), "utf8"));
const everyday = JSON.parse(readFileSync(join(here, "everyday.json"), "utf8"));

let errors = 0;
let warnings = 0;
let checked = 0;

for (const file of readdirSync(dir).filter((f) => f.endsWith(".ts"))) {
  const src = readFileSync(join(dir, file), "utf8");
  // Split on object boundaries: each concept starts with `id: "`
  const blocks = src.split(/\n\s*\{\s*\n\s*id: "/).slice(1);
  for (const block of blocks) {
    const id = block.slice(0, block.indexOf('"'));
    const nameMatch = block.match(/name: "((?:[^"\\]|\\.)*)"/);
    const kidMatch = block.match(/kid:\s*\n?\s*"((?:[^"\\]|\\.)*)"/);
    if (!kidMatch) continue;
    checked++;
    const name = (nameMatch?.[1] ?? "").toLowerCase();
    const kid = kidMatch[1].replace(/\\"/g, '"');
    if (kid.length > 220) {
      console.error(`ERROR ${id}: kid is ${kid.length} chars (max 220)`);
      errors++;
    }
    const sentences = kid.split(/[.!?]+\s/).filter(Boolean).length;
    if (sentences > 2) {
      console.error(`ERROR ${id}: kid has ${sentences} sentences (max 2)`);
      errors++;
    }
    for (const word of jargon) {
      if (name.includes(word)) continue;
      if (new RegExp(`\\b${word}s?\\b`, "i").test(kid)) {
        console.error(`ERROR ${id}: kid uses jargon "${word}"`);
        errors++;
      }
    }
    if (!everyday.some((w) => new RegExp(`\\b${w}s?\\b`, "i").test(kid))) {
      console.warn(`WARN  ${id}: kid has no everyday noun (${everyday.slice(0, 6).join(", ")}, ...)`);
      warnings++;
    }
  }
}

console.log(`Checked ${checked} kid lines: ${errors} errors, ${warnings} warnings`);
process.exit(errors > 0 ? 1 : 0);

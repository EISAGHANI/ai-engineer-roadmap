import type { AreaId } from "../schema";

/**
 * Translation of one concept. Every field is optional: whatever is missing falls back
 * to English. `official` is the translation shown under the verbatim English one-liner;
 * code samples, slugs, ids, demos and docs links are never translated.
 */
export interface ConceptTranslation {
  name?: string;
  official?: string;
  kid?: string;
  realWorld?: { title: string; text: string };
  engineering?: { text?: string; pitfalls?: string[] };
  /** Extra search words in this language; the English keywords stay searchable too. */
  keywords?: string[];
}

export type ConceptTranslations = Record<string, ConceptTranslation>;

export interface ContentTranslation {
  areas: Partial<Record<AreaId, { name?: string; summary: string; weeks?: string; learnFrom?: Record<string, string> }>>;
  phases: Record<number, { name: string; description: string }>;
  prerequisites: Record<string, { name: string; description: string }>;
  rules: Array<{ title: string; text: string }>;
  projects: Record<string, { title: string; brief: string }>;
  concepts: ConceptTranslations;
}

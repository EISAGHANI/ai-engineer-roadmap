import type { Concept } from "@/content/schema";

/** Serialisable data a concept card needs (server components build it, client components render it). */
export interface ConceptView {
  concept: Concept;
  areaName: string;
  /** Shiki-rendered HTML for `concept.engineering.code`, produced on the server. */
  codeHtml?: string;
  related: Array<{ id: string; name: string; area: string; slug: string; number: number }>;
  projects: Array<{ id: string; title: string; kind: string; status: string }>;
  prev?: { name: string; href: string };
  next?: { name: string; href: string };
}

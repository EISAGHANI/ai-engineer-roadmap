import { codeToHtml } from "shiki";
import type { Concept, Project } from "@/content/schema";
import type { LocalizedContent } from "@/content/localized";
import type { ConceptView } from "@/components/roadmap/types";
import type { ProjectView } from "@/components/projects/types";
import type { RepoStats } from "@/lib/github";

/** Highlight a code sample on the server. Falls back to plain text when the language is unknown. */
export async function highlight(code: { lang: string; source: string } | undefined) {
  if (!code) return undefined;
  try {
    // One dark theme in both site themes: code blocks stay readable and consistent.
    return await codeToHtml(code.source, { lang: code.lang, theme: "github-dark" });
  } catch {
    return undefined;
  }
}

function conceptRef(c: Concept) {
  return { id: c.id, name: c.name, area: c.area, slug: c.slug, number: c.number };
}

export async function buildConceptView(content: LocalizedContent, c: Concept, withNav = false): Promise<ConceptView> {
  const area = content.getArea(c.area);
  const related = c.related
    .map((id) => content.getConcept(id))
    .filter((x): x is Concept => Boolean(x))
    .map(conceptRef);
  // Projects the concept names, plus projects that list the concept, without duplicates
  const linked = [...c.projects.map((id) => content.getProject(id)), ...content.getProjectsForConcept(c.id)].filter(
    (p): p is Project => Boolean(p),
  );
  const projects = Array.from(new Map(linked.map((p) => [p.id, p])).values()).map((p) => ({
    id: p.id,
    title: p.title,
    kind: p.kind,
    status: p.status,
  }));
  const codeHtml = await highlight(c.engineering?.code);
  let prev: ConceptView["prev"];
  let next: ConceptView["next"];
  if (withNav) {
    const list = content.getConceptsForArea(c.area);
    const i = list.findIndex((x) => x.id === c.id);
    const p = list[i - 1];
    const n = list[i + 1];
    if (p) prev = { name: `${p.number.toString().padStart(2, "0")} ${p.name}`, href: content.conceptHref(p) };
    if (n) next = { name: `${n.number.toString().padStart(2, "0")} ${n.name}`, href: content.conceptHref(n) };
  }
  return { concept: c, areaName: area?.name ?? c.area, codeHtml, related, projects, prev, next };
}

export function buildProjectView(content: LocalizedContent, p: Project, repo: RepoStats | null): ProjectView {
  const area = p.area ? content.getArea(p.area) : undefined;
  const concepts = p.concepts
    .map((id) => content.getConcept(id))
    .filter((x): x is Concept => Boolean(x))
    .map(conceptRef);
  return { project: p, areaName: area?.name, repo, concepts };
}

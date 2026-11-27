import {
  areas as baseAreas,
  concepts as baseConcepts,
  phases as basePhases,
  projects as baseProjects,
  prerequisites as basePrerequisites,
  rules as baseRules,
} from "./index";
import { Concept, type Area, type AreaId, type Phase, type Prerequisite, type Project } from "./schema";
import type { ContentTranslation, ConceptTranslation } from "./i18n/types";
import de from "./i18n/de";
import { localePath, type Locale } from "@/i18n/config";

/**
 * All roadmap content for one locale. English is the source; other locales merge
 * their translations over it field by field and fall back to English where a
 * translation is missing. Ids, slugs, code, demos and links never change.
 */
const TRANSLATIONS: Partial<Record<Locale, ContentTranslation>> = { de };

export function localizeConcept(c: Concept, t: ConceptTranslation | undefined): Concept {
  if (!t) return c;
  const merged = {
    ...c,
    name: t.name ?? c.name,
    officialTranslation: t.official ?? c.officialTranslation,
    kid: t.kid ?? c.kid,
    realWorld: t.realWorld ?? c.realWorld,
    engineering: c.engineering && {
      ...c.engineering,
      text: t.engineering?.text ?? c.engineering.text,
      pitfalls: t.engineering?.pitfalls ?? c.engineering.pitfalls,
    },
    keywords: Array.from(new Set([...(t.keywords ?? []), ...c.keywords])),
  };
  const result = Concept.safeParse(merged);
  if (!result.success) {
    throw new Error(
      `Invalid translation for ${c.id}: ${result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")}`,
    );
  }
  return result.data;
}

function build(locale: Locale) {
  const t = TRANSLATIONS[locale];

  const areas: Area[] = baseAreas.map((a) => {
    const at = t?.areas[a.id];
    if (!at) return a;
    return {
      ...a,
      name: at.name ?? a.name,
      summary: at.summary,
      weeks: at.weeks ?? a.weeks,
      learnFrom: a.learnFrom.map((r) => ({ ...r, label: at.learnFrom?.[r.url] ?? r.label })),
    };
  });
  const concepts: Concept[] = baseConcepts.map((c) => localizeConcept(c, t?.concepts[c.id]));
  const phases: Phase[] = basePhases.map((p) => ({ ...p, ...(t?.phases[p.number] ?? {}) }));
  const projects: Project[] = baseProjects.map((p) => ({ ...p, ...(t?.projects[p.id] ?? {}) }));
  const prerequisites: Prerequisite[] = basePrerequisites.map((p) => ({ ...p, ...(t?.prerequisites[p.id] ?? {}) }));
  const rules = t?.rules ?? baseRules;

  const areasInLearningOrder = [...areas].sort((a, b) => {
    const pa = Math.min(...a.phase);
    const pb = Math.min(...b.phase);
    return pa === pb ? a.number - b.number : pa - pb;
  });
  const areasInPdfOrder = [...areas].sort((a, b) => a.number - b.number);

  const conceptById = new Map(concepts.map((c) => [c.id, c]));
  const conceptBySlug = new Map(concepts.map((c) => [`${c.area}/${c.slug}`, c]));
  const areaById = new Map(areas.map((a) => [a.id, a]));
  const projectById = new Map(projects.map((p) => [p.id, p]));

  return {
    locale,
    areas,
    concepts,
    phases,
    projects,
    prerequisites,
    rules,
    areasInLearningOrder,
    areasInPdfOrder,
    getArea: (id: string) => areaById.get(id as AreaId),
    getConcept: (id: string) => conceptById.get(id),
    getConceptBySlug: (area: string, slug: string) => conceptBySlug.get(`${area}/${slug}`),
    getConceptsForArea: (areaId: AreaId) =>
      concepts.filter((c) => c.area === areaId).sort((a, b) => a.number - b.number),
    getProject: (id: string) => projectById.get(id),
    getProjectsForConcept: (conceptId: string) => projects.filter((p) => p.concepts.includes(conceptId)),
    getProjectsForArea: (areaId: AreaId) => projects.filter((p) => p.area === areaId),
    /** Locale-aware link to a concept page. */
    conceptHref: (c: { area: string; slug: string }) => localePath(locale, `/${c.area}/${c.slug}`),
    /** Locale-aware link to any unprefixed path. */
    href: (path: string) => localePath(locale, path),
  };
}

export type LocalizedContent = ReturnType<typeof build>;

const cache = new Map<Locale, LocalizedContent>();

export function getContent(locale: Locale): LocalizedContent {
  let c = cache.get(locale);
  if (!c) {
    c = build(locale);
    cache.set(locale, c);
  }
  return c;
}

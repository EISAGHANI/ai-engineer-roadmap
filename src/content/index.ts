import { z } from "zod";
import { Area, Concept, Phase, Project, Quiz, type AreaId } from "./schema";
import areasRaw from "./areas";
import phasesRaw, { prerequisites, rules } from "./phases";
import projectsRaw from "./projects";
import llm from "./concepts/llm";
import rag from "./concepts/rag";
import agents from "./concepts/agents";
import evals from "./concepts/evals";
import systemDesign from "./concepts/system-design";
import security from "./concepts/security";
import deployment from "./concepts/deployment";
import backend from "./concepts/backend";
import quizRetakesRaw from "./quiz-retakes";
import quizzesRaw from "./quizzes";

function parseAll<T extends z.ZodTypeAny>(schema: T, items: unknown[], label: string): z.infer<T>[] {
  return items.map((item, i) => {
    const result = schema.safeParse(item);
    if (!result.success) {
      const id = (item as { id?: string })?.id ?? `#${i}`;
      throw new Error(`Invalid ${label} ${id}: ${result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")}`);
    }
    return result.data;
  });
}

export const areas = parseAll(Area, areasRaw, "area");
export const phases = parseAll(Phase, phasesRaw, "phase");
export const projects = parseAll(Project, projectsRaw, "project");
export const quizzes = parseAll(Quiz, quizzesRaw, "quiz").map((quiz) => {
  const pack = quizRetakesRaw.find((entry) => entry.conceptId === quiz.conceptId);
  return { ...quiz, retakes: pack?.retakes ?? [] };
});
export const concepts = parseAll(
  Concept,
  [...llm, ...rag, ...agents, ...evals, ...systemDesign, ...security, ...deployment, ...backend],
  "concept",
);

export { prerequisites, rules };

/** Areas in the order the roadmap suggests learning them (by phase). */
export const areasInLearningOrder = [...areas].sort((a, b) => {
  const pa = Math.min(...a.phase);
  const pb = Math.min(...b.phase);
  return pa === pb ? a.number - b.number : pa - pb;
});

/** Areas in the order they are printed in the PDF. */
export const areasInPdfOrder = [...areas].sort((a, b) => a.number - b.number);

const conceptById = new Map(concepts.map((c) => [c.id, c]));
const conceptBySlug = new Map(concepts.map((c) => [`${c.area}/${c.slug}`, c]));
const areaById = new Map(areas.map((a) => [a.id, a]));
const projectById = new Map(projects.map((p) => [p.id, p]));

export function getArea(id: string) {
  return areaById.get(id as AreaId);
}

export function getConcept(id: string) {
  return conceptById.get(id);
}

export function getConceptBySlug(area: string, slug: string) {
  return conceptBySlug.get(`${area}/${slug}`);
}

export function getConceptsForArea(areaId: AreaId) {
  return concepts.filter((c) => c.area === areaId).sort((a, b) => a.number - b.number);
}

export function getProject(id: string) {
  return projectById.get(id);
}

export function getProjectsForConcept(conceptId: string) {
  return projects.filter((p) => p.concepts.includes(conceptId));
}

export function getProjectsForArea(areaId: AreaId) {
  return projects.filter((p) => p.area === areaId);
}

export function getQuizForConcept(conceptId: string) {
  return quizzes.find((quiz) => quiz.conceptId === conceptId);
}

export function conceptHref(c: { area: string; slug: string }) {
  return `/${c.area}/${c.slug}`;
}

export const TOTAL_CONCEPTS = concepts.length;

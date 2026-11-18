import { z } from "zod";

/**
 * Content schema for the AI Engineer Roadmap site.
 * Every data file in src/content is validated against these schemas at build
 * and test time (see src/content/index.ts and tests/content.test.ts).
 */

export const AREA_IDS = [
  "llm",
  "rag",
  "agents",
  "evals",
  "system-design",
  "security",
  "deployment",
  "backend",
] as const;

export const AreaId = z.enum(AREA_IDS);
export type AreaId = z.infer<typeof AreaId>;

export const Resource = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});
export type Resource = z.infer<typeof Resource>;

export const QuizQuestion = z.object({
  prompt: z.string().min(1),
  options: z.array(z.string().min(1)).length(4),
  correctAnswer: z.number().int().min(0).max(3),
  explanation: z.string().min(1),
});
export type QuizQuestion = z.infer<typeof QuizQuestion>;

export const Quiz = z.object({
  conceptId: z.string().regex(/^[a-z-]+-\d{2}$/),
  questions: z.array(QuizQuestion).length(5),
  retakes: z.array(z.array(QuizQuestion).length(5)).optional(),
});
export type Quiz = z.infer<typeof Quiz>;

export const CodeSample = z.object({
  lang: z.string().min(1),
  source: z.string().min(1),
});

/**
 * The three explanation layers. They are optional while content is being
 * written (Step 7 of the plan); the UI shows a "coming soon" state for a
 * missing layer. The `official` one-liner from the PDF is always required.
 */
export const Concept = z.object({
  id: z.string().regex(/^[a-z-]+-\d{2}$/),
  area: AreaId,
  number: z.number().int().min(1).max(20),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  tier: z.enum(["base", "production"]),
  official: z.string().min(1),
  kid: z.string().max(220).optional(),
  realWorld: z
    .object({
      title: z.string().min(1),
      text: z.string().max(500),
    })
    .optional(),
  engineering: z
    .object({
      text: z.string().min(1),
      code: CodeSample.optional(),
      pitfalls: z.array(z.string()).max(4).optional(),
      docsUrl: z.string().url().optional(),
    })
    .optional(),
  demo: z.string().optional(),
  illustration: z.string().optional(),
  related: z.array(z.string()).max(4).default([]),
  projects: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
});
export type Concept = z.infer<typeof Concept>;
export type ConceptInput = z.input<typeof Concept>;

export const Area = z.object({
  id: AreaId,
  number: z.number().int().min(1).max(8),
  code: z.string().min(2).max(3),
  name: z.string().min(1),
  summary: z.string().min(1),
  phase: z.array(z.number().int().min(0).max(7)).min(1),
  weeks: z.string().min(1),
  color: z.string().min(1),
  buildThis: z.string().min(1),
  learnFrom: z.array(Resource),
});
export type Area = z.infer<typeof Area>;

export const ProjectStatus = z.enum(["planned", "in-progress", "shipped"]);
export type ProjectStatus = z.infer<typeof ProjectStatus>;

export const Project = z.object({
  id: z.string().min(1),
  kind: z.enum(["build-this", "portfolio", "author"]),
  area: AreaId.optional(),
  title: z.string().min(1),
  brief: z.string().min(1),
  github: z.string().optional(),
  demoUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  screenshot: z.string().optional(),
  concepts: z.array(z.string()).default([]),
  evidence: z
    .object({
      liveDemo: z.boolean(),
      evalResults: z.string().optional(),
      costLatency: z.string().optional(),
      security: z.string().optional(),
    })
    .optional(),
  status: ProjectStatus,
});
export type Project = z.infer<typeof Project>;
export type ProjectInput = z.input<typeof Project>;

export const Phase = z.object({
  number: z.number().int().min(0).max(7),
  weeks: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  areas: z.array(AreaId),
});
export type Phase = z.infer<typeof Phase>;

export const Prerequisite = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
});
export type Prerequisite = z.infer<typeof Prerequisite>;

import type { DemoLoaders } from "../types";

/** Demos for the evals area. Keys must match `demo` in src/content/concepts/evals.ts. */
export const loaders: DemoLoaders = {
  GoldenDatasetDemo: () => import("./GoldenDatasetDemo"),
  ErrorAnalysisDemo: () => import("./ErrorAnalysisDemo"),
  JudgeDemo: () => import("./JudgeDemo"),
  PairwiseDemo: () => import("./PairwiseDemo"),
  RubricDemo: () => import("./RubricDemo"),
  FaithfulnessDemo: () => import("./FaithfulnessDemo"),
  AnswerRelevanceDemo: () => import("./AnswerRelevanceDemo"),
  ContextPrecisionDemo: () => import("./ContextPrecisionDemo"),
  ToolCallAccuracyDemo: () => import("./ToolCallAccuracyDemo"),
  TrajectoryDemo: () => import("./TrajectoryDemo"),
  RegressionCiDemo: () => import("./RegressionCiDemo"),
  AbTestDemo: () => import("./AbTestDemo"),
  HumanLabelingDemo: () => import("./HumanLabelingDemo"),
  SyntheticDataDemo: () => import("./SyntheticDataDemo"),
  TracingDemo: () => import("./TracingDemo"),
  LangfuseDemo: () => import("./LangfuseDemo"),
  OtelDemo: () => import("./OtelDemo"),
  P95Demo: () => import("./P95Demo"),
  CostPerRequestDemo: () => import("./CostPerRequestDemo"),
  FeedbackLoopDemo: () => import("./FeedbackLoopDemo"),
};

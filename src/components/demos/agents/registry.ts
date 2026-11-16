import type { DemoLoaders } from "../types";

/** Demos for the agents area. Keys must match `demo` in src/content/concepts/agents.ts. */
export const loaders: DemoLoaders = {
  ToolCallingDemo: () => import("./ToolCallingDemo"),
  AgentLoopDemo: () => import("./AgentLoopDemo"),
  ReActDemo: () => import("./ReActDemo"),
  PlanningDemo: () => import("./PlanningDemo"),
  ReflectionDemo: () => import("./ReflectionDemo"),
  ShortTermMemoryDemo: () => import("./ShortTermMemoryDemo"),
  LongTermMemoryDemo: () => import("./LongTermMemoryDemo"),
  McpServerDemo: () => import("./McpServerDemo"),
  McpClientDemo: () => import("./McpClientDemo"),
  AgentSkillsDemo: () => import("./AgentSkillsDemo"),
  HandoffDemo: () => import("./HandoffDemo"),
  OrchestratorDemo: () => import("./OrchestratorDemo"),
  LangGraphDemo: () => import("./LangGraphDemo"),
  AgentsSdkDemo: () => import("./AgentsSdkDemo"),
  CheckpointsDemo: () => import("./CheckpointsDemo"),
  HumanInLoopDemo: () => import("./HumanInLoopDemo"),
  ContextEngineeringDemo: () => import("./ContextEngineeringDemo"),
  CompactionDemo: () => import("./CompactionDemo"),
  StopConditionsDemo: () => import("./StopConditionsDemo"),
  A2ADemo: () => import("./A2ADemo"),
};

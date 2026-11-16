"use client";

import * as React from "react";
import type { ComponentType } from "react";
import { DemoFallback } from "./DemoFrame";

type Loader = () => Promise<{ default: ComponentType }>;

/**
 * Registry: concept.demo string -> lazy loader. Each entry is a tiny function, so the
 * registry stays small even with 160 demos; a demo's code downloads only when shown.
 * The content test checks that every `demo` key used in src/content exists here.
 */
const loaders: Record<string, Loader> = {
  TokenizerDemo: () => import("./llm/TokenizerDemo"),
  AttentionDemo: () => import("./llm/AttentionDemo"),
  ContextWindowDemo: () => import("./llm/ContextWindowDemo"),
  KvCacheDemo: () => import("./llm/KvCacheDemo"),
  TemperatureDemo: () => import("./llm/TemperatureDemo"),
  SystemPromptDemo: () => import("./llm/SystemPromptDemo"),
  FewShotDemo: () => import("./llm/FewShotDemo"),
  ChainOfThoughtDemo: () => import("./llm/ChainOfThoughtDemo"),
  ReasoningModelDemo: () => import("./llm/ReasoningModelDemo"),
  StructuredOutputDemo: () => import("./llm/StructuredOutputDemo"),
  PromptCachingDemo: () => import("./llm/PromptCachingDemo"),
  TokenPricingDemo: () => import("./llm/TokenPricingDemo"),
  HallucinationDemo: () => import("./llm/HallucinationDemo"),
  MultimodalDemo: () => import("./llm/MultimodalDemo"),
  LoRADemo: () => import("./llm/LoRADemo"),
  QLoRADemo: () => import("./llm/QLoRADemo"),
  QuantizationDemo: () => import("./llm/QuantizationDemo"),
  DistillationDemo: () => import("./llm/DistillationDemo"),
  OpenVsClosedDemo: () => import("./llm/OpenVsClosedDemo"),
  EmbeddingMapDemo: () => import("./rag/EmbeddingMapDemo"),
  CosineDemo: () => import("./rag/CosineDemo"),
  ChunkingDemo: () => import("./rag/ChunkingDemo"),
  VectorDbDemo: () => import("./rag/VectorDbDemo"),
  PgvectorDemo: () => import("./rag/PgvectorDemo"),
  HnswDemo: () => import("./rag/HnswDemo"),
  MetadataFilterDemo: () => import("./rag/MetadataFilterDemo"),
  Bm25Demo: () => import("./rag/Bm25Demo"),
  HybridSearchDemo: () => import("./rag/HybridSearchDemo"),
  RerankDemo: () => import("./rag/RerankDemo"),
  QueryRewriteDemo: () => import("./rag/QueryRewriteDemo"),
  HydeDemo: () => import("./rag/HydeDemo"),
  ContextualRetrievalDemo: () => import("./rag/ContextualRetrievalDemo"),
  ParentChildDemo: () => import("./rag/ParentChildDemo"),
  ParsingDemo: () => import("./rag/ParsingDemo"),
  CitationsDemo: () => import("./rag/CitationsDemo"),
  GraphRagDemo: () => import("./rag/GraphRagDemo"),
  AgenticRagDemo: () => import("./rag/AgenticRagDemo"),
  RecallDemo: () => import("./rag/RecallDemo"),
  RankMetricsDemo: () => import("./rag/RankMetricsDemo"),
  ToolCallingDemo: () => import("./agents/ToolCallingDemo"),
  AgentLoopDemo: () => import("./agents/AgentLoopDemo"),
  ReActDemo: () => import("./agents/ReActDemo"),
  PlanningDemo: () => import("./agents/PlanningDemo"),
  ReflectionDemo: () => import("./agents/ReflectionDemo"),
  ShortTermMemoryDemo: () => import("./agents/ShortTermMemoryDemo"),
  LongTermMemoryDemo: () => import("./agents/LongTermMemoryDemo"),
  McpServerDemo: () => import("./agents/McpServerDemo"),
  McpClientDemo: () => import("./agents/McpClientDemo"),
  AgentSkillsDemo: () => import("./agents/AgentSkillsDemo"),
  HandoffDemo: () => import("./agents/HandoffDemo"),
  OrchestratorDemo: () => import("./agents/OrchestratorDemo"),
  LangGraphDemo: () => import("./agents/LangGraphDemo"),
  AgentsSdkDemo: () => import("./agents/AgentsSdkDemo"),
  CheckpointsDemo: () => import("./agents/CheckpointsDemo"),
  HumanInLoopDemo: () => import("./agents/HumanInLoopDemo"),
  ContextEngineeringDemo: () => import("./agents/ContextEngineeringDemo"),
  CompactionDemo: () => import("./agents/CompactionDemo"),
  StopConditionsDemo: () => import("./agents/StopConditionsDemo"),
  A2ADemo: () => import("./agents/A2ADemo"),
};

const cache = new Map<string, React.LazyExoticComponent<ComponentType>>();

function lazyFor(name: string) {
  let component = cache.get(name);
  if (!component) {
    component = React.lazy(loaders[name]);
    cache.set(name, component);
  }
  return component;
}

export function hasDemo(name: string | undefined): name is string {
  return Boolean(name && name in loaders);
}

/** Renders a registered demo, loading its code on first use. */
export function DemoSlot({ name }: { name: string }) {
  const Lazy = lazyFor(name);
  return (
    <React.Suspense fallback={<DemoFallback />}>
      <Lazy />
    </React.Suspense>
  );
}

export const DEMO_KEYS = Object.keys(loaders);

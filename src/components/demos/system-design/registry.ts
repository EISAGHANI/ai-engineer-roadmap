import type { DemoLoaders } from "../types";

/** Demos for the system-design area. Keys must match `demo` in src/content/concepts/system-design.ts. */
export const loaders: DemoLoaders = {
  ModelRoutingDemo: () => import("./ModelRoutingDemo"),
  FallbackDemo: () => import("./FallbackDemo"),
  SemanticCacheDemo: () => import("./SemanticCacheDemo"),
  PrefixCacheDemo: () => import("./PrefixCacheDemo"),
  TokenBudgetDemo: () => import("./TokenBudgetDemo"),
  StreamingDemo: () => import("./StreamingDemo"),
  TtftDemo: () => import("./TtftDemo"),
  ThroughputLatencyDemo: () => import("./ThroughputLatencyDemo"),
  VllmDemo: () => import("./VllmDemo"),
  ContinuousBatchingDemo: () => import("./ContinuousBatchingDemo"),
  PagedAttentionDemo: () => import("./PagedAttentionDemo"),
  SpeculativeDemo: () => import("./SpeculativeDemo"),
  GpuVsApiDemo: () => import("./GpuVsApiDemo"),
  BatchInferenceDemo: () => import("./BatchInferenceDemo"),
  JobPipelineDemo: () => import("./JobPipelineDemo"),
  ProviderRateLimitDemo: () => import("./ProviderRateLimitDemo"),
  MultiTenantDemo: () => import("./MultiTenantDemo"),
  RagVsFinetuneDemo: () => import("./RagVsFinetuneDemo"),
  ContextWindowDemo: () => import("./ContextWindowDemo"),
  CostOptimizationDemo: () => import("./CostOptimizationDemo"),
};

import type { DemoLoaders } from "../types";

/** Demos for the llm area. Keys must match `demo` in src/content/concepts/llm.ts. */
export const loaders: DemoLoaders = {
  TokenizerDemo: () => import("./TokenizerDemo"),
  AttentionDemo: () => import("./AttentionDemo"),
  ContextWindowDemo: () => import("./ContextWindowDemo"),
  KvCacheDemo: () => import("./KvCacheDemo"),
  TemperatureDemo: () => import("./TemperatureDemo"),
  SystemPromptDemo: () => import("./SystemPromptDemo"),
  FewShotDemo: () => import("./FewShotDemo"),
  ChainOfThoughtDemo: () => import("./ChainOfThoughtDemo"),
  ReasoningModelDemo: () => import("./ReasoningModelDemo"),
  StructuredOutputDemo: () => import("./StructuredOutputDemo"),
  PromptCachingDemo: () => import("./PromptCachingDemo"),
  TokenPricingDemo: () => import("./TokenPricingDemo"),
  HallucinationDemo: () => import("./HallucinationDemo"),
  MultimodalDemo: () => import("./MultimodalDemo"),
  LoRADemo: () => import("./LoRADemo"),
  QLoRADemo: () => import("./QLoRADemo"),
  QuantizationDemo: () => import("./QuantizationDemo"),
  DistillationDemo: () => import("./DistillationDemo"),
  OpenVsClosedDemo: () => import("./OpenVsClosedDemo"),
};

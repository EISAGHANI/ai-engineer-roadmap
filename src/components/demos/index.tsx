"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { DemoFallback } from "./DemoFrame";

/**
 * Registry: concept.demo string -> lazily loaded component.
 * Add a line here for every new demo; the content test checks that every `demo`
 * key used in src/content exists in this map.
 * Note: Next.js requires the dynamic() options to be an inline object literal.
 */
export const demos: Record<string, ComponentType> = {
  TokenizerDemo: dynamic(() => import("./llm/TokenizerDemo"), { loading: () => <DemoFallback />, ssr: false }),
  AttentionDemo: dynamic(() => import("./llm/AttentionDemo"), { loading: () => <DemoFallback />, ssr: false }),
  ContextWindowDemo: dynamic(() => import("./llm/ContextWindowDemo"), { loading: () => <DemoFallback />, ssr: false }),
  KvCacheDemo: dynamic(() => import("./llm/KvCacheDemo"), { loading: () => <DemoFallback />, ssr: false }),
  TemperatureDemo: dynamic(() => import("./llm/TemperatureDemo"), { loading: () => <DemoFallback />, ssr: false }),
  SystemPromptDemo: dynamic(() => import("./llm/SystemPromptDemo"), { loading: () => <DemoFallback />, ssr: false }),
  FewShotDemo: dynamic(() => import("./llm/FewShotDemo"), { loading: () => <DemoFallback />, ssr: false }),
  ChainOfThoughtDemo: dynamic(() => import("./llm/ChainOfThoughtDemo"), { loading: () => <DemoFallback />, ssr: false }),
  ReasoningModelDemo: dynamic(() => import("./llm/ReasoningModelDemo"), { loading: () => <DemoFallback />, ssr: false }),
  StructuredOutputDemo: dynamic(() => import("./llm/StructuredOutputDemo"), { loading: () => <DemoFallback />, ssr: false }),
  PromptCachingDemo: dynamic(() => import("./llm/PromptCachingDemo"), { loading: () => <DemoFallback />, ssr: false }),
  TokenPricingDemo: dynamic(() => import("./llm/TokenPricingDemo"), { loading: () => <DemoFallback />, ssr: false }),
  HallucinationDemo: dynamic(() => import("./llm/HallucinationDemo"), { loading: () => <DemoFallback />, ssr: false }),
  MultimodalDemo: dynamic(() => import("./llm/MultimodalDemo"), { loading: () => <DemoFallback />, ssr: false }),
  LoRADemo: dynamic(() => import("./llm/LoRADemo"), { loading: () => <DemoFallback />, ssr: false }),
  QLoRADemo: dynamic(() => import("./llm/QLoRADemo"), { loading: () => <DemoFallback />, ssr: false }),
  QuantizationDemo: dynamic(() => import("./llm/QuantizationDemo"), { loading: () => <DemoFallback />, ssr: false }),
  DistillationDemo: dynamic(() => import("./llm/DistillationDemo"), { loading: () => <DemoFallback />, ssr: false }),
  OpenVsClosedDemo: dynamic(() => import("./llm/OpenVsClosedDemo"), { loading: () => <DemoFallback />, ssr: false }),
};

export const DEMO_KEYS = Object.keys(demos);

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
};

export const DEMO_KEYS = Object.keys(demos);

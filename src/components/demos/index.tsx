"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { DemoFallback } from "./DemoFrame";

const opts = { loading: () => <DemoFallback />, ssr: false } as const;

/**
 * Registry: concept.demo string -> lazily loaded component.
 * Add a line here for every new demo; the content test checks that every `demo`
 * key used in src/content exists in this map.
 */
export const demos: Record<string, ComponentType> = {
  TokenizerDemo: dynamic(() => import("./llm/TokenizerDemo"), opts),
  AttentionDemo: dynamic(() => import("./llm/AttentionDemo"), opts),
  ContextWindowDemo: dynamic(() => import("./llm/ContextWindowDemo"), opts),
  KvCacheDemo: dynamic(() => import("./llm/KvCacheDemo"), opts),
};

export const DEMO_KEYS = Object.keys(demos);

"use client";

import * as React from "react";
import type { ComponentType } from "react";
import { DemoFallback } from "./DemoFrame";
import type { DemoLoaders } from "./types";

/**
 * Two-level lazy loading keeps every page light:
 * 1. an area's registry (a small map of loaders) downloads only when one of its demos is shown,
 * 2. the demo's own code downloads only when that demo is shown.
 * Each area registry lives in src/components/demos/<area>/registry.ts.
 */
const areaRegistries: Record<string, () => Promise<{ loaders: DemoLoaders }>> = {
  llm: () => import("./llm/registry"),
  rag: () => import("./rag/registry"),
  agents: () => import("./agents/registry"),
  evals: () => import("./evals/registry"),
  deployment: () => import("./deployment/registry"),
  backend: () => import("./backend/registry"),
  "system-design": () => import("./system-design/registry"),
};

const cache = new Map<string, React.LazyExoticComponent<ComponentType>>();

function MissingDemo() {
  return <p className="rounded-card border border-dashed border-border p-4 text-sm text-muted">This demo could not be loaded.</p>;
}

function lazyFor(area: string, name: string) {
  const key = `${area}/${name}`;
  let component = cache.get(key);
  if (!component) {
    component = React.lazy(async () => {
      const registry = areaRegistries[area];
      if (!registry) return { default: MissingDemo };
      const { loaders } = await registry();
      const loader = loaders[name];
      return loader ? loader() : { default: MissingDemo };
    });
    cache.set(key, component);
  }
  return component;
}

/** True when the area has a demo registry (the content test checks every demo key exists). */
export function hasDemo(area: string, name: string | undefined): name is string {
  return Boolean(name && area in areaRegistries);
}

/** Renders a registered demo, loading its registry and code on first use. */
export function DemoSlot({ area, name }: { area: string; name: string }) {
  const Lazy = lazyFor(area, name);
  return (
    <React.Suspense fallback={<DemoFallback />}>
      <Lazy />
    </React.Suspense>
  );
}

export const DEMO_AREAS = Object.keys(areaRegistries);

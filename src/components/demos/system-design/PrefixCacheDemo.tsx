"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";
import { Switch } from "@/components/ui/Switch";

const PREFIX_TOKENS = 60_000; // the handbook
const QUESTION_TOKENS = 40;
const PRICE_IN = 3 / 1e6; // $ per input token (example)
const CACHE_WRITE = 1.25; // multiplier for writing the cache
const CACHE_READ = 0.1; // multiplier for reading it

type Call = { kind: "full" | "write" | "read"; cost: number; ttft: number };

export default function PrefixCacheDemo() {
  const [caching, setCaching] = React.useState(true);
  const [timestampFirst, setTimestampFirst] = React.useState(false);
  const [calls, setCalls] = React.useState<Call[]>([]);

  function ask() {
    const cacheUsable = caching && !timestampFirst;
    let kind: Call["kind"] = "full";
    if (cacheUsable) kind = calls.some((c) => c.kind !== "full") ? "read" : "write";
    const prefixCost = PREFIX_TOKENS * PRICE_IN * (kind === "read" ? CACHE_READ : kind === "write" ? CACHE_WRITE : 1);
    const cost = prefixCost + QUESTION_TOKENS * PRICE_IN;
    const ttft = kind === "read" ? 0.5 : 2.6;
    setCalls([...calls, { kind, cost, ttft }]);
  }

  const total = calls.reduce((a, c) => a + c.cost, 0);
  const noCache = calls.length * (PREFIX_TOKENS + QUESTION_TOKENS) * PRICE_IN;

  return (
    <DemoFrame
      title="The same pizza base, ready to go"
      hint="Every question sends the same 60,000-token handbook first, then a short question."
      onReset={() => {
        setCalls([]);
        setCaching(true);
        setTimestampFirst(false);
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Switch checked={caching} onChange={(v) => { setCaching(v); setCalls([]); }} label="cache_control on the handbook" />
        <Switch checked={timestampFirst} onChange={(v) => { setTimestampFirst(v); setCalls([]); }} label="Mistake: current time at the top" />
        <ActionButton onClick={ask}>Ask a question</ActionButton>
      </div>
      <div className="mt-3 flex h-6 overflow-hidden rounded-md font-mono text-[10px]">
        {timestampFirst && <span className="flex items-center bg-[var(--warn)] px-1 text-black">14:33:07</span>}
        <span className="flex flex-1 items-center px-2" style={{ backgroundColor: "color-mix(in srgb, var(--area-system-design) 30%, transparent)" }}>
          system + handbook (60k tokens) {caching && !timestampFirst ? "🔒 cached prefix" : ""}
        </span>
        <span className="flex w-24 items-center justify-center bg-surface-2">question</span>
      </div>
      <ul className="mt-3 space-y-0.5 font-mono text-[11px]" aria-live="polite">
        {calls.map((c, i) => (
          <li key={i} className="flex gap-3">
            <span className="w-8 text-muted">#{i + 1}</span>
            <span className="w-28" style={{ color: c.kind === "read" ? "var(--good)" : c.kind === "write" ? "var(--warn)" : undefined }}>
              {c.kind === "read" ? "cache read" : c.kind === "write" ? "cache write" : "full price"}
            </span>
            <span className="w-16">${c.cost.toFixed(3)}</span>
            <span>first word {c.ttft} s</span>
          </li>
        ))}
      </ul>
      {calls.length > 0 && (
        <p className="mt-2 text-xs">
          Spent <strong>${total.toFixed(3)}</strong> vs ${noCache.toFixed(3)} without caching.
          {timestampFirst && caching && " The timestamp changes every request, so the prefix never matches and nothing is reused."}
        </p>
      )}
    </DemoFrame>
  );
}

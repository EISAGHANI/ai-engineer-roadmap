"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { cn } from "@/lib/utils";

/** Each need pushes the decision towards open weights (negative) or a closed API (positive). */
const NEEDS = [
  { id: "privacy", label: "Data must never leave our servers", weight: -3 },
  { id: "offline", label: "Must work offline", weight: -3 },
  { id: "custom", label: "Deep customisation or fine-tuning", weight: -2 },
  { id: "volume", label: "Huge, steady request volume", weight: -1 },
  { id: "quality", label: "Best possible quality on hard tasks", weight: 2 },
  { id: "noops", label: "No servers or GPUs to manage", weight: 2 },
  { id: "fast", label: "Ship this week with a tiny team", weight: 1 },
] as const;

export default function OpenVsClosedDemo() {
  const [picked, setPicked] = React.useState<Set<string>>(new Set());
  const score = NEEDS.reduce((a, n) => (picked.has(n.id) ? a + n.weight : a), 0);
  const pos = Math.max(-6, Math.min(6, score)); // -6 open … +6 closed
  const verdict =
    picked.size === 0
      ? "Pick what matters to you."
      : score <= -2
        ? "Lean towards an open-weight model you host yourself (e.g. with Ollama or vLLM)."
        : score >= 2
          ? "Lean towards a closed model behind an API."
          : "A mix: a closed API for hard requests, an open model for private or high-volume work.";

  function toggle(id: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <DemoFrame title="Buy the parrot or rent one?" hint="Tick your needs and watch the balance tip." onReset={() => setPicked(new Set())}>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Your needs">
        {NEEDS.map((n) => {
          const on = picked.has(n.id);
          return (
            <button
              key={n.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(n.id)}
              className={cn("rounded-full border px-3 py-1 text-xs", on ? "border-accent bg-accent text-accent-ink" : "border-border hover:border-accent/60")}
            >
              {n.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-xs font-medium">
          <span style={{ color: "var(--area-evals)" }}>Open weights (buy)</span>
          <span style={{ color: "var(--area-system-design)" }}>Closed API (rent)</span>
        </div>
        <div className="relative mt-2 h-3 rounded-full" style={{ background: "linear-gradient(90deg, var(--area-evals), var(--surface-2), var(--area-system-design))" }}>
          <span
            className="absolute top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-bg bg-text shadow"
            style={{ left: `${((pos + 6) / 12) * 100}%`, transition: "left 300ms var(--ease-out)" }}
            aria-hidden="true"
          />
        </div>
      </div>
      <p className="mt-4 rounded-lg bg-surface px-3 py-2 text-sm" aria-live="polite">
        {verdict}
      </p>
      <p className="mt-2 text-xs text-muted">A rule of thumb, not a verdict: many real products use both.</p>
    </DemoFrame>
  );
}

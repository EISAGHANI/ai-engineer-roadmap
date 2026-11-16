"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";
import { useMotionSafe } from "@/lib/motion";

/** A confused agent that keeps checking two shops for "the perfect apple". */
const COST_PER_STEP = 0.04;
const SECONDS_PER_STEP = 4;
const RULES = [
  { id: "loop", label: "Loop detection (same call twice)", stopAt: 3, reason: "loop detected: search_shop('A') again" },
  { id: "steps", label: "Max 10 steps", stopAt: 10, reason: "step limit (10) reached" },
  { id: "budget", label: "Budget 0.50 $", stopAt: 13, reason: "budget exceeded (0.52 $ > 0.50 $)" },
  { id: "timeout", label: "Timeout 60 s", stopAt: 16, reason: "timeout (64 s > 60 s)" },
] as const;
type RuleId = (typeof RULES)[number]["id"];
const RUNAWAY = 40;

export default function StopConditionsDemo() {
  const motionSafe = useMotionSafe();
  const [on, setOn] = React.useState<Set<RuleId>>(new Set(["steps"]));
  const [step, setStep] = React.useState<number | null>(null);

  const active = RULES.filter((r) => on.has(r.id)).sort((a, b) => a.stopAt - b.stopAt);
  const stopper = active[0];
  const target = stopper ? stopper.stopAt : RUNAWAY;

  React.useEffect(() => {
    if (step === null || step >= target) return;
    const t = window.setTimeout(() => setStep((s) => (s === null ? null : s + 1)), 90);
    return () => window.clearTimeout(t);
  }, [step, target]);

  function toggle(id: RuleId) {
    setStep(null);
    setOn((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const s = step ?? 0;
  const finished = step !== null && step >= target;

  return (
    <DemoFrame title="Rules for when to come home" hint="The agent keeps walking between shop A and shop B. Which rule stops it first?" onReset={() => { setOn(new Set(["steps"])); setStep(null); }}>
      <div className="grid gap-1 sm:grid-cols-2">
        {RULES.map((r) => (
          <label key={r.id} className="flex cursor-pointer items-center gap-2 rounded-md bg-surface px-2 py-1 text-xs">
            <input type="checkbox" checked={on.has(r.id)} onChange={() => toggle(r.id)} className="accent-[var(--accent)]" />
            {r.label}
          </label>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <ActionButton onClick={() => setStep(motionSafe ? 0 : target)}>Run agent</ActionButton>
        <span className="font-mono text-xs text-muted">
          step {s} · {(s * COST_PER_STEP).toFixed(2)} $ · {s * SECONDS_PER_STEP} s
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-0.5" aria-hidden="true">
        {Array.from({ length: s }, (_, i) => (
          <span key={i} className="rounded px-1 font-mono text-[9px]" style={{ backgroundColor: "var(--surface)" }}>
            {i % 2 === 0 ? "A" : "B"}
          </span>
        ))}
      </div>
      {finished && (
        <p
          className="mt-2 rounded-lg px-3 py-2 text-xs"
          style={{ backgroundColor: `color-mix(in srgb, ${stopper ? "var(--good)" : "var(--bad)"} 16%, transparent)` }}
          aria-live="polite"
        >
          {stopper
            ? `Stopped after ${stopper.stopAt} steps: ${stopper.reason}. It returns its notes so far and the reason.`
            : `No rules: still running after ${RUNAWAY} steps and ${(RUNAWAY * COST_PER_STEP).toFixed(2)} $… it would never come home.`}
        </p>
      )}
    </DemoFrame>
  );
}

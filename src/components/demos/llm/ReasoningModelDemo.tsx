"use client";

import * as React from "react";
import { Zap, Brain } from "lucide-react";
import { DemoFrame } from "../DemoFrame";
import { useMotionSafe } from "@/lib/motion";
import { cn } from "@/lib/utils";

const QUESTIONS = {
  easy: {
    label: "Easy",
    text: "What is the capital of France?",
    fast: { answer: "Paris", correct: true },
    reasoning: { answer: "Paris", correct: true },
  },
  hard: {
    label: "Hard",
    text: "Pens cost 3 euros each, or 4 for 10 euros. Cheapest way to buy exactly 10 pens?",
    fast: { answer: "30 euros (buy 10 single pens)", correct: false },
    reasoning: { answer: "26 euros (2 packs of 4 + 2 single pens)", correct: true },
  },
} as const;

type Level = keyof typeof QUESTIONS;

/** Illustrative numbers: the reasoning model thinks for longer and writes many hidden words. */
const MODELS = {
  fast: { name: "Quick model", icon: Zap, seconds: 0.6, thinking: 0, cost: 1 },
  reasoning: { name: "Reasoning model", icon: Brain, seconds: 4.2, thinking: 1800, cost: 12 },
} as const;

export default function ReasoningModelDemo() {
  const motionSafe = useMotionSafe();
  const [level, setLevel] = React.useState<Level>("hard");
  const [elapsed, setElapsed] = React.useState<number | null>(null); // simulated seconds since asking

  React.useEffect(() => {
    if (elapsed === null || elapsed >= MODELS.reasoning.seconds) return;
    const t = window.setTimeout(() => setElapsed((e) => (e === null ? null : Math.min(MODELS.reasoning.seconds, e + 0.2))), 100);
    return () => window.clearTimeout(t);
  }, [elapsed]);

  function ask() {
    setElapsed(motionSafe ? 0 : MODELS.reasoning.seconds);
  }

  const q = QUESTIONS[level];

  return (
    <DemoFrame
      title="Quick parrot vs careful owl"
      hint="Ask an easy and a hard question. Compare speed, cost and correctness."
      onReset={() => setElapsed(null)}
    >
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(QUESTIONS) as Level[]).map((l) => (
          <button
            key={l}
            type="button"
            aria-pressed={level === l}
            onClick={() => {
              setLevel(l);
              setElapsed(null);
            }}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              level === l ? "border-accent bg-accent text-accent-ink" : "border-border hover:border-accent/60",
            )}
          >
            {QUESTIONS[l].label} question
          </button>
        ))}
        <button
          type="button"
          onClick={ask}
          className="ml-auto rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-ink"
        >
          Ask both
        </button>
      </div>
      <p className="mt-2 rounded-lg bg-surface px-3 py-2 text-sm">{q.text}</p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {(["fast", "reasoning"] as const).map((key) => {
          const m = MODELS[key];
          const result = q[key];
          const Icon = m.icon;
          const finished = elapsed !== null && elapsed >= m.seconds;
          const running = elapsed !== null && !finished;
          const thinkingSoFar = elapsed === null ? 0 : Math.round(m.thinking * Math.min(1, elapsed / m.seconds));
          return (
            <div key={key} className="rounded-lg bg-surface p-3 text-sm">
              <div className="flex items-center gap-1.5 font-medium">
                <Icon className="h-4 w-4" aria-hidden="true" /> {m.name}
              </div>
              <div className="mt-1 font-mono text-[11px] text-muted">
                {m.seconds}s · cost ×{m.cost}
                {m.thinking > 0 && ` · ${thinkingSoFar} hidden thinking words`}
              </div>
              <div className="mt-2 min-h-10" aria-live="polite">
                {running && <span className="animate-pulse text-muted">{m.thinking ? "thinking…" : "typing…"}</span>}
                {finished && (
                  <span style={{ color: result.correct ? "var(--good)" : "var(--bad)" }}>
                    {result.correct ? "✓" : "✗"} {result.answer}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted">
        {level === "easy"
          ? "Both are right, but the reasoning model took 7 times longer and cost 12 times more. Send easy questions to the quick model."
          : "Only the reasoning model checked the combinations. Worth the wait and the price for hard problems."}
      </p>
    </DemoFrame>
  );
}

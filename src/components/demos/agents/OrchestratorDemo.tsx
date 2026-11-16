"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, ChoiceChips, ScoreBar } from "../ui";
import { useMotionSafe } from "@/lib/motion";

const WORKERS = [
  { id: "A", bakery: "Brot & Co", report: "4.20 € a loaf · open 7-18 · crusty, a bit salty" },
  { id: "B", bakery: "Sonnenbäck", report: "3.60 € a loaf · open 6-14 · soft, great rolls" },
  { id: "C", bakery: "Korn", report: "4.90 € a loaf · open 8-19 · organic sourdough" },
];
const WORK = 3; // time units per worker
const MERGE = 1;

type Mode = "parallel" | "sequential";

function progress(mode: Mode, t: number, i: number) {
  const start = mode === "parallel" ? 0 : i * WORK;
  return Math.max(0, Math.min(1, (t - start) / WORK));
}

export default function OrchestratorDemo() {
  const motionSafe = useMotionSafe();
  const [mode, setMode] = React.useState<Mode>("parallel");
  const [t, setT] = React.useState<number | null>(null);
  const total = (mode === "parallel" ? WORK : WORK * WORKERS.length) + MERGE;

  React.useEffect(() => {
    if (t === null || t >= total) return;
    const id = window.setTimeout(() => setT((x) => (x === null ? null : Math.min(total, x + 0.25))), 120);
    return () => window.clearTimeout(id);
  }, [t, total]);

  const workDone = t !== null && t >= total - MERGE;
  const finished = t !== null && t >= total;

  return (
    <DemoFrame title="One lead, three runners" hint="Task: compare the three best bakeries in town." onReset={() => setT(null)}>
      <div className="flex flex-wrap items-center gap-2">
        <ChoiceChips
          label="Workers run"
          options={[
            { id: "parallel", label: "in parallel" },
            { id: "sequential", label: "one after another" },
          ]}
          value={mode}
          onChange={(m) => {
            setMode(m);
            setT(null);
          }}
        />
        <ActionButton onClick={() => setT(motionSafe ? 0 : total)}>Start</ActionButton>
      </div>
      <p className="mt-2 text-xs text-muted">Lead agent: &ldquo;Split into 3 subtasks, one bakery each, max 50 words per report.&rdquo;</p>
      <ul className="mt-2 space-y-2">
        {WORKERS.map((w, i) => {
          const p = t === null ? 0 : progress(mode, t, i);
          return (
            <li key={w.id} className="text-xs">
              <div className="flex justify-between">
                <span>
                  Worker {w.id}: {w.bakery}
                </span>
                <span className="font-mono text-muted">{Math.round(p * 100)}%</span>
              </div>
              <ScoreBar value={p} color="var(--area-agents)" />
              {p >= 1 && <div className="mt-0.5 text-muted">{w.report}</div>}
            </li>
          );
        })}
      </ul>
      <div className="mt-3 rounded-lg bg-surface px-3 py-2 text-xs" aria-live="polite">
        {finished ? (
          <>
            <strong>Lead:</strong> Cheapest is Sonnenbäck (3.60 €) but it closes at 14:00; for evenings and organic bread pick Korn.
            <span className="mt-1 block text-muted">
              Time: {total} units {mode === "parallel" ? "(parallel)" : "(sequential)"} · tokens: about 3 × 4k for workers + 3k for the lead.
            </span>
          </>
        ) : workDone ? (
          "Lead is merging the reports…"
        ) : t === null ? (
          "Press Start."
        ) : (
          "Workers are researching…"
        )}
      </div>
    </DemoFrame>
  );
}

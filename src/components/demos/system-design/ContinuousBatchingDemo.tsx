"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

type Mode = "static" | "continuous";
const SLOTS = 4;
/** Output length (in steps) of each queued request, in arrival order. */
const JOBS = [3, 12, 2, 4, 2, 9, 3, 2, 5, 2, 3, 4];
const COLORS = ["#60a5fa", "#f472b6", "#34d399", "#fbbf24", "#a78bfa", "#f87171"];

type Cell = { job: number } | null;

function schedule(mode: Mode) {
  const grid: Cell[][] = []; // grid[step][slot]
  const remaining = [...JOBS];
  const finishedAt: number[] = [];
  let next = 0;
  const slots: Array<{ job: number; left: number } | null> = Array(SLOTS).fill(null);
  let step = 0;
  while ((next < JOBS.length || slots.some(Boolean)) && step < 60) {
    const canRefill = mode === "continuous" || slots.every((s) => s === null);
    if (canRefill) {
      for (let i = 0; i < SLOTS; i++) {
        if (slots[i] === null && next < JOBS.length) {
          slots[i] = { job: next, left: remaining[next] };
          next++;
        }
      }
    }
    grid.push(slots.map((s) => (s ? { job: s.job } : null)));
    for (let i = 0; i < SLOTS; i++) {
      const s = slots[i];
      if (s) {
        s.left -= 1;
        if (s.left === 0) {
          finishedAt[s.job] = step + 1;
          slots[i] = null;
        }
      }
    }
    step++;
  }
  const busy = grid.flat().filter(Boolean).length;
  return { grid, steps: step, utilisation: busy / (step * SLOTS), avgDone: finishedAt.reduce((a, b) => a + b, 0) / JOBS.length };
}

export default function ContinuousBatchingDemo() {
  const [mode, setMode] = React.useState<Mode>("static");
  const r = React.useMemo(() => schedule(mode), [mode]);

  return (
    <DemoFrame title="A free burner never stays empty" hint="4 GPU slots, 12 requests with very different answer lengths. Each column is one decoding step." onReset={() => setMode("static")}>
      <ChoiceChips
        label="Batching"
        options={[
          { id: "static", label: "Static (wait for the whole batch)" },
          { id: "continuous", label: "Continuous" },
        ]}
        value={mode}
        onChange={setMode}
      />
      <div className="mt-3 overflow-x-auto">
        <div className="inline-grid gap-px" style={{ gridTemplateColumns: `repeat(${r.steps}, 0.9rem)` }} role="img" aria-label="Slots over time">
          {Array.from({ length: SLOTS }, (_, slot) =>
            r.grid.map((col, step) => {
              const c = col[slot];
              return (
                <span
                  key={`${slot}-${step}`}
                  className="h-5 rounded-[2px]"
                  style={{ gridRow: slot + 1, gridColumn: step + 1, backgroundColor: c ? COLORS[c.job % COLORS.length] : "var(--surface)", opacity: c ? 0.9 : 1 }}
                  title={c ? `request ${c.job + 1}` : "idle"}
                />
              );
            }),
          )}
        </div>
      </div>
      <ul className="mt-3 grid grid-cols-3 gap-2 text-center text-xs" aria-live="polite">
        <li className="rounded-lg bg-surface p-2">
          <div className="font-mono text-lg">{r.steps}</div>
          <div className="text-muted">steps to finish all</div>
        </li>
        <li className="rounded-lg bg-surface p-2">
          <div className="font-mono text-lg">{Math.round(r.utilisation * 100)}%</div>
          <div className="text-muted">slots busy</div>
        </li>
        <li className="rounded-lg bg-surface p-2">
          <div className="font-mono text-lg">{r.avgDone.toFixed(1)}</div>
          <div className="text-muted">avg step a request finishes</div>
        </li>
      </ul>
      <p className="mt-2 text-[11px] text-muted">
        {mode === "static" ? "Grey gaps: short answers finished but their slot waits for the longest one in the batch." : "A finished slot is refilled at the very next step."}
      </p>
    </DemoFrame>
  );
}

"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";
import { Switch } from "@/components/ui/Switch";

const STEPS = [
  { shop: "Bakery", item: "bread" },
  { shop: "Market", item: "apples" },
  { shop: "Pharmacy", item: "plasters" },
  { shop: "Post office", item: "stamps" },
  { shop: "Library", item: "returned book" },
  { shop: "Home", item: "" },
];
const CRASH_AT = 3; // battery dies at the post office

export default function CheckpointsDemo() {
  const [checkpoints, setCheckpoints] = React.useState(true);
  const [done, setDone] = React.useState<number[]>([]); // completed step indexes, in order (may repeat)
  const [crashed, setCrashed] = React.useState(false);
  const [view, setView] = React.useState<number | null>(null);

  function run() {
    setDone([0, 1, 2]);
    setCrashed(true);
    setView(null);
  }

  function resume() {
    const from = checkpoints ? CRASH_AT : 0;
    setDone((d) => [...d, ...STEPS.map((_, i) => i).slice(from)]);
    setCrashed(false);
  }

  function reset() {
    setDone([]);
    setCrashed(false);
    setView(null);
  }

  const counts = done.reduce<Record<number, number>>((acc, i) => ({ ...acc, [i]: (acc[i] ?? 0) + 1 }), {});
  const duplicates = Object.entries(counts).filter(([, n]) => n > 1).map(([i]) => STEPS[Number(i)].item).filter(Boolean);
  const finished = !crashed && done.includes(STEPS.length - 1);
  const savedUpTo = checkpoints ? Math.max(-1, ...done.filter((i) => i < CRASH_AT || finished)) : -1;

  return (
    <DemoFrame title="Save the game after every shop" hint="The battery dies at the post office. What happens on restart?" onReset={reset}>
      <div className="flex flex-wrap items-center gap-2">
        <Switch
          checked={checkpoints}
          onChange={(v) => {
            setCheckpoints(v);
            reset();
          }}
          label="Checkpoint after each step"
        />
        <ActionButton onClick={run} disabled={done.length > 0}>
          Run errands
        </ActionButton>
        <ActionButton onClick={resume} disabled={!crashed} variant="secondary">
          Restart robot
        </ActionButton>
      </div>
      <ol className="mt-3 grid grid-cols-6 gap-1 text-center text-[10px]">
        {STEPS.map((s, i) => {
          const n = counts[i] ?? 0;
          const isCrash = crashed && i === CRASH_AT;
          return (
            <li key={s.shop}>
              <button
                type="button"
                onClick={() => checkpoints && n > 0 && setView(i)}
                disabled={!checkpoints || n === 0}
                className="w-full rounded-md px-1 py-2"
                style={{
                  backgroundColor: isCrash
                    ? "color-mix(in srgb, var(--bad) 25%, transparent)"
                    : n > 1
                      ? "color-mix(in srgb, var(--warn) 30%, transparent)"
                      : n === 1
                        ? "color-mix(in srgb, var(--good) 22%, transparent)"
                        : "var(--surface)",
                  outline: view === i ? "2px solid var(--accent)" : undefined,
                }}
                aria-label={`${s.shop}${n ? `, done ${n} time${n > 1 ? "s" : ""}` : ""}`}
              >
                {isCrash ? "🔋✗" : n ? "✓" : "·"}
                <span className="block">{s.shop}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 rounded-lg bg-surface px-3 py-2 text-xs" aria-live="polite">
        {done.length === 0 && "Press Run errands."}
        {crashed && (checkpoints ? `Crashed. Last checkpoint: after ${STEPS[savedUpTo]?.shop}. Restart continues from the post office.` : "Crashed. No checkpoints: a restarted robot knows nothing and starts at the bakery again.")}
        {finished && (duplicates.length ? <span style={{ color: "var(--bad)" }}>Finished, but it bought {duplicates.join(", ")} twice: side effects repeated.</span> : <span style={{ color: "var(--good)" }}>Finished. Each errand ran exactly once.</span>)}
      </div>
      {checkpoints && view !== null && (
        <p className="mt-2 font-mono text-[11px] text-muted">
          checkpoint after {STEPS[view].shop}: bag = [{STEPS.slice(0, view + 1).map((s) => s.item).filter(Boolean).join(", ")}] (click any done step to time-travel)
        </p>
      )}
    </DemoFrame>
  );
}

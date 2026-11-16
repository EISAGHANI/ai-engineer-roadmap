"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, StepControls, useStepper } from "../ui";

type Mode = "sync" | "async";
/** Three LLM calls: a little work, then mostly waiting for the provider. Seconds. */
const CALLS = [
  { label: "Summarize chapter 1", wait: 2.4 },
  { label: "Summarize chapter 2", wait: 1.8 },
  { label: "Summarize chapter 3", wait: 2.1 },
];
const WORK = 0.1;

export default function AsyncDemo() {
  const [mode, setMode] = React.useState<Mode>("sync");
  const TICKS = 70; // 7 s at 0.1 s per tick
  const { shown, play, reset, done, next } = useStepper(TICKS, 60);
  const t = shown / 10;

  // Start times: one after another, or all at once
  const starts: number[] = [];
  CALLS.forEach((_, i) => starts.push(mode === "async" ? i * WORK : i === 0 ? 0 : starts[i - 1] + WORK + CALLS[i - 1].wait));
  const ends = CALLS.map((c, i) => starts[i] + WORK + c.wait);
  const total = Math.max(...ends);
  const scale = 7;

  return (
    <DemoFrame title="Never stand at the window waiting" hint="Three LLM calls. Mostly the program is just waiting for answers." onReset={reset}>
      <div className="flex flex-wrap items-center gap-3">
        <ChoiceChips
          label="Code"
          options={[
            { id: "sync", label: "One after another" },
            { id: "async", label: "asyncio.gather" },
          ]}
          value={mode}
          onChange={(m) => {
            setMode(m);
            reset();
          }}
        />
        <StepControls onPlay={play} onNext={next} done={done} playLabel="Run" />
      </div>
      <ul className="mt-3 space-y-2">
        {CALLS.map((c, i) => {
          const s = starts[i];
          const e = ends[i];
          const visibleEnd = Math.min(t, e);
          const started = t > s;
          return (
            <li key={c.label} className="text-xs">
              <div className="flex justify-between">
                <span>{c.label}</span>
                <span className="font-mono text-muted">{t >= e ? `done at ${e.toFixed(1)} s` : started ? "waiting…" : "not started"}</span>
              </div>
              <div className="relative mt-0.5 h-3 rounded-sm bg-surface">
                {started && (
                  <span
                    className="absolute top-0 h-full rounded-sm"
                    style={{ left: `${(s / scale) * 100}%`, width: `${((visibleEnd - s) / scale) * 100}%`, backgroundColor: "var(--area-backend)" }}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-sm" aria-live="polite">
        {t >= total ? (
          <>
            All three done in <strong>{total.toFixed(1)} s</strong>.{" "}
            {mode === "sync" ? "Each call waited for the one before it." : "The waits overlapped, so total ≈ the slowest call."}
          </>
        ) : (
          <span className="text-muted">Clock: {t.toFixed(1)} s</span>
        )}
      </p>
    </DemoFrame>
  );
}

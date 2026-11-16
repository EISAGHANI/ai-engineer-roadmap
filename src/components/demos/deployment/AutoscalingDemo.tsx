"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

/** Visitors per hour across a day with a stadium spike in the evening. */
const TRAFFIC = [20, 15, 10, 10, 15, 30, 60, 90, 110, 120, 130, 140, 150, 140, 130, 120, 140, 180, 420, 520, 300, 160, 80, 40];
const PER_COPY = 60; // requests one copy handles at 70% CPU
const MIN = 2;

type Mode = "fixed" | "auto";

export default function AutoscalingDemo() {
  const [mode, setMode] = React.useState<Mode>("auto");
  const [max, setMax] = React.useState(10);

  const fixedCopies = 3;
  // Scale up immediately, scale down only after load stayed low (stabilization window ~1 hour here)
  const copies: number[] = [];
  TRAFFIC.forEach((t, h) => {
    const wanted = Math.min(max, Math.max(MIN, Math.ceil(t / PER_COPY)));
    const prev = h === 0 ? MIN : copies[h - 1];
    copies.push(mode === "fixed" ? fixedCopies : wanted >= prev ? wanted : Math.max(wanted, prev - 1));
  });
  const dropped = TRAFFIC.reduce((a, t, h) => a + Math.max(0, t - copies[h] * PER_COPY), 0);
  const copyHours = copies.reduce((a, c) => a + c, 0);
  const peak = Math.max(...TRAFFIC);
  const chartMax = Math.max(peak, max * PER_COPY);

  return (
    <DemoFrame
      title="More trucks when the crowd arrives"
      hint="A day of traffic with a stadium crowd at 18:00. Compare a fixed fleet with autoscaling."
      onReset={() => {
        setMode("auto");
        setMax(10);
      }}
    >
      <div className="flex flex-wrap items-end gap-4">
        <ChoiceChips
          label="Fleet"
          options={[
            { id: "fixed", label: "Always 3 copies" },
            { id: "auto", label: "Autoscale (min 2)" },
          ]}
          value={mode}
          onChange={setMode}
        />
        {mode === "auto" && (
          <label className="text-xs text-muted">
            max copies: <span className="font-mono text-text">{max}</span>
            <input type="range" min={3} max={12} value={max} onChange={(e) => setMax(+e.target.value)} className="mt-1 block w-32 accent-[var(--accent)]" />
          </label>
        )}
      </div>
      <div className="mt-3 flex h-28 items-end gap-[2px]" role="img" aria-label="Traffic and capacity per hour">
        {TRAFFIC.map((t, h) => {
          const cap = copies[h] * PER_COPY;
          const over = t > cap;
          return (
            <div key={h} className="relative flex-1" style={{ height: "100%" }}>
              <div className="absolute bottom-0 w-full rounded-t-sm" style={{ height: `${(cap / chartMax) * 100}%`, backgroundColor: "color-mix(in srgb, var(--area-deployment) 25%, transparent)" }} />
              <div className="absolute bottom-0 left-1/4 w-1/2 rounded-t-sm" style={{ height: `${(t / chartMax) * 100}%`, backgroundColor: over ? "var(--bad)" : "var(--area-deployment)" }} />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[9px] text-muted">
        <span>00:00</span>
        <span>12:00</span>
        <span>23:00</span>
      </div>
      <p className="mt-2 text-[11px] text-muted">thin bar = visitors · wide shade = capacity · red = more visitors than capacity</p>
      <p className="mt-2 text-xs" aria-live="polite">
        Requests dropped: <strong style={{ color: dropped ? "var(--bad)" : "var(--good)" }}>{dropped.toLocaleString("en-US")}</strong> · copy-hours paid:{" "}
        <strong>{copyHours}</strong>
        {mode === "auto" && dropped > 0 && " · the max is a cost ceiling, but too low drops visitors"}
      </p>
    </DemoFrame>
  );
}

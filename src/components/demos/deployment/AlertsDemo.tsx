"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";

/** p95 latency in seconds, one value per 10 minutes over 8 hours. A real incident starts at index 33. */
const P95 = [2.1, 2.3, 2.2, 3.1, 2.4, 2.2, 2.0, 2.6, 3.4, 2.3, 2.1, 2.2, 2.5, 3.2, 2.4, 2.2, 2.1, 2.3, 2.9, 2.2, 2.4, 3.3, 2.2, 2.1, 2.3, 2.2, 2.6, 2.4, 2.1, 3.0, 2.3, 2.2, 2.4, 4.6, 5.2, 5.8, 6.1, 5.9, 6.3, 6.0, 5.7, 6.2, 6.4, 6.1, 6.0, 5.8, 6.2, 6.1];
const INCIDENT_START = 33;

export default function AlertsDemo() {
  const [threshold, setThreshold] = React.useState(3);
  const [forWindows, setForWindows] = React.useState(1);

  // An alert fires when the value stays above the threshold for `forWindows` points in a row
  const fires: number[] = [];
  let run = 0;
  P95.forEach((v, i) => {
    run = v > threshold ? run + 1 : 0;
    if (run === forWindows) fires.push(i);
  });
  const falseAlarms = fires.filter((i) => i < INCIDENT_START).length;
  const caught = fires.find((i) => i >= INCIDENT_START);
  const delayMin = caught === undefined ? null : (caught - INCIDENT_START + 1) * 10;
  const top = 7;

  return (
    <DemoFrame
      title="The screen and the pager"
      hint="p95 latency over 8 hours. Tune the alert so it catches the real incident without paging for noise."
      onReset={() => {
        setThreshold(3);
        setForWindows(1);
      }}
    >
      <div className="flex flex-wrap gap-4">
        <label className="text-xs text-muted">
          threshold: <span className="font-mono text-text">{threshold.toFixed(1)} s</span>
          <input type="range" min={2.5} max={6.5} step={0.5} value={threshold} onChange={(e) => setThreshold(+e.target.value)} className="mt-1 block w-36 accent-[var(--accent)]" />
        </label>
        <label className="text-xs text-muted">
          for: <span className="font-mono text-text">{forWindows * 10} min</span>
          <input type="range" min={1} max={4} value={forWindows} onChange={(e) => setForWindows(+e.target.value)} className="mt-1 block w-28 accent-[var(--accent)]" />
        </label>
      </div>
      <div className="relative mt-3 flex h-24 items-end gap-[2px]" role="img" aria-label="p95 latency chart with threshold line">
        {P95.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-sm"
            style={{
              height: `${(v / top) * 100}%`,
              backgroundColor: fires.includes(i) ? (i < INCIDENT_START ? "var(--warn)" : "var(--bad)") : i >= INCIDENT_START ? "color-mix(in srgb, var(--bad) 40%, transparent)" : "var(--area-deployment)",
            }}
          />
        ))}
        <div className="absolute right-0 left-0 border-t-2 border-dashed border-text" style={{ bottom: `${(threshold / top) * 100}%` }} />
      </div>
      <p className="mt-1 text-[10px] text-muted">bright bars = moment the pager rang · the reddish block at the end is the real incident</p>
      <ul className="mt-2 space-y-0.5 text-xs" aria-live="polite">
        <li>
          False alarms before the incident: <strong style={{ color: falseAlarms ? "var(--warn)" : "var(--good)" }}>{falseAlarms}</strong>
        </li>
        <li>
          Real incident: {delayMin === null ? <strong style={{ color: "var(--bad)" }}>missed!</strong> : <strong style={{ color: "var(--good)" }}>paged after {delayMin} min</strong>}
        </li>
      </ul>
      <p className="mt-1 text-[11px] text-muted">
        {falseAlarms > 2
          ? "Too noisy: people learn to ignore the pager."
          : delayMin === null
            ? "Too strict: users suffer and nobody is told."
            : "A good balance: quiet on normal spikes, fast on real trouble."}
      </p>
    </DemoFrame>
  );
}

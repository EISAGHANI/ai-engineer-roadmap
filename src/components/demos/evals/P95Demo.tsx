"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { Switch } from "@/components/ui/Switch";

/** 200 deterministic request times (ms): mostly 600-1,600 ms. */
function baseLatencies() {
  let seed = 11;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: 200 }, () => Math.round(600 + (rnd() + rnd() + rnd()) / 3 * 1000));
}
const BASE = baseLatencies();
const SLOW = BASE.map((ms, i) => (i % 20 === 7 || i % 20 === 13 ? ms + 5000 : ms)); // 10% hit a cold cache

function percentile(values: number[], p: number) {
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1);
  return sorted[idx];
}

const BINS = 16;
const MAX = 7000;

export default function P95Demo() {
  const [tail, setTail] = React.useState(false);
  const data = tail ? SLOW : BASE;
  const mean = Math.round(data.reduce((a, b) => a + b, 0) / data.length);
  const p50 = percentile(data, 50);
  const p95 = percentile(data, 95);
  const p99 = percentile(data, 99);
  const counts = Array.from({ length: BINS }, () => 0);
  data.forEach((ms) => {
    counts[Math.min(BINS - 1, Math.floor((ms / MAX) * BINS))]++;
  });
  const maxCount = Math.max(...counts);
  const x = (ms: number) => (ms / MAX) * 300;

  return (
    <DemoFrame title="The slow end of the queue" hint="200 requests. Add a slow tail and compare the average with p95." onReset={() => setTail(false)}>
      <Switch checked={tail} onChange={setTail} label="10% of requests hit a cold cache (+5 s)" />
      <svg viewBox="0 0 300 120" className="mt-2 w-full rounded-lg bg-surface" role="img" aria-label={`Latency histogram, p95 ${p95} ms`}>
        {counts.map((c, i) => (
          <rect key={i} x={(i * 300) / BINS + 1} y={100 - (c / maxCount) * 85} width={300 / BINS - 2} height={(c / maxCount) * 85} fill="var(--area-evals)" opacity="0.7" />
        ))}
        {[
          { v: mean, label: "avg", color: "var(--muted)" },
          { v: p95, label: "p95", color: "var(--accent)" },
        ].map((l) => (
          <g key={l.label}>
            <line x1={x(l.v)} x2={x(l.v)} y1="8" y2="100" stroke={l.color} strokeWidth="2" strokeDasharray="4 3" />
            <text x={x(l.v) + 3} y="16" fontSize="9" fill={l.color}>
              {l.label}
            </text>
          </g>
        ))}
        <text x="2" y="114" fontSize="8" fill="var(--muted)">
          0 s
        </text>
        <text x="298" y="114" fontSize="8" textAnchor="end" fill="var(--muted)">
          7 s
        </text>
      </svg>
      <dl className="mt-2 grid grid-cols-4 gap-2 text-center text-xs" aria-live="polite">
        {[
          ["average", mean],
          ["p50", p50],
          ["p95", p95],
          ["p99", p99],
        ].map(([k, v]) => (
          <div key={k} className="rounded-lg bg-surface p-1.5">
            <dt className="text-muted">{k}</dt>
            <dd className="font-mono" style={k === "p95" ? { color: "var(--accent)" } : undefined}>
              {(Number(v) / 1000).toFixed(2)} s
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-xs text-muted">
        {tail ? "The average grew a little; p95 jumped. One user in twenty now waits over 5 seconds." : "Without a tail, average and p95 are close."}
      </p>
    </DemoFrame>
  );
}

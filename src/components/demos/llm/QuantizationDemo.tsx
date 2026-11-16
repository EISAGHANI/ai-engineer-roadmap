"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";

const OPTIONS = [
  { bits: 16, levels: 0, gb: 14, quality: "Reference quality", fits: "a big data-centre GPU" },
  { bits: 8, levels: 256, gb: 7, quality: "Practically identical", fits: "a gaming GPU" },
  { bits: 4, levels: 16, gb: 3.5, quality: "Small loss, usually fine", fits: "a laptop" },
  { bits: 3, levels: 8, gb: 2.6, quality: "Noticeable loss", fits: "a laptop" },
  { bits: 2, levels: 4, gb: 1.75, quality: "Breaks down", fits: "a phone" },
];

const W = 300;
const H = 110;
const N = 120;

/** A smooth "weight curve" standing in for the model's precise numbers. */
const truth = (x: number) => 0.55 * Math.sin(x * 2.1) + 0.3 * Math.sin(x * 5.3 + 1) + 0.12 * Math.sin(x * 11.7);

function quantize(v: number, levels: number) {
  if (!levels) return v;
  const min = -1;
  const max = 1;
  const step = (max - min) / (levels - 1);
  return Math.round((v - min) / step) * step + min;
}

export default function QuantizationDemo() {
  const [idx, setIdx] = React.useState(2);
  const o = OPTIONS[idx];
  const xs = Array.from({ length: N }, (_, i) => (i / (N - 1)) * Math.PI * 2);
  const y = (v: number) => H / 2 - v * (H / 2 - 6);
  const x = (i: number) => (i / (N - 1)) * W;
  const truePath = xs.map((t, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(truth(t)).toFixed(1)}`).join(" ");
  const qPath = xs
    .map((t, i) => {
      const v = y(quantize(truth(t), o.levels));
      return i === 0 ? `M0 ${v.toFixed(1)}` : `H${x(i).toFixed(1)} V${v.toFixed(1)}`;
    })
    .join(" ");
  const err = xs.reduce((a, t) => a + Math.abs(truth(t) - quantize(truth(t), o.levels)), 0) / N;

  return (
    <DemoFrame title="Round the numbers, shrink the model" hint="Fewer bits = fewer steps the numbers can take." onReset={() => setIdx(2)}>
      <label className="text-xs text-muted">
        Bits per number: <span className="font-mono text-text">{o.bits}</span>
        <input
          type="range"
          min={0}
          max={OPTIONS.length - 1}
          value={idx}
          onChange={(e) => setIdx(parseInt(e.target.value, 10))}
          aria-valuetext={`${o.bits} bits`}
          className="mt-1 block w-full accent-[var(--accent)]"
        />
      </label>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-2 w-full rounded-lg bg-surface" role="img" aria-label={`Precise curve and its ${o.bits}-bit version`}>
        <path d={truePath} fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="3 3" />
        <path d={qPath} fill="none" stroke="var(--area-llm)" strokeWidth="2" style={{ transition: "d 200ms" }} />
      </svg>
      <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs" aria-live="polite">
        <div className="rounded-lg bg-surface p-2">
          <dt className="text-muted">7B model size</dt>
          <dd className="font-mono text-base">{o.gb} GB</dd>
        </div>
        <div className="rounded-lg bg-surface p-2">
          <dt className="text-muted">Average error</dt>
          <dd className="font-mono text-base">{err.toFixed(3)}</dd>
        </div>
        <div className="rounded-lg bg-surface p-2">
          <dt className="text-muted">Quality</dt>
          <dd className="text-sm" style={{ color: o.bits >= 4 ? "var(--good)" : o.bits === 3 ? "var(--warn)" : "var(--bad)" }}>
            {o.quality}
          </dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-muted">Dashed: the precise numbers. Coloured: what is stored. At {o.bits} bits it runs on {o.fits}.</p>
    </DemoFrame>
  );
}

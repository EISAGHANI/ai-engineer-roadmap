"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { cn } from "@/lib/utils";

/** Example prices in USD per 1M tokens. Real prices differ per provider and change often. */
const TIERS = {
  small: { label: "Small model", input: 0.25, output: 1.25 },
  medium: { label: "Medium model", input: 3, output: 15 },
  large: { label: "Large model", input: 15, output: 75 },
} as const;
type Tier = keyof typeof TIERS;

const INPUT_STEPS = [200, 500, 1_000, 2_000, 5_000, 10_000, 20_000, 50_000];
const OUTPUT_STEPS = [50, 100, 200, 500, 1_000, 2_000, 4_000, 8_000];
const CALL_STEPS = [100, 1_000, 5_000, 10_000, 50_000, 100_000];

const fmt = (n: number) => n.toLocaleString("en-US");
const usd = (n: number) =>
  n < 0.001
    ? `$${n.toFixed(6)}`
    : n < 1
      ? `$${n.toFixed(4)}`
      : `$${n.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;

export default function TokenPricingDemo() {
  const [tier, setTier] = React.useState<Tier>("medium");
  const [inIdx, setInIdx] = React.useState(3);
  const [outIdx, setOutIdx] = React.useState(3);
  const [callIdx, setCallIdx] = React.useState(2);

  const p = TIERS[tier];
  const input = INPUT_STEPS[inIdx];
  const output = OUTPUT_STEPS[outIdx];
  const calls = CALL_STEPS[callIdx];
  const inCost = (input * p.input) / 1e6;
  const outCost = (output * p.output) / 1e6;
  const perCall = inCost + outCost;
  const perMonth = perCall * calls * 30;
  const outShare = perCall > 0 ? outCost / perCall : 0;

  function reset() {
    setTier("medium");
    setInIdx(3);
    setOutIdx(3);
    setCallIdx(2);
  }

  return (
    <DemoFrame title="What does one call cost?" hint="Example prices per 1M tokens. Writing costs more than reading." onReset={reset}>
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Model size">
        {(Object.keys(TIERS) as Tier[]).map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={tier === t}
            onClick={() => setTier(t)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              tier === t ? "border-accent bg-accent text-accent-ink" : "border-border hover:border-accent/60",
            )}
          >
            {TIERS[t].label} · ${TIERS[t].input} / ${TIERS[t].output}
          </button>
        ))}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <Slider label="Input tokens" value={fmt(input)} index={inIdx} max={INPUT_STEPS.length - 1} onChange={setInIdx} />
        <Slider label="Output tokens" value={fmt(output)} index={outIdx} max={OUTPUT_STEPS.length - 1} onChange={setOutIdx} />
        <Slider label="Calls per day" value={fmt(calls)} index={callIdx} max={CALL_STEPS.length - 1} onChange={setCallIdx} />
      </div>

      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-surface" aria-hidden="true">
        <div className="flex h-full">
          <span style={{ width: `${(1 - outShare) * 100}%`, backgroundColor: "var(--area-rag)" }} />
          <span style={{ width: `${outShare * 100}%`, backgroundColor: "var(--area-llm)" }} />
        </div>
      </div>
      <p className="mt-1 text-xs text-muted">
        <span style={{ color: "var(--area-rag)" }}>■</span> reading {usd(inCost)} ·{" "}
        <span style={{ color: "var(--area-llm)" }}>■</span> writing {usd(outCost)} ({Math.round(outShare * 100)}% of the bill)
      </p>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-center" aria-live="polite">
        <div className="rounded-lg bg-surface p-2">
          <dt className="text-[11px] text-muted">Per call</dt>
          <dd className="font-mono text-lg">{usd(perCall)}</dd>
        </div>
        <div className="rounded-lg bg-surface p-2">
          <dt className="text-[11px] text-muted">Per month (30 days)</dt>
          <dd className="font-mono text-lg" style={{ color: "var(--accent)" }}>
            {usd(perMonth)}
          </dd>
        </div>
      </dl>
    </DemoFrame>
  );
}

function Slider({
  label,
  value,
  index,
  max,
  onChange,
}: {
  label: string;
  value: string;
  index: number;
  max: number;
  onChange: (i: number) => void;
}) {
  return (
    <label className="text-xs text-muted">
      {label}: <span className="font-mono text-text">{value}</span>
      <input
        type="range"
        min={0}
        max={max}
        step={1}
        value={index}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        aria-valuetext={value}
        className="mt-1 w-full accent-[var(--accent)]"
      />
    </label>
  );
}

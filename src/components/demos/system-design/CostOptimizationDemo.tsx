"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { Switch } from "@/components/ui/Switch";

const BASELINE = 12_000; // $ per month
const LEVERS = [
  { id: "trim", label: "Trim prompts, cap outputs", keep: 0.8, quality: 0, effort: "low" },
  { id: "prefix", label: "Prompt caching for the handbook", keep: 0.75, quality: 0, effort: "low" },
  { id: "route", label: "Route 70% to a small model", keep: 0.45, quality: -1, effort: "medium" },
  { id: "semantic", label: "Semantic cache for FAQs", keep: 0.85, quality: -1, effort: "medium" },
  { id: "batch", label: "Nightly jobs via the Batch API", keep: 0.93, quality: 0, effort: "low" },
  { id: "chunks", label: "Retrieve 5 chunks instead of 20", keep: 0.88, quality: 0, effort: "low" },
] as const;

export default function CostOptimizationDemo() {
  const [on, setOn] = React.useState<Record<string, boolean>>({});
  const [evals, setEvals] = React.useState(true);

  let cost = BASELINE;
  const steps: Array<{ label: string; cost: number }> = [{ label: "Today", cost: BASELINE }];
  let qualityRisk = 0;
  for (const l of LEVERS) {
    if (!on[l.id]) continue;
    cost *= l.keep;
    qualityRisk += l.quality;
    steps.push({ label: l.label, cost });
  }
  const saving = 1 - cost / BASELINE;
  const qualityDropped = qualityRisk < 0 && !evals;

  return (
    <DemoFrame
      title="Many small savings add up"
      hint="A $12,000/month AI feature. Switch on levers; savings multiply."
      onReset={() => {
        setOn({});
        setEvals(true);
      }}
    >
      <ul className="grid gap-1.5 sm:grid-cols-2">
        {LEVERS.map((l) => (
          <li key={l.id} className="flex items-center justify-between gap-2 rounded-lg bg-surface px-2 py-1">
            <Switch checked={!!on[l.id]} onChange={(v) => setOn({ ...on, [l.id]: v })} label={l.label} className="text-xs" />
            <span className="shrink-0 font-mono text-[10px] text-muted">−{Math.round((1 - l.keep) * 100)}%</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 flex h-24 items-end gap-1" role="img" aria-label="Monthly cost after each lever">
        {steps.map((s, i) => (
          <div key={s.label} className="flex flex-1 flex-col items-center justify-end" style={{ height: "100%" }}>
            <span className="font-mono text-[9px]">${Math.round(s.cost / 100) / 10}k</span>
            <span className="w-full rounded-t-sm transition-all" style={{ height: `${(s.cost / BASELINE) * 80}%`, backgroundColor: i === 0 ? "var(--muted)" : "var(--area-system-design)" }} />
          </div>
        ))}
      </div>
      <p className="mt-2 text-sm" aria-live="polite">
        ${Math.round(cost).toLocaleString("en-US")}/month · saving <strong style={{ color: "var(--good)" }}>{Math.round(saving * 100)}%</strong>
      </p>
      <label className="mt-2 flex items-center gap-2 text-xs text-muted">
        <input type="checkbox" checked={evals} onChange={(e) => setEvals(e.target.checked)} className="accent-[var(--accent)]" />
        Run evals after every change
      </label>
      {qualityRisk < 0 && (
        <p className="mt-1 text-[11px]" style={{ color: qualityDropped ? "var(--bad)" : "var(--good)" }}>
          {qualityDropped
            ? "⚠ Routing and caching can quietly lower answer quality. Without evals, nobody would notice until users complain."
            : "Evals check routing and caching, so the cheaper path is proven to answer well enough."}
        </p>
      )}
    </DemoFrame>
  );
}

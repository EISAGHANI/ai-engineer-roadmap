"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { cn } from "@/lib/utils";

const D = 4096; // size of one square weight matrix (d x d)
const RANKS = [1, 2, 4, 8, 16, 32, 64];
const ADAPTERS = {
  medical: { label: "Medical", color: "var(--area-security)", sample: "Patient presents with acute dyspnoea; recommend SpO₂ monitoring." },
  legal: { label: "Legal", color: "var(--area-agents)", sample: "Pursuant to clause 4.2, the lessee shall give three months' notice." },
  cooking: { label: "Cooking", color: "var(--area-evals)", sample: "Fold the egg whites in gently so the batter stays light and airy." },
} as const;
type Adapter = keyof typeof ADAPTERS;

const fmt = (n: number) => n.toLocaleString("en-US");

export default function LoRADemo() {
  const [rankIdx, setRankIdx] = React.useState(4);
  const [adapter, setAdapter] = React.useState<Adapter>("medical");
  const r = RANKS[rankIdx];
  const full = D * D;
  const lora = 2 * D * r;
  const pct = (lora / full) * 100;
  const a = ADAPTERS[adapter];
  const thin = 4 + Math.log2(r) * 6; // visual thickness of the adapter bars (4..40)

  return (
    <DemoFrame title="Freeze the big matrix, train two thin ones" hint="Change the rank and swap adapters." onReset={() => { setRankIdx(4); setAdapter("medical"); }}>
      <div className="flex flex-wrap items-end gap-4">
        <label className="text-xs text-muted">
          Rank r: <span className="font-mono text-text">{r}</span>
          <input
            type="range"
            min={0}
            max={RANKS.length - 1}
            value={rankIdx}
            onChange={(e) => setRankIdx(parseInt(e.target.value, 10))}
            aria-valuetext={`rank ${r}`}
            className="mt-1 block w-40 accent-[var(--accent)]"
          />
        </label>
        <div role="radiogroup" aria-label="Adapter" className="flex gap-1.5">
          {(Object.keys(ADAPTERS) as Adapter[]).map((k) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={adapter === k}
              onClick={() => setAdapter(k)}
              className={cn("rounded-full border px-3 py-1 text-xs", adapter === k ? "text-accent-ink" : "border-border")}
              style={adapter === k ? { backgroundColor: ADAPTERS[k].color, borderColor: ADAPTERS[k].color } : undefined}
            >
              {ADAPTERS[k].label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <svg viewBox="0 0 300 120" className="h-28 w-auto" role="img" aria-label={`Frozen 4096 by 4096 matrix plus rank ${r} adapters`}>
          <defs>
            <pattern id="lora-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="var(--border)" strokeWidth="2" />
            </pattern>
          </defs>
          <rect x="4" y="4" width="112" height="112" rx="6" fill="url(#lora-hatch)" stroke="var(--border)" />
          <text x="60" y="56" textAnchor="middle" fontSize="11" fill="var(--text)" fontWeight="600">W (frozen)</text>
          <text x="60" y="72" textAnchor="middle" fontSize="9" fill="var(--muted)">4096 × 4096</text>
          <text x="134" y="64" textAnchor="middle" fontSize="16" fill="var(--muted)">+</text>
          <text x={150 + thin / 2} y="11" textAnchor="middle" fontSize="10" fill="var(--muted)">B</text>
          <rect x="150" y="16" width={thin} height="100" rx="3" fill={a.color} style={{ transition: "width 250ms" }} />
          <text x={161 + thin} y="68" textAnchor="middle" fontSize="14" fill="var(--muted)">·</text>
          <text x={204 + thin} y="50" textAnchor="middle" fontSize="10" fill="var(--muted)">A</text>
          <rect x={172 + thin} y="56" width="64" height={thin} rx="3" fill={a.color} style={{ transition: "height 250ms" }} />
        </svg>
        <dl className="space-y-1 text-xs">
          <div>
            <dt className="inline text-muted">Full fine-tune: </dt>
            <dd className="inline font-mono">{fmt(full)}</dd>
          </div>
          <div>
            <dt className="inline text-muted">LoRA trains: </dt>
            <dd className="inline font-mono" style={{ color: "var(--accent)" }}>
              {fmt(lora)}
            </dd>
          </div>
          <div>
            <dt className="inline text-muted">Share: </dt>
            <dd className="inline font-mono">{pct < 0.1 ? pct.toFixed(3) : pct.toFixed(2)}%</dd>
          </div>
        </dl>
      </div>
      <p className="mt-2 rounded-lg px-3 py-2 text-sm" style={{ backgroundColor: `color-mix(in srgb, ${a.color} 14%, transparent)` }} aria-live="polite">
        <span className="font-mono text-[10px] text-muted uppercase">{a.label} adapter plugged in · </span>
        {a.sample}
      </p>
      <p className="mt-1 text-xs text-muted">Same frozen model, different small adapter files. Swapping one takes seconds.</p>
    </DemoFrame>
  );
}

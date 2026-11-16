"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { cn } from "@/lib/utils";

/**
 * Rough training memory in GB, without activations (approximate rules of thumb):
 * full fine-tune ≈ 16 bytes/param (bf16 weights + grads + Adam states + fp32 master copy),
 * LoRA (16-bit) ≈ 2 bytes/param + ~2 GB, QLoRA (4-bit) ≈ 0.6 bytes/param + ~2 GB.
 */
const MODELS = { "8B": 8, "70B": 70 } as const;
const GPUS = { "24 GB gaming GPU": 24, "48 GB workstation GPU": 48, "80 GB data-centre GPU": 80 } as const;
type ModelKey = keyof typeof MODELS;
type GpuKey = keyof typeof GPUS;

function methods(b: number) {
  return [
    { name: "Full fine-tune", gb: b * 16 },
    { name: "LoRA, 16-bit base", gb: b * 2 + 2 },
    { name: "QLoRA, 4-bit base", gb: b * 0.6 + 2 },
  ];
}

export default function QLoRADemo() {
  const [model, setModel] = React.useState<ModelKey>("8B");
  const [gpu, setGpu] = React.useState<GpuKey>("24 GB gaming GPU");
  const rows = methods(MODELS[model]);
  const cap = GPUS[gpu];
  const scale = Math.max(cap * 1.4, ...rows.map((r) => Math.min(r.gb, cap * 3)));

  return (
    <DemoFrame title="Will it fit on my GPU?" hint="Approximate training memory, activations not included." onReset={() => { setModel("8B"); setGpu("24 GB gaming GPU"); }}>
      <div className="flex flex-wrap gap-3">
        <Choice label="Model" options={Object.keys(MODELS) as ModelKey[]} value={model} onChange={setModel} />
        <Choice label="GPU" options={Object.keys(GPUS) as GpuKey[]} value={gpu} onChange={setGpu} />
      </div>
      <ul className="relative mt-4 space-y-3">
        {rows.map((r) => {
          const fits = r.gb <= cap;
          return (
            <li key={r.name} className="text-xs">
              <div className="flex justify-between">
                <span>{r.name}</span>
                <span className="font-mono" style={{ color: fits ? "var(--good)" : "var(--bad)" }}>
                  ~{Math.round(r.gb)} GB {fits ? "✓ fits" : "✗ too big"}
                </span>
              </div>
              <div className="relative mt-1 h-3 rounded-full bg-surface">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (r.gb / scale) * 100)}%`,
                    backgroundColor: fits ? "var(--good)" : "var(--bad)",
                    transition: "width 300ms var(--ease-out)",
                  }}
                />
                <div className="absolute top-[-4px] h-5 w-0.5 bg-text" style={{ left: `${(cap / scale) * 100}%` }} aria-hidden="true" />
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-muted">
        The vertical line is your GPU ({cap} GB). QLoRA shrinks the frozen base model to 4 bits, which is why a 70B model can be
        fine-tuned on a single 48 GB card.
      </p>
    </DemoFrame>
  );
}

function Choice<T extends string>({ label, options, value, onChange }: { label: string; options: T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap items-center gap-1.5 text-xs">
      <span className="text-muted">{label}:</span>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={cn("rounded-full border px-2.5 py-1", value === o ? "border-accent bg-accent text-accent-ink" : "border-border")}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

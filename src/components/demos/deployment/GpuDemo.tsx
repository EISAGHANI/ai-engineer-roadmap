"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

/** Approximate numbers for Llama-3-style models (KV cache in 16-bit). */
const MODELS = {
  "8b": { label: "8B model", params: 8, kvKbPerToken: 128 },
  "70b": { label: "70B model", params: 70, kvKbPerToken: 320 },
} as const;
const GPUS = {
  l4: { label: "L4 · 24 GB", vram: 24, usdHour: 0.8 },
  a100: { label: "A100 · 80 GB", vram: 80, usdHour: 1.8 },
  h100: { label: "H100 · 80 GB", vram: 80, usdHour: 3.0 },
} as const;
const CONTEXTS = [2_048, 4_096, 8_192, 16_384, 32_768];
type ModelId = keyof typeof MODELS;
type GpuId = keyof typeof GPUS;
type Bits = "16" | "4";

export default function GpuDemo() {
  const [model, setModel] = React.useState<ModelId>("8b");
  const [bits, setBits] = React.useState<Bits>("16");
  const [gpu, setGpu] = React.useState<GpuId>("l4");
  const [ctxIdx, setCtxIdx] = React.useState(2);
  const [users, setUsers] = React.useState(4);

  const m = MODELS[model];
  const g = GPUS[gpu];
  const weights = m.params * (bits === "16" ? 2 : 0.6);
  const kv = (m.kvKbPerToken * CONTEXTS[ctxIdx] * users) / 1024 / 1024;
  const overhead = 2;
  const total = weights + kv + overhead;
  const count = Math.ceil(total / (g.vram * 0.9));
  const scale = Math.max(total, g.vram) * 1.05;

  return (
    <DemoFrame
      title="Will it fit, and how many GPUs?"
      hint="VRAM must hold the weights plus a KV cache for every active conversation."
      onReset={() => {
        setModel("8b");
        setBits("16");
        setGpu("l4");
        setCtxIdx(2);
        setUsers(4);
      }}
    >
      <div className="flex flex-wrap gap-2">
        <ChoiceChips label="Model" options={(Object.keys(MODELS) as ModelId[]).map((k) => ({ id: k, label: MODELS[k].label }))} value={model} onChange={setModel} />
        <ChoiceChips label="Precision" options={[{ id: "16", label: "16-bit" }, { id: "4", label: "4-bit" }]} value={bits} onChange={setBits} />
        <ChoiceChips label="GPU" options={(Object.keys(GPUS) as GpuId[]).map((k) => ({ id: k, label: GPUS[k].label }))} value={gpu} onChange={setGpu} />
      </div>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-muted">
          Context per conversation: <span className="font-mono text-text">{CONTEXTS[ctxIdx].toLocaleString("en-US")}</span> tokens
          <input type="range" min={0} max={CONTEXTS.length - 1} value={ctxIdx} onChange={(e) => setCtxIdx(+e.target.value)} className="mt-1 block w-full accent-[var(--accent)]" />
        </label>
        <label className="text-xs text-muted">
          Conversations at the same time: <span className="font-mono text-text">{users}</span>
          <input type="range" min={1} max={32} value={users} onChange={(e) => setUsers(+e.target.value)} className="mt-1 block w-full accent-[var(--accent)]" />
        </label>
      </div>
      <div className="relative mt-3 h-6 w-full overflow-hidden rounded-md bg-surface" role="img" aria-label={`${total.toFixed(1)} GB needed`}>
        <div className="flex h-full">
          <span style={{ width: `${(weights / scale) * 100}%`, backgroundColor: "var(--area-llm)" }} />
          <span style={{ width: `${(kv / scale) * 100}%`, backgroundColor: "var(--area-rag)" }} />
          <span style={{ width: `${(overhead / scale) * 100}%`, backgroundColor: "var(--muted)" }} />
        </div>
        <span className="absolute top-0 h-full w-0.5 bg-text" style={{ left: `${(g.vram / scale) * 100}%` }} />
      </div>
      <p className="mt-1 text-[11px] text-muted">
        <span style={{ color: "var(--area-llm)" }}>■</span> weights {weights.toFixed(1)} GB · <span style={{ color: "var(--area-rag)" }}>■</span> KV cache {kv.toFixed(1)} GB ·{" "}
        <span>■</span> overhead {overhead} GB · line = one GPU ({g.vram} GB)
      </p>
      <p className="mt-2 text-sm" aria-live="polite">
        Needs about <span className="font-mono">{total.toFixed(1)} GB</span> →{" "}
        <strong style={{ color: count === 1 ? "var(--good)" : "var(--warn)" }}>
          {count} × {g.label.split(" ·")[0]}
        </strong>{" "}
        <span className="text-xs text-muted">≈ ${(count * g.usdHour).toFixed(2)}/hour (example price)</span>
      </p>
    </DemoFrame>
  );
}

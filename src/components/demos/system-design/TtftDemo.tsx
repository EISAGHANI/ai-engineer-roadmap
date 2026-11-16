"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";
import { Switch } from "@/components/ui/Switch";

type Model = "small" | "large" | "reasoning";
const PREFILL_MS_PER_1K = { small: 25, large: 70, reasoning: 70 } as const;
const MODEL_BASE = { small: 150, large: 350, reasoning: 4500 } as const; // includes "thinking" before the first visible word

export default function TtftDemo() {
  const [promptK, setPromptK] = React.useState(30);
  const [model, setModel] = React.useState<Model>("large");
  const [retrieval, setRetrieval] = React.useState(true);
  const [rerank, setRerank] = React.useState(true);
  const [cached, setCached] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const parts = [
    { label: "network", ms: 120, color: "var(--muted)" },
    { label: "queue", ms: busy ? 900 : 40, color: "var(--warn)" },
    { label: "retrieval", ms: retrieval ? 180 : 0, color: "var(--area-rag)" },
    { label: "rerank", ms: retrieval && rerank ? 350 : 0, color: "var(--area-evals)" },
    { label: "prefill", ms: Math.round(promptK * PREFILL_MS_PER_1K[model] * (cached ? 0.15 : 1)), color: "var(--area-system-design)" },
    { label: model === "reasoning" ? "model start + thinking" : "model start", ms: MODEL_BASE[model], color: "var(--area-llm)" },
  ].filter((p) => p.ms > 0);
  const total = parts.reduce((a, p) => a + p.ms, 0);
  const scale = Math.max(total, 3000);

  return (
    <DemoFrame
      title="How long until the first plate?"
      hint="Everything that happens before the first word appears."
      onReset={() => {
        setPromptK(30);
        setModel("large");
        setRetrieval(true);
        setRerank(true);
        setCached(false);
        setBusy(false);
      }}
    >
      <div className="flex flex-wrap items-end gap-3">
        <ChoiceChips
          label="Model"
          options={[
            { id: "small", label: "Small" },
            { id: "large", label: "Large" },
            { id: "reasoning", label: "Reasoning" },
          ]}
          value={model}
          onChange={setModel}
        />
        <label className="text-xs text-muted">
          prompt size: <span className="font-mono text-text">{promptK}k tokens</span>
          <input type="range" min={1} max={100} value={promptK} onChange={(e) => setPromptK(+e.target.value)} className="mt-1 block w-36 accent-[var(--accent)]" />
        </label>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        <Switch checked={retrieval} onChange={setRetrieval} label="Retrieval" />
        <Switch checked={rerank} onChange={setRerank} label="Reranking" />
        <Switch checked={cached} onChange={setCached} label="Prefix cached" />
        <Switch checked={busy} onChange={setBusy} label="Peak traffic" />
      </div>
      <div className="mt-3 flex h-7 w-full overflow-hidden rounded-md" role="img" aria-label={`time to first token ${total} ms`}>
        {parts.map((p) => (
          <span key={p.label} className="h-full transition-all" title={`${p.label}: ${p.ms} ms`} style={{ width: `${(p.ms / scale) * 100}%`, backgroundColor: p.color }} />
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted">
        {parts.map((p) => (
          <li key={p.label}>
            <span style={{ color: p.color }}>■</span> {p.label} {p.ms} ms
          </li>
        ))}
      </ul>
      <p className="mt-2 text-sm" aria-live="polite">
        Time to first token: <strong style={{ color: total > 2000 ? "var(--bad)" : total > 1000 ? "var(--warn)" : "var(--good)" }}>{(total / 1000).toFixed(2)} s</strong>
      </p>
    </DemoFrame>
  );
}

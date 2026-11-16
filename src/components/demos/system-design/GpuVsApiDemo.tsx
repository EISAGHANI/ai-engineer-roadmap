"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ScoreBar } from "../ui";

/** Illustrative prices. Blended API price per million tokens, GPU price per hour. */
const API_PER_M = 1.5;
const GPU_HOUR = 2.5;
const GPU_TOKENS_PER_S = 2500; // one GPU at realistic batch sizes, with a small open model
const OPS_MONTHLY = 4000; // share of an engineer's time, monitoring, on-call
const STEPS = [5, 20, 50, 100, 300, 1000, 3000]; // million tokens per day

export default function GpuVsApiDemo() {
  const [idx, setIdx] = React.useState(2);
  const [peaky, setPeaky] = React.useState(true);
  const mPerDay = STEPS[idx];

  const api = mPerDay * 30 * API_PER_M;
  // GPUs must cover the peak, not the average; at least 2 for redundancy
  const avgTps = (mPerDay * 1e6) / 86_400;
  const peakTps = avgTps * (peaky ? 3 : 1.3);
  const gpus = Math.max(2, Math.ceil(peakTps / GPU_TOKENS_PER_S));
  const util = avgTps / (gpus * GPU_TOKENS_PER_S);
  const self = gpus * GPU_HOUR * 24 * 30 + OPS_MONTHLY;
  const max = Math.max(api, self);

  return (
    <DemoFrame
      title="Takeaway or your own kitchen?"
      hint="Monthly cost of the same traffic through an API or on rented GPUs (illustrative prices)."
      onReset={() => {
        setIdx(2);
        setPeaky(true);
      }}
    >
      <label className="text-xs text-muted">
        tokens per day: <span className="font-mono text-text">{mPerDay.toLocaleString("en-US")} million</span>
        <input type="range" min={0} max={STEPS.length - 1} value={idx} onChange={(e) => setIdx(+e.target.value)} className="mt-1 block w-60 accent-[var(--accent)]" />
      </label>
      <label className="mt-2 flex items-center gap-2 text-xs text-muted">
        <input type="checkbox" checked={peaky} onChange={(e) => setPeaky(e.target.checked)} className="accent-[var(--accent)]" />
        Busy days and quiet nights (peak = 3× average)
      </label>
      <ul className="mt-3 space-y-2 text-xs" aria-live="polite">
        <li>
          <div className="flex justify-between">
            <span>API, pay per token</span>
            <span className="font-mono">${Math.round(api).toLocaleString("en-US")}/mo</span>
          </div>
          <ScoreBar value={api} max={max} color="var(--area-llm)" />
        </li>
        <li>
          <div className="flex justify-between">
            <span>
              Self-hosted: {gpus} GPUs + operations
            </span>
            <span className="font-mono">${Math.round(self).toLocaleString("en-US")}/mo</span>
          </div>
          <ScoreBar value={self} max={max} color="var(--area-system-design)" />
          <div className="mt-0.5 text-[10px] text-muted">average GPU utilisation {Math.round(util * 100)}%</div>
        </li>
      </ul>
      <p className="mt-3 text-sm">
        Cheaper here: <strong style={{ color: "var(--accent)" }}>{api < self ? "the API" : "self-hosting"}</strong>
      </p>
      <p className="mt-1 text-[11px] text-muted">
        Self-hosting only wins at high, steady volume, and only if a smaller open model is good enough for the task.
      </p>
    </DemoFrame>
  );
}

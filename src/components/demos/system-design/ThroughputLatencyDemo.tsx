"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";

/** Illustrative decode model: per-step time grows slowly with batch size until the GPU saturates. */
const SIZES = [1, 2, 4, 8, 16, 32, 64, 128, 256];
function stepMs(batch: number) {
  return 12 + 0.12 * batch + (batch > 64 ? (batch - 64) * 0.06 : 0);
}
const OUTPUT_TOKENS = 300;
const TARGET_P95_S = 8;

export default function ThroughputLatencyDemo() {
  const [idx, setIdx] = React.useState(3);
  const data = SIZES.map((b) => {
    const ms = stepMs(b);
    return { b, perUserTps: 1000 / ms, totalTps: (1000 / ms) * b, answerS: (ms * OUTPUT_TOKENS) / 1000 };
  });
  const cur = data[idx];
  const maxTotal = Math.max(...data.map((d) => d.totalTps));
  const maxUser = Math.max(...data.map((d) => d.perUserTps));
  const ok = cur.answerS <= TARGET_P95_S;

  return (
    <DemoFrame title="One fast plate or forty plates an hour?" hint="Change how many requests share the GPU at once." onReset={() => setIdx(3)}>
      <label className="text-xs text-muted">
        concurrent requests (batch size): <span className="font-mono text-text">{cur.b}</span>
        <input type="range" min={0} max={SIZES.length - 1} value={idx} onChange={(e) => setIdx(+e.target.value)} className="mt-1 block w-60 accent-[var(--accent)]" />
      </label>
      <div className="mt-3 grid grid-cols-2 gap-4">
        <div>
          <div className="text-[11px] text-muted">Total tokens / second (throughput)</div>
          <div className="mt-1 flex h-20 items-end gap-1">
            {data.map((d, i) => (
              <span key={d.b} className="flex-1 rounded-t-sm" style={{ height: `${(d.totalTps / maxTotal) * 100}%`, backgroundColor: i === idx ? "var(--area-system-design)" : "color-mix(in srgb, var(--area-system-design) 30%, transparent)" }} />
            ))}
          </div>
          <div className="mt-1 font-mono text-xs">{Math.round(cur.totalTps).toLocaleString("en-US")} tok/s</div>
        </div>
        <div>
          <div className="text-[11px] text-muted">Speed for each user (tokens / second)</div>
          <div className="mt-1 flex h-20 items-end gap-1">
            {data.map((d, i) => (
              <span key={d.b} className="flex-1 rounded-t-sm" style={{ height: `${(d.perUserTps / maxUser) * 100}%`, backgroundColor: i === idx ? "var(--area-llm)" : "color-mix(in srgb, var(--area-llm) 30%, transparent)" }} />
            ))}
          </div>
          <div className="mt-1 font-mono text-xs">{cur.perUserTps.toFixed(0)} tok/s · a 300-token answer in {cur.answerS.toFixed(1)} s</div>
        </div>
      </div>
      <p className="mt-3 text-xs" aria-live="polite" style={{ color: ok ? "var(--good)" : "var(--bad)" }}>
        {ok
          ? cur.b < 32
            ? `Fast for each user, but the GPU is mostly idle: you pay for capacity you don't use.`
            : `A good spot for chat: high throughput, and answers still finish under the ${TARGET_P95_S} s target.`
          : `Great for overnight batch jobs, too slow for live chat (target ${TARGET_P95_S} s).`}
      </p>
    </DemoFrame>
  );
}

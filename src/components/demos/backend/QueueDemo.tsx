"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";

const TICK_MS = 400;
const PER_WORKER_PER_TICK = 1;

type Sim = { queue: number; done: number; history: number[] };
const EMPTY: Sim = { queue: 0, done: 0, history: [] };

export default function QueueDemo() {
  const [sim, setSim] = React.useState<Sim>(EMPTY);
  const [workers, setWorkers] = React.useState(2);
  const [running, setRunning] = React.useState(true);
  const { queue, done, history } = sim;
  const enqueue = (n: number) => setSim((s) => ({ ...s, queue: s.queue + n }));

  React.useEffect(() => {
    const t = window.setInterval(() => {
      setSim((s) => {
        const processed = running ? Math.min(s.queue, workers * PER_WORKER_PER_TICK) : 0;
        const next = s.queue - processed;
        return { queue: next, done: s.done + processed, history: [...s.history.slice(-39), next] };
      });
    }, TICK_MS);
    return () => window.clearInterval(t);
  }, [workers, running]);

  const max = Math.max(10, ...history);

  return (
    <DemoFrame
      title="The sorting bag that never overflows"
      hint="Send a burst of uploads. The API just drops them in the queue; workers drain it."
      onReset={() => {
        setSim(EMPTY);
        setWorkers(2);
        setRunning(true);
      }}
    >
      <div className="flex flex-wrap items-end gap-3">
        <ActionButton onClick={() => enqueue(30)}>📨 Burst: 30 uploads</ActionButton>
        <ActionButton variant="secondary" onClick={() => enqueue(1)}>
          1 upload
        </ActionButton>
        <label className="text-xs text-muted">
          workers: <span className="font-mono text-text">{workers}</span>
          <input type="range" min={1} max={8} value={workers} onChange={(e) => setWorkers(+e.target.value)} className="mt-1 block w-28 accent-[var(--accent)]" />
        </label>
        <ActionButton variant="secondary" onClick={() => setRunning((r) => !r)}>
          {running ? "⏸ Workers crash" : "▶ Workers back"}
        </ActionButton>
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-center text-xs">
        <div className="rounded-lg bg-surface p-2">
          API
          <div className="text-[10px] text-muted">answers &quot;202 queued&quot; instantly</div>
        </div>
        <div className="min-w-24 rounded-lg p-2" style={{ backgroundColor: "color-mix(in srgb, var(--area-backend) 18%, transparent)" }}>
          queue
          <div className="font-mono text-lg" aria-live="polite">
            {queue}
          </div>
        </div>
        <div className="rounded-lg bg-surface p-2">
          {Array.from({ length: workers }, (_, i) => (
            <span key={i} className="mx-0.5" style={{ opacity: running ? 1 : 0.3 }}>
              🛠
            </span>
          ))}
          <div className="text-[10px] text-muted">processed {done}</div>
        </div>
      </div>
      <div className="mt-3 flex h-14 items-end gap-[2px]" role="img" aria-label="Queue length over time">
        {history.map((v, i) => (
          <span key={i} className="flex-1 rounded-t-sm" style={{ height: `${(v / max) * 100}%`, backgroundColor: "var(--area-backend)" }} />
        ))}
      </div>
      <p className="mt-1 text-[11px] text-muted">
        {!running && queue > 0
          ? "Workers are down, but nothing is lost: messages wait in the queue until they come back."
          : "Queue length over time. More workers drain a burst faster."}
      </p>
    </DemoFrame>
  );
}

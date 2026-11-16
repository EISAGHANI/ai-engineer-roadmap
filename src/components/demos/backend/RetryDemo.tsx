"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

type Strategy = "none" | "immediate" | "backoff" | "jitter";
const CLIENTS = 40;
const SECONDS = 30;
const CAPACITY = 12; // requests per second the provider can take while recovering
const OUTAGE_END = 6; // the provider is down for the first 6 seconds

/** Deterministic pseudo-random so the chart is stable between renders. */
function rand(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function simulate(strategy: Strategy) {
  const load = new Array(SECONDS).fill(0);
  let succeeded = 0;
  let gaveUp = 0;
  const pending = Array.from({ length: CLIENTS }, (_, c) => ({ c, t: 0, attempt: 0 }));
  while (pending.length) {
    const r = pending.shift()!;
    if (r.t >= SECONDS) {
      gaveUp++;
      continue;
    }
    load[r.t]++;
    const ok = r.t >= OUTAGE_END && load[r.t] <= CAPACITY;
    if (ok) {
      succeeded++;
      continue;
    }
    if (strategy === "none" || r.attempt >= 6) {
      gaveUp++;
      continue;
    }
    const base = 2 ** r.attempt;
    const wait = strategy === "immediate" ? 1 : strategy === "backoff" ? base : Math.max(1, Math.round(rand(r.c * 7 + r.attempt) * base * 2));
    pending.push({ c: r.c, t: r.t + wait, attempt: r.attempt + 1 });
    pending.sort((a, b) => a.t - b.t);
  }
  return { load, succeeded, gaveUp };
}

const LABELS: Record<Strategy, string> = {
  none: "Give up at once",
  immediate: "Retry every second",
  backoff: "Exponential backoff",
  jitter: "Backoff + jitter",
};

export default function RetryDemo() {
  const [strategy, setStrategy] = React.useState<Strategy>("immediate");
  const { load, succeeded, gaveUp } = React.useMemo(() => simulate(strategy), [strategy]);
  const max = Math.max(CLIENTS, ...load);

  return (
    <DemoFrame
      title="Knock, wait, knock, wait longer"
      hint={`${CLIENTS} users hit a provider that is down for ${OUTAGE_END} s, then can take ${CAPACITY} requests per second.`}
      onReset={() => setStrategy("immediate")}
    >
      <ChoiceChips label="Retry strategy" options={(Object.keys(LABELS) as Strategy[]).map((k) => ({ id: k, label: LABELS[k] }))} value={strategy} onChange={setStrategy} />
      <div className="relative mt-3 flex h-28 items-end gap-[2px]" role="img" aria-label="Requests per second hitting the provider">
        {load.map((v, t) => (
          <span
            key={t}
            className="flex-1 rounded-t-sm"
            style={{ height: `${(v / max) * 100}%`, backgroundColor: t < OUTAGE_END ? "var(--bad)" : v > CAPACITY ? "var(--warn)" : "var(--area-backend)" }}
          />
        ))}
        <span className="absolute right-0 left-0 border-t border-dashed border-text" style={{ bottom: `${(CAPACITY / max) * 100}%` }} />
      </div>
      <div className="flex justify-between text-[9px] text-muted">
        <span>0 s</span>
        <span>requests per second · dashed line = capacity · red = outage</span>
        <span>{SECONDS} s</span>
      </div>
      <p className="mt-2 text-sm" aria-live="polite">
        Answered: <strong style={{ color: "var(--good)" }}>{succeeded}</strong> / {CLIENTS} · failed: <strong style={{ color: gaveUp ? "var(--bad)" : undefined }}>{gaveUp}</strong>
      </p>
      <p className="mt-1 text-[11px] text-muted">
        {strategy === "none" && "Every user gets an error, even though the outage was short."}
        {strategy === "immediate" && "Everyone hammers the provider in sync; the spikes keep it overloaded."}
        {strategy === "backoff" && "Waits grow, but all users still retry at the same moments: synchronized waves."}
        {strategy === "jitter" && "Random waits spread retries out, so the recovering provider can serve them."}
      </p>
    </DemoFrame>
  );
}

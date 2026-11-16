"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, ScoreBar } from "../ui";
import { Switch } from "@/components/ui/Switch";

type Algo = "round-robin" | "least-conn";
/** 12 requests: every third one is a long LLM answer (8 s), the rest are quick (1 s). */
const DURATIONS: number[] = Array.from({ length: 4 }, () => [8, 1, 1]).flat();
const NAMES = ["api-1", "api-2", "api-3"];

function simulate(algo: Algo, down: boolean) {
  const healthy = NAMES.map((_, i) => !(down && i === 1));
  const busyUntil = [0, 0, 0];
  const assigned: number[][] = [[], [], []];
  let rr = 0;
  let worstWait = 0;
  DURATIONS.forEach((d, idx) => {
    const now = idx * 0.5; // a request every half second
    const candidates = NAMES.map((_, i) => i).filter((i) => healthy[i]);
    let pick: number;
    if (algo === "round-robin") {
      pick = candidates[rr % candidates.length];
      rr += 1;
    } else {
      pick = candidates.reduce((best, i) => (busyUntil[i] < busyUntil[best] ? i : best), candidates[0]);
    }
    const start = Math.max(now, busyUntil[pick]);
    worstWait = Math.max(worstWait, start - now);
    busyUntil[pick] = start + d;
    assigned[pick].push(d);
  });
  return { assigned, busyUntil, worstWait, healthy };
}

export default function LoadBalancingDemo() {
  const [algo, setAlgo] = React.useState<Algo>("round-robin");
  const [down, setDown] = React.useState(false);
  const r = simulate(algo, down);
  const finish = Math.max(...r.busyUntil);

  return (
    <DemoFrame
      title="The helper at the entrance"
      hint="12 requests arrive; every third one is a long LLM answer. Where does each go?"
      onReset={() => {
        setAlgo("round-robin");
        setDown(false);
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <ChoiceChips
          label="Algorithm"
          options={[
            { id: "round-robin", label: "Round robin" },
            { id: "least-conn", label: "Least busy" },
          ]}
          value={algo}
          onChange={setAlgo}
        />
        <Switch checked={down} onChange={setDown} label="api-2 fails its health check" />
      </div>
      <ul className="mt-3 space-y-2">
        {NAMES.map((n, i) => (
          <li key={n} className="text-xs" style={{ opacity: r.healthy[i] ? 1 : 0.4 }}>
            <div className="flex items-center justify-between">
              <span className="font-mono">{n}</span>
              <span className="text-muted">{r.healthy[i] ? `${r.assigned[i].length} requests · busy ${r.busyUntil[i].toFixed(1)} s` : "removed from rotation"}</span>
            </div>
            <div className="mt-0.5 flex flex-wrap gap-0.5">
              {r.assigned[i].map((d, k) => (
                <span key={k} className="h-3 rounded-sm" style={{ width: `${d * 10}px`, backgroundColor: d > 1 ? "var(--area-llm)" : "var(--area-rag)" }} />
              ))}
            </div>
            {r.healthy[i] && <ScoreBar value={r.busyUntil[i]} max={Math.max(finish, 1)} color="var(--area-deployment)" />}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs" aria-live="polite">
        Longest wait for a request: <strong>{r.worstWait.toFixed(1)} s</strong> · all done after <strong>{finish.toFixed(1)} s</strong>
      </p>
      <p className="mt-1 text-[11px] text-muted">
        {algo === "round-robin"
          ? "Round robin ignores how long requests take, so all the long answers pile up on the same copy."
          : "Least busy sends new requests to whoever frees up first, so long answers spread out."}
      </p>
    </DemoFrame>
  );
}

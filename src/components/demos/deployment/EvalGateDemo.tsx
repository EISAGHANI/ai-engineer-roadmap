"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

const BASELINE = 0.92;
const CANDIDATES = {
  shorter: { label: "Shorter prompt (cheaper)", pass: 0.86, faith: 0.88, p95: 2.1 },
  model: { label: "Cheaper model", pass: 0.91, faith: 0.82, p95: 1.9 },
  retrieval: { label: "Better retrieval", pass: 0.94, faith: 0.9, p95: 2.8 },
} as const;
type Id = keyof typeof CANDIDATES;

export default function EvalGateDemo() {
  const [id, setId] = React.useState<Id>("shorter");
  const c = CANDIDATES[id];
  const checks = [
    { name: "pass rate ≥ 0.90", value: c.pass.toFixed(2), ok: c.pass >= 0.9 },
    { name: "faithfulness ≥ 0.85", value: c.faith.toFixed(2), ok: c.faith >= 0.85 },
    { name: `no drop > 2 points vs main (${BASELINE})`, value: `${c.pass - BASELINE >= 0 ? "+" : ""}${Math.round((c.pass - BASELINE) * 100)} pts`, ok: c.pass >= BASELINE - 0.02 },
    { name: "p95 latency ≤ 3 s", value: `${c.p95} s`, ok: c.p95 <= 3 },
  ];
  const allOk = checks.every((x) => x.ok);

  return (
    <DemoFrame title="The tasting panel at the gate" hint="Each candidate change is scored on 50 golden questions before it may deploy." onReset={() => setId("shorter")}>
      <ChoiceChips label="Candidate" options={(Object.keys(CANDIDATES) as Id[]).map((k) => ({ id: k, label: CANDIDATES[k].label }))} value={id} onChange={setId} />
      <ul className="mt-3 space-y-1 font-mono text-xs" aria-live="polite">
        {checks.map((x) => (
          <li key={x.name} className="flex justify-between rounded-md px-2 py-1" style={{ backgroundColor: `color-mix(in srgb, ${x.ok ? "var(--good)" : "var(--bad)"} 14%, transparent)` }}>
            <span>
              {x.ok ? "PASS" : "FAIL"} {x.name}
            </span>
            <span>{x.value}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: `color-mix(in srgb, ${allOk ? "var(--good)" : "var(--bad)"} 18%, transparent)` }}>
        {allOk
          ? "exit 0: the deploy continues."
          : id === "model"
            ? "exit 1: deploy blocked. The cheaper model passes overall but invents more facts (faithfulness 0.82)."
            : "exit 1: deploy blocked. The saving costs 6 points of quality."}
      </p>
    </DemoFrame>
  );
}

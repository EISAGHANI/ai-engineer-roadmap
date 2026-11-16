"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ScoreBar } from "../ui";
import { Switch } from "@/components/ui/Switch";

/** Example prices per 1M tokens: large model $3 in / $15 out, small model $0.25 / $1.25. */
const LARGE = { in: 3, out: 15 };
const SMALL = { in: 0.25, out: 1.25 };
const INFRA = 0.0004; // search, database and servers per request

const FEATURES = [
  { id: "help", label: "Homework help", perDay: 4000, inTok: 1500, outTok: 200 },
  { id: "essay", label: "Essay feedback", perDay: 600, inTok: 6000, outTok: 1500 },
  { id: "summary", label: "Chapter summaries", perDay: 2500, inTok: 8000, outTok: 300 },
];

export default function CostPerRequestDemo() {
  const [routed, setRouted] = React.useState(false);

  const rows = FEATURES.map((f) => {
    const price = routed && f.id === "summary" ? SMALL : LARGE;
    const perRequest = (f.inTok * price.in + f.outTok * price.out) / 1e6 + INFRA;
    return { ...f, perRequest, perMonth: perRequest * f.perDay * 30 };
  });
  const total = rows.reduce((a, r) => a + r.perMonth, 0);
  const max = Math.max(...rows.map((r) => r.perMonth));

  return (
    <DemoFrame title="What does one answer cost?" hint="Cost per request and per month, by feature (example prices)." onReset={() => setRouted(false)}>
      <Switch checked={routed} onChange={setRouted} label="Route chapter summaries to a small model" />
      <ul className="mt-3 space-y-2">
        {rows.map((r) => (
          <li key={r.id} className="text-xs">
            <div className="flex justify-between">
              <span>
                {r.label} <span className="text-muted">· {r.perDay.toLocaleString("en-US")}/day</span>
              </span>
              <span className="font-mono">
                ${r.perRequest.toFixed(4)} / request · ${Math.round(r.perMonth).toLocaleString("en-US")} / month
              </span>
            </div>
            <ScoreBar value={r.perMonth} max={max} color={r.id === "summary" && routed ? "var(--good)" : "var(--area-evals)"} />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm" aria-live="polite">
        Total: <span className="font-mono" style={{ color: "var(--accent)" }}>${Math.round(total).toLocaleString("en-US")}</span> per month
      </p>
      <p className="text-xs text-muted">
        {routed
          ? "Summaries got about 10× cheaper. Check their eval scores before keeping the change."
          : "Essay feedback costs the most per request, but summaries are the biggest bill: high volume and long inputs."}
      </p>
    </DemoFrame>
  );
}

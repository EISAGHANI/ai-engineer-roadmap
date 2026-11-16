"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ScoreBar } from "../ui";

/** Example prices (infrastructure only, model tokens not included). */
const PER_REQUEST = 0.0000002; // invocation price
const GB_SECOND = 0.0000166667;
const DURATION_S = 3; // a request that waits ~3 s for the LLM
const MEMORY_GB = 0.5;
const SERVER_MONTH = 35; // one always-on server
const SERVER_CAPACITY_PER_DAY = 1_500_000;

const STEPS = [1_000, 10_000, 100_000, 300_000, 1_000_000, 3_000_000];

export default function ServerlessDemo() {
  const [idx, setIdx] = React.useState(1);
  const perDay = STEPS[idx];
  const perMonth = perDay * 30;
  const serverless = perMonth * (PER_REQUEST + DURATION_S * MEMORY_GB * GB_SECOND);
  const servers = Math.max(2, Math.ceil(perDay / SERVER_CAPACITY_PER_DAY)); // at least 2 for safety
  const alwaysOn = servers * SERVER_MONTH;
  const max = Math.max(serverless, alwaysOn);
  const cheaper = serverless < alwaysOn ? "serverless" : "always-on servers";

  return (
    <DemoFrame title="Pop-up kitchen or parked truck?" hint="Monthly infrastructure cost as traffic grows (example prices, LLM tokens not included)." onReset={() => setIdx(1)}>
      <label className="text-xs text-muted">
        Requests per day: <span className="font-mono text-text">{perDay.toLocaleString("en-US")}</span>
        <input type="range" min={0} max={STEPS.length - 1} value={idx} onChange={(e) => setIdx(+e.target.value)} aria-valuetext={`${perDay} requests per day`} className="mt-1 block w-full accent-[var(--accent)]" />
      </label>
      <ul className="mt-3 space-y-2 text-xs" aria-live="polite">
        <li>
          <div className="flex justify-between">
            <span>Serverless (pay per request)</span>
            <span className="font-mono">${serverless.toFixed(2)} / month</span>
          </div>
          <ScoreBar value={serverless} max={max} color="var(--area-deployment)" />
        </li>
        <li>
          <div className="flex justify-between">
            <span>
              {servers} always-on servers
            </span>
            <span className="font-mono">${alwaysOn.toFixed(2)} / month</span>
          </div>
          <ScoreBar value={alwaysOn} max={max} color="var(--area-system-design)" />
        </li>
      </ul>
      <p className="mt-3 text-sm">
        Cheaper here: <strong style={{ color: "var(--accent)" }}>{cheaper}</strong>
      </p>
      <p className="mt-1 text-xs text-muted">
        Quiet apps pay almost nothing serverless. Under steady heavy traffic, paying per millisecond of waiting for the LLM adds up, and
        servers win. Serverless also adds a cold start (about a second) after idle periods.
      </p>
    </DemoFrame>
  );
}

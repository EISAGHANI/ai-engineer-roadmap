"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

type Mode = "realtime" | "batch";
const ITEMS = 20_000;
const COST_PER_ITEM = 0.0006; // $ with a small model (illustrative)
const RPM_LIMIT = 1000;

export default function BatchInferenceDemo() {
  const [mode, setMode] = React.useState<Mode>("realtime");
  const [livePeak, setLivePeak] = React.useState(true);

  const cost = ITEMS * COST_PER_ITEM * (mode === "batch" ? 0.5 : 1);
  const minutesNeeded = ITEMS / RPM_LIMIT;
  const liveImpact = mode === "realtime" && livePeak;

  return (
    <DemoFrame
      title="Tomorrow's lunch boxes, cooked tonight"
      hint="Label 20,000 old support tickets. Nobody is waiting for the result today."
      onReset={() => {
        setMode("realtime");
        setLivePeak(true);
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <ChoiceChips
          label="How to send"
          options={[
            { id: "realtime", label: "20,000 normal API calls" },
            { id: "batch", label: "One Batch API job" },
          ]}
          value={mode}
          onChange={setMode}
        />
        <label className="flex items-center gap-2 text-xs text-muted">
          <input type="checkbox" checked={livePeak} onChange={(e) => setLivePeak(e.target.checked)} className="accent-[var(--accent)]" />
          Run it during business hours
        </label>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs" aria-live="polite">
        <div className="rounded-lg bg-surface p-2">
          <div className="font-mono text-lg">${cost.toFixed(2)}</div>
          <div className="text-muted">cost</div>
        </div>
        <div className="rounded-lg bg-surface p-2">
          <div className="font-mono text-lg">{mode === "batch" ? "≤ 24 h" : `${Math.round(minutesNeeded)} min`}</div>
          <div className="text-muted">until done</div>
        </div>
        <div className="rounded-lg bg-surface p-2">
          <div className="font-mono text-lg" style={{ color: liveImpact ? "var(--bad)" : "var(--good)" }}>
            {liveImpact ? "429s" : "none"}
          </div>
          <div className="text-muted">effect on live users</div>
        </div>
      </div>
      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-surface" aria-hidden>
        <div className="h-full" style={{ width: mode === "batch" ? "50%" : "100%", backgroundColor: "var(--area-system-design)" }} />
      </div>
      <p className="mt-2 text-xs">
        {mode === "batch"
          ? "Half the price, its own rate limits, and live chat never notices. You just wait longer for the results."
          : liveImpact
            ? `The job uses the whole ${RPM_LIMIT}-requests-per-minute limit for ${Math.round(minutesNeeded)} minutes, so real users get rate-limited.`
            : "Fast, but full price, and you must throttle it yourself."}
      </p>
    </DemoFrame>
  );
}

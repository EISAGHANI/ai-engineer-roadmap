"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { StepControls, useStepper } from "../ui";
import { Switch } from "@/components/ui/Switch";

const STEPS = [5, 25, 50, 100];
const BASE_ERR = 0.6; // % errors on the current version

export default function CanaryDemo() {
  const [buggy, setBuggy] = React.useState(false);
  // Buggy version: errors are spotted at the first step and rolled back
  const total = buggy ? 2 : STEPS.length;
  const { shown, play, next, reset, done } = useStepper(total, 900);

  const rolledBack = buggy && shown >= 2;
  const weight = rolledBack ? 0 : shown === 0 ? 0 : STEPS[shown - 1];
  const canaryErr = buggy ? 7.8 : 0.5;
  const affected = buggy ? (5 * canaryErr) / 100 : 0;

  return (
    <DemoFrame
      title="One truck tries the new burger first"
      hint="Traffic moves to v1.5 step by step. Metrics decide whether to go on."
      onReset={reset}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Switch
          checked={buggy}
          onChange={(v) => {
            setBuggy(v);
            reset();
          }}
          label="v1.5 has a hidden bug"
        />
        <StepControls onPlay={play} onNext={next} done={done} playLabel="Start rollout" />
      </div>
      <div className="mt-3 flex h-8 w-full overflow-hidden rounded-lg text-[11px] font-medium" aria-live="polite">
        <div className="flex items-center justify-center transition-all duration-500" style={{ width: `${100 - weight}%`, backgroundColor: "color-mix(in srgb, var(--area-system-design) 30%, transparent)" }}>
          {100 - weight > 0 && `v1.4 · ${100 - weight}%`}
        </div>
        <div className="flex items-center justify-center transition-all duration-500" style={{ width: `${weight}%`, backgroundColor: "color-mix(in srgb, var(--area-deployment) 45%, transparent)" }}>
          {weight > 0 && `v1.5 · ${weight}%`}
        </div>
      </div>
      <table className="mt-3 w-full text-left text-xs">
        <thead className="text-muted">
          <tr>
            <th className="font-normal">metric</th>
            <th className="font-normal">v1.4</th>
            <th className="font-normal">v1.5 (canary)</th>
          </tr>
        </thead>
        <tbody className="font-mono">
          <tr className="border-t border-border">
            <td className="py-0.5 font-sans">error rate</td>
            <td>{BASE_ERR}%</td>
            <td style={{ color: shown > 0 && buggy ? "var(--bad)" : undefined }}>{shown > 0 ? `${canaryErr}%` : "—"}</td>
          </tr>
          <tr className="border-t border-border">
            <td className="py-0.5 font-sans">p95 latency</td>
            <td>2.4 s</td>
            <td>{shown > 0 ? "2.3 s" : "—"}</td>
          </tr>
        </tbody>
      </table>
      {done && (
        <p className="mt-2 rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: `color-mix(in srgb, ${buggy ? "var(--bad)" : "var(--good)"} 16%, transparent)` }}>
          {buggy
            ? `Analysis failed at 5%: errors 13× higher. Automatic rollback to v1.4. Only about ${affected.toFixed(2)}% of all users saw an error, instead of ${canaryErr}% if it had shipped to everyone.`
            : "Every step looked healthy, so v1.5 now serves 100% of traffic."}
        </p>
      )}
    </DemoFrame>
  );
}

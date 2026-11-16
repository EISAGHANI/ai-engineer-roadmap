"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ScoreBar } from "../ui";

const RATE_A = 0.62; // thumbs-up rate of the current prompt
const RATE_B = 0.66; // thumbs-up rate of the new prompt (the true difference: 4 points)
const SIZES = [50, 100, 200, 500, 1000, 2000, 5000, 10000];

/** Two-proportion z-test, with the observed rates set to the true rates for clarity. */
function zScore(n: number) {
  const p = (RATE_A + RATE_B) / 2;
  const se = Math.sqrt(p * (1 - p) * (2 / n));
  return (RATE_B - RATE_A) / se;
}

export default function AbTestDemo() {
  const [idx, setIdx] = React.useState(2);
  const n = SIZES[idx];
  const z = zScore(n);
  const significant = z >= 1.96;

  return (
    <DemoFrame title="Two worksheets, two halves of the class" hint="Prompt A: 62% thumbs up. Prompt B: 66%. When can you trust the difference?" onReset={() => setIdx(2)}>
      <label className="text-xs text-muted">
        Users per variant: <span className="font-mono text-text">{n.toLocaleString("en-US")}</span>
        <input type="range" min={0} max={SIZES.length - 1} value={idx} onChange={(e) => setIdx(+e.target.value)} aria-valuetext={`${n} users per variant`} className="mt-1 block w-full accent-[var(--accent)]" />
      </label>
      <div className="mt-3 space-y-2 text-xs">
        {[
          { label: "A (current prompt)", rate: RATE_A },
          { label: "B (new prompt)", rate: RATE_B },
        ].map((v) => (
          <div key={v.label}>
            <div className="flex justify-between">
              <span>{v.label}</span>
              <span className="font-mono">
                {Math.round(v.rate * n).toLocaleString("en-US")} / {n.toLocaleString("en-US")} thumbs up ({Math.round(v.rate * 100)}%)
              </span>
            </div>
            <ScoreBar value={v.rate} color="var(--area-evals)" />
          </div>
        ))}
      </div>
      <p
        className="mt-3 rounded-lg px-3 py-2 text-xs"
        style={{ backgroundColor: `color-mix(in srgb, ${significant ? "var(--good)" : "var(--warn)"} 16%, transparent)` }}
        aria-live="polite"
      >
        z = <span className="font-mono">{z.toFixed(2)}</span>{" "}
        {significant
          ? "≥ 1.96: statistically significant (95% confidence). B really is better."
          : "< 1.96: could easily be luck. Keep the test running; don't pick a winner yet."}
      </p>
      <p className="mt-1 text-xs text-muted">A 4-point difference needs over a thousand users per variant before it can be trusted.</p>
    </DemoFrame>
  );
}

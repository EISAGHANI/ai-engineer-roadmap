"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, Panel } from "../ui";

const PATHS = {
  good: {
    label: "Robot 1",
    steps: ["search_docs('class reader')", "search_docs('Lena Fox born')", "calculator('2026 - 1964')"],
  },
  bad: {
    label: "Robot 2",
    steps: [
      "search_docs('author age')",
      "search_docs('author age')",
      "web_search('Lena Fox')",
      "search_docs('class reader')",
      "search_docs('class reader')",
      "web_search('Lena Fox birthday')",
      "search_docs('Lena Fox born')",
      "calculator('2026 - 1964')",
    ],
  },
} as const;
type Id = keyof typeof PATHS;
const FINAL = "Yes, Lena Fox is 62.";

function checks(steps: readonly string[]) {
  return [
    { label: "Final answer correct", ok: true },
    { label: "At most 6 steps", ok: steps.length <= 6 },
    { label: "No repeated calls", ok: new Set(steps).size === steps.length },
    { label: "Never used web_search (not allowed)", ok: steps.every((s) => !s.startsWith("web_search")) },
  ];
}

export default function TrajectoryDemo() {
  const [id, setId] = React.useState<Id>("bad");
  const p = PATHS[id];
  const steps: readonly string[] = p.steps;
  const results = checks(steps);
  const allOk = results.every((r) => r.ok);

  return (
    <DemoFrame title="Mark the working, not just the answer" hint='Both robots answer "Is the author of our class reader older than 60?" correctly.' onReset={() => setId("bad")}>
      <ChoiceChips label="Trajectory" options={(Object.keys(PATHS) as Id[]).map((k) => ({ id: k, label: PATHS[k].label }))} value={id} onChange={setId} />
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Panel title={`steps (${steps.length})`}>
          <ol className="list-decimal space-y-0.5 pl-4 font-mono text-[10px]">
            {steps.map((s, i) => (
              <li key={i} style={{ color: s.startsWith("web_search") || steps.indexOf(s) !== i ? "var(--bad)" : undefined }}>
                {s}
              </li>
            ))}
          </ol>
          <p className="mt-1 text-xs">→ {FINAL}</p>
        </Panel>
        <Panel title="trajectory checks" tint={allOk ? "var(--good)" : "var(--bad)"}>
          <ul className="space-y-0.5 text-xs" aria-live="polite">
            {results.map((r) => (
              <li key={r.label} style={{ color: r.ok ? "var(--good)" : "var(--bad)" }}>
                {r.ok ? "✓" : "✗"} {r.label}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <p className="mt-2 text-xs text-muted">
        An answer-only eval passes both robots. The trajectory shows Robot 2 wasted steps and broke a rule: costly, slow and risky in production.
      </p>
    </DemoFrame>
  );
}

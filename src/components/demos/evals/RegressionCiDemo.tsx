"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, StepControls, useStepper } from "../ui";

const BASELINE = 0.92;
const THRESHOLD = 0.9;
const CHANGES = {
  good: { label: "Clearer instructions", diff: '- "Answer the question."\n+ "Answer in 1-3 sentences. If the rules don\'t say, reply: I don\'t know."', score: 0.94, broke: [] as string[] },
  risky: {
    label: "Shorter prompt to save tokens",
    diff: '- "Use only the library rules below. Cite the rule number."\n+ "Answer briefly."',
    score: 0.86,
    broke: ["q07 renew online", "q19 fines for lost books", "q23 guest Wi-Fi"],
  },
} as const;
type Id = keyof typeof CHANGES;

const STAGES = ["Lint", "Unit tests", "Build", "Evals on 50 golden questions"];

export default function RegressionCiDemo() {
  const [id, setId] = React.useState<Id>("risky");
  const c = CHANGES[id];
  const { shown, play, next, reset, done } = useStepper(STAGES.length, 700);
  const passed = c.score >= THRESHOLD && BASELINE - c.score <= 0.02;

  return (
    <DemoFrame title="The test at the classroom door" hint={`Gate: pass rate ≥ ${THRESHOLD * 100}% and at most 2 points below main (${BASELINE * 100}%).`} onReset={reset}>
      <div className="flex flex-wrap items-center gap-2">
        <ChoiceChips
          label="Pull request"
          options={(Object.keys(CHANGES) as Id[]).map((k) => ({ id: k, label: CHANGES[k].label }))}
          value={id}
          onChange={(k) => {
            setId(k);
            reset();
          }}
        />
        <StepControls onPlay={play} onNext={next} done={done} playLabel="Run CI" />
      </div>
      <pre className="mt-2 overflow-x-auto rounded-lg bg-surface p-2 font-mono text-[10px] leading-snug">{c.diff}</pre>
      <ol className="mt-2 space-y-1 text-xs">
        {STAGES.map((s, i) => {
          const ran = i < shown;
          const isEval = i === STAGES.length - 1;
          const ok = !isEval || passed;
          return (
            <li key={s} className="flex items-center gap-2">
              <span className="w-4 font-mono" style={{ color: !ran ? "var(--muted)" : ok ? "var(--good)" : "var(--bad)" }}>
                {!ran ? "○" : ok ? "✓" : "✗"}
              </span>
              <span>{s}</span>
              {isEval && ran && (
                <span className="font-mono text-muted">
                  {Math.round(c.score * 100)}% (main: {Math.round(BASELINE * 100)}%)
                </span>
              )}
            </li>
          );
        })}
      </ol>
      {done && (
        <p
          className="mt-2 rounded-lg px-3 py-2 text-xs"
          style={{ backgroundColor: `color-mix(in srgb, ${passed ? "var(--good)" : "var(--bad)"} 16%, transparent)` }}
          aria-live="polite"
        >
          {passed ? "All checks passed: the change can be merged and deployed." : `Merge blocked. Newly failing: ${c.broke.join(", ")}.`}
        </p>
      )}
    </DemoFrame>
  );
}

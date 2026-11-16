"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, StepControls, useStepper } from "../ui";

const STAGES = [
  { id: "test", label: "Test", detail: "lint · types · unit tests · evals" },
  { id: "build", label: "Build", detail: "docker build → app:7f3c2e1" },
  { id: "staging", label: "Staging", detail: "deploy app:7f3c2e1 · smoke tests" },
  { id: "prod", label: "Production", detail: "deploy the same app:7f3c2e1" },
];
const COMMITS = {
  good: { label: "Commit: fix typo in answer text", failAt: -1, error: "" },
  broken: { label: "Commit: refactor search (breaks a test)", failAt: 0, error: "test_search_returns_citations FAILED" },
  smoke: { label: "Commit: new env variable (missing in staging)", failAt: 2, error: "smoke test: GET /ready → 503 (SEARCH_URL not set)" },
} as const;
type CommitId = keyof typeof COMMITS;

export default function CicdDemo() {
  const [cid, setCid] = React.useState<CommitId>("broken");
  const c = COMMITS[cid];
  const total = c.failAt >= 0 ? c.failAt + 1 : STAGES.length;
  const { shown, play, next, reset, done } = useStepper(total, 750);

  return (
    <DemoFrame title="From the test kitchen to every truck" hint="Every push runs the same stages. A failure stops everything after it." onReset={reset}>
      <ChoiceChips
        label="Push"
        options={(Object.keys(COMMITS) as CommitId[]).map((k) => ({ id: k, label: COMMITS[k].label }))}
        value={cid}
        onChange={(k) => {
          setCid(k);
          reset();
        }}
      />
      <div className="mt-2">
        <StepControls onPlay={play} onNext={next} done={done} playLabel="git push" />
      </div>
      <ol className="mt-3 flex flex-wrap items-stretch gap-1.5">
        {STAGES.map((s, i) => {
          const ran = i < shown;
          const failed = ran && i === c.failAt;
          const skipped = done && c.failAt >= 0 && i > c.failAt;
          return (
            <li
              key={s.id}
              className="min-w-[7rem] flex-1 rounded-lg p-2 text-xs"
              style={{
                backgroundColor: failed
                  ? "color-mix(in srgb, var(--bad) 22%, transparent)"
                  : ran
                    ? "color-mix(in srgb, var(--good) 20%, transparent)"
                    : "var(--surface)",
                opacity: skipped ? 0.4 : 1,
              }}
            >
              <div className="font-medium">
                {failed ? "✗" : ran ? "✓" : skipped ? "⏭" : "○"} {s.label}
              </div>
              <div className="text-[10px] text-muted">{s.detail}</div>
            </li>
          );
        })}
      </ol>
      {done && (
        <p className="mt-2 rounded-lg bg-surface px-3 py-2 text-xs" aria-live="polite">
          {c.failAt >= 0 ? (
            <span style={{ color: "var(--bad)" }}>
              Stopped: {c.error}. Nothing after this stage ran; production is untouched.
            </span>
          ) : (
            <span style={{ color: "var(--good)" }}>Shipped. Production runs exactly the image that passed tests and staging.</span>
          )}
        </p>
      )}
    </DemoFrame>
  );
}

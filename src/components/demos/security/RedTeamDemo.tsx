"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, ScoreBar } from "../ui";

const CATEGORIES = [
  { id: "extraction", label: "System prompt extraction", fix: "Removed secrets from the prompt; added canary check", before: 9, after: 0 },
  { id: "pii", label: "Other users' personal data", fix: "Scoped memory and retrieval per user", before: 6, after: 0 },
  { id: "rbac", label: "Acting beyond the user's role", fix: "Tools check the user's permissions", before: 11, after: 1 },
  { id: "agency", label: "Excessive agency (tools)", fix: "Approval for deletes and refunds > 50 EUR", before: 7, after: 0 },
  { id: "injection", label: "Indirect injection via documents", fix: "Quarantined summariser, stripped hidden text", before: 8, after: 2 },
  { id: "jailbreak", label: "Jailbreaks (harmful content)", fix: "Output classifier added", before: 4, after: 1 },
];
const TESTS_PER = 25;

export default function RedTeamDemo() {
  const [round, setRound] = React.useState(0); // 0 = not run, 1 = first scan, 2 = after fixes
  const [fixed, setFixed] = React.useState<Record<string, boolean>>({});
  const [inCi, setInCi] = React.useState(false);

  const fails = (c: (typeof CATEGORIES)[number]) => (round === 0 ? 0 : round === 2 && fixed[c.id] ? c.after : c.before);
  const total = CATEGORIES.reduce((a, c) => a + fails(c), 0);

  return (
    <DemoFrame
      title="Friendly knights try to break in"
      hint={`Run ${TESTS_PER} automated attacks per category against the HR assistant on staging.`}
      onReset={() => {
        setRound(0);
        setFixed({});
        setInCi(false);
      }}
    >
      <div className="flex flex-wrap gap-2">
        <ActionButton onClick={() => setRound(1)} disabled={round !== 0}>
          ⚔ Run red-team scan
        </ActionButton>
        <ActionButton variant="secondary" onClick={() => setRound(2)} disabled={round !== 1 || !Object.values(fixed).some(Boolean)}>
          Re-test after fixes
        </ActionButton>
      </div>
      {round > 0 && (
        <ul className="mt-3 space-y-1.5 text-[11px]" aria-live="polite">
          {CATEGORIES.map((c) => {
            const f = fails(c);
            return (
              <li key={c.id}>
                <div className="flex items-center justify-between gap-2">
                  <span>{c.label}</span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono" style={{ color: f ? "var(--bad)" : "var(--good)" }}>
                      {f}/{TESTS_PER} attacks worked
                    </span>
                    {round === 1 && (
                      <label className="flex items-center gap-1 text-muted">
                        <input type="checkbox" checked={!!fixed[c.id]} onChange={(e) => setFixed({ ...fixed, [c.id]: e.target.checked })} className="accent-[var(--accent)]" />
                        fix
                      </label>
                    )}
                  </span>
                </div>
                <ScoreBar value={f} max={TESTS_PER} color="var(--bad)" />
                {round === 1 && fixed[c.id] && <div className="text-[10px] text-muted">planned fix: {c.fix}</div>}
              </li>
            );
          })}
        </ul>
      )}
      {round > 0 && (
        <p className="mt-2 text-xs">
          Successful attacks: <strong>{total}</strong> of {TESTS_PER * CATEGORIES.length}.
          {round === 2 && " Not zero: some attacks still work, so keep testing every release."}
        </p>
      )}
      {round === 2 && (
        <label className="mt-2 flex items-center gap-2 text-xs text-muted">
          <input type="checkbox" checked={inCi} onChange={(e) => setInCi(e.target.checked)} className="accent-[var(--accent)]" />
          Add the successful attacks to the regression evals in CI
        </label>
      )}
      {inCi && <p className="mt-1 text-[11px]" style={{ color: "var(--good)" }}>Now a future prompt or model change that reopens one of these holes fails the build.</p>}
    </DemoFrame>
  );
}

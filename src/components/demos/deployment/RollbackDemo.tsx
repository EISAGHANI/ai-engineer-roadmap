"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, ChoiceChips } from "../ui";

type Migration = "additive" | "drop";
type Phase = "running-old" | "running-new" | "rolled-back" | "rollback-failed";

export default function RollbackDemo() {
  const [migration, setMigration] = React.useState<Migration>("additive");
  const [phase, setPhase] = React.useState<Phase>("running-old");

  const revisions = [
    { rev: 41, tag: "1.4.0", current: phase === "running-old" || phase === "rolled-back" },
    { rev: 42, tag: "1.5.0", current: phase === "running-new" || phase === "rollback-failed" },
  ];

  return (
    <DemoFrame
      title="The spare trucks with yesterday's menu"
      hint="Deploy 1.5.0, find a bug, then roll back in one step."
      onReset={() => {
        setMigration("additive");
        setPhase("running-old");
      }}
    >
      <ChoiceChips
        label="1.5.0 database migration"
        options={[
          { id: "additive", label: "Adds a new column" },
          { id: "drop", label: "Drops the old 'title' column" },
        ]}
        value={migration}
        onChange={(m) => {
          setMigration(m);
          setPhase("running-old");
        }}
      />
      <div className="mt-3 flex flex-wrap gap-2">
        <ActionButton onClick={() => setPhase("running-new")} disabled={phase !== "running-old"}>
          Deploy 1.5.0
        </ActionButton>
        <ActionButton variant="secondary" onClick={() => setPhase(migration === "drop" ? "rollback-failed" : "rolled-back")} disabled={phase !== "running-new"}>
          ⏪ kubectl rollout undo
        </ActionButton>
      </div>
      <ul className="mt-3 space-y-1 font-mono text-xs">
        {revisions.map((r) => (
          <li key={r.rev} className="flex items-center gap-2 rounded-md px-2 py-1" style={{ backgroundColor: r.current ? "color-mix(in srgb, var(--accent) 16%, transparent)" : "var(--surface)" }}>
            <span>revision {r.rev}</span>
            <span className="text-muted">rag-api:{r.tag}</span>
            {r.current && <span className="ml-auto text-[10px]">← running</span>}
          </li>
        ))}
      </ul>
      <p
        className="mt-3 rounded-lg px-3 py-2 text-xs"
        aria-live="polite"
        style={{
          backgroundColor:
            phase === "rollback-failed"
              ? "color-mix(in srgb, var(--bad) 18%, transparent)"
              : phase === "rolled-back"
                ? "color-mix(in srgb, var(--good) 18%, transparent)"
                : "var(--surface)",
        }}
      >
        {phase === "running-old" && "Production runs 1.4.0. Click Deploy."}
        {phase === "running-new" && "1.5.0 is live… and answers are missing their titles. Roll back!"}
        {phase === "rolled-back" && "Back on 1.4.0 within seconds. The extra column is simply ignored by the old code."}
        {phase === "rollback-failed" &&
          "1.4.0 is back, but it crashes: column 'title' does not exist. The code rolled back; the data didn't. Use expand-and-contract: add first, remove the old column only in a later release."}
      </p>
    </DemoFrame>
  );
}

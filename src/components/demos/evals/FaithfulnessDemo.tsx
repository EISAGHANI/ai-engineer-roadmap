"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { Panel, StepControls, useStepper } from "../ui";

const CONTEXT =
  "Dinosaurs died out about 66 million years ago. Fossils show that some dinosaurs had feathers. The largest known dinosaurs were long-necked plant eaters.";

const CLAIMS = [
  { text: "Dinosaurs died out about 66 million years ago.", supported: true, evidence: "sentence 1" },
  { text: "Some dinosaurs had feathers.", supported: true, evidence: "sentence 2" },
  { text: "The biggest dinosaurs ate plants.", supported: true, evidence: "sentence 3" },
  { text: "All dinosaurs were green.", supported: false, evidence: "not in the context" },
];

export default function FaithfulnessDemo() {
  const { shown, play, next, reset, done } = useStepper(CLAIMS.length, 700);
  const checked = CLAIMS.slice(0, shown);
  const score = checked.filter((c) => c.supported).length;

  return (
    <DemoFrame title="Did the book really say that?" hint="Split the answer into claims, then check each one against the retrieved context." onReset={reset}>
      <Panel title="retrieved context">
        <p className="text-xs">{CONTEXT}</p>
      </Panel>
      <div className="mt-2 flex items-center gap-2">
        <StepControls onPlay={play} onNext={next} done={done} playLabel="Check claims" />
      </div>
      <ul className="mt-2 space-y-1" aria-live="polite">
        {CLAIMS.map((c, i) => {
          const isChecked = i < shown;
          return (
            <li
              key={c.text}
              className="flex justify-between gap-2 rounded-md px-2 py-1 text-xs"
              style={{
                backgroundColor: !isChecked
                  ? "var(--surface)"
                  : `color-mix(in srgb, ${c.supported ? "var(--good)" : "var(--bad)"} 18%, transparent)`,
              }}
            >
              <span>
                {isChecked ? (c.supported ? "✓ " : "✗ ") : "· "}
                {c.text}
              </span>
              {isChecked && <span className="shrink-0 text-muted">{c.evidence}</span>}
            </li>
          );
        })}
      </ul>
      {done && (
        <p className="mt-2 text-sm">
          Faithfulness = {score}/{CLAIMS.length} ={" "}
          <span className="font-mono" style={{ color: "var(--accent)" }}>
            {(score / CLAIMS.length).toFixed(2)}
          </span>{" "}
          <span className="text-xs text-muted">· one claim was made up, however confident it sounds.</span>
        </p>
      )}
    </DemoFrame>
  );
}

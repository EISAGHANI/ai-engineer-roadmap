"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, ChoiceChips, Panel } from "../ui";

const A = "The library closes at 18:00 on weekdays.";
const B = "On weekdays the library is open until 18:00; on Saturdays until 14:00, and it is closed on Sundays.";
/** Illustrative judge outputs for five repeated runs. */
const SCORES_A = [7, 8, 6, 8, 7];
const SCORES_B = [8, 7, 9, 8, 8];
const PAIRWISE = ["B", "B", "B", "B", "B"];

type Mode = "absolute" | "pairwise";

export default function PairwiseDemo() {
  const [mode, setMode] = React.useState<Mode>("absolute");
  const [runs, setRuns] = React.useState(0);

  return (
    <DemoFrame
      title="Which of these two is better?"
      hint='Question: "When is the library open?" Ask the judge five times.'
      onReset={() => {
        setMode("absolute");
        setRuns(0);
      }}
    >
      <div className="grid gap-2 sm:grid-cols-2">
        <Panel title="answer A">
          <p className="text-xs">{A}</p>
        </Panel>
        <Panel title="answer B">
          <p className="text-xs">{B}</p>
        </Panel>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <ChoiceChips
          label="Judge style"
          options={[
            { id: "absolute", label: "Score each 1-10" },
            { id: "pairwise", label: "Pick the better one" },
          ]}
          value={mode}
          onChange={(m) => {
            setMode(m);
            setRuns(0);
          }}
        />
        <ActionButton onClick={() => setRuns(5)}>Ask 5 times</ActionButton>
      </div>
      {runs > 0 && (
        <div className="mt-3 text-xs" aria-live="polite">
          {mode === "absolute" ? (
            <>
              <p className="font-mono">A: {SCORES_A.join(", ")}</p>
              <p className="font-mono">B: {SCORES_B.join(", ")}</p>
              <p className="mt-1 text-muted">
                In run 2, A beat B; in runs 1, 3 and 5, B won; in run 4 it was a tie. Absolute scores wobble, so small
                differences mean little.
              </p>
            </>
          ) : (
            <>
              <p className="font-mono">winner: {PAIRWISE.join(", ")}</p>
              <p className="mt-1 text-muted">
                B wins every time, and still wins with the order swapped. Relative judgements are far more stable.
              </p>
            </>
          )}
        </div>
      )}
    </DemoFrame>
  );
}

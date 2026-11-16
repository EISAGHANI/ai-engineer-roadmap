"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, StepControls, useStepper } from "../ui";

type Line = { kind: "Thought" | "Action" | "Observation" | "Answer"; text: string };

const REACT: Line[] = [
  { kind: "Thought", text: "I need the bakery's closing time." },
  { kind: "Action", text: "read_sign[bakery]" },
  { kind: "Observation", text: "Open until 18:00." },
  { kind: "Thought", text: "Now I need the next bus and how long the ride takes." },
  { kind: "Action", text: "timetable[bus 7 to the bakery]" },
  { kind: "Observation", text: "Next bus 17:20, ride 25 minutes, arrives 17:45." },
  { kind: "Thought", text: "17:45 is before 18:00, so it works." },
  { kind: "Answer", text: "Yes: take the 17:20 bus and you arrive 15 minutes before closing." },
];

const ACT_ONLY: Line[] = [
  { kind: "Action", text: "search[bakery bus]" },
  { kind: "Observation", text: "Bus 7 serves the town centre." },
  { kind: "Action", text: "search[bakery]" },
  { kind: "Observation", text: "Best bread in town!" },
  { kind: "Answer", text: "Probably yes, bus 7 goes to the town centre." },
];

const COLORS = { Thought: "var(--area-agents)", Action: "var(--area-llm)", Observation: "var(--area-rag)", Answer: "var(--good)" } as const;

export default function ReActDemo() {
  const [mode, setMode] = React.useState<"react" | "act">("react");
  const lines = mode === "react" ? REACT : ACT_ONLY;
  const { shown, play, next, reset, done } = useStepper(lines.length, 650);

  return (
    <DemoFrame title="Think, act, look, repeat" hint="It is 17:10. Can I reach the bakery by bus before it closes?" onReset={reset}>
      <div className="flex flex-wrap items-center gap-2">
        <ChoiceChips
          label="Prompt style"
          options={[
            { id: "react", label: "ReAct (thoughts + actions)" },
            { id: "act", label: "Actions only" },
          ]}
          value={mode}
          onChange={(m) => {
            setMode(m);
            reset();
          }}
        />
        <StepControls onPlay={play} onNext={next} done={done} />
      </div>
      <ol className="mt-3 space-y-0.5 font-mono text-xs" aria-live="polite">
        {lines.slice(0, shown).map((l, i) => (
          <li key={i}>
            <span style={{ color: COLORS[l.kind] }}>{l.kind}:</span> {l.text}
          </li>
        ))}
      </ol>
      {done && (
        <p className="mt-2 text-xs text-muted">
          {mode === "react"
            ? "Each thought decided the next action, so it looked up exactly the two facts it needed."
            : "Without thoughts it searched vaguely and guessed. It never checked the closing time."}
        </p>
      )}
    </DemoFrame>
  );
}

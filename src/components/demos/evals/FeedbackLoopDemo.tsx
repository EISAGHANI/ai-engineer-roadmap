"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { StepControls, useStepper } from "../ui";

const STAGES = [
  { icon: "👎", title: "Thumbs down", text: "A pupil marks the answer “Late fee: 50 cents per day” as wrong and writes: “it's 10 cents”." },
  { icon: "🔗", title: "Linked to the trace", text: "The feedback is stored with the trace: question, retrieved chunks, prompt version v3." },
  { icon: "🧑‍🏫", title: "Human review", text: "The teacher checks the rules: the pupil is right. The search returned the 2019 fee table." },
  { icon: "📒", title: "New golden case", text: "Added to golden.jsonl: “What is the late fee?” → “10 cents per day” (tag: fees)." },
  { icon: "🛡️", title: "Guarded forever", text: "Every future prompt or model change is tested on this exact question in CI." },
];

export default function FeedbackLoopDemo() {
  const { shown, play, next, reset, done } = useStepper(STAGES.length, 900);
  const goldenSize = 50 + (shown >= 4 ? 1 : 0);

  return (
    <DemoFrame title="Complaints become test questions" hint="Follow one thumbs-down all the way into the test set." onReset={reset}>
      <div className="flex items-center gap-3">
        <StepControls onPlay={play} onNext={next} done={done} />
        <span className="font-mono text-xs text-muted">golden set: {goldenSize} cases</span>
      </div>
      <ol className="mt-3 space-y-1.5" aria-live="polite">
        {STAGES.map((s, i) => {
          const on = i < shown;
          return (
            <li
              key={s.title}
              className="flex gap-2 rounded-md px-2 py-1.5 text-xs"
              style={{
                opacity: on ? 1 : 0.3,
                backgroundColor: on ? "color-mix(in srgb, var(--area-evals) 14%, transparent)" : "var(--surface)",
                transition: "opacity 250ms",
              }}
            >
              <span aria-hidden="true">{s.icon}</span>
              <span>
                <strong>{s.title}.</strong> {s.text}
              </span>
            </li>
          );
        })}
      </ol>
      {done && <p className="mt-2 text-xs text-muted">One complaint became a permanent regression test. Users improve your test set every day.</p>}
    </DemoFrame>
  );
}

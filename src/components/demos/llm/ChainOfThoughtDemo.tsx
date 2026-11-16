"use client";

import * as React from "react";
import { Play, StepForward } from "lucide-react";
import { DemoFrame } from "../DemoFrame";
import { Switch } from "@/components/ui/Switch";
import { useMotionSafe } from "@/lib/motion";

const QUESTION = "A book costs 12 euros. I have 50 euros and buy three books. How much is left?";
const STEPS = ["One book costs 12 euros.", "Three books cost 3 × 12 = 36 euros.", "I had 50 euros: 50 − 36 = 14."];
const QUICK_ANSWER = "36 euros"; // the classic slip: answers the cost, not what is left
const STEP_ANSWER = "14 euros";

export default function ChainOfThoughtDemo() {
  const motionSafe = useMotionSafe();
  const [stepByStep, setStepByStep] = React.useState(false);
  const [shown, setShown] = React.useState(0); // steps revealed
  const [done, setDone] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(() => {
    if (!playing) return;
    if (shown >= STEPS.length) {
      setDone(true);
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setShown((s) => s + 1), 700);
    return () => window.clearTimeout(t);
  }, [playing, shown]);

  function reset() {
    setShown(0);
    setDone(false);
    setPlaying(false);
  }

  function ask() {
    reset();
    if (!stepByStep) {
      setDone(true);
      return;
    }
    if (motionSafe) setPlaying(true);
  }

  function step() {
    if (shown < STEPS.length) setShown((s) => s + 1);
    else setDone(true);
  }

  const answer = stepByStep ? STEP_ANSWER : QUICK_ANSWER;
  const correct = stepByStep;

  return (
    <DemoFrame title="Think before you answer" hint="Ask once without steps, then switch on step by step." onReset={reset}>
      <p className="rounded-lg bg-surface px-3 py-2 text-sm">{QUESTION}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Switch
          checked={stepByStep}
          onChange={(v) => {
            setStepByStep(v);
            reset();
          }}
          label="Think step by step"
        />
        <button
          type="button"
          onClick={ask}
          className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-ink"
        >
          <Play className="h-3.5 w-3.5" aria-hidden="true" /> Ask
        </button>
        {stepByStep && !motionSafe && !done && (
          <button
            type="button"
            onClick={step}
            className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs"
          >
            <StepForward className="h-3.5 w-3.5" aria-hidden="true" /> Next step
          </button>
        )}
      </div>

      {stepByStep && (
        <ol className="mt-3 space-y-1 text-sm" aria-label="Thinking steps">
          {STEPS.slice(0, shown).map((s, i) => (
            <li key={s} className="flex gap-2 rounded-md bg-surface px-3 py-1">
              <span className="font-mono text-xs text-muted">{i + 1}</span> {s}
            </li>
          ))}
        </ol>
      )}

      {done && (
        <div
          className="mt-3 rounded-lg border-2 px-3 py-2 text-sm"
          style={{ borderColor: correct ? "var(--good)" : "var(--bad)" }}
          aria-live="polite"
        >
          <strong>Answer: {answer}</strong>
          <div className="text-xs text-muted">
            {correct
              ? "Right. Writing the steps kept the model from mixing up cost and money left."
              : "Wrong: 36 is what the books cost, not what is left. Jumping straight to an answer skips a step."}
          </div>
        </div>
      )}
    </DemoFrame>
  );
}

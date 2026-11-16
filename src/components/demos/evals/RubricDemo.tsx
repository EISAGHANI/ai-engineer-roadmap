"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, ScoreBar } from "../ui";

const CRITERIA = [
  { id: "correct", label: "Correct", levels: ["wrong", "partly wrong", "correct with gaps", "fully correct"] },
  { id: "complete", label: "Complete", levels: ["misses the point", "half answered", "mostly", "everything asked"] },
  { id: "tone", label: "Tone", levels: ["rude or confusing", "stiff", "clear", "friendly and clear"] },
] as const;

const ANSWERS = [
  { id: "a", label: "Friendly but wrong", text: "Great question! You can borrow books for 3 months. 😊", scores: { correct: 1, complete: 3, tone: 4 } },
  { id: "b", label: "Right but curt", text: "3 weeks. Read the rules.", scores: { correct: 4, complete: 3, tone: 1 } },
  { id: "c", label: "Right and kind", text: "You can borrow a book for 3 weeks, and renew it online up to 2 times.", scores: { correct: 4, complete: 4, tone: 4 } },
] as const;
type Id = (typeof ANSWERS)[number]["id"];

export default function RubricDemo() {
  const [id, setId] = React.useState<Id>("a");
  const a = ANSWERS.find((x) => x.id === id) ?? ANSWERS[0];
  const pass = a.scores.correct >= 3 && a.scores.complete >= 3 && a.scores.tone >= 2;
  const avg = (a.scores.correct + a.scores.complete + a.scores.tone) / 3;

  return (
    <DemoFrame title="The marking scheme on the board" hint="Pass rule: correct ≥ 3, complete ≥ 3, tone ≥ 2." onReset={() => setId("a")}>
      <ChoiceChips label="Answer" options={ANSWERS.map((x) => ({ id: x.id, label: x.label }))} value={id} onChange={setId} />
      <p className="mt-2 rounded-md bg-surface px-3 py-1.5 text-sm">{a.text}</p>
      <ul className="mt-3 space-y-2">
        {CRITERIA.map((c) => {
          const s: number = a.scores[c.id];
          return (
            <li key={c.id} className="grid grid-cols-[5rem_1fr_9rem] items-center gap-2 text-xs">
              <span>{c.label}</span>
              <ScoreBar value={s} max={4} color={s >= 3 ? "var(--good)" : s === 2 ? "var(--warn)" : "var(--bad)"} />
              <span className="text-muted">
                {s}/4 · {c.levels[s - 1]}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs" aria-live="polite">
        <strong style={{ color: pass ? "var(--good)" : "var(--bad)" }}>{pass ? "PASS" : "FAIL"}</strong>{" "}
        <span className="text-muted">
          (average {avg.toFixed(1)}/4. {id === "a" ? "A decent average still fails: being wrong is not saved by being friendly." : "Each criterion is judged on its own scale."})
        </span>
      </p>
    </DemoFrame>
  );
}

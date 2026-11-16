"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, Panel } from "../ui";

const QUESTION = "How long can I borrow a book?";
const REFERENCE = "3 weeks";
const ANSWERS = [
  {
    id: "exact",
    label: "Same words",
    text: "3 weeks",
    exact: true,
    judge: { verdict: "pass", reasoning: "Identical to the reference." },
  },
  {
    id: "paraphrase",
    label: "Different words",
    text: "You can keep it for twenty-one days.",
    exact: false,
    judge: { verdict: "pass", reasoning: "Twenty-one days equals 3 weeks, so the meaning matches." },
  },
  {
    id: "wrong",
    label: "Subtly wrong",
    text: "Books can be borrowed for 3 weeks, or 3 months for pupils.",
    exact: false,
    judge: { verdict: "fail", reasoning: "Adds a 3-month rule that is not in the reference: incorrect." },
  },
] as const;
type Id = (typeof ANSWERS)[number]["id"];

export default function JudgeDemo() {
  const [id, setId] = React.useState<Id>("paraphrase");
  const a = ANSWERS.find((x) => x.id === id) ?? ANSWERS[0];
  const pass = a.judge.verdict === "pass";

  return (
    <DemoFrame title="A trusted assistant marks the papers" hint={`Question: "${QUESTION}" · reference: "${REFERENCE}"`} onReset={() => setId("paraphrase")}>
      <ChoiceChips label="Bot answer" options={ANSWERS.map((x) => ({ id: x.id, label: x.label }))} value={id} onChange={setId} />
      <Panel className="mt-3" title="bot answer">
        <p className="text-sm">{a.text}</p>
      </Panel>
      <div className="mt-2 grid gap-2 sm:grid-cols-2" aria-live="polite">
        <Panel title="exact string match" tint={a.exact ? "var(--good)" : "var(--bad)"}>
          <p className="text-xs">{a.exact ? "✓ pass" : "✗ fail: the words differ"}</p>
        </Panel>
        <Panel title="LLM judge (reasoning, then verdict)" tint={pass ? "var(--good)" : "var(--bad)"}>
          <p className="text-xs">
            <span className="font-mono">{pass ? "✓ pass" : "✗ fail"}</span> · {a.judge.reasoning}
          </p>
        </Panel>
      </div>
      <p className="mt-2 text-xs text-muted">
        String matching fails good answers in other words and can&apos;t spot subtle errors. A judge reads for meaning, but you must check it
        against human marks.
      </p>
    </DemoFrame>
  );
}

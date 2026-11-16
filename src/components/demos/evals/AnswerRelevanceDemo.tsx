"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, Panel, ScoreBar } from "../ui";

const QUESTION = "What time does the library close on Saturday?";
const ANSWERS = [
  { id: "direct", label: "Direct", text: "At 14:00 on Saturdays.", score: 5, faithful: true, note: "Answers exactly what was asked." },
  {
    id: "buried",
    label: "Buried",
    text: "Our library was founded in 1925 and has 20,000 books, a reading corner and Wi-Fi. On weekdays it closes at 18:00, and on Saturdays a bit earlier, at 14:00.",
    score: 3,
    faithful: true,
    note: "The answer is in there, but buried under unrelated facts.",
  },
  {
    id: "offtopic",
    label: "True but off-topic",
    text: "The library has 20,000 books and was founded in 1925.",
    score: 1,
    faithful: true,
    note: "Every word is true and grounded, yet it doesn't answer the question.",
  },
] as const;
type Id = (typeof ANSWERS)[number]["id"];

export default function AnswerRelevanceDemo() {
  const [id, setId] = React.useState<Id>("offtopic");
  const a = ANSWERS.find((x) => x.id === id) ?? ANSWERS[0];

  return (
    <DemoFrame title="Right facts, wrong question" hint={`Question: "${QUESTION}"`} onReset={() => setId("offtopic")}>
      <ChoiceChips label="Answer" options={ANSWERS.map((x) => ({ id: x.id, label: x.label }))} value={id} onChange={setId} />
      <Panel className="mt-3" title="answer">
        <p className="text-sm">{a.text}</p>
      </Panel>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs" aria-live="polite">
        <div>
          <div className="flex justify-between">
            <span>Faithfulness</span>
            <span className="font-mono">{a.faithful ? "1.00" : "0.00"}</span>
          </div>
          <ScoreBar value={a.faithful ? 1 : 0} color="var(--good)" />
        </div>
        <div>
          <div className="flex justify-between">
            <span>Answer relevance</span>
            <span className="font-mono">{a.score}/5</span>
          </div>
          <ScoreBar value={a.score} max={5} color={a.score >= 4 ? "var(--good)" : a.score >= 3 ? "var(--warn)" : "var(--bad)"} />
        </div>
      </div>
      <p className="mt-2 text-xs text-muted">{a.note} That is why RAG evals measure both.</p>
    </DemoFrame>
  );
}

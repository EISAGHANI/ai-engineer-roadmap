"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";

type Answer = "rag" | "finetune" | "both" | "prompt";
const LABELS: Record<Answer, string> = { rag: "RAG", finetune: "Fine-tune", both: "Both", prompt: "Just a better prompt" };
const CASES: Array<{ text: string; answer: Answer; why: string }> = [
  { text: "Answer questions about our HR policies, which change every few months.", answer: "rag", why: "Facts that change: retrieve them, and cite the page." },
  { text: "Every reply must be valid JSON in our exact ticket format, millions of times a day, as cheaply as possible.", answer: "finetune", why: "A narrow, repetitive format at scale: a fine-tuned small model is cheaper and more consistent." },
  { text: "A support bot that knows each customer's own contracts and must not see other customers' files.", answer: "rag", why: "Private, per-user data with access control belongs in retrieval, not in weights." },
  { text: "Answers in our brand voice, based on our product docs which update weekly.", answer: "both", why: "Voice is a style (fine-tune or strong prompt); the docs are fresh facts (RAG)." },
  { text: "Summaries are a bit too long; we want three bullet points.", answer: "prompt", why: "Try instructions and a few examples first. Fine-tuning is overkill for this." },
  { text: "Teach the model all our product facts so it never needs to look them up.", answer: "rag", why: "Fine-tuning is poor at storing facts: they go stale and can't be cited." },
];

export default function RagVsFinetuneDemo() {
  const [i, setI] = React.useState(0);
  const [picked, setPicked] = React.useState<Answer | null>(null);
  const [score, setScore] = React.useState(0);
  const c = CASES[i];
  const last = i === CASES.length - 1;

  return (
    <DemoFrame
      title="Read the card, or go to school?"
      hint="For each need, pick the right tool."
      onReset={() => {
        setI(0);
        setPicked(null);
        setScore(0);
      }}
    >
      <p className="text-xs text-muted">
        {i + 1} / {CASES.length} · score {score}
      </p>
      <p className="mt-1 min-h-12 rounded-lg bg-surface px-3 py-2 text-sm">{c.text}</p>
      <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {(Object.keys(LABELS) as Answer[]).map((a) => {
          const isRight = picked !== null && a === c.answer;
          const isWrong = picked === a && a !== c.answer;
          return (
            <button
              key={a}
              type="button"
              disabled={picked !== null}
              onClick={() => {
                setPicked(a);
                if (a === c.answer) setScore((s) => s + 1);
              }}
              className="rounded-lg border px-2 py-1.5 text-xs"
              style={{
                borderColor: isRight ? "var(--good)" : isWrong ? "var(--bad)" : "var(--border)",
                backgroundColor: isRight ? "color-mix(in srgb, var(--good) 18%, transparent)" : undefined,
              }}
            >
              {LABELS[a]}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="mt-3 flex items-start justify-between gap-3 text-xs" aria-live="polite">
          <p>
            <strong>{picked === c.answer ? "✓ Right." : `✗ Better: ${LABELS[c.answer]}.`}</strong> {c.why}
          </p>
          {!last ? (
            <button
              type="button"
              className="shrink-0 rounded-full bg-accent px-3 py-1 text-accent-ink"
              onClick={() => {
                setI(i + 1);
                setPicked(null);
              }}
            >
              Next
            </button>
          ) : (
            <span className="shrink-0 font-semibold">
              {score}/{CASES.length}
            </span>
          )}
        </div>
      )}
    </DemoFrame>
  );
}

"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, ChoiceChips, ScoreBar } from "../ui";

const QUESTION = "why is the sky blue?";
const PRETEND =
  "Sunlight is made of many colours. When it passes through the air, the tiny gas molecules scatter short blue waves much more than red ones, so blue light reaches our eyes from every part of the sky.";

/** Illustrative similarity scores of three library pages to each search text. */
const DOCS = [
  { title: "Rayleigh scattering: why the daytime sky looks blue", q: 0.48, h: 0.86 },
  { title: "Colours of light and the rainbow", q: 0.41, h: 0.69 },
  { title: "Sky Blue FC: club history", q: 0.52, h: 0.18 },
];

type Mode = "question" | "pretend";

export default function HydeDemo() {
  const [written, setWritten] = React.useState(false);
  const [mode, setMode] = React.useState<Mode>("question");
  const key = mode === "question" ? "q" : "h";
  const ranked = [...DOCS].sort((a, b) => b[key] - a[key]);

  return (
    <DemoFrame
      title="Imagine the answer, then find its twin"
      hint="Search with the short question, then with a pretend answer."
      onReset={() => {
        setWritten(false);
        setMode("question");
      }}
    >
      <p className="rounded-lg bg-surface px-3 py-2 text-sm">{QUESTION}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <ActionButton
          onClick={() => {
            setWritten(true);
            setMode("pretend");
          }}
          disabled={written}
        >
          Write a pretend answer
        </ActionButton>
        {written && (
          <ChoiceChips
            label="Search with"
            options={[
              { id: "question", label: "the question" },
              { id: "pretend", label: "the pretend answer" },
            ]}
            value={mode}
            onChange={setMode}
          />
        )}
      </div>
      {written && (
        <p className="mt-2 rounded-md border border-dashed border-border px-3 py-1.5 text-xs text-muted">
          <span className="font-mono text-[10px] uppercase">pretend answer (never shown to the user): </span>
          {PRETEND}
        </p>
      )}
      <ul className="mt-3 space-y-1.5" aria-live="polite">
        {ranked.map((d, i) => (
          <li key={d.title} className="grid grid-cols-[1fr_5rem_2.5rem] items-center gap-2 text-xs">
            <span className={i === 0 ? "font-semibold" : undefined}>{d.title}</span>
            <ScoreBar value={d[key]} />
            <span className="text-right font-mono">{d[key].toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-muted">
        {mode === "question"
          ? "The short question even matches a football club called Sky Blue. Questions and textbook pages just look different."
          : "The pretend answer reads like a textbook page, so the real textbook page comes out on top."}
      </p>
    </DemoFrame>
  );
}

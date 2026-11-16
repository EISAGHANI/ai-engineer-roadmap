"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";

const CAPACITY = 24; // dots on the "desk"

export default function ContextWindowDemo() {
  const [prompt, setPrompt] = React.useState(10);
  const [answer, setAnswer] = React.useState(8);
  const total = prompt + answer;
  const overflow = Math.max(0, total - CAPACITY);
  const roomLeft = Math.max(0, CAPACITY - prompt);

  return (
    <DemoFrame
      title="The desk only holds so many cards"
      hint="Slide the question and the answer. Together they must fit in the window."
      onReset={() => {
        setPrompt(10);
        setAnswer(8);
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-muted">
          Question cards: {prompt}
          <input type="range" min={1} max={CAPACITY} value={prompt} onChange={(e) => setPrompt(+e.target.value)} className="mt-1 w-full accent-[var(--accent)]" />
        </label>
        <label className="text-xs text-muted">
          Answer cards: {answer}
          <input type="range" min={1} max={CAPACITY} value={answer} onChange={(e) => setAnswer(+e.target.value)} className="mt-1 w-full accent-[var(--accent)]" />
        </label>
      </div>
      <div
        className="mt-4 rounded-lg border-2 p-2"
        style={{ borderColor: overflow ? "var(--bad)" : "var(--border)", transition: "border-color 200ms" }}
        aria-label={`Context window with ${CAPACITY} slots`}
      >
        <div className="grid grid-cols-12 gap-1">
          {Array.from({ length: CAPACITY }, (_, i) => {
            const kind = i < prompt ? "prompt" : i < total ? "answer" : "empty";
            return (
              <span
                key={i}
                className="h-5 rounded-sm"
                style={{
                  backgroundColor:
                    kind === "prompt" ? "var(--area-llm)" : kind === "answer" ? "var(--area-rag)" : "var(--surface)",
                  opacity: kind === "empty" ? 0.6 : 1,
                  transition: "background-color 150ms",
                }}
              />
            );
          })}
        </div>
        {overflow > 0 && (
          <div className="mt-2 flex flex-wrap gap-1" aria-label="Cards that fell off the desk">
            {Array.from({ length: Math.min(overflow, 24) }, (_, i) => (
              <span key={i} className="h-5 w-5 rotate-12 rounded-sm" style={{ backgroundColor: "var(--bad)", opacity: 0.7 }} />
            ))}
          </div>
        )}
      </div>
      <p className="mt-3 text-sm" aria-live="polite">
        {overflow > 0 ? (
          <span style={{ color: "var(--bad)" }}>
            {overflow} card{overflow > 1 ? "s" : ""} fell off! The model would cut the answer short or refuse the call.
          </span>
        ) : (
          <span className="text-muted">
            Fits. With {prompt} question cards there is room for {roomLeft} answer cards.
          </span>
        )}
      </p>
      <p className="mt-1 text-xs text-muted">
        Legend: <span style={{ color: "var(--area-llm)" }}>■</span> question (prompt) ·{" "}
        <span style={{ color: "var(--area-rag)" }}>■</span> answer · window = {CAPACITY} tokens here, 128k+ in real models.
      </p>
    </DemoFrame>
  );
}

"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";

const CASES = [
  { situation: "The answer was generated fine.", code: 200 },
  { situation: "A new document was uploaded and saved.", code: 201 },
  { situation: "The request has no 'Authorization' header.", code: 401 },
  { situation: "A free user asks for a Pro-only feature.", code: 403 },
  { situation: "Document 999 does not exist.", code: 404 },
  { situation: "'top_k' was sent as \"lots\" instead of a number.", code: 422 },
  { situation: "The user sent 200 questions in one minute.", code: 429 },
  { situation: "A bug in our code threw an exception.", code: 500 },
  { situation: "The model provider is overloaded right now.", code: 503 },
];
const CODES = [
  { code: 200, label: "200 OK" },
  { code: 201, label: "201 Created" },
  { code: 401, label: "401 Unauthorized" },
  { code: 403, label: "403 Forbidden" },
  { code: 404, label: "404 Not Found" },
  { code: 422, label: "422 Invalid input" },
  { code: 429, label: "429 Too Many" },
  { code: 500, label: "500 Server Error" },
  { code: 503, label: "503 Unavailable" },
];

function family(code: number) {
  if (code < 300) return { color: "var(--good)", who: "Success" };
  if (code < 500) return { color: "var(--warn)", who: "The sender must fix something" };
  return { color: "var(--bad)", who: "The server has a problem" };
}

export default function StatusCodesDemo() {
  const [i, setI] = React.useState(0);
  const [picked, setPicked] = React.useState<number | null>(null);
  const [score, setScore] = React.useState(0);
  const c = CASES[i];
  const right = picked === c.code;
  const finished = i === CASES.length - 1 && picked !== null;

  function pick(code: number) {
    if (picked !== null) return;
    setPicked(code);
    if (code === c.code) setScore((s) => s + 1);
  }

  return (
    <DemoFrame
      title="Which stamp goes on the reply?"
      hint="Pick the status code the server should send."
      onReset={() => {
        setI(0);
        setPicked(null);
        setScore(0);
      }}
    >
      <p className="text-xs text-muted">
        Case {i + 1} of {CASES.length} · score {score}
      </p>
      <p className="mt-1 rounded-lg bg-surface px-3 py-2 text-sm">{c.situation}</p>
      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {CODES.map((x) => {
          const f = family(x.code);
          const isAnswer = picked !== null && x.code === c.code;
          const isWrongPick = picked === x.code && !right;
          return (
            <button
              key={x.code}
              type="button"
              onClick={() => pick(x.code)}
              className="rounded-md border px-1.5 py-1 font-mono text-[11px]"
              style={{
                borderColor: isAnswer ? "var(--good)" : isWrongPick ? "var(--bad)" : "var(--border)",
                backgroundColor: isAnswer ? "color-mix(in srgb, var(--good) 18%, transparent)" : `color-mix(in srgb, ${f.color} 6%, transparent)`,
              }}
            >
              {x.label}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="mt-3 flex items-center justify-between gap-2 text-xs" aria-live="polite">
          <span>
            {right ? "✓ Right." : `✗ It's ${c.code}.`} <span style={{ color: family(c.code).color }}>{family(c.code).who}.</span>
          </span>
          {!finished ? (
            <button
              type="button"
              className="rounded-full bg-accent px-3 py-1 text-accent-ink"
              onClick={() => {
                setI(i + 1);
                setPicked(null);
              }}
            >
              Next case
            </button>
          ) : (
            <span className="font-semibold">
              Done: {score}/{CASES.length}
            </span>
          )}
        </div>
      )}
    </DemoFrame>
  );
}

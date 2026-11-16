"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, Panel } from "../ui";

const TESTS = ["level", "Racecar", "A man, a plan, a canal: Panama"];

const ROUNDS = [
  {
    code: "def is_palindrome(w):\n    return w == w[::-1]",
    passes: [true, false, false],
    critique: "Fails on capital letters ('Racecar') and on spaces and punctuation.",
  },
  {
    code: "def is_palindrome(w):\n    w = w.lower()\n    return w == w[::-1]",
    passes: [true, true, false],
    critique: "Capitals fixed, but spaces, commas and the colon still count as letters.",
  },
  {
    code: "def is_palindrome(w):\n    w = ''.join(c for c in w.lower() if c.isalnum())\n    return w == w[::-1]",
    passes: [true, true, true],
    critique: "All tests pass. Stop reflecting.",
  },
];

export default function ReflectionDemo() {
  const [round, setRound] = React.useState(0);
  const r = ROUNDS[round];
  const allPass = r.passes.every(Boolean);

  return (
    <DemoFrame title="Check your own work against tests" hint="Task: write is_palindrome(word)." onReset={() => setRound(0)}>
      <div className="flex items-center gap-2">
        <ActionButton onClick={() => setRound((n) => Math.min(ROUNDS.length - 1, n + 1))} disabled={allPass}>
          Reflect and revise
        </ActionButton>
        <span className="font-mono text-xs text-muted">version {round + 1}</span>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <pre className="overflow-x-auto rounded-lg bg-surface p-2 font-mono text-[11px] leading-relaxed">{r.code}</pre>
        <Panel title="tests">
          <ul className="space-y-0.5 font-mono text-[11px]">
            {TESTS.map((t, i) => (
              <li key={t} style={{ color: r.passes[i] ? "var(--good)" : "var(--bad)" }}>
                {r.passes[i] ? "✓" : "✗"} {JSON.stringify(t)}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
      <Panel className="mt-2" title="critique (grounded in the failing tests)" tint={allPass ? "var(--good)" : "var(--warn)"}>
        <p className="text-xs" aria-live="polite">
          {r.critique}
        </p>
      </Panel>
    </DemoFrame>
  );
}

"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { DemoFrame } from "../DemoFrame";
import { Switch } from "@/components/ui/Switch";

// Example prices per 1M tokens (illustrative): input $3, cache write $3.75, cache read $0.30
const RULEBOOK = 10_000; // tokens of the shared prefix
const QUESTION = 50; // tokens that change per call
const PRICE = { input: 3, write: 3.75, read: 0.3 };

const QUESTIONS = [
  "Can I park here on Sundays?",
  "How long can I borrow a book?",
  "Are dogs allowed inside?",
  "What happens if I lose my card?",
  "Can I eat in the reading room?",
];

interface Call {
  q: string;
  kind: "full" | "write" | "hit";
  cost: number;
  seconds: number;
}

function callFor(index: number, caching: boolean): Call {
  const q = QUESTIONS[index];
  if (!caching) return { q, kind: "full", cost: ((RULEBOOK + QUESTION) * PRICE.input) / 1e6, seconds: 2.0 };
  if (index === 0) return { q, kind: "write", cost: (RULEBOOK * PRICE.write + QUESTION * PRICE.input) / 1e6, seconds: 2.1 };
  return { q, kind: "hit", cost: (RULEBOOK * PRICE.read + QUESTION * PRICE.input) / 1e6, seconds: 0.6 };
}

const KIND_LABEL = { full: "reads all 10,050", write: "reads all + saves", hit: "cache hit: reads 50" } as const;
const KIND_COLOR = { full: "var(--bad)", write: "var(--warn)", hit: "var(--good)" } as const;

export default function PromptCachingDemo() {
  const [caching, setCaching] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const calls = Array.from({ length: count }, (_, i) => callFor(i, caching));
  const total = calls.reduce((a, c) => a + c.cost, 0);
  const maxCost = callFor(0, true).cost;

  return (
    <DemoFrame
      title="Five visitors, one rulebook"
      hint="Send all five questions, then try again with caching on."
      onReset={() => setCount(0)}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Switch
          checked={caching}
          onChange={(v) => {
            setCaching(v);
            setCount(0);
          }}
          label="Prompt caching"
        />
        <button
          type="button"
          disabled={count >= QUESTIONS.length}
          onClick={() => setCount((c) => Math.min(QUESTIONS.length, c + 1))}
          className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-ink disabled:opacity-40"
        >
          <Send className="h-3.5 w-3.5" aria-hidden="true" /> Send next question
        </button>
        <span className="ml-auto font-mono text-xs text-muted">
          total ${total.toFixed(4)}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted">Each call = 10,000-token rulebook (same every time) + a 50-token question.</p>
      <ul className="mt-2 space-y-1.5" aria-live="polite">
        {calls.map((c, i) => (
          <li key={i} className="rounded-md bg-surface px-3 py-1.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate">{c.q}</span>
              <span className="shrink-0 font-mono" style={{ color: KIND_COLOR[c.kind] }}>
                {KIND_LABEL[c.kind]}
              </span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                <span className="block h-full rounded-full" style={{ width: `${(c.cost / maxCost) * 100}%`, backgroundColor: KIND_COLOR[c.kind] }} />
              </span>
              <span className="w-28 text-right font-mono text-muted">
                ${c.cost.toFixed(4)} · {c.seconds}s
              </span>
            </div>
          </li>
        ))}
      </ul>
      {count === QUESTIONS.length && (
        <p className="mt-2 text-xs">
          {caching
            ? "The first call paid a little extra to save the rulebook; the next four were about 10× cheaper and 3× faster."
            : "Every call paid to read the whole rulebook again. Turn caching on and compare the total."}
        </p>
      )}
    </DemoFrame>
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { DemoFrame } from "../DemoFrame";

const EXAMPLES = [
  { input: "Dune by Frank Herbert, science fiction", output: "Dune | Herbert | Sci-Fi" },
  { input: "Emma by Jane Austen, a classic novel", output: "Emma | Austen | Classic" },
  { input: "It by Stephen King, horror", output: "It | King | Horror" },
];

const NEW_INPUT = "The Hobbit by J.R.R. Tolkien, a fantasy adventure";

/** What the model tends to answer with 0, 1, 2 or 3 examples in the prompt. */
const OUTPUTS = [
  { text: "The Hobbit is a fantasy novel written by J.R.R. Tolkien and published in 1937.", score: 0, note: "No examples: a nice sentence, but not a label." },
  { text: "The Hobbit - Tolkien - fantasy", score: 0.5, note: "One example: the idea is there, the separators are not." },
  { text: "The Hobbit | Tolkien | fantasy", score: 0.8, note: "Two examples: almost, only the capital letter is missing." },
  { text: "The Hobbit | Tolkien | Fantasy", score: 1, note: "Three examples: the pattern is copied exactly." },
];

export default function FewShotDemo() {
  const [count, setCount] = React.useState(0);
  const out = OUTPUTS[count];
  const color = out.score >= 1 ? "var(--good)" : out.score >= 0.5 ? "var(--warn)" : "var(--bad)";

  return (
    <DemoFrame
      title="Teach by showing"
      hint="Add finished examples to the prompt and watch the answer copy their pattern."
      onReset={() => setCount(0)}
    >
      <div className="flex items-center gap-2 text-xs">
        <span className="text-muted">Examples in the prompt:</span>
        {[0, 1, 2, 3].map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={count === n}
            onClick={() => setCount(n)}
            className={cn(
              "h-7 w-7 rounded-full border font-mono",
              count === n ? "border-accent bg-accent text-accent-ink" : "border-border hover:border-accent/60",
            )}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="mt-3 rounded-lg bg-surface p-3 font-mono text-xs leading-relaxed">
        <div className="text-muted">Make a book label.</div>
        {EXAMPLES.slice(0, count).map((ex) => (
          <div key={ex.input} className="mt-1">
            <span className="text-muted">book:</span> {ex.input}
            <br />
            <span className="text-muted">label:</span> <span style={{ color: "var(--area-llm)" }}>{ex.output}</span>
          </div>
        ))}
        <div className="mt-1">
          <span className="text-muted">book:</span> {NEW_INPUT}
          <br />
          <span className="text-muted">label:</span> <span className="animate-pulse">▍</span>
        </div>
      </div>

      <div className="mt-3 rounded-lg border-2 px-3 py-2" style={{ borderColor: color }} aria-live="polite">
        <div className="font-mono text-sm">{out.text}</div>
        <div className="mt-1 text-xs text-muted">{out.note}</div>
      </div>
    </DemoFrame>
  );
}

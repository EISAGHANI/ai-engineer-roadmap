"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";

const RESULTS = [
  { title: "Elephant lifespan in the wild", relevant: true },
  { title: "Elephant herds and their leaders", relevant: false },
  { title: "How old can elephants get?", relevant: true },
  { title: "The ivory trade", relevant: false },
  { title: "Elephant pregnancy facts", relevant: false },
  { title: "Zoo elephants live shorter lives", relevant: true },
  { title: "Asian vs African elephants", relevant: false },
  { title: "Elephant teeth and diet", relevant: false },
  { title: "Oldest elephant on record", relevant: true },
  { title: "Elephants in art", relevant: false },
];
const TOTAL_RELEVANT = 5; // one relevant book was never retrieved at all
const MISSING = "Life expectancy tables for large mammals";

export default function RecallDemo() {
  const [k, setK] = React.useState(5);
  const hits = RESULTS.slice(0, k).filter((r) => r.relevant).length;
  const recall = hits / TOTAL_RELEVANT;

  return (
    <DemoFrame title="How many right books are in the pile?" hint="5 books in the library answer the question. Move k." onReset={() => setK(5)}>
      <label className="text-xs text-muted">
        k (pile size): <span className="font-mono text-text">{k}</span>
        <input type="range" min={1} max={10} value={k} onChange={(e) => setK(+e.target.value)} className="mt-1 block w-full accent-[var(--accent)]" />
      </label>
      <ol className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
        {RESULTS.map((r, i) => {
          const inPile = i < k;
          return (
            <li
              key={r.title}
              className="flex gap-2 rounded-md px-2 py-0.5 text-xs"
              style={{
                opacity: inPile ? 1 : 0.35,
                backgroundColor: inPile && r.relevant ? "color-mix(in srgb, var(--good) 20%, transparent)" : "var(--surface)",
              }}
            >
              <span className="w-4 font-mono text-muted">{i + 1}</span>
              <span>{r.title}</span>
              {r.relevant && <span className="ml-auto" style={{ color: "var(--good)" }}>✓</span>}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-sm" aria-live="polite">
        Recall@{k} = {hits} / {TOTAL_RELEVANT} = <span className="font-mono text-lg" style={{ color: "var(--accent)" }}>{Math.round(recall * 100)}%</span>
      </p>
      <p className="text-xs text-muted">
        Even at k = 10 the best is 80%: &ldquo;{MISSING}&rdquo; was never retrieved, so no LLM could use it.
      </p>
    </DemoFrame>
  );
}

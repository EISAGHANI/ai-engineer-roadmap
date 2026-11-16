"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ScoreBar } from "../ui";
import { Switch } from "@/components/ui/Switch";

const QUERY = "How much did ACME's revenue grow in Q2 2023?";

/** Illustrative match scores without and with the added context line. */
const CHUNKS = [
  {
    id: "acme",
    context: "From ACME Corp's report for Q2 2023, section on revenue.",
    text: "Revenue grew by 3% over the previous quarter.",
    plain: 0.58,
    withContext: 0.91,
    right: true,
  },
  {
    id: "beta",
    context: "From Beta Ltd's report for Q4 2022, section on revenue.",
    text: "Revenue grew by 5% over the previous quarter, driven by exports.",
    plain: 0.62,
    withContext: 0.55,
    right: false,
  },
  {
    id: "acme-staff",
    context: "From ACME Corp's report for Q2 2023, section on staff.",
    text: "The team grew to 140 people.",
    plain: 0.31,
    withContext: 0.6,
    right: false,
  },
];

export default function ContextualRetrievalDemo() {
  const [withContext, setWithContext] = React.useState(false);
  const key = withContext ? "withContext" : "plain";
  const ranked = [...CHUNKS].sort((a, b) => b[key] - a[key]);
  const winner = ranked[0];

  return (
    <DemoFrame title="Label every card before filing it" hint={QUERY} onReset={() => setWithContext(false)}>
      <Switch checked={withContext} onChange={setWithContext} label="Add a context line to each chunk (LLM, once at indexing)" />
      <ul className="mt-3 space-y-2">
        {ranked.map((c, i) => (
          <li key={c.id} className="rounded-md bg-surface px-3 py-2 text-xs" style={i === 0 ? { outline: `2px solid ${c.right ? "var(--good)" : "var(--bad)"}` } : undefined}>
            {withContext && <div className="mb-0.5 italic" style={{ color: "var(--area-rag)" }}>{c.context}</div>}
            <div>{c.text}</div>
            <div className="mt-1 grid grid-cols-[1fr_2.5rem] items-center gap-2">
              <ScoreBar value={c[key]} />
              <span className="text-right font-mono">{c[key].toFixed(2)}</span>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs" aria-live="polite" style={{ color: winner.right ? "var(--good)" : "var(--bad)" }}>
        {winner.right
          ? "With context, the ACME Q2 2023 chunk wins: the chunk now says whose revenue and which quarter."
          : "Without context, a different company's revenue chunk wins: 'revenue grew' looks the same everywhere."}
      </p>
    </DemoFrame>
  );
}

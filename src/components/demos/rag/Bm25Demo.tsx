"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, ScoreBar } from "../ui";

const DOCS = [
  "The XR-200 microscope manual: focus and lighting",
  "The XR-300 microscope quick start guide",
  "How microscopes work: a guide for kids",
  "Cleaning the XR-200 lenses safely",
  "The history of the microscope",
];
const QUERIES = [
  { id: "a", label: "xr-200 manual" },
  { id: "b", label: "microscope guide" },
  { id: "c", label: "the microscope" },
] as const;
type QId = (typeof QUERIES)[number]["id"];

const tokenize = (s: string) => s.toLowerCase().split(/[^a-z0-9-]+/).filter(Boolean);
const TOKENS = DOCS.map(tokenize);
const AVG_LEN = TOKENS.reduce((a, t) => a + t.length, 0) / TOKENS.length;
const K1 = 1.2;
const B = 0.75;

function idf(term: string) {
  const n = TOKENS.filter((t) => t.includes(term)).length;
  return Math.log(1 + (DOCS.length - n + 0.5) / (n + 0.5));
}

function bm25(query: string[], doc: string[]) {
  return query.reduce((score, term) => {
    const tf = doc.filter((t) => t === term).length;
    if (!tf) return score;
    return score + idf(term) * ((tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * doc.length) / AVG_LEN)));
  }, 0);
}

export default function Bm25Demo() {
  const [qid, setQid] = React.useState<QId>("a");
  const query = tokenize(QUERIES.find((q) => q.id === qid)?.label ?? "");
  const scored = DOCS.map((d, i) => ({ d, i, s: bm25(query, TOKENS[i]) })).sort((a, b) => b.s - a.s);
  const max = Math.max(...scored.map((x) => x.s), 0.01);

  return (
    <DemoFrame title="Count the exact words" hint="Rare words score high, common words barely count." onReset={() => setQid("a")}>
      <ChoiceChips label="Search" options={QUERIES.map((q) => ({ id: q.id, label: `“${q.label}”` }))} value={qid} onChange={setQid} />
      <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
        {query.map((t) => (
          <span key={t} className="rounded-full bg-surface px-2 py-0.5 font-mono">
            {t} <span className="text-muted">weight {idf(t).toFixed(2)}</span>
          </span>
        ))}
      </div>
      <ul className="mt-3 space-y-1.5" aria-live="polite">
        {scored.map(({ d, i, s }) => (
          <li key={i} className="grid grid-cols-[1fr_5rem_2.5rem] items-center gap-2 text-xs">
            <span>
              {d.split(/(\s+)/).map((word, k) => {
                const hit = query.includes(tokenize(word)[0] ?? "");
                return (
                  <span key={k} style={hit ? { backgroundColor: "color-mix(in srgb, var(--area-rag) 30%, transparent)", borderRadius: 3 } : undefined}>
                    {word}
                  </span>
                );
              })}
            </span>
            <ScoreBar value={s} max={max} />
            <span className="text-right font-mono">{s.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-muted">
        Notice: &ldquo;microscopes&rdquo; does not match &ldquo;microscope&rdquo;, and &ldquo;the&rdquo; is nearly worthless. Keyword search
        is exact, so it is paired with meaning search.
      </p>
    </DemoFrame>
  );
}

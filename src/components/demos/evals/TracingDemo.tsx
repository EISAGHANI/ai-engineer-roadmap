"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { Panel } from "../ui";

type Span = { id: string; name: string; start: number; end: number; depth: number; detail: Record<string, string | number> };

const SPANS: Span[] = [
  { id: "req", name: "POST /ask", start: 0, end: 2.05, depth: 0, detail: { user: "pupil-311", question: "Can I renew a book online?", status: 200 } },
  { id: "rewrite", name: "rewrite query (small model)", start: 0.02, end: 0.31, depth: 1, detail: { model: "small", input_tokens: 120, output_tokens: 18, cost_usd: 0.00004 } },
  { id: "search", name: "hybrid search", start: 0.31, end: 0.52, depth: 1, detail: { query: "renew book online rules", results: 5, top_doc: "Loans policy §4" } },
  { id: "rerank", name: "rerank", start: 0.52, end: 0.68, depth: 1, detail: { candidates: 20, kept: 5 } },
  { id: "llm", name: "LLM answer", start: 0.68, end: 2.0, depth: 1, detail: { model: "claude-sonnet-5-5", input_tokens: 2100, output_tokens: 64, cost_usd: 0.0073, time_to_first_token_s: 0.41 } },
];
const TOTAL = 2.05;

export default function TracingDemo() {
  const [picked, setPicked] = React.useState("llm");
  const s = SPANS.find((x) => x.id === picked) ?? SPANS[0];

  return (
    <DemoFrame title="The diary of one request" hint="Click a span to see what was recorded." onReset={() => setPicked("llm")}>
      <ul className="space-y-1">
        {SPANS.map((sp) => (
          <li key={sp.id}>
            <button
              type="button"
              onClick={() => setPicked(sp.id)}
              aria-pressed={picked === sp.id}
              className="grid w-full grid-cols-[11rem_1fr_3rem] items-center gap-2 rounded-md px-1 py-0.5 text-left text-[11px]"
              style={{ backgroundColor: picked === sp.id ? "color-mix(in srgb, var(--area-evals) 18%, transparent)" : undefined }}
            >
              <span className="truncate" style={{ paddingLeft: sp.depth * 12 }}>
                {sp.depth ? "└ " : ""}
                {sp.name}
              </span>
              <span className="relative h-2 rounded-full bg-surface">
                <span
                  className="absolute h-full rounded-full"
                  style={{ left: `${(sp.start / TOTAL) * 100}%`, width: `${((sp.end - sp.start) / TOTAL) * 100}%`, backgroundColor: sp.depth ? "var(--area-evals)" : "var(--muted)" }}
                />
              </span>
              <span className="text-right font-mono text-muted">{(sp.end - sp.start).toFixed(2)}s</span>
            </button>
          </li>
        ))}
      </ul>
      <Panel className="mt-3" title={`span: ${s.name}`}>
        <dl className="grid grid-cols-[9rem_1fr] gap-x-2 font-mono text-[11px]" aria-live="polite">
          {Object.entries(s.detail).map(([k, v]) => (
            <React.Fragment key={k}>
              <dt className="text-muted">{k}</dt>
              <dd>{String(v)}</dd>
            </React.Fragment>
          ))}
        </dl>
      </Panel>
      <p className="mt-2 text-xs text-muted">Most of the 2 seconds is the LLM call. When an answer is wrong, the search span shows which documents it was given.</p>
    </DemoFrame>
  );
}

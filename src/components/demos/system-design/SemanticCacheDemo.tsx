"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";

const CACHED = "What is today's soup?";
/** Similarity to the cached question (as an embedding model might score it) and whether the cached answer is correct. */
const INCOMING = [
  { q: "What's the soup of the day?", sim: 0.97, same: true },
  { q: "Which soup do you have today?", sim: 0.95, same: true },
  { q: "today soup??", sim: 0.94, same: true },
  { q: "What was yesterday's soup?", sim: 0.93, same: false },
  { q: "Is today's soup vegan?", sim: 0.9, same: false },
  { q: "What is today's dessert?", sim: 0.86, same: false },
  { q: "Do you have soup without onions today?", sim: 0.88, same: false },
  { q: "How much is the soup?", sim: 0.82, same: false },
];

export default function SemanticCacheDemo() {
  const [threshold, setThreshold] = React.useState(0.9);

  const rows = INCOMING.map((r) => {
    const hit = r.sim >= threshold;
    const outcome = hit ? (r.same ? "good-hit" : "wrong-hit") : r.same ? "missed-saving" : "correct-miss";
    return { ...r, hit, outcome };
  });
  const goodHits = rows.filter((r) => r.outcome === "good-hit").length;
  const wrong = rows.filter((r) => r.outcome === "wrong-hit").length;

  return (
    <DemoFrame title="A pot of soup already on the stove" hint={`Cached question: "${CACHED}". Tune the similarity threshold.`} onReset={() => setThreshold(0.9)}>
      <label className="text-xs text-muted">
        threshold: <span className="font-mono text-text">{threshold.toFixed(2)}</span>
        <input type="range" min={0.8} max={0.99} step={0.01} value={threshold} onChange={(e) => setThreshold(+e.target.value)} className="mt-1 block w-56 accent-[var(--accent)]" />
      </label>
      <ul className="mt-3 space-y-0.5 text-[11px]">
        {rows.map((r) => (
          <li
            key={r.q}
            className="grid grid-cols-[1fr_3rem_6.5rem] items-center gap-2 rounded px-2 py-0.5"
            style={{
              backgroundColor:
                r.outcome === "wrong-hit"
                  ? "color-mix(in srgb, var(--bad) 18%, transparent)"
                  : r.outcome === "good-hit"
                    ? "color-mix(in srgb, var(--good) 14%, transparent)"
                    : "var(--surface)",
            }}
          >
            <span className="truncate">{r.q}</span>
            <span className="font-mono text-muted">{r.sim.toFixed(2)}</span>
            <span className="text-right">
              {r.outcome === "good-hit" && "✓ cached answer"}
              {r.outcome === "wrong-hit" && "✗ wrong answer!"}
              {r.outcome === "missed-saving" && "LLM (could reuse)"}
              {r.outcome === "correct-miss" && "LLM ✓"}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs" aria-live="polite">
        LLM calls saved: <strong style={{ color: "var(--good)" }}>{goodHits}</strong> · wrong answers served: <strong style={{ color: wrong ? "var(--bad)" : undefined }}>{wrong}</strong>
      </p>
      <p className="mt-1 text-[11px] text-muted">
        {wrong
          ? "Too low: questions that only look alike get the soup answer."
          : goodHits < 3
            ? "Safe, but too strict: paraphrases miss the cache."
            : "A good setting for this data. Tune it on real, labelled question pairs."}
      </p>
    </DemoFrame>
  );
}

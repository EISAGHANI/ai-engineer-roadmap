"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";

const WORDS = ["The", "dog", "chased", "its", "ball", "because", "it", "was", "red"];

/** Hand-made attention weights: which words each word "looks at" most. */
const LINKS: Record<number, Array<[number, number]>> = {
  0: [[1, 0.9]],
  1: [[2, 0.5], [0, 0.3]],
  2: [[1, 0.6], [4, 0.6]],
  3: [[1, 0.95]],
  4: [[2, 0.5], [3, 0.4], [8, 0.3]],
  5: [[2, 0.4], [7, 0.5]],
  6: [[4, 0.9]],
  7: [[6, 0.5], [8, 0.6]],
  8: [[4, 0.6], [6, 0.4]],
};

export default function AttentionDemo() {
  const [active, setActive] = React.useState<number | null>(3);
  const W = 640;
  const H = 150;
  const xs = WORDS.map((_, i) => 40 + (i * (W - 80)) / (WORDS.length - 1));
  const links = active === null ? [] : LINKS[active] ?? [];

  return (
    <DemoFrame
      title="Who is each word looking at?"
      hint="Hover or focus a word. Lines show which other words give it its meaning."
      onReset={() => setActive(3)}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Attention links between words">
        {links.map(([j, w]) => {
          const x1 = xs[active ?? 0];
          const x2 = xs[j];
          const mid = (x1 + x2) / 2;
          return (
            <path
              key={j}
              d={`M ${x1} 100 Q ${mid} ${100 - Math.abs(x2 - x1) * 0.45} ${x2} 100`}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={1 + w * 5}
              strokeOpacity={0.35 + w * 0.6}
              strokeLinecap="round"
              style={{ transition: "stroke-width 200ms, stroke-opacity 200ms" }}
            />
          );
        })}
        {WORDS.map((w, i) => {
          const isActive = i === active;
          const weight = links.find(([j]) => j === i)?.[1] ?? 0;
          return (
            <g key={w + i} transform={`translate(${xs[i]} 100)`}>
              <circle r={isActive ? 20 : 16 + weight * 6} fill={isActive ? "var(--accent)" : "var(--surface)"} stroke="var(--border)" />
              <text y={5} textAnchor="middle" fontSize="12" fill={isActive ? "var(--accent-ink)" : "var(--text)"} fontWeight={isActive ? 700 : 500}>
                {w}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Pick a word">
        {WORDS.map((w, i) => (
          <button
            key={w + i}
            type="button"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-pressed={active === i}
            className="rounded-full border border-border px-3 py-1 text-sm"
            style={active === i ? { background: "var(--accent)", color: "var(--accent-ink)", borderColor: "var(--accent)" } : undefined}
          >
            {w}
          </button>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted" aria-live="polite">
        {active === 3 && "“its” looks almost only at “dog”: that is how the model knows whose ball it is."}
        {active === 6 && "“it” looks at “ball”, not at “dog”: attention resolves what a pronoun means."}
        {active !== null && active !== 3 && active !== 6 && `“${WORDS[active]}” mostly attends to: ${links.map(([j]) => WORDS[j]).join(", ")}.`}
      </p>
    </DemoFrame>
  );
}

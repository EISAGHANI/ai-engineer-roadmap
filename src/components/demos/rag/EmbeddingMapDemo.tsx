"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";

/** Hand-placed 2D "embeddings" (real ones have hundreds of numbers). */
const WORDS = [
  { w: "dog", x: 18, y: 26, g: "pets" },
  { w: "puppy", x: 24, y: 18, g: "pets" },
  { w: "cat", x: 32, y: 34, g: "pets" },
  { w: "kitten", x: 38, y: 24, g: "pets" },
  { w: "car", x: 74, y: 22, g: "vehicles" },
  { w: "truck", x: 84, y: 32, g: "vehicles" },
  { w: "bus", x: 70, y: 34, g: "vehicles" },
  { w: "bicycle", x: 64, y: 16, g: "vehicles" },
  { w: "apple", x: 24, y: 74, g: "food" },
  { w: "banana", x: 32, y: 84, g: "food" },
  { w: "pizza", x: 46, y: 78, g: "food" },
  { w: "bread", x: 40, y: 68, g: "food" },
] as const;

const COLORS = { pets: "var(--area-rag)", vehicles: "var(--area-system-design)", food: "var(--area-llm)" } as const;

export default function EmbeddingMapDemo() {
  const [picked, setPicked] = React.useState<string>("puppy");
  const p = WORDS.find((w) => w.w === picked) ?? WORDS[1];
  const nearest = WORDS.filter((w) => w.w !== p.w)
    .map((w) => ({ ...w, d: Math.hypot(w.x - p.x, w.y - p.y) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 3);
  const X = (v: number) => v * 3;
  const Y = (v: number) => v * 1.9;

  return (
    <DemoFrame title="Words on a map of meaning" hint="Pick a word. Its nearest neighbours light up." onReset={() => setPicked("puppy")}>
      <svg viewBox="0 0 300 190" className="w-full rounded-lg bg-surface" role="img" aria-label={`Map of words; nearest to ${p.w}: ${nearest.map((n) => n.w).join(", ")}`}>
        {nearest.map((n) => (
          <line key={n.w} x1={X(p.x)} y1={Y(p.y)} x2={X(n.x)} y2={Y(n.y)} stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 3" />
        ))}
        {WORDS.map((w) => {
          const isP = w.w === p.w;
          const isN = nearest.some((n) => n.w === w.w);
          return (
            <g key={w.w} onClick={() => setPicked(w.w)} style={{ cursor: "pointer" }}>
              <circle cx={X(w.x)} cy={Y(w.y)} r={isP ? 7 : 5} fill={COLORS[w.g]} opacity={isP || isN ? 1 : 0.45} stroke={isP ? "var(--text)" : "none"} strokeWidth="1.5" />
              <text x={X(w.x) + 9} y={Y(w.y) + 4} fontSize="10" fill="var(--text)" opacity={isP || isN ? 1 : 0.6} fontWeight={isP ? 700 : 400}>
                {w.w}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="mt-2 flex flex-wrap gap-1" role="radiogroup" aria-label="Pick a word">
        {WORDS.map((w) => (
          <button
            key={w.w}
            type="button"
            role="radio"
            aria-checked={picked === w.w}
            onClick={() => setPicked(w.w)}
            className="rounded-full border px-2 py-0.5 text-xs"
            style={picked === w.w ? { background: "var(--accent)", color: "var(--accent-ink)", borderColor: "var(--accent)" } : { borderColor: "var(--border)" }}
          >
            {w.w}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted" aria-live="polite">
        <span className="font-mono text-text">{p.w} = [{(p.x / 100).toFixed(2)}, {(p.y / 100).toFixed(2)}]</span> · nearest:{" "}
        {nearest.map((n) => n.w).join(", ")}. Real embeddings use hundreds of numbers instead of two, but the idea is the same.
      </p>
    </DemoFrame>
  );
}

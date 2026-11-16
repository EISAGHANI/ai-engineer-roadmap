"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

const SECTIONS = [
  {
    heading: "Elephants",
    text: "Elephants are the largest land animals. They can live 60 to 70 years in the wild. Herds are led by the oldest female.",
  },
  {
    heading: "Pandas",
    text: "Giant pandas live in the mountains of China. They eat bamboo for up to 14 hours a day.",
  },
];
const ANSWER = "60 to 70 years";

type Strategy = "fixed" | "sentence" | "heading";

function chunk(strategy: Strategy): string[] {
  if (strategy === "heading") return SECTIONS.map((s) => `${s.heading}: ${s.text}`);
  if (strategy === "sentence") return SECTIONS.flatMap((s) => s.text.split(/(?<=\.)\s+/));
  const flat = SECTIONS.map((s) => `${s.heading}: ${s.text}`).join(" ");
  const out: string[] = [];
  for (let i = 0; i < flat.length; i += 70) out.push(flat.slice(i, i + 70));
  return out;
}

const NOTES: Record<Strategy, string> = {
  fixed: "Every 70 characters: words and sentences get cut in half, and the answer is split across two chunks.",
  sentence: "One sentence per chunk: clean, but 'They can live…' no longer says who 'they' are.",
  heading: "One section per chunk: the answer sits next to the word 'Elephants', so the question finds it easily.",
};

export default function ChunkingDemo() {
  const [strategy, setStrategy] = React.useState<Strategy>("fixed");
  const chunks = chunk(strategy);
  const full = chunks.findIndex((c) => c.includes(ANSWER));
  const partial = full === -1 ? chunks.map((c, i) => (c.includes("60") || c.includes("70 years") ? i : -1)).filter((i) => i >= 0) : [];

  return (
    <DemoFrame title="Cut the page into cards" hint='Question: "How long do elephants live?"' onReset={() => setStrategy("fixed")}>
      <ChoiceChips
        label="Chunking strategy"
        options={[
          { id: "fixed", label: "Fixed size" },
          { id: "sentence", label: "By sentence" },
          { id: "heading", label: "By heading" },
        ]}
        value={strategy}
        onChange={setStrategy}
      />
      <ol className="mt-3 space-y-1">
        {chunks.map((c, i) => {
          const hit = i === full;
          const half = partial.includes(i);
          return (
            <li
              key={`${strategy}-${i}`}
              className="flex gap-2 rounded-md px-2 py-1 font-mono text-[11px]"
              style={{
                backgroundColor: hit
                  ? "color-mix(in srgb, var(--good) 22%, transparent)"
                  : half
                    ? "color-mix(in srgb, var(--warn) 22%, transparent)"
                    : "var(--surface)",
              }}
            >
              <span className="text-muted">{i + 1}</span>
              <span>{c}</span>
            </li>
          );
        })}
      </ol>
      <p className="mt-2 text-xs text-muted" aria-live="polite">
        {NOTES[strategy]}
      </p>
    </DemoFrame>
  );
}

"use client";

import * as React from "react";
import { motion } from "motion/react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, ScoreBar } from "../ui";
import { useMotionSafe } from "@/lib/motion";

const CANDIDATES = [
  { id: 1, text: "Elephant herds are led by the oldest female.", fast: 0.82, rerank: 0.31 },
  { id: 2, text: "Elephants can live 60 to 70 years in the wild.", fast: 0.8, rerank: 0.97 },
  { id: 3, text: "The history of the ivory trade.", fast: 0.78, rerank: 0.12 },
  { id: 4, text: "Zoo elephants often have shorter lives than wild ones.", fast: 0.74, rerank: 0.88 },
  { id: 5, text: "How long is an elephant pregnancy? About 22 months.", fast: 0.73, rerank: 0.41 },
  { id: 6, text: "Life expectancy of African and Asian elephants.", fast: 0.7, rerank: 0.92 },
];

export default function RerankDemo() {
  const motionSafe = useMotionSafe();
  const [reranked, setReranked] = React.useState(false);
  const key = reranked ? "rerank" : "fast";
  const list = [...CANDIDATES].sort((a, b) => b[key] - a[key]);

  return (
    <DemoFrame title="A careful second look" hint='Question: "How long do elephants live?" Only the top 3 go to the LLM.' onReset={() => setReranked(false)}>
      <ActionButton onClick={() => setReranked((r) => !r)}>{reranked ? "Show fast search order" : "Rerank with a cross-encoder"}</ActionButton>
      <ol className="mt-3 space-y-1.5">
        {list.map((c, i) => (
          <motion.li
            key={c.id}
            layout={motionSafe}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-[1.5rem_1fr_4rem_2.5rem] items-center gap-2 rounded-md px-2 py-1 text-xs"
            style={{ backgroundColor: i < 3 ? "color-mix(in srgb, var(--area-rag) 18%, transparent)" : "var(--surface)" }}
          >
            <span className="font-mono text-muted">{i + 1}</span>
            <span>{c.text}</span>
            <ScoreBar value={c[key]} color={reranked ? "var(--good)" : "var(--muted)"} />
            <span className="text-right font-mono">{c[key].toFixed(2)}</span>
          </motion.li>
        ))}
      </ol>
      <p className="mt-2 text-xs text-muted" aria-live="polite">
        {reranked
          ? "Reading each passage with the question, the reranker pushes the three lifespan passages to the top."
          : "The fast search ranks by rough similarity: a herd fact and the ivory trade sit in the top 3, the real answers lower down."}
      </p>
    </DemoFrame>
  );
}

"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

const CHUNKS = {
  a: { text: "Elephants can live 60 to 70 years in the wild.", useful: true },
  b: { text: "The history of the ivory trade.", useful: false },
  c: { text: "Zoo elephants often live shorter lives.", useful: true },
  d: { text: "How herds choose a leader.", useful: false },
  e: { text: "Elephants in circus history.", useful: false },
} as const;
type ChunkId = keyof typeof CHUNKS;

const ORDERS: Record<string, ChunkId[]> = {
  retrieved: ["b", "a", "d", "e", "c"],
  reranked: ["a", "c", "b", "d", "e"],
  top2: ["a", "c"],
};

function precision(order: ChunkId[]) {
  const useful = order.map((id) => CHUNKS[id].useful);
  const precisions = useful.map((u, i) => (u ? useful.slice(0, i + 1).filter(Boolean).length / (i + 1) : null)).filter((x): x is number => x !== null);
  return precisions.length ? precisions.reduce((s, p) => s + p, 0) / precisions.length : 0;
}

type Mode = "retrieved" | "reranked" | "top2";

export default function ContextPrecisionDemo() {
  const [mode, setMode] = React.useState<Mode>("retrieved");
  const order = ORDERS[mode];
  const score = precision(order);
  const usefulCount = order.filter((id) => CHUNKS[id].useful).length;

  return (
    <DemoFrame title="How much of the pile was useful?" hint='Question: "How long do elephants live?"' onReset={() => setMode("retrieved")}>
      <ChoiceChips
        label="Context sent"
        options={[
          { id: "retrieved", label: "As retrieved (5)" },
          { id: "reranked", label: "Reranked (5)" },
          { id: "top2", label: "Reranked, top 2 only" },
        ]}
        value={mode}
        onChange={setMode}
      />
      <ol className="mt-3 space-y-1">
        {order.map((id, i) => (
          <li
            key={id}
            className="flex gap-2 rounded-md px-2 py-1 text-xs"
            style={{ backgroundColor: CHUNKS[id].useful ? "color-mix(in srgb, var(--good) 18%, transparent)" : "var(--surface)" }}
          >
            <span className="font-mono text-muted">{i + 1}</span>
            <span className="flex-1">{CHUNKS[id].text}</span>
            <span>{CHUNKS[id].useful ? "useful" : "noise"}</span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-sm" aria-live="polite">
        Context precision:{" "}
        <span className="font-mono text-lg" style={{ color: "var(--accent)" }}>
          {score.toFixed(2)}
        </span>{" "}
        <span className="text-xs text-muted">
          · {usefulCount} useful of {order.length} sent{mode === "retrieved" ? ", and the useful ones sit low in the pile" : ""}
        </span>
      </p>
    </DemoFrame>
  );
}

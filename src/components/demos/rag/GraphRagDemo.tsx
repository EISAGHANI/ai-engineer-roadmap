"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, ChoiceChips, Panel } from "../ui";
import { useMotionSafe } from "@/lib/motion";

const NODES = {
  ana: { label: "Ana", x: 40, y: 85, kind: "person" },
  acme: { label: "Acme", x: 130, y: 85, kind: "company" },
  ebikes: { label: "E-bikes", x: 130, y: 20, kind: "product" },
  berlin: { label: "Berlin", x: 130, y: 150, kind: "place" },
  beta: { label: "Beta", x: 225, y: 85, kind: "company" },
  lamps: { label: "Solar lamps", x: 225, y: 20, kind: "product" },
  bob: { label: "Bob", x: 225, y: 150, kind: "person" },
} as const;
type NodeId = keyof typeof NODES;

const EDGES: Array<{ from: NodeId; to: NodeId; label: string }> = [
  { from: "ana", to: "acme", label: "works at" },
  { from: "acme", to: "ebikes", label: "makes" },
  { from: "acme", to: "berlin", label: "based in" },
  { from: "acme", to: "beta", label: "bought" },
  { from: "beta", to: "lamps", label: "makes" },
  { from: "bob", to: "beta", label: "works at" },
];

/** The order in which the graph walk follows edges (indexes into EDGES). */
const WALK = [0, 1, 3, 4];
const COLORS = { person: "var(--area-agents)", company: "var(--area-rag)", product: "var(--area-llm)", place: "var(--muted)" } as const;

type Mode = "vector" | "graph";

export default function GraphRagDemo() {
  const motionSafe = useMotionSafe();
  const [mode, setMode] = React.useState<Mode>("vector");
  const [step, setStep] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(() => {
    if (!playing) return;
    if (step >= WALK.length) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), 650);
    return () => window.clearTimeout(t);
  }, [playing, step]);

  const walked = new Set(WALK.slice(0, step));
  const done = mode === "graph" && step >= WALK.length;

  function start() {
    setStep(0);
    if (motionSafe) setPlaying(true);
  }

  return (
    <DemoFrame
      title="Follow the strings between cards"
      hint='Question: "What does the company Ana works for make now?"'
      onReset={() => {
        setMode("vector");
        setStep(0);
        setPlaying(false);
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <ChoiceChips
          label="Retrieval"
          options={[
            { id: "vector", label: "Vector search only" },
            { id: "graph", label: "Graph walk" },
          ]}
          value={mode}
          onChange={(m) => {
            setMode(m);
            setStep(0);
            setPlaying(false);
          }}
        />
        {mode === "graph" && (
          <>
            <ActionButton onClick={start}>Walk the graph</ActionButton>
            {!motionSafe && (
              <ActionButton variant="secondary" onClick={() => setStep((s) => Math.min(WALK.length, s + 1))}>
                Next hop
              </ActionButton>
            )}
          </>
        )}
      </div>
      <svg viewBox="0 0 270 170" className="mt-2 w-full rounded-lg bg-surface" role="img" aria-label="Knowledge graph of Ana, Acme and Beta">
        {EDGES.map((e, i) => {
          const a = NODES[e.from];
          const b = NODES[e.to];
          const on = mode === "graph" && walked.has(i);
          return (
            <g key={i}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={on ? "var(--accent)" : "var(--border)"} strokeWidth={on ? 3 : 1.25} />
              <text x={(a.x + b.x) / 2 + 3} y={(a.y + b.y) / 2 - 3} fontSize="8" fill="var(--muted)">
                {e.label}
              </text>
            </g>
          );
        })}
        {(Object.keys(NODES) as NodeId[]).map((id) => {
          const n = NODES[id];
          const vectorHit = mode === "vector" && (id === "ana" || id === "acme" || id === "ebikes");
          return (
            <g key={id}>
              <circle cx={n.x} cy={n.y} r="14" fill={COLORS[n.kind]} opacity={vectorHit || mode === "graph" ? 1 : 0.4} />
              <text x={n.x} y={n.y + 26} textAnchor="middle" fontSize="9" fill="var(--text)">
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>
      <Panel className="mt-2" title="answer" tint={mode === "vector" ? "var(--warn)" : done ? "var(--good)" : undefined}>
        <p className="text-xs" aria-live="polite">
          {mode === "vector"
            ? "Acme makes e-bikes. (The closest chunks mention Ana and Acme, but nothing links Acme to Beta, so the solar lamps are missed.)"
            : done
              ? "E-bikes, and since Acme bought Beta, solar lamps too. Found by following Ana → Acme → Beta → solar lamps."
              : `Hop ${step} of ${WALK.length}…`}
        </p>
      </Panel>
    </DemoFrame>
  );
}

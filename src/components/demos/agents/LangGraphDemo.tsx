"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { Panel, StepControls, useStepper } from "../ui";

type Node = "write" | "review" | "send" | "end";
const FRAMES: Array<{ node: Node; state: Record<string, string | number | boolean> }> = [
  { node: "write", state: { request: "Sam's book is overdue", draft: "Sam, your book is overdue. Return it.", attempts: 1, approved: false } },
  { node: "review", state: { request: "Sam's book is overdue", draft: "Sam, your book is overdue. Return it.", attempts: 1, approved: false, feedback: "Too harsh; add the due date." } },
  { node: "write", state: { request: "Sam's book is overdue", draft: "Hi Sam, a friendly reminder: 'Dune' was due on 3 May.", attempts: 2, approved: false } },
  { node: "review", state: { request: "Sam's book is overdue", draft: "Hi Sam, a friendly reminder: 'Dune' was due on 3 May.", attempts: 2, approved: true } },
  { node: "send", state: { request: "Sam's book is overdue", draft: "Hi Sam, a friendly reminder: 'Dune' was due on 3 May.", attempts: 2, approved: true, status: "sent" } },
  { node: "end", state: { request: "Sam's book is overdue", draft: "Hi Sam, a friendly reminder: 'Dune' was due on 3 May.", attempts: 2, approved: true, status: "sent" } },
];

const POS: Record<Exclude<Node, "end">, { x: number; label: string }> = {
  write: { x: 20, label: "write" },
  review: { x: 115, label: "review" },
  send: { x: 210, label: "send" },
};

export default function LangGraphDemo() {
  const { shown, play, next, reset, done } = useStepper(FRAMES.length, 900);
  const frame = shown > 0 ? FRAMES[shown - 1] : null;
  const loopBack = frame?.node === "review" && frame.state.approved === false;

  return (
    <DemoFrame title="A map with arrows and a shared clipboard" hint="write → review → (approved? send : back to write)" onReset={reset}>
      <StepControls onPlay={play} onNext={next} done={done} />
      <svg viewBox="0 0 300 92" className="mt-2 w-full" role="img" aria-label={`Graph run, current node ${frame?.node ?? "none"}`}>
        <defs>
          <marker id="lg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M0 0L10 5L0 10z" fill="var(--muted)" />
          </marker>
        </defs>
        <line x1="90" y1="50" x2="113" y2="50" stroke="var(--muted)" markerEnd="url(#lg-arrow)" />
        <line x1="185" y1="50" x2="208" y2="50" stroke={frame?.node === "send" ? "var(--good)" : "var(--muted)"} markerEnd="url(#lg-arrow)" />
        <path d="M150 33 C150 4, 55 4, 55 31" fill="none" stroke={loopBack ? "var(--warn)" : "var(--muted)"} strokeWidth={loopBack ? 2 : 1} strokeDasharray="4 3" markerEnd="url(#lg-arrow)" />
        <text x="102" y="12" textAnchor="middle" fontSize="9" fill="var(--muted)">
          not approved
        </text>
        <text x="197" y="44" textAnchor="middle" fontSize="9" fill="var(--muted)">
          ok
        </text>
        {(Object.keys(POS) as Array<keyof typeof POS>).map((id) => {
          const on = frame?.node === id;
          return (
            <g key={id}>
              <rect x={POS[id].x} y="34" width="70" height="32" rx="8" fill={on ? "var(--area-agents)" : "var(--surface)"} stroke="var(--area-agents)" />
              <text x={POS[id].x + 35} y="54" textAnchor="middle" fontSize="11" fill={on ? "var(--accent-ink)" : "var(--text)"} fontWeight={on ? 700 : 400}>
                {POS[id].label}
              </text>
            </g>
          );
        })}
        <text x="290" y="54" textAnchor="end" fontSize="10" fill={frame?.node === "end" ? "var(--good)" : "var(--muted)"}>
          END
        </text>
      </svg>
      <Panel title="state (the clipboard every node reads and updates)">
        <pre className="font-mono text-[10px] leading-snug whitespace-pre-wrap" aria-live="polite">
          {frame ? JSON.stringify(frame.state, null, 1) : "{ }"}
        </pre>
      </Panel>
    </DemoFrame>
  );
}

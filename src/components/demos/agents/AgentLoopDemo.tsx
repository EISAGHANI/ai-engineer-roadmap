"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { StepControls, useStepper } from "../ui";

type Phase = "think" | "act" | "observe" | "answer";
const STEPS: Array<{ phase: Phase; text: string; ok?: boolean }> = [
  { phase: "think", text: "Bread is first on the list." },
  { phase: "act", text: "bakery.buy('bread')" },
  { phase: "observe", text: "Bread ✓ · 2.50 €", ok: true },
  { phase: "think", text: "Next: eggs from the market." },
  { phase: "act", text: "market.buy('eggs')" },
  { phase: "observe", text: "Sold out ✗", ok: false },
  { phase: "think", text: "Try the supermarket for eggs instead." },
  { phase: "act", text: "supermarket.buy('eggs')" },
  { phase: "observe", text: "Eggs ✓ · 3.10 €", ok: true },
  { phase: "think", text: "Last item: milk, same shop." },
  { phase: "act", text: "supermarket.buy('milk')" },
  { phase: "observe", text: "Milk ✓ · 1.20 €", ok: true },
  { phase: "answer", text: "All done: bread, eggs and milk for 6.80 €." },
];

const NODES: Array<{ id: Exclude<Phase, "answer">; label: string; x: number; y: number }> = [
  { id: "think", label: "Think", x: 70, y: 28 },
  { id: "act", label: "Act", x: 120, y: 110 },
  { id: "observe", label: "Observe", x: 20, y: 110 },
];

export default function AgentLoopDemo() {
  const { shown, play, next, reset, done } = useStepper(STEPS.length, 550);
  const current = shown > 0 ? STEPS[shown - 1] : null;
  const lap = STEPS.slice(0, shown).filter((s) => s.phase === "think").length;

  return (
    <DemoFrame title="Think → act → observe, until done" hint="Task: get bread, eggs and milk." onReset={reset}>
      <StepControls onPlay={play} onNext={next} done={done} />
      <div className="mt-3 flex gap-3">
        <svg viewBox="0 0 150 140" className="w-36 shrink-0" role="img" aria-label={`Agent loop, lap ${lap}`}>
          <defs>
            <marker id="loop-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="var(--muted)" />
            </marker>
          </defs>
          <path d="M94 44 L120 93" stroke="var(--muted)" fill="none" markerEnd="url(#loop-arrow)" />
          <path d="M108 110 L53 110" stroke="var(--muted)" fill="none" markerEnd="url(#loop-arrow)" />
          <path d="M40 93 L66 44" stroke="var(--muted)" fill="none" markerEnd="url(#loop-arrow)" />
          {NODES.map((n) => {
            const on = current?.phase === n.id;
            return (
              <g key={n.id}>
                <circle cx={n.x + 10} cy={n.y} r="20" fill={on ? "var(--area-agents)" : "var(--surface)"} stroke="var(--area-agents)" strokeWidth="1.5" />
                <text x={n.x + 10} y={n.y + 4} textAnchor="middle" fontSize="10" fill={on ? "var(--accent-ink)" : "var(--text)"} fontWeight={on ? 700 : 400}>
                  {n.label}
                </text>
              </g>
            );
          })}
          <text x="80" y="76" textAnchor="middle" fontSize="10" fill="var(--muted)">
            lap {lap}
          </text>
        </svg>
        <ol className="max-h-56 flex-1 space-y-0.5 overflow-auto text-xs" aria-live="polite">
          {STEPS.slice(0, shown).map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="w-14 shrink-0 font-mono text-[10px] text-muted uppercase">{s.phase}</span>
              <span
                className={s.phase === "act" ? "font-mono" : undefined}
                style={{ color: s.ok === false ? "var(--bad)" : s.phase === "answer" ? "var(--good)" : undefined }}
              >
                {s.text}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </DemoFrame>
  );
}

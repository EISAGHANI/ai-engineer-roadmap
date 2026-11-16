"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

type Strategy = "everything" | "last-n" | "summary";
const WINDOW = 200; // thousand tokens
const SYSTEM = 4;
const PER_TURN = 6; // thousand tokens per exchange (incl. tool output)
const RETRIEVED = 12;

export default function ContextWindowDemo() {
  const [turns, setTurns] = React.useState(10);
  const [strategy, setStrategy] = React.useState<Strategy>("everything");

  const allHistory = turns * PER_TURN;
  let history = allHistory;
  let summary = 0;
  if (strategy === "last-n") history = Math.min(allHistory, 6 * PER_TURN);
  if (strategy === "summary") {
    history = Math.min(allHistory, 3 * PER_TURN);
    summary = turns > 3 ? 2 : 0;
  }
  const total = SYSTEM + summary + history + RETRIEVED;
  const overflow = total > WINDOW;
  // The user said "I'm allergic to nuts" in turn 2
  const allergyKept = strategy === "everything" ? !overflow : strategy === "summary" ? true : turns <= 6;
  const costCents = Math.min(total, WINDOW) * 0.3;

  const parts = [
    { label: "system", k: SYSTEM, color: "var(--area-llm)" },
    { label: "summary", k: summary, color: "var(--area-evals)" },
    { label: "history", k: Math.min(history, WINDOW - SYSTEM - summary - RETRIEVED), color: "var(--area-system-design)" },
    { label: "retrieved", k: RETRIEVED, color: "var(--area-rag)" },
  ].filter((p) => p.k > 0);

  return (
    <DemoFrame
      title="Only so much room on the counter"
      hint="A long chat with an assistant that plans meals. In turn 2 the user said: 'I'm allergic to nuts'."
      onReset={() => {
        setTurns(10);
        setStrategy("everything");
      }}
    >
      <div className="flex flex-wrap items-end gap-4">
        <label className="text-xs text-muted">
          conversation length: <span className="font-mono text-text">{turns} turns</span>
          <input type="range" min={2} max={40} value={turns} onChange={(e) => setTurns(+e.target.value)} className="mt-1 block w-44 accent-[var(--accent)]" />
        </label>
        <ChoiceChips
          label="Strategy"
          options={[
            { id: "everything", label: "Send everything" },
            { id: "last-n", label: "Last 6 turns" },
            { id: "summary", label: "Summary + last 3 + retrieval" },
          ]}
          value={strategy}
          onChange={setStrategy}
        />
      </div>
      <div className="relative mt-3 flex h-7 w-full overflow-hidden rounded-md bg-surface" role="img" aria-label={`${total}k of ${WINDOW}k tokens`}>
        {parts.map((p) => (
          <span key={p.label} className="h-full transition-all" title={`${p.label}: ${p.k}k`} style={{ width: `${(p.k / WINDOW) * 100}%`, backgroundColor: p.color }} />
        ))}
      </div>
      <ul className="mt-1 flex flex-wrap gap-x-3 text-[10px] text-muted">
        {parts.map((p) => (
          <li key={p.label}>
            <span style={{ color: p.color }}>■</span> {p.label} {p.k}k
          </li>
        ))}
      </ul>
      <ul className="mt-3 space-y-1 text-xs" aria-live="polite">
        <li>
          Tokens needed: <span className="font-mono">{total}k / {WINDOW}k</span>{" "}
          {overflow && <strong style={{ color: "var(--bad)" }}>→ too long, the request fails or gets cut</strong>}
        </li>
        <li>
          Cost per message: <span className="font-mono">≈ {costCents.toFixed(1)}¢</span>
        </li>
        <li style={{ color: allergyKept ? "var(--good)" : "var(--bad)" }}>
          {allergyKept ? "✓ The model still knows about the nut allergy." : "✗ The nut allergy fell out of the context. Next recipe might contain nuts!"}
        </li>
      </ul>
      {strategy === "summary" && <p className="mt-1 text-[11px] text-muted">Pin critical facts (like allergies) in the summary or a memory, so they survive trimming.</p>}
    </DemoFrame>
  );
}

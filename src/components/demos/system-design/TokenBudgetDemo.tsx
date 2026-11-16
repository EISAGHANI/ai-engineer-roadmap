"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";
import { Switch } from "@/components/ui/Switch";

const DAILY = 50_000;
const PER_RUN = 20_000;

type Event = { label: string; tokens: number; status: "ok" | "trimmed" | "blocked" | "stopped" };

export default function TokenBudgetDemo() {
  const [budgets, setBudgets] = React.useState(true);
  const [used, setUsed] = React.useState(0);
  const [events, setEvents] = React.useState<Event[]>([]);

  function add(e: Event, cost: number) {
    setUsed((u) => u + cost);
    setEvents((list) => [e, ...list].slice(0, 6));
  }

  function question() {
    if (budgets && used + 1_500 > DAILY) return add({ label: "Question", tokens: 0, status: "blocked" }, 0);
    add({ label: "Question", tokens: 1_500, status: "ok" }, 1_500);
  }
  function hugePaste() {
    const want = 180_000;
    if (!budgets) return add({ label: "Pasted a whole book", tokens: want, status: "ok" }, want);
    const allowed = Math.min(20_000, DAILY - used);
    if (allowed <= 0) return add({ label: "Pasted a whole book", tokens: 0, status: "blocked" }, 0);
    add({ label: "Pasted a whole book (trimmed to 20k)", tokens: allowed, status: "trimmed" }, allowed);
  }
  function agentLoop() {
    // An agent stuck retrying a failing tool, 3,000 tokens per step, 60 steps
    const want = 60 * 3_000;
    if (!budgets) return add({ label: "Agent stuck in a loop (60 steps)", tokens: want, status: "ok" }, want);
    const allowed = Math.min(PER_RUN, DAILY - used);
    add({ label: `Agent loop stopped after ${Math.floor(allowed / 3_000)} steps (run budget)`, tokens: allowed, status: "stopped" }, allowed);
  }

  const pct = Math.min(100, (used / DAILY) * 100);
  const cost = (used / 1e6) * 3;

  return (
    <DemoFrame
      title="A limit per table"
      hint="One user's day. Budgets: 50k tokens per day, 20k per request or agent run."
      onReset={() => {
        setUsed(0);
        setEvents([]);
        setBudgets(true);
      }}
    >
      <Switch checked={budgets} onChange={setBudgets} label="Enforce token budgets" />
      <div className="mt-3 flex flex-wrap gap-2">
        <ActionButton onClick={question}>Normal question</ActionButton>
        <ActionButton variant="secondary" onClick={hugePaste}>
          Paste a whole book
        </ActionButton>
        <ActionButton variant="secondary" onClick={agentLoop}>
          🔁 Agent gets stuck
        </ActionButton>
      </div>
      <div className="mt-3 h-4 w-full overflow-hidden rounded-full bg-surface" role="img" aria-label={`${used} tokens used today`}>
        <div className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: used > DAILY ? "var(--bad)" : "var(--area-system-design)" }} />
      </div>
      <p className="mt-1 font-mono text-[11px]" aria-live="polite">
        {used.toLocaleString("en-US")} tokens today {budgets ? `/ ${DAILY.toLocaleString("en-US")} budget` : "(no limit)"} · ≈ ${cost.toFixed(2)}
        {used > DAILY && <span style={{ color: "var(--bad)" }}> · {Math.round(used / DAILY)}× a normal day&apos;s budget</span>}
      </p>
      <ul className="mt-2 space-y-0.5 text-[11px]">
        {events.map((e, i) => (
          <li key={i} className="flex justify-between rounded px-2 py-0.5" style={{ backgroundColor: e.status === "ok" ? "var(--surface)" : "color-mix(in srgb, var(--warn) 16%, transparent)" }}>
            <span>{e.label}</span>
            <span className="font-mono">{e.status === "blocked" ? "429 · daily budget reached" : `+${e.tokens.toLocaleString("en-US")}`}</span>
          </li>
        ))}
      </ul>
    </DemoFrame>
  );
}

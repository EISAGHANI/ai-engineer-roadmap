"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, ScoreBar } from "../ui";

type Policy = "all-large" | "all-small" | "router";
/** Example traffic: hard = needs the strong model to answer well. Costs per request in cents (illustrative). */
const REQUESTS = [
  { text: "Translate 'thank you' to German", hard: false },
  { text: "Is this email spam? (yes/no)", hard: false },
  { text: "Extract the invoice total", hard: false },
  { text: "Compare our two pricing contracts and flag risks", hard: true },
  { text: "Summarize this paragraph", hard: false },
  { text: "Plan a migration from MySQL to Postgres", hard: true },
  { text: "What are your opening hours?", hard: false },
  { text: "Classify this ticket: billing / bug / other", hard: false },
  { text: "Debug this race condition in our job queue", hard: true },
  { text: "Rewrite this sentence more politely", hard: false },
];
const COST = { small: 0.1, large: 1.5 };

export default function ModelRoutingDemo() {
  const [policy, setPolicy] = React.useState<Policy>("router");

  const rows = REQUESTS.map((r) => {
    const model = policy === "all-large" ? "large" : policy === "all-small" ? "small" : r.hard ? "large" : "small";
    const good = model === "large" || !r.hard;
    return { ...r, model, good, cost: COST[model] };
  });
  const cost = rows.reduce((a, r) => a + r.cost, 0);
  const quality = rows.filter((r) => r.good).length;
  const maxCost = REQUESTS.length * COST.large;

  return (
    <DemoFrame title="Not every order needs the head chef" hint="Ten requests. Who should cook each one?" onReset={() => setPolicy("router")}>
      <ChoiceChips
        label="Policy"
        options={[
          { id: "all-large", label: "Everything → big model" },
          { id: "all-small", label: "Everything → small model" },
          { id: "router", label: "Router" },
        ]}
        value={policy}
        onChange={setPolicy}
      />
      <ul className="mt-3 space-y-0.5 text-[11px]">
        {rows.map((r) => (
          <li key={r.text} className="flex items-center gap-2 rounded px-2 py-0.5" style={{ backgroundColor: r.good ? "var(--surface)" : "color-mix(in srgb, var(--bad) 14%, transparent)" }}>
            <span className="flex-1 truncate">{r.text}</span>
            <span className="w-24 text-right font-mono" style={{ color: r.model === "large" ? "var(--area-system-design)" : "var(--muted)" }}>
              {r.model === "large" ? "👩‍🍳 big model" : "🧑‍🍳 small"}
            </span>
            <span className="w-4">{r.good ? "✓" : "✗"}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs" aria-live="polite">
        <div>
          <div className="flex justify-between">
            <span>cost per 10 requests</span>
            <span className="font-mono">{cost.toFixed(1)}¢</span>
          </div>
          <ScoreBar value={cost} max={maxCost} color="var(--warn)" />
        </div>
        <div>
          <div className="flex justify-between">
            <span>answered well</span>
            <span className="font-mono">
              {quality}/{REQUESTS.length}
            </span>
          </div>
          <ScoreBar value={quality} max={REQUESTS.length} color="var(--good)" />
        </div>
      </div>
      {policy === "router" && <p className="mt-2 text-[11px] text-muted">Same quality as all-big, for about a third of the cost.</p>}
    </DemoFrame>
  );
}

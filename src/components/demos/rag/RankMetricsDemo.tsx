"use client";

import * as React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";

/** gain: 3 = perfect answer, 2 = very useful, 1 = a little useful, 0 = not relevant */
const ITEMS = [
  { id: "d", title: "The ivory trade", gain: 0 },
  { id: "a", title: "Elephant lifespan facts", gain: 3 },
  { id: "c", title: "Elephant teeth and age", gain: 1 },
  { id: "e", title: "How herds choose a leader", gain: 0 },
  { id: "b", title: "Zoo vs wild elephant lives", gain: 2 },
];

function ndcg(gains: number[]) {
  const dcg = gains.reduce((s, g, i) => s + g / Math.log2(i + 2), 0);
  const ideal = [...gains].sort((a, b) => b - a).reduce((s, g, i) => s + g / Math.log2(i + 2), 0);
  return ideal ? dcg / ideal : 0;
}

export default function RankMetricsDemo() {
  const [order, setOrder] = React.useState(ITEMS);
  const firstRelevant = order.findIndex((x) => x.gain > 0);
  const rr = firstRelevant >= 0 ? 1 / (firstRelevant + 1) : 0;
  const score = ndcg(order.map((x) => x.gain));

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
  }

  return (
    <DemoFrame title="Points for putting it on top" hint="Reorder the pile and watch both scores change." onReset={() => setOrder(ITEMS)}>
      <div className="flex gap-2">
        <ActionButton onClick={() => setOrder([...ITEMS].sort((a, b) => b.gain - a.gain))}>Best order</ActionButton>
        <ActionButton variant="secondary" onClick={() => setOrder([...ITEMS].sort((a, b) => a.gain - b.gain))}>
          Worst order
        </ActionButton>
      </div>
      <ol className="mt-3 space-y-1">
        {order.map((x, i) => (
          <li key={x.id} className="flex items-center gap-2 rounded-md bg-surface px-2 py-1 text-xs">
            <span className="w-4 font-mono text-muted">{i + 1}</span>
            <span className="flex-1">{x.title}</span>
            <span className="font-mono" style={{ color: x.gain >= 2 ? "var(--good)" : x.gain === 1 ? "var(--warn)" : "var(--muted)" }}>
              {"★".repeat(x.gain) || "·"}
            </span>
            <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${x.title} up`} className="rounded p-0.5 hover:bg-surface-2 disabled:opacity-30">
              <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => move(i, 1)} disabled={i === order.length - 1} aria-label={`Move ${x.title} down`} className="rounded p-0.5 hover:bg-surface-2 disabled:opacity-30">
              <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-center" aria-live="polite">
        <div className="rounded-lg bg-surface p-2">
          <dt className="text-[11px] text-muted">Reciprocal rank (first useful at #{firstRelevant + 1})</dt>
          <dd className="font-mono text-lg">{rr.toFixed(2)}</dd>
        </div>
        <div className="rounded-lg bg-surface p-2">
          <dt className="text-[11px] text-muted">nDCG@5 (all stars, by position)</dt>
          <dd className="font-mono text-lg" style={{ color: "var(--accent)" }}>
            {score.toFixed(2)}
          </dd>
        </div>
      </dl>
    </DemoFrame>
  );
}

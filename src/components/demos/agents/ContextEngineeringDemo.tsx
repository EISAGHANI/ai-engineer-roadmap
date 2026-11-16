"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";

const BUDGET = 50_000;
const ITEMS = [
  { id: "system", label: "System instructions", tokens: 800, needed: true },
  { id: "allTools", label: "All 40 tool definitions", tokens: 12_000, needed: false },
  { id: "fewTools", label: "Only the 3 tools this step needs", tokens: 900, needed: true },
  { id: "history", label: "Full chat history (60 turns)", tokens: 25_000, needed: false },
  { id: "summary", label: "Summary of earlier turns", tokens: 600, needed: true },
  { id: "prefs", label: "User's saved preferences", tokens: 150, needed: true },
  { id: "manual", label: "The whole 300-page manual", tokens: 40_000, needed: false },
  { id: "sections", label: "4 retrieved manual sections", tokens: 2_400, needed: true },
] as const;
type ItemId = (typeof ITEMS)[number]["id"];
const NAIVE: ItemId[] = ["system", "allTools", "history", "manual"];

export default function ContextEngineeringDemo() {
  const [picked, setPicked] = React.useState<Set<ItemId>>(new Set(NAIVE));
  const chosen = ITEMS.filter((i) => picked.has(i.id));
  const total = chosen.reduce((a, i) => a + i.tokens, 0);
  const noise = chosen.filter((i) => !i.needed).reduce((a, i) => a + i.tokens, 0);
  const missing = ITEMS.filter((i) => i.needed && !picked.has(i.id) && !(i.id === "fewTools" && picked.has("allTools")) && !(i.id === "sections" && picked.has("manual")) && !(i.id === "summary" && picked.has("history")));

  let verdict: { text: string; color: string };
  if (total > BUDGET) verdict = { text: `Over budget: ${total.toLocaleString("en-US")} tokens don't fit in ${BUDGET.toLocaleString("en-US")}.`, color: "var(--bad)" };
  else if (missing.length) verdict = { text: `Missing: ${missing.map((m) => m.label.toLowerCase()).join(", ")}. The answer will be guesswork.`, color: "var(--bad)" };
  else if (noise > 10_000) verdict = { text: `Fits, but ${Math.round((noise / total) * 100)}% is noise: slower, pricier, and details get lost.`, color: "var(--warn)" };
  else verdict = { text: "Lean and complete: everything needed, almost nothing else.", color: "var(--good)" };

  function toggle(id: ItemId) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <DemoFrame title="Pack the backpack for this step" hint="Choose what goes into the context. Start from the 'just add everything' default." onReset={() => setPicked(new Set(NAIVE))}>
      <ul className="grid gap-1 sm:grid-cols-2">
        {ITEMS.map((i) => (
          <li key={i.id}>
            <label className="flex cursor-pointer items-center gap-2 rounded-md bg-surface px-2 py-1 text-xs">
              <input type="checkbox" checked={picked.has(i.id)} onChange={() => toggle(i.id)} className="accent-[var(--accent)]" />
              <span className="flex-1">{i.label}</span>
              <span className="font-mono text-muted">{i.tokens.toLocaleString("en-US")}</span>
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-surface" aria-hidden="true">
        <div className="flex h-full">
          <span style={{ width: `${Math.min(100, ((total - noise) / BUDGET) * 100)}%`, backgroundColor: "var(--good)" }} />
          <span style={{ width: `${Math.min(100, (noise / BUDGET) * 100)}%`, backgroundColor: "var(--warn)" }} />
        </div>
      </div>
      <p className="mt-1 text-xs text-muted">
        {total.toLocaleString("en-US")} of {BUDGET.toLocaleString("en-US")} tokens · <span style={{ color: "var(--good)" }}>■</span> useful ·{" "}
        <span style={{ color: "var(--warn)" }}>■</span> noise
      </p>
      <p className="mt-2 rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: `color-mix(in srgb, ${verdict.color} 16%, transparent)` }} aria-live="polite">
        {verdict.text}
      </p>
    </DemoFrame>
  );
}

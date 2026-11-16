"use client";

import * as React from "react";
import { motion } from "motion/react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, ScoreBar } from "../ui";
import { useMotionSafe } from "@/lib/motion";

const NOTES = [
  { text: "found the 2019 rules, not the 2026 ones", cat: "Wrong document retrieved" },
  { text: "ignored 'next Saturday' in the question", cat: "Ignores dates" },
  { text: "pulled the cafeteria menu for a book question", cat: "Wrong document retrieved" },
  { text: "said 'I can't help' although the rule exists", cat: "Refuses too often" },
  { text: "answered for today instead of the holiday", cat: "Ignores dates" },
  { text: "cited the old fines table", cat: "Wrong document retrieved" },
  { text: "very long answer for a yes/no question", cat: "Too long" },
  { text: "retrieved the staff handbook for a pupil", cat: "Wrong document retrieved" },
  { text: "refused to give the Wi-Fi rule", cat: "Refuses too often" },
  { text: "used the wrong library branch's hours", cat: "Wrong document retrieved" },
  { text: "missed that the date was a Sunday", cat: "Ignores dates" },
  { text: "matched 'renew' to the passport page", cat: "Wrong document retrieved" },
];

export default function ErrorAnalysisDemo() {
  const motionSafe = useMotionSafe();
  const [grouped, setGrouped] = React.useState(false);
  const counts = Object.entries(
    NOTES.reduce<Record<string, number>>((acc, n) => ({ ...acc, [n.cat]: (acc[n.cat] ?? 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1]);

  return (
    <DemoFrame title="Sort the mistakes into piles" hint="12 real failures, one short note each. Then group and count." onReset={() => setGrouped(false)}>
      <ActionButton onClick={() => setGrouped((g) => !g)}>{grouped ? "Show the raw notes" : "Group into categories"}</ActionButton>
      {!grouped ? (
        <ul className="mt-3 grid gap-1 sm:grid-cols-2">
          {NOTES.map((n) => (
            <motion.li key={n.text} layout={motionSafe} className="rounded-md bg-surface px-2 py-1 text-[11px]">
              ✗ {n.text}
            </motion.li>
          ))}
        </ul>
      ) : (
        <ul className="mt-3 space-y-2" aria-live="polite">
          {counts.map(([cat, n], i) => (
            <li key={cat} className="text-xs">
              <div className="flex justify-between">
                <span className={i === 0 ? "font-semibold" : undefined}>
                  {cat} {i === 0 && <span style={{ color: "var(--accent)" }}>← fix this first</span>}
                </span>
                <span className="font-mono">{n}</span>
              </div>
              <ScoreBar value={n} max={NOTES.length} color={i === 0 ? "var(--accent)" : "var(--area-evals)"} />
            </li>
          ))}
        </ul>
      )}
      {grouped && <p className="mt-2 text-xs text-muted">Half of all failures come from retrieval, not from the model. A prompt tweak would not have fixed them.</p>}
    </DemoFrame>
  );
}

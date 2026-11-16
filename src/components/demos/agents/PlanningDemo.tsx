"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { StepControls, useStepper } from "../ui";

type Status = "todo" | "done" | "failed" | "new";
type Frame = { plan: Array<{ text: string; status: Status }>; log: string };

const FRAMES: Frame[] = [
  {
    log: "Plan written for: organise a birthday picnic.",
    plan: [
      { text: "Order a cake at the bakery", status: "todo" },
      { text: "Buy balloons", status: "todo" },
      { text: "Book a spot in the park", status: "todo" },
      { text: "Send invitations", status: "todo" },
    ],
  },
  {
    log: "Bakery: fully booked this week. Replanning…",
    plan: [
      { text: "Order a cake at the bakery", status: "failed" },
      { text: "Buy a cake at the supermarket", status: "new" },
      { text: "Buy balloons", status: "todo" },
      { text: "Book a spot in the park", status: "todo" },
      { text: "Send invitations", status: "todo" },
    ],
  },
  {
    log: "Cake and balloons bought.",
    plan: [
      { text: "Order a cake at the bakery", status: "failed" },
      { text: "Buy a cake at the supermarket", status: "done" },
      { text: "Buy balloons", status: "done" },
      { text: "Book a spot in the park", status: "todo" },
      { text: "Send invitations", status: "todo" },
    ],
  },
  {
    log: "Park booked, but rain is forecast. Adding a backup step…",
    plan: [
      { text: "Order a cake at the bakery", status: "failed" },
      { text: "Buy a cake at the supermarket", status: "done" },
      { text: "Buy balloons", status: "done" },
      { text: "Book a spot in the park", status: "done" },
      { text: "Reserve the community hall as a rain backup", status: "new" },
      { text: "Send invitations (mention both places)", status: "todo" },
    ],
  },
  {
    log: "Everything done. The plan changed twice and still reached the goal.",
    plan: [
      { text: "Order a cake at the bakery", status: "failed" },
      { text: "Buy a cake at the supermarket", status: "done" },
      { text: "Buy balloons", status: "done" },
      { text: "Book a spot in the park", status: "done" },
      { text: "Reserve the community hall as a rain backup", status: "done" },
      { text: "Send invitations (mention both places)", status: "done" },
    ],
  },
];

const MARK: Record<Status, { icon: string; color: string }> = {
  todo: { icon: "○", color: "var(--muted)" },
  done: { icon: "✓", color: "var(--good)" },
  failed: { icon: "✗", color: "var(--bad)" },
  new: { icon: "+", color: "var(--area-agents)" },
};

export default function PlanningDemo() {
  const { shown, play, next, reset, done } = useStepper(FRAMES.length, 1100);
  const frame = FRAMES[Math.max(0, shown - 1)];

  return (
    <DemoFrame title="A plan that changes as results come in" hint="Goal: organise a birthday picnic." onReset={reset}>
      <StepControls onPlay={play} onNext={next} done={done} />
      {shown > 0 && (
        <>
          <ul className="mt-3 space-y-1 text-sm">
            {frame.plan.map((p) => (
              <li key={p.text} className="flex gap-2">
                <span className="w-4 font-mono" style={{ color: MARK[p.status].color }}>
                  {MARK[p.status].icon}
                </span>
                <span className={p.status === "failed" ? "text-muted line-through" : undefined}>{p.text}</span>
                {p.status === "new" && <span className="text-xs" style={{ color: "var(--area-agents)" }}>added by replanning</span>}
              </li>
            ))}
          </ul>
          <p className="mt-2 rounded-md bg-surface px-3 py-1.5 text-xs" aria-live="polite">
            {frame.log}
          </p>
        </>
      )}
    </DemoFrame>
  );
}

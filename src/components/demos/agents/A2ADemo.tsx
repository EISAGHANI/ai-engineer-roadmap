"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { StepControls, useStepper } from "../ui";

type Msg = { from: "travel" | "hotel"; title: string; body: string; state?: string };

const FLOW: Msg[] = [
  {
    from: "travel",
    title: "1 · Discover",
    body: "GET the hotel agent's Agent Card from its well-known URL",
  },
  {
    from: "hotel",
    title: "Agent Card",
    body: '{ "name": "Hotel booking agent", "skills": [{ "id": "book_room" }], "capabilities": { "streaming": true } }',
  },
  {
    from: "travel",
    title: "2 · Send a task (message/send)",
    body: "Book a room in Vienna: 2 nights from 12 March, 1 guest, under 150 € a night.",
  },
  { from: "hotel", title: "Task update", body: "Searching three hotels…", state: "working" },
  { from: "hotel", title: "Task update", body: "Found Hotel Donau, 134 € a night. Breakfast included?", state: "input-required" },
  { from: "travel", title: "3 · Reply in the same task", body: "Yes, with breakfast." },
  { from: "hotel", title: "Task result", body: "Booked: Hotel Donau, room 214, 2 nights with breakfast, 268 €. Confirmation HD-5521.", state: "completed" },
];

const STATE_COLOR: Record<string, string> = { working: "var(--warn)", "input-required": "var(--area-agents)", completed: "var(--good)" };

export default function A2ADemo() {
  const { shown, play, next, reset, done } = useStepper(FLOW.length, 900);

  return (
    <DemoFrame title="Two companies' agents, one conversation" hint="Our travel agent books a room through another company's hotel agent." onReset={reset}>
      <StepControls onPlay={play} onNext={next} done={done} />
      <div className="mt-2 flex justify-between text-[11px] font-medium">
        <span style={{ color: "var(--area-agents)" }}>🧳 Travel agent (our company)</span>
        <span style={{ color: "var(--area-rag)" }}>🏨 Hotel agent (another company)</span>
      </div>
      <ol className="mt-2 max-h-52 space-y-1 overflow-auto" aria-live="polite">
        {FLOW.slice(0, shown).map((m, i) => (
          <li
            key={i}
            className={m.from === "travel" ? "mr-auto max-w-[80%] rounded-md px-2 py-1 text-xs" : "ml-auto max-w-[80%] rounded-md px-2 py-1 text-xs"}
            style={{ backgroundColor: `color-mix(in srgb, ${m.from === "travel" ? "var(--area-agents)" : "var(--area-rag)"} 16%, transparent)` }}
          >
            <div className="flex items-center gap-2 font-mono text-[10px] text-muted">
              {m.title}
              {m.state && (
                <span className="rounded-full px-1.5" style={{ color: STATE_COLOR[m.state], border: `1px solid ${STATE_COLOR[m.state]}` }}>
                  {m.state}
                </span>
              )}
            </div>
            <div className={m.body.startsWith("{") ? "font-mono text-[10px]" : undefined}>{m.body}</div>
          </li>
        ))}
      </ol>
      {done && (
        <p className="mt-2 text-xs text-muted">
          Neither side saw the other&apos;s code or tools. They only shared the card format and the task messages.
        </p>
      )}
    </DemoFrame>
  );
}

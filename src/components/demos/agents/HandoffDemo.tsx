"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, Panel, StepControls, useStepper } from "../ui";

const AGENTS = {
  desk: { label: "Front desk", x: 20 },
  billing: { label: "Billing", x: 200 },
  tech: { label: "Tech support", x: 200 },
} as const;

const MESSAGES = [
  {
    id: "charge",
    label: "Charged twice",
    text: "I was charged twice for my subscription in March.",
    to: "billing" as const,
    note: "Customer #4411 was charged twice for March. Wants a refund.",
    reply: "I can see two charges of 9.99 € on 1 March. I've refunded one; it arrives in 3-5 days.",
  },
  {
    id: "crash",
    label: "App crashes",
    text: "The app closes every time I log in on my phone.",
    to: "tech" as const,
    note: "App crashes at login on the user's phone. No troubleshooting done yet.",
    reply: "Let's fix that. Which phone and app version are you using? First, try updating the app.",
  },
  {
    id: "hours",
    label: "Opening hours",
    text: "When are you open on Saturday?",
    to: null,
    note: "",
    reply: "We're open 09:00-14:00 on Saturdays.",
  },
] as const;
type MId = (typeof MESSAGES)[number]["id"];

export default function HandoffDemo() {
  const [mid, setMid] = React.useState<MId>("charge");
  const m = MESSAGES.find((x) => x.id === mid) ?? MESSAGES[0];
  const steps = m.to ? 3 : 2;
  const { shown, play, next, reset, done } = useStepper(steps, 800);
  const target = m.to;

  return (
    <DemoFrame title="The front desk walks you to the right office" hint="Each specialist has its own instructions and tools." onReset={reset}>
      <div className="flex flex-wrap items-center gap-2">
        <ChoiceChips
          label="Customer message"
          options={MESSAGES.map((x) => ({ id: x.id, label: x.label }))}
          value={mid}
          onChange={(id) => {
            setMid(id);
            reset();
          }}
        />
        <StepControls onPlay={play} onNext={next} done={done} />
      </div>
      <svg viewBox="0 0 300 110" className="mt-2 w-full" role="img" aria-label="Front desk hands off to a specialist">
        <rect x="10" y="38" width="90" height="34" rx="8" fill={shown >= 1 && (!target || shown < 3) ? "var(--area-agents)" : "var(--surface)"} stroke="var(--area-agents)" />
        <text x="55" y="59" textAnchor="middle" fontSize="11" fill="var(--text)">
          {AGENTS.desk.label}
        </text>
        {(["billing", "tech"] as const).map((id, i) => {
          const y = 8 + i * 60;
          const on = target === id && shown >= 3;
          return (
            <g key={id}>
              <line x1="100" y1="55" x2="190" y2={y + 17} stroke={target === id && shown >= 2 ? "var(--accent)" : "var(--border)"} strokeWidth={target === id && shown >= 2 ? 2.5 : 1} />
              <rect x="190" y={y} width="100" height="34" rx="8" fill={on ? "var(--area-agents)" : "var(--surface)"} stroke="var(--area-agents)" />
              <text x="240" y={y + 21} textAnchor="middle" fontSize="11" fill="var(--text)">
                {AGENTS[id].label}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="space-y-1.5 text-xs" aria-live="polite">
        {shown >= 1 && <Panel title="customer">{m.text}</Panel>}
        {target && shown >= 2 && (
          <Panel title={`handoff → ${AGENTS[target].label} (context passed)`} tint="var(--accent)">
            {m.note}
          </Panel>
        )}
        {shown >= steps && (
          <Panel title={target ? AGENTS[target].label : "Front desk (no handoff needed)"} tint="var(--good)">
            {m.reply}
          </Panel>
        )}
      </div>
    </DemoFrame>
  );
}

"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, ScoreBar } from "../ui";

/** Illustrative token sizes: the label (name + description) vs the full folder contents. */
const SKILLS = [
  { id: "invoice", label: "invoice-pdf", desc: "Create German invoices as PDF", full: 3200 },
  { id: "contract", label: "contract-review", desc: "Check contracts against our checklist", full: 4100 },
  { id: "brand", label: "brand-guidelines", desc: "Apply company colours and fonts", full: 2600 },
  { id: "slides", label: "pitch-deck", desc: "Build a 10-slide pitch deck", full: 2900 },
  { id: "sql", label: "sales-sql", desc: "Query the sales database safely", full: 1800 },
] as const;
const LABEL_TOKENS = 40;
const TASKS = [
  { id: "invoice", label: "Make an invoice for order 42" },
  { id: "contract", label: "Review this rental contract" },
  { id: "none", label: "Just say hello" },
] as const;
type TaskId = (typeof TASKS)[number]["id"];
type Mode = "progressive" | "all";

export default function AgentSkillsDemo() {
  const [mode, setMode] = React.useState<Mode>("progressive");
  const [task, setTask] = React.useState<TaskId>("invoice");
  const loaded = (s: (typeof SKILLS)[number]) => (mode === "all" ? s.full : s.id === task ? LABEL_TOKENS + s.full : LABEL_TOKENS);
  const total = SKILLS.reduce((a, s) => a + loaded(s), 0);
  const max = SKILLS.reduce((a, s) => a + s.full, 0);

  return (
    <DemoFrame
      title="Read the labels, open one folder"
      hint="Compare loading every skill up front with loading only what the task needs."
      onReset={() => {
        setMode("progressive");
        setTask("invoice");
      }}
    >
      <ChoiceChips
        label="Loading"
        options={[
          { id: "progressive", label: "Progressive (labels first)" },
          { id: "all", label: "Load everything up front" },
        ]}
        value={mode}
        onChange={setMode}
      />
      <ChoiceChips className="mt-2" label="Task" options={TASKS} value={task} onChange={setTask} />
      <ul className="mt-3 space-y-1">
        {SKILLS.map((s) => {
          const open = mode === "all" || s.id === task;
          return (
            <li key={s.id} className="grid grid-cols-[1fr_6rem_3.5rem] items-center gap-2 text-xs">
              <span>
                <span className="font-mono">{open ? "📂" : "📁"} {s.label}</span> <span className="text-muted">: {s.desc}</span>
              </span>
              <ScoreBar value={loaded(s)} max={4200} color={open ? "var(--area-agents)" : "var(--muted)"} />
              <span className="text-right font-mono text-muted">{loaded(s).toLocaleString("en-US")}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-sm" aria-live="polite">
        Context used by skills: <span className="font-mono" style={{ color: "var(--accent)" }}>{total.toLocaleString("en-US")}</span> tokens{" "}
        <span className="text-xs text-muted">(everything would be {max.toLocaleString("en-US")})</span>
      </p>
    </DemoFrame>
  );
}

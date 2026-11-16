"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, Panel } from "../ui";
import { Switch } from "@/components/ui/Switch";

const FACTS = ["Doesn't eat meat", "Lives in Kreuzberg, Berlin"];

export default function LongTermMemoryDemo() {
  const [save, setSave] = React.useState(true);
  const [day, setDay] = React.useState<1 | 2>(1);
  const notebook = save ? FACTS : [];

  return (
    <DemoFrame
      title="A notebook that survives the night"
      hint="Day 1: tell the robot something. Day 2: a brand new chat."
      onReset={() => {
        setSave(true);
        setDay(1);
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Switch
          checked={save}
          onChange={(v) => {
            setSave(v);
            setDay(1);
          }}
          label="Save durable facts to long-term memory"
        />
        <ActionButton onClick={() => setDay(day === 1 ? 2 : 1)}>{day === 1 ? "Sleep → next day" : "Back to day 1"}</ActionButton>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_11rem]">
        <div className="space-y-1 text-xs">
          <div className="font-mono text-[10px] text-muted uppercase">day {day} chat (short-term memory starts empty)</div>
          {day === 1 ? (
            <>
              <div className="ml-auto w-fit rounded-md bg-surface px-2 py-1">I don&apos;t eat meat, and I live in Kreuzberg.</div>
              <div className="w-fit rounded-md px-2 py-1" style={{ backgroundColor: "color-mix(in srgb, var(--area-agents) 14%, transparent)" }}>
                {save ? "Noted! I'll remember that." : "Okay!"}
              </div>
            </>
          ) : (
            <>
              <div className="ml-auto w-fit rounded-md bg-surface px-2 py-1">Where should I have dinner tonight?</div>
              <div className="w-fit max-w-[95%] rounded-md px-2 py-1" style={{ backgroundColor: `color-mix(in srgb, ${save ? "var(--good)" : "var(--warn)"} 16%, transparent)` }} aria-live="polite">
                {save
                  ? "Try Café Grün: a vegetarian place five minutes from you in Kreuzberg."
                  : "Happy to help! What food do you like, and which part of town are you in?"}
              </div>
            </>
          )}
        </div>
        <Panel title="notebook (long-term)">
          {notebook.length ? (
            <ul className="list-disc space-y-0.5 pl-4 text-xs">
              {notebook.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-muted">empty</p>
          )}
        </Panel>
      </div>
      {day === 2 && (
        <p className="mt-2 text-xs text-muted">
          {save ? "Before answering, the robot looked up the notebook and found two relevant facts." : "Nothing was saved, so day 2 starts from zero."}
        </p>
      )}
    </DemoFrame>
  );
}

"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { Panel } from "../ui";
import { Switch } from "@/components/ui/Switch";

const CHAT = [
  { who: "user", text: "Hi, I'm Sara. I need help with errands." },
  { who: "bot", text: "Hi Sara! What do you need?" },
  { who: "user", text: "Brown bread, eggs and stamps." },
  { who: "bot", text: "Bakery, market, post office. Got it." },
  { who: "user", text: "The market might be closed today." },
  { who: "bot", text: "Then I'll try the supermarket for eggs." },
  { who: "user", text: "Great, and please be quick." },
  { who: "bot", text: "On my way!" },
];

export default function ShortTermMemoryDemo() {
  const [size, setSize] = React.useState(8);
  const [pinned, setPinned] = React.useState(false);
  const firstVisible = CHAT.length - size;
  const nameVisible = firstVisible <= 0 || pinned;

  return (
    <DemoFrame
      title="Only the last few pages fit"
      hint='After this chat Sara asks: "What is my name?"'
      onReset={() => {
        setSize(8);
        setPinned(false);
      }}
    >
      <div className="flex flex-wrap items-end gap-4">
        <label className="text-xs text-muted">
          Messages that fit in the context: <span className="font-mono text-text">{size}</span>
          <input type="range" min={2} max={8} value={size} onChange={(e) => setSize(+e.target.value)} className="mt-1 block w-48 accent-[var(--accent)]" />
        </label>
        <Switch checked={pinned} onChange={setPinned} label="Pin key facts (name)" />
      </div>
      {pinned && (
        <p className="mt-2 rounded-md border border-dashed border-border px-2 py-1 font-mono text-[11px]">pinned: user name = Sara; wants brown bread</p>
      )}
      <ol className="mt-2 space-y-0.5 text-xs">
        {CHAT.map((m, i) => {
          const inWindow = i >= firstVisible;
          return (
            <li
              key={i}
              className={m.who === "user" ? "ml-auto w-fit max-w-[85%] rounded-md bg-surface px-2 py-0.5" : "w-fit max-w-[85%] rounded-md px-2 py-0.5"}
              style={{
                opacity: inWindow ? 1 : 0.25,
                textDecoration: inWindow ? undefined : "line-through",
                backgroundColor: m.who === "bot" ? "color-mix(in srgb, var(--area-agents) 14%, transparent)" : undefined,
              }}
            >
              {m.text}
            </li>
          );
        })}
      </ol>
      <Panel className="mt-2" title='answer to "What is my name?"' tint={nameVisible ? "var(--good)" : "var(--bad)"}>
        <p className="text-xs" aria-live="polite">
          {nameVisible ? "Your name is Sara." : "Sorry, I don't know your name. (That message fell out of the window.)"}
        </p>
      </Panel>
    </DemoFrame>
  );
}

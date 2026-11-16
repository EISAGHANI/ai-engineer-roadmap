"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, Panel } from "../ui";
import { cn } from "@/lib/utils";

const SERVERS = {
  weather: { label: "Weather station", tools: ["get_forecast"] },
  calendar: { label: "Calendar office", tools: ["list_events", "create_event"] },
  files: { label: "File cabinet", tools: ["read_file", "search_files"] },
} as const;
type ServerId = keyof typeof SERVERS;

const QUESTIONS = [
  { id: "rain", label: "Umbrella tomorrow?", needs: "weather", tool: "get_forecast", answer: "Yes: 70% chance of rain tomorrow afternoon." },
  { id: "cal", label: "What's on tomorrow?", needs: "calendar", tool: "list_events", answer: "Dentist at 09:30 and team lunch at 12:30." },
  { id: "notes", label: "Summarise notes.txt", needs: "files", tool: "read_file", answer: "Three points: book the hall, order cake, invite 12 friends." },
] as const;
type QId = (typeof QUESTIONS)[number]["id"];

export default function McpClientDemo() {
  const [connected, setConnected] = React.useState<Set<ServerId>>(new Set(["weather"]));
  const [qid, setQid] = React.useState<QId>("cal");
  const q = QUESTIONS.find((x) => x.id === qid) ?? QUESTIONS[0];
  const ok = connected.has(q.needs);
  const tools = (Object.keys(SERVERS) as ServerId[]).filter((s) => connected.has(s)).flatMap((s) => SERVERS[s].tools.map((t) => `${s}.${t}`));

  function toggle(id: ServerId) {
    setConnected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <DemoFrame
      title="One plug, many shops"
      hint="Plug servers into the app. The tool list updates without new code."
      onReset={() => {
        setConnected(new Set(["weather"]));
        setQid("cal");
      }}
    >
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Connected MCP servers">
        {(Object.keys(SERVERS) as ServerId[]).map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={connected.has(s)}
            onClick={() => toggle(s)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              connected.has(s) ? "border-accent bg-accent text-accent-ink" : "border-dashed border-border text-muted",
            )}
          >
            {connected.has(s) ? "🔌 " : ""}
            {SERVERS[s].label}
          </button>
        ))}
      </div>
      <Panel className="mt-2" title="tools the model can see">
        <p className="font-mono text-[11px]">{tools.length ? tools.join(" · ") : "none"}</p>
      </Panel>
      <ChoiceChips className="mt-3" label="Ask" options={QUESTIONS.map((x) => ({ id: x.id, label: x.label }))} value={qid} onChange={setQid} />
      <Panel className="mt-2" title={ok ? `called ${q.needs}.${q.tool}` : "no matching tool"} tint={ok ? "var(--good)" : "var(--warn)"}>
        <p className="text-xs" aria-live="polite">
          {ok ? q.answer : `I can't check that: no ${SERVERS[q.needs].label.toLowerCase()} is connected.`}
        </p>
      </Panel>
    </DemoFrame>
  );
}

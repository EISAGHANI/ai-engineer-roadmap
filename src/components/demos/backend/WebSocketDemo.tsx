"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, ChoiceChips } from "../ui";

type Transport = "sse" | "ws";
type Msg = { from: "client" | "server"; text: string };
const ANSWER = ["Here", "is", "a", "long", "packing", "list:", "tent,", "sleeping", "bag,", "torch,", "rain", "jacket,", "water", "bottle,", "map,", "snacks,", "first-aid", "kit…"];

export default function WebSocketDemo() {
  const [transport, setTransport] = React.useState<Transport>("ws");
  const [log, setLog] = React.useState<Msg[]>([]);
  const [words, setWords] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const [note, setNote] = React.useState("");

  React.useEffect(() => {
    if (!running) return;
    if (words >= ANSWER.length) {
      setRunning(false);
      setLog((l) => [...l, { from: "server", text: `done (${ANSWER.length} words billed)` }]);
      return;
    }
    const t = window.setTimeout(() => setWords(words + 1), 220);
    return () => window.clearTimeout(t);
  }, [running, words]);

  function ask() {
    setWords(0);
    setNote("");
    setRunning(true);
    setLog([{ from: "client", text: '{"type":"ask","text":"packing list for camping"}' }]);
  }

  function stop() {
    if (transport === "ws") {
      setRunning(false);
      setLog((l) => [...l, { from: "client", text: '{"type":"stop"}' }, { from: "server", text: `{"type":"stopped"} (${words} words billed)` }]);
      setNote("The same open connection carried your 'stop' to the server instantly.");
    } else {
      setNote("SSE only flows server → browser. To stop, the browser must close the stream or send a separate request; the server may keep generating until it notices.");
    }
  }

  return (
    <DemoFrame
      title="A direct line instead of letters"
      hint="Ask, then try to interrupt halfway."
      onReset={() => {
        setRunning(false);
        setWords(0);
        setLog([]);
        setNote("");
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <ChoiceChips
          label="Connection"
          options={[
            { id: "sse", label: "SSE (one-way)" },
            { id: "ws", label: "WebSocket (two-way)" },
          ]}
          value={transport}
          onChange={(v) => {
            setTransport(v);
            setRunning(false);
            setWords(0);
            setLog([]);
            setNote("");
          }}
        />
        <ActionButton onClick={ask} disabled={running}>
          Ask
        </ActionButton>
        <ActionButton variant="secondary" onClick={stop} disabled={!running}>
          ✋ Stop
        </ActionButton>
      </div>
      <p className="mt-3 min-h-12 rounded-lg bg-surface p-2 text-xs">{ANSWER.slice(0, words).join(" ")}</p>
      <ul className="mt-2 space-y-0.5 font-mono text-[10px]" aria-live="polite">
        {log.map((m, i) => (
          <li key={i} className={m.from === "client" ? "text-left" : "text-right"}>
            <span className="rounded px-1.5 py-0.5" style={{ backgroundColor: m.from === "client" ? "color-mix(in srgb, var(--accent) 16%, transparent)" : "var(--surface-2)" }}>
              {m.from === "client" ? "→ " : "← "}
              {m.text}
            </span>
          </li>
        ))}
      </ul>
      {note && <p className="mt-2 text-xs text-muted">{note}</p>}
    </DemoFrame>
  );
}

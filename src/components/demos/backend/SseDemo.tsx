"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";

const ANSWER =
  "Our holiday policy gives every full-time employee 28 days per year. Unused days can be carried over until the end of March. Ask your manager before booking more than two weeks in a row.";
const WORDS = ANSWER.split(" ");
const FIRST_TOKEN_MS = 500;
const PER_WORD_MS = 90;

export default function SseDemo() {
  const [elapsed, setElapsed] = React.useState<number | null>(null);
  const raf = React.useRef<number | null>(null);

  React.useEffect(() => () => {
    if (raf.current) cancelAnimationFrame(raf.current);
  }, []);

  function start() {
    if (raf.current) cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const tick = () => {
      const ms = performance.now() - t0;
      setElapsed(ms);
      if (ms < FIRST_TOKEN_MS + WORDS.length * PER_WORD_MS + 300) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }

  const totalMs = FIRST_TOKEN_MS + WORDS.length * PER_WORD_MS;
  const ms = elapsed ?? 0;
  const streamedWords = elapsed === null ? 0 : Math.max(0, Math.min(WORDS.length, Math.floor((ms - FIRST_TOKEN_MS) / PER_WORD_MS) + 1));
  const waitDone = elapsed !== null && ms >= totalMs;
  const events = WORDS.slice(0, Math.min(streamedWords, 4));

  return (
    <DemoFrame
      title="Pages by mail, as they are written"
      hint="Same answer, same generation time. Which one feels faster?"
      onReset={() => {
        if (raf.current) cancelAnimationFrame(raf.current);
        setElapsed(null);
      }}
    >
      <ActionButton onClick={start}>Ask both</ActionButton>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg bg-surface p-2 text-xs">
          <div className="mb-1 font-medium">Wait for the whole answer</div>
          <p className="min-h-20" aria-live="polite">
            {elapsed === null ? "" : waitDone ? ANSWER : <span className="text-muted">⏳ waiting… {(ms / 1000).toFixed(1)} s</span>}
          </p>
          {waitDone && <p className="mt-1 font-mono text-[10px] text-muted">first word after {(totalMs / 1000).toFixed(1)} s</p>}
        </div>
        <div className="rounded-lg bg-surface p-2 text-xs">
          <div className="mb-1 font-medium">Stream with SSE</div>
          <p className="min-h-20">
            {WORDS.slice(0, streamedWords).join(" ")}
            {elapsed !== null && streamedWords < WORDS.length && <span className="animate-pulse">▍</span>}
          </p>
          {streamedWords > 0 && <p className="mt-1 font-mono text-[10px] text-muted">first word after {(FIRST_TOKEN_MS / 1000).toFixed(1)} s</p>}
        </div>
      </div>
      {events.length > 0 && (
        <pre className="mt-2 rounded-lg bg-neutral-950 p-2 font-mono text-[10px] text-neutral-300">
          {events.map((w) => `data: ${w}\n`).join("\n")}
          {streamedWords > 4 ? "\n…" : ""}
        </pre>
      )}
    </DemoFrame>
  );
}

"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, ChoiceChips } from "../ui";
import { useMotionSafe } from "@/lib/motion";

type Step = { kind: "think" | "search" | "found" | "answer"; text: string };

const QUESTION = "Was the author of our class reader born before the first moon landing?";

const TRACES: Record<"fixed" | "agent", { steps: Step[]; good: boolean }> = {
  fixed: {
    good: false,
    steps: [
      { kind: "search", text: 'search("author of our class reader born before first moon landing")' },
      { kind: "found", text: "Moon landing facts for kids · Class reading list 2026" },
      { kind: "answer", text: "I'm not sure. The class reader is 'River Tales', but I found no birth year for its author." },
    ],
  },
  agent: {
    good: true,
    steps: [
      { kind: "think", text: "First I need to know who wrote the class reader." },
      { kind: "search", text: 'search("class reading list 2026")' },
      { kind: "found", text: "Class reading list: 'River Tales' by Lena Fox" },
      { kind: "think", text: "Now I need Lena Fox's birth year." },
      { kind: "search", text: 'search("Lena Fox author born")' },
      { kind: "found", text: "Lena Fox (born 1964) writes books for children." },
      { kind: "search", text: 'search("first moon landing date")' },
      { kind: "found", text: "Apollo 11 landed on the Moon on 20 July 1969." },
      { kind: "answer", text: "Yes. Lena Fox was born in 1964, five years before the 1969 moon landing." },
    ],
  },
};

const ICON: Record<Step["kind"], string> = { think: "💭", search: "🔎", found: "📄", answer: "✅" };

export default function AgenticRagDemo() {
  const motionSafe = useMotionSafe();
  const [mode, setMode] = React.useState<"fixed" | "agent">("fixed");
  const [shown, setShown] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const trace = TRACES[mode];

  React.useEffect(() => {
    if (!playing) return;
    if (shown >= trace.steps.length) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setShown((s) => s + 1), 600);
    return () => window.clearTimeout(t);
  }, [playing, shown, trace.steps.length]);

  function run() {
    setShown(motionSafe ? 0 : trace.steps.length);
    setPlaying(motionSafe);
  }

  const finished = shown >= trace.steps.length;

  return (
    <DemoFrame
      title="One lookup or keep digging?"
      hint={QUESTION}
      onReset={() => {
        setShown(0);
        setPlaying(false);
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <ChoiceChips
          label="Retrieval style"
          options={[
            { id: "fixed", label: "One fixed search" },
            { id: "agent", label: "Agentic RAG" },
          ]}
          value={mode}
          onChange={(m) => {
            setMode(m);
            setShown(0);
            setPlaying(false);
          }}
        />
        <ActionButton onClick={run}>Run</ActionButton>
        <span className="ml-auto font-mono text-xs text-muted">
          {trace.steps.filter((s, i) => i < shown && s.kind === "search").length} searches
        </span>
      </div>
      <ol className="mt-3 space-y-1">
        {trace.steps.slice(0, shown).map((s, i) => (
          <li
            key={i}
            className="flex gap-2 rounded-md px-2 py-1 text-xs"
            style={{
              backgroundColor:
                s.kind === "answer"
                  ? `color-mix(in srgb, ${trace.good ? "var(--good)" : "var(--warn)"} 20%, transparent)`
                  : "var(--surface)",
            }}
          >
            <span aria-hidden="true">{ICON[s.kind]}</span>
            <span className={s.kind === "search" ? "font-mono" : undefined}>{s.text}</span>
          </li>
        ))}
      </ol>
      {finished && shown > 0 && (
        <p className="mt-2 text-xs text-muted" aria-live="polite">
          {trace.good
            ? "Three targeted searches, each chosen after reading the last result. A step limit stops it from searching forever."
            : "One search with the whole question found nothing that connects the author to a birth year."}
        </p>
      )}
    </DemoFrame>
  );
}

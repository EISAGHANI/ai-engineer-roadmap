"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { Switch } from "@/components/ui/Switch";

const QUESTION = "Which book did our library's founder write in 1923?";
const DOCUMENT = "doc-1: Our founder, Maria Lenz, wrote 'The Quiet Shelf' in 1923 before opening the library in 1925.";

type Verdict = "grounded" | "honest" | "invented" | "fake-citation";

function respond(grounded: boolean, allowIdk: boolean, citations: boolean): { text: string; verdict: Verdict } {
  if (grounded) {
    return {
      text: `Maria Lenz wrote 'The Quiet Shelf' in 1923.${citations ? " [doc-1]" : ""}`,
      verdict: "grounded",
    };
  }
  if (allowIdk) return { text: "I don't know. I have no source about the library's founder.", verdict: "honest" };
  if (citations) {
    return {
      text: "The founder wrote 'Winds over Lisbon' (1923), a celebrated travel memoir. [Library Annals, p. 42]",
      verdict: "fake-citation",
    };
  }
  return { text: "The founder wrote 'Winds over Lisbon' (1923), a celebrated travel memoir.", verdict: "invented" };
}

const VERDICT = {
  grounded: { color: "var(--good)", note: "Correct, and taken from the document you gave it." },
  honest: { color: "var(--warn)", note: "Not an answer, but honest. Far better than a confident invention." },
  invented: { color: "var(--bad)", note: "Made up. It sounds confident because the model writes plausible text, not checked facts." },
  "fake-citation": {
    color: "var(--bad)",
    note: "Made up, with a made-up source. Asking for citations without giving real sources can make it worse.",
  },
} as const;

export default function HallucinationDemo() {
  const [grounded, setGrounded] = React.useState(false);
  const [allowIdk, setAllowIdk] = React.useState(false);
  const [citations, setCitations] = React.useState(false);
  const r = respond(grounded, allowIdk, citations);
  const v = VERDICT[r.verdict];

  return (
    <DemoFrame
      title="Stop the parrot making things up"
      hint="Switch the three fixes on and off and watch the answer change."
      onReset={() => {
        setGrounded(false);
        setAllowIdk(false);
        setCitations(false);
      }}
    >
      <p className="rounded-lg bg-surface px-3 py-2 text-sm">{QUESTION}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <Switch checked={grounded} onChange={setGrounded} label="Give it the document" />
        <Switch checked={allowIdk} onChange={setAllowIdk} label={"Allow “I don't know”"} />
        <Switch checked={citations} onChange={setCitations} label="Ask for citations" />
      </div>
      {grounded && <p className="mt-2 rounded-md border border-dashed border-border px-3 py-1.5 font-mono text-xs text-muted">{DOCUMENT}</p>}
      <div className="mt-3 rounded-lg border-2 px-3 py-2" style={{ borderColor: v.color }} aria-live="polite">
        <div className="text-sm">{r.text}</div>
        <div className="mt-1 text-xs text-muted">{v.note}</div>
      </div>
    </DemoFrame>
  );
}

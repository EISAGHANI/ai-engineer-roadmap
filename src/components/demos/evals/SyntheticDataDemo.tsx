"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, Panel } from "../ui";

const DOC = "Loans: books 3 weeks, DVDs 1 week. Renew online up to 2 times. Late fee 10 cents per day.";

const GENERATED = [
  { type: "easy", q: "How long can I keep a DVD?", expected: "1 week", ok: true },
  { type: "easy", q: "What is the late fee?", expected: "10 cents per day", ok: true },
  { type: "tricky wording", q: "If I renew twice, how long can I keep a book in total?", expected: "9 weeks", ok: true },
  { type: "tricky wording", q: "Is a DVD loan longer than a book loan?", expected: "No, shorter", ok: true },
  { type: "typo", q: "how meny times can i renu?", expected: "Up to 2 times online", ok: true },
  { type: "typo", q: "dvd lone time??", expected: "1 week", ok: true },
  { type: "unanswerable", q: "Can I borrow e-books?", expected: "Not in the rules: say I don't know", ok: true },
  { type: "unanswerable", q: "What is the fee for a lost DVD?", expected: "25 €", ok: false },
];

export default function SyntheticDataDemo() {
  const [generated, setGenerated] = React.useState(false);
  const [kept, setKept] = React.useState<Set<number>>(new Set());
  const [reviewed, setReviewed] = React.useState(false);

  function generate() {
    setGenerated(true);
    setKept(new Set(GENERATED.map((_, i) => i)));
    setReviewed(false);
  }

  function toggle(i: number) {
    setKept((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <DemoFrame
      title="The assistant drafts, the teacher checks"
      hint="Generate varied test questions from one rule sheet, then review them."
      onReset={() => {
        setGenerated(false);
        setKept(new Set());
        setReviewed(false);
      }}
    >
      <Panel title="source document">
        <p className="text-xs">{DOC}</p>
      </Panel>
      <div className="mt-2 flex gap-2">
        <ActionButton onClick={generate}>Generate 8 test cases</ActionButton>
        <ActionButton onClick={() => setReviewed(true)} disabled={!generated} variant="secondary">
          Highlight problems
        </ActionButton>
      </div>
      {generated && (
        <ul className="mt-2 space-y-0.5">
          {GENERATED.map((g, i) => {
            const flagged = reviewed && !g.ok;
            return (
              <li key={g.q} className="flex items-center gap-2 rounded-md px-2 py-0.5 text-[11px]" style={{ backgroundColor: flagged ? "color-mix(in srgb, var(--bad) 18%, transparent)" : "var(--surface)" }}>
                <input type="checkbox" checked={kept.has(i)} onChange={() => toggle(i)} aria-label={`Keep: ${g.q}`} className="accent-[var(--accent)]" />
                <span className="w-24 shrink-0 text-muted">{g.type}</span>
                <span className="flex-1">{g.q}</span>
                <span className="font-mono">{g.expected}</span>
              </li>
            );
          })}
        </ul>
      )}
      {generated && (
        <p className="mt-2 text-xs" aria-live="polite">
          {kept.size} of {GENERATED.length} kept.{" "}
          {reviewed &&
            (kept.has(7)
              ? <span style={{ color: "var(--bad)" }}>The lost-DVD answer &ldquo;25 €&rdquo; was invented: the document has no such rule. Untick it.</span>
              : <span style={{ color: "var(--good)" }}>Good: the invented case is out. The rest can join the golden set.</span>)}
        </p>
      )}
    </DemoFrame>
  );
}

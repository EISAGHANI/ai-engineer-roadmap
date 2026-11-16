"use client";

import * as React from "react";
import { Play } from "lucide-react";
import { DemoFrame } from "../DemoFrame";
import { Switch } from "@/components/ui/Switch";

const FREE_TEXT = "Sure! That's Emma by Jane Austen, published back in 1815 I believe. Lovely book!";
const JSON_REPLY = '{"title": "Emma", "author": "Jane Austen", "year": 1815}';

export default function StructuredOutputDemo() {
  const [forced, setForced] = React.useState(false);
  const [ran, setRan] = React.useState(false);

  const reply = forced ? JSON_REPLY : FREE_TEXT;
  let result: { ok: boolean; text: string };
  try {
    const parsed = JSON.parse(reply) as { year: number };
    result = { ok: true, text: `book.year + 1 = ${parsed.year + 1}` };
  } catch {
    result = { ok: false, text: "JSONDecodeError: Expecting value: line 1 column 1" };
  }

  return (
    <DemoFrame
      title="Fill in the form, not a letter"
      hint="Run the code with and without a forced schema."
      onReset={() => {
        setForced(false);
        setRan(false);
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Switch
          checked={forced}
          onChange={(v) => {
            setForced(v);
            setRan(false);
          }}
          label="Force the Book schema"
        />
        <button
          type="button"
          onClick={() => setRan(true)}
          className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-ink"
        >
          <Play className="h-3.5 w-3.5" aria-hidden="true" /> Run my code
        </button>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg bg-surface p-3">
          <div className="font-mono text-[10px] tracking-wide text-muted uppercase">schema</div>
          <pre className="mt-1 font-mono text-xs leading-relaxed">{`class Book:
  title: str
  author: str
  year: int`}</pre>
        </div>
        <div className="rounded-lg p-3" style={{ backgroundColor: "color-mix(in srgb, var(--area-llm) 14%, transparent)" }}>
          <div className="font-mono text-[10px] tracking-wide text-muted uppercase">model reply</div>
          <p className={forced ? "mt-1 font-mono text-xs" : "mt-1 text-sm"}>{reply}</p>
        </div>
      </div>

      <div className="mt-3 rounded-lg bg-surface p-3 font-mono text-xs">
        <div className="text-muted">book = Book(**json.loads(reply))</div>
        <div className="text-muted">print(book.year + 1)</div>
        {ran && (
          <div className="mt-1" style={{ color: result.ok ? "var(--good)" : "var(--bad)" }} aria-live="polite">
            {result.ok ? "✓ " : "✗ "}
            {result.text}
          </div>
        )}
      </div>
    </DemoFrame>
  );
}

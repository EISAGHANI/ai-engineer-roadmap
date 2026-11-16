"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";

type Entity = "PERSON" | "PHONE" | "EMAIL" | "IBAN";
const RULES: Array<{ type: Entity; re: RegExp }> = [
  { type: "EMAIL", re: /[\w.-]+@[\w-]+\.[\w.]+/g },
  { type: "IBAN", re: /\b[A-Z]{2}\d{2}(?: ?\d{4}){4,5}(?: ?\d{1,2})?\b/g },
  { type: "PHONE", re: /\+\d{2}[\d ]{8,14}\d/g },
  { type: "PERSON", re: /\b(Sara Malik|Omar Khan|Sara|Omar)\b/g },
];
const TEXT =
  "Hi, I'm Sara Malik. Please refund my order to DE89 3704 0044 0532 0130 00 and call me on +49 151 2345 6789, or email sara.malik@example.com. My manager Omar Khan approved it.";

function redact(text: string, enabled: Set<Entity>) {
  const map: Record<string, string> = {};
  const counters: Record<string, number> = {};
  let out = text;
  for (const { type, re } of RULES) {
    if (!enabled.has(type)) continue;
    out = out.replace(re, (m) => {
      const existing = Object.keys(map).find((k) => map[k] === m);
      if (existing) return existing;
      counters[type] = (counters[type] ?? 0) + 1;
      const ph = `<${type}_${counters[type]}>`;
      map[ph] = m;
      return ph;
    });
  }
  return { out, map };
}

export default function PiiRedactionDemo() {
  const [enabled, setEnabled] = React.useState<Set<Entity>>(new Set<Entity>(["PERSON", "PHONE", "EMAIL", "IBAN"]));
  const [restore, setRestore] = React.useState(true);
  const { out, map } = redact(TEXT, enabled);
  const reply = `Thanks <PERSON_1>, I've started the refund to <IBAN_1>. We'll confirm at <EMAIL_1>.`;
  const restored = restore ? reply.replace(/<[A-Z]+_\d+>/g, (ph) => map[ph] ?? ph) : reply;

  function toggle(t: Entity) {
    const next = new Set(enabled);
    if (next.has(t)) next.delete(t);
    else next.add(t);
    setEnabled(next);
  }

  return (
    <DemoFrame
      title="Sticky notes over names"
      hint="A support message, before it is logged or sent to the model. The data is made up."
      onReset={() => {
        setEnabled(new Set<Entity>(["PERSON", "PHONE", "EMAIL", "IBAN"]));
        setRestore(true);
      }}
    >
      <div className="flex flex-wrap gap-1.5">
        {(["PERSON", "PHONE", "EMAIL", "IBAN"] as Entity[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => toggle(t)}
            className="rounded-full border px-2.5 py-0.5 font-mono text-[10px]"
            style={{ borderColor: enabled.has(t) ? "var(--accent)" : "var(--border)", opacity: enabled.has(t) ? 1 : 0.5 }}
          >
            {enabled.has(t) ? "✓ " : ""}
            {t}
          </button>
        ))}
      </div>
      <div className="mt-3 grid gap-2 text-[11px] sm:grid-cols-2">
        <div>
          <div className="text-muted">Original (stays in the secure support system)</div>
          <p className="mt-1 rounded-lg bg-surface p-2">{TEXT}</p>
        </div>
        <div>
          <div className="text-muted">What logs and the model see</div>
          <p className="mt-1 rounded-lg p-2 font-mono text-[10px]" style={{ backgroundColor: "color-mix(in srgb, var(--area-security) 12%, transparent)" }} aria-live="polite">
            {out}
          </p>
        </div>
      </div>
      <div className="mt-3 text-[11px]">
        <label className="flex items-center gap-2 text-muted">
          <input type="checkbox" checked={restore} onChange={(e) => setRestore(e.target.checked)} className="accent-[var(--accent)]" />
          Put the real values back into the reply (only for the customer)
        </label>
        <p className="mt-1 rounded-lg bg-surface p-2">{restored}</p>
      </div>
      {enabled.size < 4 && <p className="mt-2 text-[11px]" style={{ color: "var(--bad)" }}>Some personal data now reaches logs and the model provider unmasked.</p>}
    </DemoFrame>
  );
}

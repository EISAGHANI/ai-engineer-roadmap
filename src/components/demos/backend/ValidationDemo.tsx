"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";

type Field = { loc: string; msg: string };

const PRESETS: Array<{ label: string; body: string }> = [
  { label: "Valid", body: '{\n  "question": "How many holiday days do I get?",\n  "top_k": 5,\n  "language": "en"\n}' },
  { label: "Wrong types", body: '{\n  "question": "How many holiday days?",\n  "top_k": "lots",\n  "language": "fr"\n}' },
  { label: "Missing + extra", body: '{\n  "top_k": 50,\n  "is_admin": true\n}' },
  { label: "Blank question", body: '{\n  "question": "   ",\n  "top_k": 3\n}' },
];

/** A tiny re-implementation of the AskRequest Pydantic model from the code example. */
function validate(text: string): { ok: true; data: Record<string, unknown> } | { ok: false; errors: Field[] } {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, errors: [{ loc: "body", msg: "JSON decode error" }] };
  }
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return { ok: false, errors: [{ loc: "body", msg: "Input should be an object" }] };
  const obj = raw as Record<string, unknown>;
  const errors: Field[] = [];
  const q = obj.question;
  if (q === undefined) errors.push({ loc: "question", msg: "Field required" });
  else if (typeof q !== "string") errors.push({ loc: "question", msg: "Input should be a valid string" });
  else if (!q.trim()) errors.push({ loc: "question", msg: "Value error, question must not be blank" });
  else if (q.length > 2000) errors.push({ loc: "question", msg: "String should have at most 2000 characters" });

  const k = obj.top_k ?? 5;
  if (typeof k !== "number" || !Number.isInteger(k)) errors.push({ loc: "top_k", msg: "Input should be a valid integer" });
  else if (k < 1 || k > 20) errors.push({ loc: "top_k", msg: "Input should be between 1 and 20" });

  const lang = obj.language ?? "en";
  if (!["en", "de", "ur"].includes(String(lang))) errors.push({ loc: "language", msg: "Input should be 'en', 'de' or 'ur'" });

  for (const key of Object.keys(obj)) {
    if (!["question", "top_k", "language"].includes(key)) errors.push({ loc: key, msg: "Extra inputs are not permitted" });
  }
  if (errors.length) return { ok: false, errors };
  return { ok: true, data: { question: String(q).trim(), top_k: k, language: lang } };
}

export default function ValidationDemo() {
  const [body, setBody] = React.useState(PRESETS[1].body);
  const result = validate(body);

  return (
    <DemoFrame title="Checking the form at the counter" hint="Edit the request body. Pydantic checks it before your code ever runs." onReset={() => setBody(PRESETS[1].body)}>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button key={p.label} type="button" onClick={() => setBody(p.body)} className="rounded-full border border-border px-2.5 py-0.5 text-xs">
            {p.label}
          </button>
        ))}
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <label className="text-[11px] text-muted">
          POST /v1/ask
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            spellCheck={false}
            rows={6}
            className="mt-1 block w-full rounded-lg border border-border bg-surface p-2 font-mono text-[11px] text-text"
          />
        </label>
        <div className="text-[11px]" aria-live="polite">
          <div className="text-muted">response</div>
          <pre
            className="mt-1 min-h-[7.5rem] whitespace-pre-wrap rounded-lg p-2 font-mono text-[10px]"
            style={{ backgroundColor: `color-mix(in srgb, ${result.ok ? "var(--good)" : "var(--bad)"} 12%, transparent)` }}
          >
            {result.ok
              ? `200 OK\nhandler receives:\n${JSON.stringify(result.data, null, 1)}`
              : `422 Unprocessable Entity\n${result.errors.map((e) => `• ${e.loc}: ${e.msg}`).join("\n")}`}
          </pre>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-muted">Bad input is stopped at the door with exact reasons; your handler only ever sees clean data.</p>
    </DemoFrame>
  );
}

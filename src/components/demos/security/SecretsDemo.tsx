"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";

const SPOTS = [
  { id: "code", where: "src/llm.py", line: 'client = Anthropic(api_key="sk-ant-api03-9F2A…")', fix: 'client = Anthropic(api_key=get_secret("prod/rag-api")["ANTHROPIC_API_KEY"])' },
  { id: "prompt", where: "prompts/system.md", line: "Use the admin password Castle2026! when calling the HR tool.", fix: "(removed: the HR tool authenticates on the server; the model never sees credentials)" },
  { id: "log", where: "logs/app.log", line: "DEBUG request headers={'Authorization': 'Bearer sk-ant-api03-9F2A…'}", fix: "DEBUG request headers={'Authorization': '[REDACTED]'}" },
  { id: "frontend", where: "web/.env (NEXT_PUBLIC_…)", line: "NEXT_PUBLIC_ANTHROPIC_KEY=sk-ant-api03-9F2A…", fix: "(removed: the browser calls /api/ask; only the server holds the key)" },
  { id: "history", where: "git history, commit 3f1a2c0", line: "+ OPENAI_API_KEY=sk-proj-…  (deleted in a later commit)", fix: "key rotated: the old value in history no longer works" },
];

export default function SecretsDemo() {
  const [scanned, setScanned] = React.useState(false);
  const [fixed, setFixed] = React.useState<Record<string, boolean>>({});
  const remaining = SPOTS.filter((s) => !fixed[s.id]).length;

  return (
    <DemoFrame
      title="Not on the gate, not in the guest book"
      hint="Keys hide in more places than you think. Scan the project, then move each one to the vault."
      onReset={() => {
        setScanned(false);
        setFixed({});
      }}
    >
      <ActionButton onClick={() => setScanned(true)}>🔍 Run secret scan (gitleaks)</ActionButton>
      {scanned && (
        <>
          <ul className="mt-3 space-y-1" aria-live="polite">
            {SPOTS.map((s) => (
              <li key={s.id} className="rounded-lg px-2 py-1.5 text-[11px]" style={{ backgroundColor: fixed[s.id] ? "color-mix(in srgb, var(--good) 13%, transparent)" : "color-mix(in srgb, var(--bad) 13%, transparent)" }}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{s.where}</span>
                  {!fixed[s.id] && (
                    <button type="button" onClick={() => setFixed({ ...fixed, [s.id]: true })} className="rounded-full border border-border px-2 py-0.5 text-[10px]">
                      {s.id === "history" ? "Rotate key" : "Fix"}
                    </button>
                  )}
                </div>
                <code className="mt-0.5 block break-all font-mono text-[10px]">{fixed[s.id] ? s.fix : s.line}</code>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs">
            {remaining ? (
              <span style={{ color: "var(--bad)" }}>{remaining} leak{remaining > 1 ? "s" : ""} left.</span>
            ) : (
              <span style={{ color: "var(--good)" }}>All keys live in the secret manager, and the scan runs in CI on every push.</span>
            )}
          </p>
        </>
      )}
    </DemoFrame>
  );
}

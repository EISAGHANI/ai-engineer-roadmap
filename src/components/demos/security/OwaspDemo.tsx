"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";

const RISKS = [
  { id: "LLM01", name: "Prompt Injection", castle: "A visitor's note pretends to be the king.", control: "Input classifiers, no tools on untrusted text, approvals" },
  { id: "LLM02", name: "Sensitive Information Disclosure", castle: "A servant repeats another guest's private business.", control: "PII redaction, per-user retrieval, no secrets in prompts" },
  { id: "LLM03", name: "Supply Chain", castle: "A trader sells the castle a cursed lock.", control: "Pinned models, packages and MCP servers from trusted sources" },
  { id: "LLM04", name: "Data and Model Poisoning", castle: "A fake page slipped into the recipe book.", control: "Trusted sources, provenance, review of new documents" },
  { id: "LLM05", name: "Improper Output Handling", castle: "The scribe's letter is sent without anyone reading it.", control: "Schema validation, HTML escaping, never run raw SQL or shell" },
  { id: "LLM06", name: "Excessive Agency", castle: "Every servant carries a master key.", control: "Least-privilege tools, user permissions, human approval" },
  { id: "LLM07", name: "System Prompt Leakage", castle: "The guard recites his secret orders to a visitor.", control: "Assume the prompt leaks: keep secrets and rules enforcement out of it" },
  { id: "LLM08", name: "Vector and Embedding Weaknesses", castle: "The librarian fetches council books for anyone.", control: "ACL filters at search time, tenant namespaces" },
  { id: "LLM09", name: "Misinformation", castle: "The town crier confidently announces made-up news.", control: "RAG with citations, faithfulness evals, human review" },
  { id: "LLM10", name: "Unbounded Consumption", castle: "One guest eats the whole winter store in a night.", control: "Rate limits, token budgets, max agent steps" },
];

export default function OwaspDemo() {
  const [open, setOpen] = React.useState<string>("LLM01");
  const [covered, setCovered] = React.useState<Record<string, boolean>>({});
  const n = RISKS.filter((r) => covered[r.id]).length;
  const r = RISKS.find((x) => x.id === open) ?? RISKS[0];

  return (
    <DemoFrame
      title="The captain's ten-point checklist"
      hint="OWASP Top 10 for LLM Applications (2025). Open each risk and tick it when your app has a control for it."
      onReset={() => {
        setOpen("LLM01");
        setCovered({});
      }}
    >
      <div className="grid grid-cols-5 gap-1">
        {RISKS.map((x) => (
          <button
            key={x.id}
            type="button"
            onClick={() => setOpen(x.id)}
            className="rounded-md border px-1 py-1.5 font-mono text-[10px]"
            style={{
              borderColor: x.id === open ? "var(--accent)" : "var(--border)",
              backgroundColor: covered[x.id] ? "color-mix(in srgb, var(--good) 20%, transparent)" : undefined,
            }}
          >
            {covered[x.id] ? "✓ " : ""}
            {x.id}
          </button>
        ))}
      </div>
      <div className="mt-3 rounded-lg bg-surface p-3 text-xs" aria-live="polite">
        <div className="font-semibold">
          {r.id} · {r.name}
        </div>
        <p className="mt-1">🏰 {r.castle}</p>
        <p className="mt-1 text-muted">Controls: {r.control}</p>
        <label className="mt-2 flex items-center gap-2">
          <input type="checkbox" checked={!!covered[r.id]} onChange={(e) => setCovered({ ...covered, [r.id]: e.target.checked })} className="accent-[var(--accent)]" />
          Our app has this covered
        </label>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface">
        <div className="h-full transition-all" style={{ width: `${n * 10}%`, backgroundColor: n === 10 ? "var(--good)" : "var(--area-security)" }} />
      </div>
      <p className="mt-1 text-xs">
        {n}/10 covered {n === 10 && "· ready for a red-team test to prove it"}
      </p>
    </DemoFrame>
  );
}

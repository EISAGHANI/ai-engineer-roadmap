"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";

const SOURCES = [
  { id: 1, title: "Elephants: lifespan", text: "African elephants can live 60 to 70 years in the wild." },
  { id: 2, title: "Elephant diet", text: "Elephants spend 12 to 18 hours a day eating grasses, bark and fruit." },
  { id: 3, title: "Elephant families", text: "Elephants recognise members of their family even after years apart." },
];

const ANSWER = [
  { text: "Elephants can live about 70 years", cite: 1, supported: true },
  { text: "and eat for up to 18 hours a day.", cite: 2, supported: true },
  { text: "They can remember a watering hole for 50 years.", cite: 3, supported: false },
];

export default function CitationsDemo() {
  const [active, setActive] = React.useState<number | null>(null);
  const [checked, setChecked] = React.useState(false);

  return (
    <DemoFrame
      title="Bookmarks in every answer"
      hint="Click a citation to open its source. Then check whether each source really says it."
      onReset={() => {
        setActive(null);
        setChecked(false);
      }}
    >
      <p className="rounded-lg px-3 py-2 text-sm leading-relaxed" style={{ backgroundColor: "color-mix(in srgb, var(--area-rag) 14%, transparent)" }}>
        {ANSWER.map((s) => (
          <span key={s.cite}>
            <span style={checked && !s.supported ? { textDecoration: "underline wavy var(--bad)" } : undefined}>{s.text}</span>
            <button
              type="button"
              onClick={() => setActive(s.cite)}
              aria-pressed={active === s.cite}
              aria-label={`Open source ${s.cite}`}
              className="mx-0.5 rounded px-1 align-super font-mono text-[10px]"
              style={{ backgroundColor: active === s.cite ? "var(--accent)" : "var(--surface)", color: active === s.cite ? "var(--accent-ink)" : "var(--text)" }}
            >
              [{s.cite}]
            </button>
            {checked && <span style={{ color: s.supported ? "var(--good)" : "var(--bad)" }}>{s.supported ? "✓ " : "✗ "}</span>}{" "}
          </span>
        ))}
      </p>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {SOURCES.map((src) => (
          <li
            key={src.id}
            className="rounded-lg border-2 bg-surface p-2 text-xs transition-colors"
            style={{ borderColor: active === src.id ? "var(--accent)" : "transparent" }}
          >
            <div className="font-mono text-[10px] text-muted">
              [{src.id}] {src.title}
            </div>
            {src.text}
          </li>
        ))}
      </ul>
      <div className="mt-3 flex items-center gap-3">
        <ActionButton onClick={() => setChecked(true)} disabled={checked}>
          Check every citation
        </ActionButton>
        {checked && (
          <span className="text-xs" aria-live="polite">
            2 of 3 claims are backed by their source. Source [3] is about family, not watering holes: a real source, a wrong claim.
          </span>
        )}
      </div>
    </DemoFrame>
  );
}

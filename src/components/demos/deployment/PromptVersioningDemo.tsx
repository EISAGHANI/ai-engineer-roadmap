"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";

const VERSIONS = [
  { v: "v12", note: "Added 'cite page numbers'", score: 0.86, text: "You are the library helper. Answer only from the given pages and cite page numbers." },
  { v: "v13", note: "Friendlier tone", score: 0.89, text: "You are a friendly library helper. Answer only from the given pages and cite page numbers." },
  { v: "v14", note: "Say 'I don't know' when unsure", score: 0.93, text: "You are a friendly library helper. Answer only from the given pages and cite page numbers. If the pages don't say, answer 'I don't know'." },
  { v: "v15", note: "Shorter, to save tokens", score: 0.84, text: "Library helper. Use the pages. Be brief." },
];

export default function PromptVersioningDemo() {
  const [prod, setProd] = React.useState(2);
  const [staging, setStaging] = React.useState(3);
  const [log, setLog] = React.useState<string[]>(["10:02 answered · prompt=library_bot@v14"]);

  function promote(i: number) {
    setProd(i);
    setLog((l) => [`${new Date().toTimeString().slice(0, 5)} answered · prompt=library_bot@${VERSIONS[i].v}`, ...l].slice(0, 4));
  }

  return (
    <DemoFrame
      title="Numbered recipe cards in a binder"
      hint="Each prompt change is a new version with an eval score. Labels decide what users get."
      onReset={() => {
        setProd(2);
        setStaging(3);
        setLog(["10:02 answered · prompt=library_bot@v14"]);
      }}
    >
      <ol className="space-y-1">
        {VERSIONS.map((ver, i) => (
          <li key={ver.v} className="flex flex-wrap items-center gap-2 rounded-lg px-2 py-1 text-xs" style={{ backgroundColor: i === prod ? "color-mix(in srgb, var(--good) 14%, transparent)" : "var(--surface)" }}>
            <span className="font-mono font-semibold">{ver.v}</span>
            <span className="flex-1 text-muted">{ver.note}</span>
            <span className="font-mono" style={{ color: ver.score >= 0.9 ? "var(--good)" : ver.score < 0.85 ? "var(--bad)" : undefined }}>
              eval {ver.score.toFixed(2)}
            </span>
            {i === prod && <span className="rounded-full bg-accent px-2 text-[10px] text-accent-ink">production</span>}
            {i === staging && <span className="rounded-full border border-border px-2 text-[10px]">staging</span>}
            {i !== prod && (
              <ActionButton variant="secondary" onClick={() => promote(i)}>
                Make production
              </ActionButton>
            )}
          </li>
        ))}
      </ol>
      <div className="mt-2 flex gap-2">
        <ActionButton variant="secondary" onClick={() => setStaging((s) => (s + 1) % VERSIONS.length)}>
          Move staging label
        </ActionButton>
      </div>
      <p className="mt-2 rounded-lg bg-surface p-2 font-mono text-[11px]">{VERSIONS[prod].text}</p>
      <ul className="mt-2 font-mono text-[10px] text-muted" aria-live="polite">
        {log.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
      {VERSIONS[prod].score < 0.9 && (
        <p className="mt-1 text-xs" style={{ color: "var(--warn)" }}>
          Production now runs a lower-scoring prompt. Rolling back is one click: move the label back to v14.
        </p>
      )}
    </DemoFrame>
  );
}

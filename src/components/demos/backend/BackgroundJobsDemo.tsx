"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, ChoiceChips } from "../ui";

type Mode = "inline" | "job";
const STAGES = ["extract text", "chunk", "embed", "store"];
const STAGE_SECONDS = [25, 5, 40, 10]; // a 300-page PDF
const TIMEOUT_S = 30;

export default function BackgroundJobsDemo() {
  const [mode, setMode] = React.useState<Mode>("job");
  const [t, setT] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (t === null || t >= 85) return;
    const id = window.setTimeout(() => setT(t + 1), 45);
    return () => window.clearTimeout(id);
  }, [t]);

  const sec = t ?? 0;
  let acc = 0;
  const stageState = STAGES.map((s, i) => {
    const start = acc;
    acc += STAGE_SECONDS[i];
    return { name: s, state: sec >= acc ? "done" : sec >= start ? "running" : "waiting" };
  });
  const total = acc;
  const timedOut = mode === "inline" && t !== null && sec >= TIMEOUT_S;

  return (
    <DemoFrame
      title="Here's your ticket, you can go"
      hint="Upload a 300-page PDF. Processing takes about 80 seconds."
      onReset={() => setT(null)}
    >
      <div className="flex flex-wrap items-center gap-2">
        <ChoiceChips
          label="Backend"
          options={[
            { id: "inline", label: "Process inside the request" },
            { id: "job", label: "Background job" },
          ]}
          value={mode}
          onChange={(m) => {
            setMode(m);
            setT(null);
          }}
        />
        <ActionButton onClick={() => setT(0)} disabled={t !== null && t < 85}>
          Upload PDF
        </ActionButton>
      </div>
      {t !== null && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2" aria-live="polite">
          <div className="rounded-lg bg-surface p-2 text-xs">
            <div className="mb-1 font-medium">What the user sees</div>
            {mode === "inline" ? (
              timedOut ? (
                <p style={{ color: "var(--bad)" }}>504 Gateway Timeout after {TIMEOUT_S} s. Did it save? Nobody knows. The user uploads again…</p>
              ) : (
                <p>⏳ Spinner… {sec} s (the browser tab is stuck)</p>
              )
            ) : (
              <>
                <p className="font-mono text-[11px]" style={{ color: "var(--good)" }}>
                  202 Accepted in 0.2 s · job_id 8f2c
                </p>
                <p className="mt-1">{sec >= total ? "✓ “Holiday handbook” is ready to search." : `Processing… ${Math.min(100, Math.round((sec / total) * 100))}%. You can keep chatting.`}</p>
              </>
            )}
          </div>
          <div className="rounded-lg bg-surface p-2 text-xs">
            <div className="mb-1 font-medium">{mode === "inline" ? "Inside the request" : "Worker (in the back room)"}</div>
            <ul className="space-y-0.5 font-mono text-[11px]">
              {stageState.map((s) => {
                const killed = timedOut && s.state !== "done";
                return (
                  <li key={s.name} style={{ color: killed ? "var(--bad)" : s.state === "done" ? "var(--good)" : s.state === "running" ? "var(--warn)" : "var(--muted)" }}>
                    {killed ? "✗" : s.state === "done" ? "✓" : s.state === "running" ? "…" : "○"} {s.name}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </DemoFrame>
  );
}

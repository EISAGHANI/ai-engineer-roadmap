"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, StepControls, useStepper } from "../ui";

type Mode = "through" | "presigned";
const FLOWS: Record<Mode, Array<{ from: string; to: string; text: string; heavy?: boolean }>> = {
  through: [
    { from: "Browser", to: "API", text: "POST /upload (40 MB file)", heavy: true },
    { from: "API", to: "S3", text: "PutObject (the same 40 MB again)", heavy: true },
    { from: "API", to: "Browser", text: "201 Created" },
  ],
  presigned: [
    { from: "Browser", to: "API", text: "POST /uploads {filename, type: pdf}" },
    { from: "API", to: "Browser", text: "presigned URL, valid 15 min, max 50 MB" },
    { from: "Browser", to: "S3", text: "POST file directly (40 MB)", heavy: true },
    { from: "S3", to: "API", text: "event: object created → enqueue ingestion" },
  ],
};
const NODES = ["Browser", "API", "S3"];

export default function UploadDemo() {
  const [mode, setMode] = React.useState<Mode>("presigned");
  const steps = FLOWS[mode];
  const { shown, play, next, reset, done } = useStepper(steps.length, 900);
  const apiMb = steps.slice(0, shown).filter((s) => s.heavy && (s.from === "API" || s.to === "API")).length * 40;

  return (
    <DemoFrame title="Straight to the storage room" hint="Upload a 40 MB PDF. How much of it passes through your API server?" onReset={reset}>
      <div className="flex flex-wrap items-center gap-3">
        <ChoiceChips
          label="Upload path"
          options={[
            { id: "through", label: "Through the API" },
            { id: "presigned", label: "Presigned URL" },
          ]}
          value={mode}
          onChange={(m) => {
            setMode(m);
            reset();
          }}
        />
        <StepControls onPlay={play} onNext={next} done={done} playLabel="Upload" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-medium">
        {NODES.map((n) => (
          <div key={n} className="rounded-md bg-surface py-1.5">
            {n === "Browser" ? "🧑‍💻" : n === "API" ? "⚙️" : "🗄️"} {n === "S3" ? "S3 bucket (private)" : n}
          </div>
        ))}
      </div>
      <ol className="mt-2 space-y-1" aria-live="polite">
        {steps.slice(0, shown).map((s, i) => {
          const a = NODES.indexOf(s.from);
          const b = NODES.indexOf(s.to);
          return (
            <li key={i} className="grid grid-cols-3 text-[11px]">
              <div
                className="rounded-md px-2 py-1"
                style={{
                  gridColumn: `${Math.min(a, b) + 1} / span ${Math.abs(a - b) + 1}`,
                  textAlign: a < b ? "left" : "right",
                  backgroundColor: s.heavy ? "color-mix(in srgb, var(--warn) 22%, transparent)" : "color-mix(in srgb, var(--area-backend) 14%, transparent)",
                }}
              >
                {a < b ? "→" : "←"} {s.text}
              </div>
            </li>
          );
        })}
      </ol>
      {done && (
        <p className="mt-2 text-xs">
          Through your API server: <strong style={{ color: apiMb ? "var(--bad)" : "var(--good)" }}>{apiMb} MB</strong>.{" "}
          {apiMb ? "Each upload ties up a server, its memory and its timeout." : "The API only handled two tiny messages; S3 did the heavy lifting."}
        </p>
      )}
    </DemoFrame>
  );
}

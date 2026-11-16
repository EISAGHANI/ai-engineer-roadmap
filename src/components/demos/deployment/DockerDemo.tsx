"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, ChoiceChips, Panel } from "../ui";

const MACHINES = [
  { id: "laptop", label: "Your laptop", env: "Python 3.12, numpy 1.26" },
  { id: "ci", label: "CI runner", env: "Python 3.11, numpy 2.1" },
  { id: "cloud", label: "Cloud server", env: "Python 3.9, no numpy" },
];
const LAYERS = [
  { id: "base", label: "FROM python:3.12-slim", seconds: 0 },
  { id: "deps", label: "pip install -r requirements.txt", seconds: 48 },
  { id: "code", label: "COPY src/ ./src/", seconds: 1 },
];
type Change = "code" | "deps";

export default function DockerDemo() {
  const [docker, setDocker] = React.useState<"without" | "with">("without");
  const [change, setChange] = React.useState<Change | null>(null);
  const rebuilt = change === "deps" ? ["deps", "code"] : change === "code" ? ["code"] : [];
  const buildTime = LAYERS.filter((l) => rebuilt.includes(l.id)).reduce((a, l) => a + l.seconds, 0);

  return (
    <DemoFrame
      title="The truck brings its own kitchen"
      hint="Run the same app on three machines, with and without Docker."
      onReset={() => {
        setDocker("without");
        setChange(null);
      }}
    >
      <ChoiceChips
        label="How the app is shipped"
        options={[
          { id: "without", label: "Copy the code" },
          { id: "with", label: "Ship a Docker image" },
        ]}
        value={docker}
        onChange={setDocker}
      />
      <ul className="mt-3 grid gap-2 sm:grid-cols-3" aria-live="polite">
        {MACHINES.map((m, i) => {
          const ok = docker === "with" || i === 0;
          return (
            <li key={m.id} className="rounded-lg p-2 text-xs" style={{ backgroundColor: `color-mix(in srgb, ${ok ? "var(--good)" : "var(--bad)"} 14%, transparent)` }}>
              <div className="font-medium">{m.label}</div>
              <div className="text-muted">{docker === "with" ? "runs the image (Python 3.12, numpy 1.26 inside)" : m.env}</div>
              <div className="mt-1 font-mono" style={{ color: ok ? "var(--good)" : "var(--bad)" }}>
                {ok ? "✓ app running" : i === 1 ? "✗ numpy API changed" : "✗ ModuleNotFoundError"}
              </div>
            </li>
          );
        })}
      </ul>
      {docker === "with" && (
        <Panel className="mt-3" title="image layers (cached, rebuilt only from the change downwards)">
          <div className="mb-2 flex flex-wrap gap-1.5">
            <ActionButton variant="secondary" onClick={() => setChange("code")}>
              Change one line of code
            </ActionButton>
            <ActionButton variant="secondary" onClick={() => setChange("deps")}>
              Add a library
            </ActionButton>
          </div>
          <ol className="space-y-0.5 font-mono text-[11px]">
            {[...LAYERS].reverse().map((l) => (
              <li key={l.id} className="rounded px-2 py-0.5" style={{ backgroundColor: rebuilt.includes(l.id) ? "color-mix(in srgb, var(--warn) 25%, transparent)" : "var(--surface-2)" }}>
                {l.label} {change && <span className="text-muted">{rebuilt.includes(l.id) ? "· rebuilt" : "· cached"}</span>}
              </li>
            ))}
          </ol>
          {change && <p className="mt-1 text-xs text-muted">Rebuild took about {buildTime} s.</p>}
        </Panel>
      )}
    </DemoFrame>
  );
}

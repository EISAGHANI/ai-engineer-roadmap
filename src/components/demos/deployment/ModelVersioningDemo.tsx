"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, StepControls, useStepper } from "../ui";

type Mode = "alias" | "pinned";
const DAYS = [
  { day: "Mon", event: "", aliasModel: "model-2025-06", aliasScore: 0.92, pinnedScore: 0.92 },
  { day: "Tue", event: "", aliasModel: "model-2025-06", aliasScore: 0.92, pinnedScore: 0.92 },
  { day: "Wed", event: "Provider moves 'latest' to a new snapshot", aliasModel: "model-2026-11", aliasScore: 0.81, pinnedScore: 0.92 },
  { day: "Thu", event: "Users complain: answers ignore the citation format", aliasModel: "model-2026-11", aliasScore: 0.8, pinnedScore: 0.92 },
  { day: "Fri", event: "Team tests the new snapshot in staging and fixes the prompt", aliasModel: "model-2026-11", aliasScore: 0.8, pinnedScore: 0.94 },
];

export default function ModelVersioningDemo() {
  const [mode, setMode] = React.useState<Mode>("alias");
  const { shown, play, next, reset, done } = useStepper(DAYS.length, 800);

  return (
    <DemoFrame title="Exactly which flour, from which batch" hint="Play a week in production with a floating alias or a pinned model." onReset={reset}>
      <div className="flex flex-wrap items-center gap-3">
        <ChoiceChips
          label="Config"
          options={[
            { id: "alias", label: 'model: "latest"' },
            { id: "pinned", label: 'model: "model-2025-06"' },
          ]}
          value={mode}
          onChange={(m) => {
            setMode(m);
            reset();
          }}
        />
        <StepControls onPlay={play} onNext={next} done={done} playLabel="Play the week" />
      </div>
      <ol className="mt-3 space-y-1 text-xs" aria-live="polite">
        {DAYS.slice(0, shown).map((d) => {
          const score = mode === "alias" ? d.aliasScore : d.pinnedScore;
          const model = mode === "alias" ? d.aliasModel : d.day === "Fri" ? "model-2026-11 (after evals pass)" : "model-2025-06";
          const showEvent = mode === "alias" || d.day === "Fri" || d.day === "Wed";
          return (
            <li key={d.day} className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-2 rounded-md px-2 py-1" style={{ backgroundColor: score < 0.85 ? "color-mix(in srgb, var(--bad) 14%, transparent)" : "var(--surface)" }}>
              <span className="font-semibold">{d.day}</span>
              <span>
                <span className="font-mono text-[10px]">{model}</span>
                {showEvent && d.event && (
                  <span className="block text-[10px] text-muted">
                    {mode === "pinned" && d.day === "Wed" ? "New snapshot released, but production stays pinned." : d.event}
                  </span>
                )}
              </span>
              <span className="font-mono">eval {score.toFixed(2)}</span>
            </li>
          );
        })}
      </ol>
      {done && (
        <p className="mt-2 text-xs text-muted">
          {mode === "alias"
            ? "Nothing in your code changed, yet quality dropped and nobody knew why until users complained."
            : "Pinned: the upgrade happened on your schedule, after evals passed, and is recorded in the logs."}
        </p>
      )}
    </DemoFrame>
  );
}

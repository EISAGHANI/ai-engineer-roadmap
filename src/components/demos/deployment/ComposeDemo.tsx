"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { StepControls, useStepper } from "../ui";
import { Switch } from "@/components/ui/Switch";

type Line = { svc: string; text: string; bad?: boolean };

const WITH_HEALTH: Line[] = [
  { svc: "db", text: "starting Postgres…" },
  { svc: "redis", text: "ready to accept connections" },
  { svc: "db", text: "health check: pg_isready → accepting connections ✓" },
  { svc: "api", text: "connected to db, listening on :8000 ✓" },
  { svc: "worker", text: "waiting for jobs ✓" },
];
const WITHOUT_HEALTH: Line[] = [
  { svc: "db", text: "starting Postgres…" },
  { svc: "redis", text: "ready to accept connections" },
  { svc: "api", text: "connection refused: db:5432 ✗ (db still starting)", bad: true },
  { svc: "api", text: "crashed, exit code 1 ✗", bad: true },
  { svc: "db", text: "ready to accept connections (too late)" },
];
const COLORS: Record<string, string> = { db: "var(--area-rag)", redis: "var(--area-security)", api: "var(--area-deployment)", worker: "var(--area-agents)" };

export default function ComposeDemo() {
  const [health, setHealth] = React.useState(false);
  const lines = health ? WITH_HEALTH : WITHOUT_HEALTH;
  const { shown, play, next, reset, done } = useStepper(lines.length, 600);

  return (
    <DemoFrame title="One plan for the whole festival" hint="docker compose up starts api, worker, db and redis together." onReset={reset}>
      <div className="flex flex-wrap items-center gap-3">
        <Switch
          checked={health}
          onChange={(v) => {
            setHealth(v);
            reset();
          }}
          label="api waits for db health check"
        />
        <StepControls onPlay={play} onNext={next} done={done} playLabel="docker compose up" />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5 text-center text-[11px]">
        {Object.keys(COLORS).map((s) => (
          <div key={s} className="rounded-md px-1 py-1.5 font-mono" style={{ backgroundColor: `color-mix(in srgb, ${COLORS[s]} 18%, transparent)` }}>
            {s}
          </div>
        ))}
      </div>
      <pre className="mt-2 min-h-28 rounded-lg bg-neutral-950 p-2 font-mono text-[10px] leading-relaxed text-neutral-200" aria-live="polite">
        {lines.slice(0, shown).map((l, i) => (
          <div key={i} style={{ color: l.bad ? "#f87171" : undefined }}>
            <span style={{ color: COLORS[l.svc] }}>{l.svc.padEnd(7)}|</span> {l.text}
          </div>
        ))}
      </pre>
      {done && (
        <p className="mt-2 text-xs text-muted">
          {health ? "With a health condition, the api only starts once Postgres really accepts connections." : "depends_on alone only fixes the start order, not readiness."}
        </p>
      )}
    </DemoFrame>
  );
}

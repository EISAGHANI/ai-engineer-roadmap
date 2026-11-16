"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

const SCENARIOS = {
  healthy: { label: "All good", live: true, ready: true, note: "Gets traffic." },
  loading: { label: "Still loading the model", live: true, ready: false, note: "Alive, so no restart, but not ready: the load balancer skips it until the model is loaded." },
  database: { label: "Database is down", live: true, ready: false, note: "Not ready, so traffic goes elsewhere. Restarting would not fix the database, so liveness stays OK." },
  stuck: { label: "Process is stuck", live: false, ready: false, note: "Liveness fails, so the platform restarts the container." },
} as const;
type Id = keyof typeof SCENARIOS;

function Badge({ ok, text }: { ok: boolean; text: string }) {
  return (
    <span className="rounded-md px-2 py-0.5 font-mono text-[11px]" style={{ backgroundColor: `color-mix(in srgb, ${ok ? "var(--good)" : "var(--bad)"} 18%, transparent)` }}>
      {text}
    </span>
  );
}

export default function HealthCheckDemo() {
  const [id, setId] = React.useState<Id>("loading");
  const [badLiveness, setBadLiveness] = React.useState(false);
  const s = SCENARIOS[id];
  // A badly designed liveness check that also pings the database
  const live = badLiveness && id === "database" ? false : s.live;

  return (
    <DemoFrame
      title="Two questions every few seconds"
      hint="Pick what is happening inside pod-2 and see how the platform reacts."
      onReset={() => {
        setId("loading");
        setBadLiveness(false);
      }}
    >
      <ChoiceChips label="Inside pod-2" options={(Object.keys(SCENARIOS) as Id[]).map((k) => ({ id: k, label: SCENARIOS[k].label }))} value={id} onChange={setId} />
      <label className="mt-2 flex items-center gap-2 text-xs text-muted">
        <input type="checkbox" checked={badLiveness} onChange={(e) => setBadLiveness(e.target.checked)} className="accent-[var(--accent)]" />
        Mistake: /live also checks the database
      </label>
      <div className="mt-3 grid gap-2 sm:grid-cols-2" aria-live="polite">
        <div className="rounded-lg bg-surface p-2 text-xs">
          <div className="mb-1 text-muted">GET /live: are you alive?</div>
          <Badge ok={live} text={live ? "200 OK" : "no answer / 500"} />
          <div className="mt-1">{live ? "→ keep running" : "→ restart the container"}</div>
        </div>
        <div className="rounded-lg bg-surface p-2 text-xs">
          <div className="mb-1 text-muted">GET /ready: can you serve now?</div>
          <Badge ok={s.ready} text={s.ready ? "200 OK" : "503"} />
          <div className="mt-1">{s.ready ? "→ load balancer sends traffic" : "→ load balancer skips this pod"}</div>
        </div>
      </div>
      <p className="mt-2 text-xs">
        {badLiveness && id === "database"
          ? "⚠ Every pod's liveness fails at once, so all pods restart in a loop, and nothing serves even cached answers. Keep /live local."
          : s.note}
      </p>
    </DemoFrame>
  );
}

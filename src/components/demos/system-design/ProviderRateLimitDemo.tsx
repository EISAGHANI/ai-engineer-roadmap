"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

type Strategy = "blast" | "limiter" | "priority";
const LIMIT = 40; // requests the provider accepts per second (scaled down)
const SECONDS = 20;
/** Live chat traffic per second, plus a background job that wants to send 400 requests. */
const LIVE = [12, 14, 15, 13, 16, 18, 20, 22, 21, 19, 18, 17, 16, 15, 14, 14, 13, 12, 12, 11];
const JOB_TOTAL = 400;

function simulate(strategy: Strategy) {
  let jobLeft = JOB_TOTAL;
  const rows = LIVE.map((live) => {
    let jobSend: number;
    if (strategy === "blast") jobSend = Math.min(jobLeft, 120);
    else if (strategy === "limiter") jobSend = Math.min(jobLeft, Math.max(0, LIMIT - 20)); // fixed share
    else jobSend = Math.min(jobLeft, Math.max(0, LIMIT - live - 2)); // only spare capacity
    const total = live + jobSend;
    const accepted = Math.min(total, LIMIT);
    // When over the limit the provider rejects a random share of everything, live users included
    const liveRejected = total > LIMIT ? Math.round(live * (1 - accepted / total)) : 0;
    const jobRejected = total > LIMIT ? jobSend - (accepted - (live - liveRejected)) : 0;
    jobLeft -= jobSend - jobRejected;
    return { live, jobSend, liveRejected, jobRejected };
  });
  return { rows, jobLeft, liveErrors: rows.reduce((a, r) => a + r.liveRejected, 0) };
}

export default function ProviderRateLimitDemo() {
  const [strategy, setStrategy] = React.useState<Strategy>("blast");
  const { rows, jobLeft, liveErrors } = React.useMemo(() => simulate(strategy), [strategy]);
  const max = Math.max(LIMIT * 1.2, ...rows.map((r) => r.live + r.jobSend));

  return (
    <DemoFrame
      title="Forty boxes an hour, no more"
      hint={`The provider accepts ${LIMIT} requests per second. Live chat shares the limit with a 400-request background job.`}
      onReset={() => setStrategy("blast")}
    >
      <ChoiceChips
        label="Background job"
        options={[
          { id: "blast", label: "Send everything now" },
          { id: "limiter", label: "Fixed client-side limit" },
          { id: "priority", label: "Use only spare capacity" },
        ]}
        value={strategy}
        onChange={setStrategy}
      />
      <div className="relative mt-3 flex h-28 items-end gap-[2px]" role="img" aria-label="Requests per second">
        {rows.map((r, i) => (
          <div key={i} className="flex flex-1 flex-col justify-end" style={{ height: "100%" }}>
            <span style={{ height: `${(r.jobSend / max) * 100}%`, backgroundColor: r.jobRejected ? "color-mix(in srgb, var(--bad) 60%, transparent)" : "color-mix(in srgb, var(--area-system-design) 45%, transparent)" }} />
            <span style={{ height: `${(r.live / max) * 100}%`, backgroundColor: r.liveRejected ? "var(--bad)" : "var(--area-llm)" }} />
          </div>
        ))}
        <span className="absolute right-0 left-0 border-t-2 border-dashed border-text" style={{ bottom: `${(LIMIT / max) * 100}%` }} />
      </div>
      <p className="mt-1 text-[10px] text-muted">
        <span style={{ color: "var(--area-llm)" }}>■</span> live chat · <span style={{ color: "var(--area-system-design)" }}>■</span> background job · red = got 429 · dashed = limit
      </p>
      <p className="mt-2 text-xs" aria-live="polite">
        Live users who got an error: <strong style={{ color: liveErrors ? "var(--bad)" : "var(--good)" }}>{liveErrors}</strong> · background job:{" "}
        <strong>{jobLeft === 0 ? "finished" : `${JOB_TOTAL - jobLeft}/${JOB_TOTAL} done`}</strong>
      </p>
      <p className="mt-1 text-[11px] text-muted">
        {strategy === "blast" && "The job finishes fast but live users get 429s, and its own retries make it worse."}
        {strategy === "limiter" && "A fixed share is safe most of the time, but at the evening peak live traffic and the job still collide."}
        {strategy === "priority" && "Live chat always comes first; the job fills the gaps and still finishes."}
      </p>
    </DemoFrame>
  );
}

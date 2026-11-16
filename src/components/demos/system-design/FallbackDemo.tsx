"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { Switch } from "@/components/ui/Switch";

const MINUTES = 30;
const OUTAGE = [8, 19]; // primary provider down between minute 8 and 19

export default function FallbackDemo() {
  const [fallback, setFallback] = React.useState(false);
  const [breaker, setBreaker] = React.useState(false);

  const minutes = Array.from({ length: MINUTES }, (_, m) => {
    const down = m >= OUTAGE[0] && m < OUTAGE[1];
    if (!down) return { m, status: "primary" as const, wait: 1.2 };
    if (!fallback) return { m, status: "error" as const, wait: 20 };
    // Without a circuit breaker every request first waits for the primary to time out
    return { m, status: "backup" as const, wait: breaker && m > OUTAGE[0] ? 1.4 : 21.4 };
  });
  const errors = minutes.filter((x) => x.status === "error").length;
  const slow = minutes.filter((x) => x.wait > 10 && x.status !== "error").length;

  const color = { primary: "var(--good)", backup: "var(--area-system-design)", error: "var(--bad)" };

  return (
    <DemoFrame
      title="The backup oven"
      hint="The main provider has an 11-minute outage. Each square is one minute of traffic."
      onReset={() => {
        setFallback(false);
        setBreaker(false);
      }}
    >
      <div className="flex flex-wrap gap-4">
        <Switch checked={fallback} onChange={setFallback} label="Fall back to a backup model" />
        <Switch checked={breaker} onChange={setBreaker} label="Circuit breaker (skip a failing provider)" />
      </div>
      <div className="mt-3 grid grid-cols-[repeat(30,minmax(0,1fr))] gap-0.5" role="img" aria-label="Status per minute">
        {minutes.map((x) => (
          <span
            key={x.m}
            title={`minute ${x.m}: ${x.status}, ${x.wait}s wait`}
            className="h-6 rounded-sm"
            style={{ backgroundColor: color[x.status], opacity: x.wait > 10 && x.status === "backup" ? 0.55 : 1 }}
          />
        ))}
      </div>
      <p className="mt-1 text-[10px] text-muted">
        <span style={{ color: color.primary }}>■</span> primary · <span style={{ color: color.backup }}>■</span> backup (faded = slow) ·{" "}
        <span style={{ color: color.error }}>■</span> error
      </p>
      <p className="mt-2 text-sm" aria-live="polite">
        {errors > 0
          ? `${errors} minutes of errors: every user saw "Something went wrong".`
          : slow > 1
            ? `No errors, but for ${slow} minutes each answer waited ~20 s for the primary to time out first.`
            : "No errors, and after the first failures the breaker sends traffic straight to the backup."}
      </p>
    </DemoFrame>
  );
}

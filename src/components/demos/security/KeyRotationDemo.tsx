"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";

type Step = 0 | 1 | 2 | 3 | 4;
const STEPS = ["Create key B and store it in the vault", "Roll out: services restart with key B", "Verify: all traffic uses key B", "Revoke key A"];

export default function KeyRotationDemo() {
  const [step, setStep] = React.useState<Step>(0);
  const [skipped, setSkipped] = React.useState(false);
  const [leakDay, setLeakDay] = React.useState<number | null>(null);

  const servicesOnB = step >= 2 && !skipped;
  const keyAValid = step < 4;
  const outage = skipped && !servicesOnB && !keyAValid;

  function revokeEarly() {
    setSkipped(true);
    setStep(4);
  }

  // How long a leaked key keeps working depends on the rotation policy
  const policies = [
    { name: "Never rotate", days: Infinity },
    { name: "Every 90 days", days: 45 },
    { name: "Every 30 days", days: 15 },
    { name: "Rotate the same day a leak is found", days: 0.5 },
  ];

  return (
    <DemoFrame
      title="New locks every month"
      hint="Rotate the production key from A to B without downtime."
      onReset={() => {
        setStep(0);
        setSkipped(false);
        setLeakDay(null);
      }}
    >
      <ol className="space-y-1 text-xs">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2 rounded px-2 py-1" style={{ backgroundColor: i < step ? "color-mix(in srgb, var(--good) 14%, transparent)" : "var(--surface)" }}>
            <span className="font-mono">{i < step ? "✓" : i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
      <div className="mt-2 flex flex-wrap gap-2">
        <ActionButton onClick={() => setStep((Math.min(4, step + 1)) as Step)} disabled={step >= 4}>
          Next step
        </ActionButton>
        <ActionButton variant="secondary" onClick={revokeEarly} disabled={step !== 0}>
          Shortcut: revoke A first
        </ActionButton>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]" aria-live="polite">
        <div className="rounded-lg bg-surface p-2">
          key A <div className="font-mono" style={{ color: keyAValid ? "var(--good)" : "var(--muted)" }}>{keyAValid ? "valid" : "revoked"}</div>
        </div>
        <div className="rounded-lg bg-surface p-2">
          key B <div className="font-mono" style={{ color: step >= 1 && !skipped ? "var(--good)" : "var(--muted)" }}>{step >= 1 && !skipped ? "valid" : "not created"}</div>
        </div>
        <div className="rounded-lg p-2" style={{ backgroundColor: outage ? "color-mix(in srgb, var(--bad) 20%, transparent)" : "var(--surface)" }}>
          services <div className="font-mono">{outage ? "401 errors!" : servicesOnB ? "using B" : "using A"}</div>
        </div>
      </div>
      {outage && <p className="mt-2 text-xs" style={{ color: "var(--bad)" }}>Outage: the old key was revoked before services had the new one.</p>}
      {step === 4 && !skipped && <p className="mt-2 text-xs" style={{ color: "var(--good)" }}>Rotated with zero downtime. Any copy of key A (old laptops, logs) is now useless.</p>}
      <div className="mt-3 border-t border-border pt-2">
        <p className="text-[11px] text-muted">A key leaks without anyone noticing. How long can an attacker use it (on average)?</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {policies.map((p, i) => (
            <button key={p.name} type="button" onClick={() => setLeakDay(i)} className="rounded-full border px-2 py-0.5 text-[10px]" style={{ borderColor: leakDay === i ? "var(--accent)" : "var(--border)" }}>
              {p.name}
            </button>
          ))}
        </div>
        {leakDay !== null && (
          <p className="mt-1 text-xs">
            {policies[leakDay].days === Infinity ? "Forever, until someone notices the bill." : policies[leakDay].days < 1 ? "Hours, not weeks." : `About ${policies[leakDay].days} days.`}
          </p>
        )}
      </div>
    </DemoFrame>
  );
}

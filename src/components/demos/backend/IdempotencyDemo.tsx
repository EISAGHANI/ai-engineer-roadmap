"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";
import { Switch } from "@/components/ui/Switch";

type Charge = { id: number; key: string };

export default function IdempotencyDemo() {
  const [useKey, setUseKey] = React.useState(false);
  const [charges, setCharges] = React.useState<Charge[]>([]);
  const [seen, setSeen] = React.useState<Record<string, number>>({});
  const [log, setLog] = React.useState<string[]>([]);
  // One key per user action ("buy 100 credits"), reused for every retry of that action
  const [actionKey, setActionKey] = React.useState("a1f9");

  function request(reason: string) {
    const key = useKey ? actionKey : "";
    if (key && seen[key] !== undefined) {
      setLog((l) => [`${reason} → key ${key} seen before → return charge #${seen[key]}, charge nothing`, ...l]);
      return;
    }
    const id = charges.length + 1;
    setCharges((c) => [...c, { id, key }]);
    if (key) setSeen((s) => ({ ...s, [key]: id }));
    setLog((l) => [`${reason} → new charge #${id} (€10)`, ...l]);
  }

  const total = charges.length * 10;

  return (
    <DemoFrame
      title="Same ticket, same parcel"
      hint="Buy €10 of credits, then simulate the things that happen in real life."
      onReset={() => {
        setCharges([]);
        setSeen({});
        setLog([]);
        setActionKey("a1f9");
      }}
    >
      <Switch checked={useKey} onChange={setUseKey} label="Send an Idempotency-Key header" />
      <div className="mt-3 flex flex-wrap gap-2">
        <ActionButton onClick={() => request("Click 'Buy'")}>Click &apos;Buy&apos;</ActionButton>
        <ActionButton variant="secondary" onClick={() => request("Impatient double-click")}>
          Double-click
        </ActionButton>
        <ActionButton variant="secondary" onClick={() => request("Timeout → automatic retry")}>
          Network timeout, retry
        </ActionButton>
        <ActionButton
          variant="secondary"
          onClick={() => {
            setActionKey(Math.random().toString(16).slice(2, 6));
            setLog((l) => ["(new purchase: a fresh key is created)", ...l]);
          }}
        >
          Start a new purchase
        </ActionButton>
      </div>
      <ul className="mt-3 max-h-28 space-y-0.5 overflow-auto font-mono text-[10px]" aria-live="polite">
        {log.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
      <p className="mt-2 rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: `color-mix(in srgb, ${charges.length > 1 && !useKey ? "var(--bad)" : "var(--surface-2)"} 30%, transparent)` }}>
        Card charged <strong>€{total}</strong> in {charges.length} charge{charges.length === 1 ? "" : "s"}.
        {useKey ? ` Current key: ${actionKey}` : charges.length > 1 ? " The customer meant to pay once." : ""}
      </p>
    </DemoFrame>
  );
}

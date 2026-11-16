"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";
import { Switch } from "@/components/ui/Switch";

type State = { credits: number; usage: string[]; log: string[] };
const START: State = { credits: 100, usage: [], log: [] };

export default function TransactionDemo() {
  const [tx, setTx] = React.useState(false);
  const [crash, setCrash] = React.useState(true);
  const [s, setS] = React.useState<State>(START);

  function charge() {
    const log: string[] = [];
    let credits = s.credits;
    const usage = [...s.usage];
    if (tx) log.push("BEGIN");
    credits -= 10;
    log.push("UPDATE accounts SET credits = credits - 10");
    if (crash) {
      log.push("💥 server crashed before the second write");
      if (tx) {
        log.push("ROLLBACK (automatic): the first write is undone");
        setS({ credits: s.credits, usage, log });
      } else {
        setS({ credits, usage, log });
      }
      return;
    }
    usage.push(`answer #${usage.length + 1} · 10 credits`);
    log.push("INSERT INTO usage (...)");
    if (tx) log.push("COMMIT");
    setS({ credits, usage, log });
  }

  const charged = START.credits - s.credits;
  const recorded = s.usage.length * 10;
  const broken = charged !== recorded;

  return (
    <DemoFrame
      title="Both steps, or neither"
      hint="Charging for an answer needs two writes: take credits, record usage."
      onReset={() => {
        setS(START);
        setTx(false);
        setCrash(true);
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Switch checked={tx} onChange={setTx} label="Wrap in a transaction" />
        <Switch checked={crash} onChange={setCrash} label="Crash between the writes" />
        <ActionButton onClick={charge}>Charge 10 credits</ActionButton>
      </div>
      <pre className="mt-3 min-h-20 rounded-lg bg-neutral-950 p-2 font-mono text-[10px] leading-relaxed text-neutral-200">
        {s.log.length ? s.log.join("\n") : "(no writes yet)"}
      </pre>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs" aria-live="polite">
        <div className="rounded-lg bg-surface p-2">
          <div className="text-muted">accounts.credits</div>
          <div className="font-mono text-lg">{s.credits}</div>
        </div>
        <div className="rounded-lg bg-surface p-2">
          <div className="text-muted">usage rows</div>
          <div className="font-mono text-[11px]">{s.usage.length ? s.usage.join(", ") : "none"}</div>
        </div>
      </div>
      <p className="mt-2 text-xs" style={{ color: broken ? "var(--bad)" : "var(--good)" }}>
        {broken
          ? `⚠ ${charged - recorded} credits were taken with no record of what for. The customer paid for nothing.`
          : "Consistent: every credit taken has a matching usage record."}
      </p>
    </DemoFrame>
  );
}

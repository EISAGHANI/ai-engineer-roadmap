"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";

type State = "pending" | "auto" | "waiting" | "approved" | "rejected";
const PLAN = [
  { tool: "search_orders", args: "customer=sara.malik@example.com", risky: false },
  { tool: "read_ticket", args: "#4471 'Parcel arrived broken'", risky: false },
  { tool: "refund_order", args: "order=8812 · amount=120 EUR", risky: true },
  { tool: "send_email", args: "to=sara.malik@example.com · 'Your refund is on its way'", risky: true },
  { tool: "close_ticket", args: "#4471", risky: false },
];

export default function HumanApprovalDemo() {
  const [states, setStates] = React.useState<State[]>(PLAN.map(() => "pending"));
  const [amount, setAmount] = React.useState(120);
  const cur = states.findIndex((s) => s === "pending" || s === "waiting");
  const done = cur === -1;

  function advance() {
    if (done) return;
    const st = [...states];
    st[cur] = PLAN[cur].risky ? "waiting" : "auto";
    setStates(st);
  }
  function decide(ok: boolean) {
    const st = [...states];
    st[cur] = ok ? "approved" : "rejected";
    // If the refund is rejected, the follow-up email makes no sense: skip it
    if (!ok && PLAN[cur].tool === "refund_order") st[cur + 1] = "rejected";
    setStates(st);
  }

  const waiting = !done && states[cur] === "waiting";

  return (
    <DemoFrame
      title="The captain signs before the gate opens"
      hint="A support agent handles a broken-parcel ticket. Risky steps wait for a person."
      onReset={() => {
        setStates(PLAN.map(() => "pending"));
        setAmount(120);
      }}
    >
      <ol className="space-y-1 text-[11px]">
        {PLAN.map((p, i) => {
          const s = states[i];
          const bg =
            s === "auto" || s === "approved"
              ? "color-mix(in srgb, var(--good) 14%, transparent)"
              : s === "waiting"
                ? "color-mix(in srgb, var(--warn) 22%, transparent)"
                : s === "rejected"
                  ? "color-mix(in srgb, var(--bad) 14%, transparent)"
                  : "var(--surface)";
          return (
            <li key={p.tool} className="flex items-center gap-2 rounded px-2 py-1" style={{ backgroundColor: bg }}>
              <span className="w-4">{p.risky ? "⚠" : ""}</span>
              <span className="font-mono">{p.tool}</span>
              <span className="flex-1 truncate text-muted">{p.tool === "refund_order" ? `order=8812 · amount=${amount} EUR` : p.args}</span>
              <span className="font-mono text-[10px]">{s === "pending" ? "" : s === "auto" ? "ran" : s === "waiting" ? "needs approval" : s}</span>
            </li>
          );
        })}
      </ol>
      {waiting ? (
        <div className="mt-3 rounded-lg border p-2 text-xs" style={{ borderColor: "var(--warn)" }} aria-live="polite">
          <div className="font-medium">Approval needed: {PLAN[cur].tool}</div>
          {PLAN[cur].tool === "refund_order" ? (
            <label className="mt-1 flex items-center gap-2">
              Refund amount (EUR)
              <input type="number" value={amount} min={0} onChange={(e) => setAmount(+e.target.value)} className="w-20 rounded border border-border bg-surface px-1 font-mono" />
              <span className="text-muted">(order total was 49.90)</span>
            </label>
          ) : (
            <div className="mt-1 text-muted">{PLAN[cur].args}</div>
          )}
          <div className="mt-2 flex gap-2">
            <ActionButton onClick={() => decide(true)}>Approve</ActionButton>
            <ActionButton variant="secondary" onClick={() => decide(false)}>
              Reject
            </ActionButton>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <ActionButton onClick={advance} disabled={done}>
            {done ? "Run finished" : "Agent: next step"}
          </ActionButton>
        </div>
      )}
      {done && (
        <p className="mt-2 text-xs text-muted">
          {states[2] === "approved" && amount > 49.9
            ? `Approved ${amount} EUR for a 49.90 EUR order. Read the numbers before you click: approvals only help if someone checks them.`
            : "Safe steps ran on their own; the person only decided the two that can't be undone."}
        </p>
      )}
    </DemoFrame>
  );
}

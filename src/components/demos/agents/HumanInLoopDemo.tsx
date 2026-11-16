"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, ChoiceChips, Panel } from "../ui";

const LIMIT = 20;
const CASES = [
  { id: "small", label: "Refund 8 €", amount: 8, customer: "#2201", reason: "Late delivery" },
  { id: "big", label: "Refund 120 €", amount: 120, customer: "#4411", reason: "Charged twice for a yearly plan" },
] as const;
type CaseId = (typeof CASES)[number]["id"];
type Decision = null | "approved" | "edited" | "rejected";

export default function HumanInLoopDemo() {
  const [cid, setCid] = React.useState<CaseId>("big");
  const [amount, setAmount] = React.useState(120);
  const [decision, setDecision] = React.useState<Decision>(null);
  const c = CASES.find((x) => x.id === cid) ?? CASES[0];
  const needsApproval = c.amount > LIMIT;

  function pick(id: CaseId) {
    setCid(id);
    setAmount(CASES.find((x) => x.id === id)?.amount ?? 0);
    setDecision(null);
  }

  return (
    <DemoFrame title="The robot asks before paying" hint={`Rule: refunds above ${LIMIT} € need a person to approve.`} onReset={() => pick("big")}>
      <ChoiceChips label="Agent wants to" options={CASES.map((x) => ({ id: x.id, label: x.label }))} value={cid} onChange={pick} />
      {!needsApproval ? (
        <Panel className="mt-3" title="auto-approved (below the limit)" tint="var(--good)">
          <p className="text-xs">Refunded {c.amount} € to customer {c.customer}. Logged for the daily review.</p>
        </Panel>
      ) : (
        <>
          <Panel className="mt-3" title="⏸ paused: waiting for a human" tint="var(--warn)">
            <dl className="grid grid-cols-[6rem_1fr] gap-x-2 font-mono text-[11px]">
              <dt className="text-muted">action</dt>
              <dd>refund</dd>
              <dt className="text-muted">customer</dt>
              <dd>{c.customer}</dd>
              <dt className="text-muted">amount</dt>
              <dd>{amount} €</dd>
              <dt className="text-muted">reason</dt>
              <dd>{c.reason}</dd>
            </dl>
          </Panel>
          {decision === null && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <ActionButton onClick={() => setDecision(amount === c.amount ? "approved" : "edited")}>Approve</ActionButton>
              <label className="flex items-center gap-1 text-xs text-muted">
                Edit amount
                <input
                  type="range"
                  min={0}
                  max={c.amount}
                  step={10}
                  value={amount}
                  onChange={(e) => setAmount(+e.target.value)}
                  aria-valuetext={`${amount} euros`}
                  className="w-24 accent-[var(--accent)]"
                />
              </label>
              <ActionButton variant="secondary" onClick={() => setDecision("rejected")}>
                Reject
              </ActionButton>
            </div>
          )}
          {decision && (
            <Panel className="mt-2" title="result" tint={decision === "rejected" ? "var(--bad)" : "var(--good)"}>
              <p className="text-xs" aria-live="polite">
                {decision === "rejected"
                  ? "Not refunded. The agent tells the customer a colleague will review the case."
                  : `Refunded ${amount} € to ${c.customer}${decision === "edited" ? " (amount changed by the reviewer)" : ""}. Approval logged with your name.`}
              </p>
            </Panel>
          )}
        </>
      )}
    </DemoFrame>
  );
}

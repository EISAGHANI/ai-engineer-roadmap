"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";

type Entry = { ts: string; actor: string; onBehalfOf: string; action: string; args: string; outcome: string; hash: string };

function h(s: string) {
  let x = 2166136261;
  for (let i = 0; i < s.length; i++) x = Math.imul(x ^ s.charCodeAt(i), 16777619);
  return (x >>> 0).toString(16).padStart(8, "0").slice(0, 6);
}
function chain(rows: Omit<Entry, "hash">[]): Entry[] {
  let prev = "genesis";
  return rows.map((r) => {
    const hash = h(prev + JSON.stringify(r));
    prev = hash;
    return { ...r, hash };
  });
}

const BASE = [
  { ts: "09:12", actor: "agent:support-bot", onBehalfOf: "user:sara", action: "tool:search_orders", args: "email=s***@example.com", outcome: "ok" },
  { ts: "09:13", actor: "agent:support-bot", onBehalfOf: "user:sara", action: "tool:refund_order", args: "order=8812 amount=40", outcome: "ok (under 50 EUR)" },
  { ts: "10:40", actor: "agent:support-bot", onBehalfOf: "user:omar", action: "guardrail:input", args: "injection score 0.93", outcome: "blocked" },
  { ts: "11:02", actor: "agent:support-bot", onBehalfOf: "user:omar", action: "tool:delete_customer", args: "id=c_771", outcome: "approval requested" },
  { ts: "11:05", actor: "user:jan (support lead)", onBehalfOf: "-", action: "approval", args: "request=ap_19", outcome: "approved" },
  { ts: "11:05", actor: "agent:support-bot", onBehalfOf: "user:omar", action: "tool:delete_customer", args: "id=c_771", outcome: "deleted" },
];

export default function AuditLogDemo() {
  const original = React.useMemo(() => chain(BASE), []);
  const [rows, setRows] = React.useState<Entry[]>(original);
  const [filter, setFilter] = React.useState("");
  const [verified, setVerified] = React.useState<null | number>(null);

  function tamper() {
    // Someone with database access edits the approval row to hide who approved
    setRows(rows.map((r, i) => (i === 4 ? { ...r, actor: "system", outcome: "auto-approved" } : r)));
    setVerified(null);
  }
  function verify() {
    let prev = "genesis";
    for (let i = 0; i < rows.length; i++) {
      const { hash, ...rest } = rows[i];
      const expect = h(prev + JSON.stringify(rest));
      if (expect !== hash) return setVerified(i);
      prev = hash;
    }
    setVerified(-1);
  }

  const f = filter.toLowerCase();
  const visible = rows.filter((r) => !f || Object.values(r).join(" ").toLowerCase().includes(f));

  return (
    <DemoFrame
      title="The gatehouse book"
      hint="Customer c_771 was deleted. Who asked, who approved, and can the record be trusted?"
      onReset={() => {
        setRows(original);
        setFilter("");
        setVerified(null);
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="filter, e.g. c_771 or omar" aria-label="Filter audit log" className="w-48 rounded-md border border-border bg-surface px-2 py-1 font-mono text-[11px]" />
        <ActionButton variant="secondary" onClick={tamper}>
          🕵️ Someone edits a row
        </ActionButton>
        <ActionButton onClick={verify}>Verify the chain</ActionButton>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left font-mono text-[10px]">
          <thead className="text-muted">
            <tr>
              <th className="font-normal">time</th>
              <th className="font-normal">actor</th>
              <th className="font-normal">for</th>
              <th className="font-normal">action</th>
              <th className="font-normal">outcome</th>
              <th className="font-normal">hash</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => {
              const idx = rows.indexOf(r);
              const broken = verified !== null && verified >= 0 && idx >= verified;
              return (
                <tr key={idx} className="border-t border-border" style={{ backgroundColor: broken ? "color-mix(in srgb, var(--bad) 14%, transparent)" : undefined }}>
                  <td className="py-0.5">{r.ts}</td>
                  <td>{r.actor}</td>
                  <td>{r.onBehalfOf}</td>
                  <td title={r.args}>{r.action}</td>
                  <td>{r.outcome}</td>
                  <td className="text-muted">{r.hash}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs" aria-live="polite">
        {verified === null && "Each row's hash includes the previous row's hash, like stitched pages."}
        {verified === -1 && <span style={{ color: "var(--good)" }}>✓ Chain intact: Omar asked, Jan approved at 11:05, the agent deleted c_771.</span>}
        {verified !== null && verified >= 0 && <span style={{ color: "var(--bad)" }}>✗ Row {verified + 1} was changed after it was written. The log shows exactly where someone tampered.</span>}
      </p>
    </DemoFrame>
  );
}

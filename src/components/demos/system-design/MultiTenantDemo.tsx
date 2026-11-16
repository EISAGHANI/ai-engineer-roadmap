"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";
import { Switch } from "@/components/ui/Switch";

type Tenant = "acme" | "bolt";
const CHUNKS = [
  { tenant: "acme", text: "Acme: staff get 30 holiday days.", score: 0.91 },
  { tenant: "bolt", text: "Bolt: staff get 25 holiday days.", score: 0.9 },
  { tenant: "bolt", text: "Bolt salary bands 2026 (confidential).", score: 0.84 },
  { tenant: "acme", text: "Acme: book holidays in the HR portal.", score: 0.83 },
  { tenant: "acme", text: "Acme: unused days expire in March.", score: 0.8 },
] as const;
const NAMES: Record<Tenant, string> = { acme: "Acme", bolt: "Bolt" };

export default function MultiTenantDemo() {
  const [asTenant, setAsTenant] = React.useState<Tenant>("acme");
  const [filter, setFilter] = React.useState(false);
  const [quota, setQuota] = React.useState(false);
  const [boltJob, setBoltJob] = React.useState(true);

  const results = CHUNKS.filter((c) => !filter || c.tenant === asTenant).slice(0, 3);
  const leaked = results.filter((c) => c.tenant !== asTenant);
  // Shared GPU / rate limit: 100 units. Bolt's batch job wants 95.
  const boltUse = boltJob ? (quota ? 50 : 95) : 10;
  const acmeShare = Math.min(40, 100 - boltUse);
  const acmeSlow = acmeShare < 20;

  return (
    <DemoFrame
      title="One kitchen, many restaurants"
      hint="Two customers share one RAG system. Check isolation and fairness."
      onReset={() => {
        setAsTenant("acme");
        setFilter(false);
        setQuota(false);
        setBoltJob(true);
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <ChoiceChips
          label="Logged in as"
          options={[
            { id: "acme", label: "Acme employee" },
            { id: "bolt", label: "Bolt employee" },
          ]}
          value={asTenant}
          onChange={setAsTenant}
        />
        <Switch checked={filter} onChange={setFilter} label="tenant_id filter (row-level security)" />
      </div>
      <p className="mt-2 text-xs text-muted">Question: &quot;How many holiday days do we get?&quot; · top 3 chunks:</p>
      <ul className="mt-1 space-y-0.5 text-[11px]" aria-live="polite">
        {results.map((c) => (
          <li
            key={c.text}
            className="flex justify-between rounded px-2 py-0.5"
            style={{ backgroundColor: c.tenant !== asTenant ? "color-mix(in srgb, var(--bad) 20%, transparent)" : "var(--surface)" }}
          >
            <span>{c.text}</span>
            <span className="font-mono text-muted">{NAMES[c.tenant]}</span>
          </li>
        ))}
      </ul>
      {leaked.length > 0 && (
        <p className="mt-1 text-[11px]" style={{ color: "var(--bad)" }}>
          ⚠ {leaked.length} chunk{leaked.length > 1 ? "s" : ""} from another company went to the model. The answer may mix them up or reveal them.
        </p>
      )}
      <div className="mt-3 border-t border-border pt-2">
        <div className="flex flex-wrap gap-3">
          <Switch checked={boltJob} onChange={setBoltJob} label="Bolt runs a huge import" />
          <Switch checked={quota} onChange={setQuota} label="Per-tenant quota" />
        </div>
        <div className="mt-2 flex h-5 w-full overflow-hidden rounded-md text-[10px]">
          <span className="flex items-center justify-center" style={{ width: `${boltUse}%`, backgroundColor: "color-mix(in srgb, var(--area-security) 45%, transparent)" }}>
            Bolt {boltUse}%
          </span>
          <span className="flex items-center justify-center" style={{ width: `${acmeShare}%`, backgroundColor: "color-mix(in srgb, var(--area-rag) 45%, transparent)" }}>
            Acme
          </span>
        </div>
        <p className="mt-1 text-[11px]" style={{ color: acmeSlow ? "var(--bad)" : "var(--good)" }}>
          {acmeSlow ? "Noisy neighbour: Acme's users wait because Bolt is using almost everything." : "Fair: each customer keeps enough capacity."}
        </p>
      </div>
    </DemoFrame>
  );
}

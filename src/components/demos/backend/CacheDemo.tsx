"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";
import { Switch } from "@/components/ui/Switch";

const QUESTIONS = ["How many holiday days do I get?", "What's the expense limit for hotels?", "How many holiday days do I get?", "Who approves overtime?", "How many holiday days do I get?", "What's the expense limit for hotels?"];
const LLM_MS = 2100;
const LLM_COST = 0.004;

type Row = { q: string; hit: boolean; ms: number; stale?: boolean };

export default function CacheDemo() {
  const [tenantInKey, setTenantInKey] = React.useState(true);
  const [rows, setRows] = React.useState<Row[]>([]);
  const [store, setStore] = React.useState<Record<string, number>>({}); // key -> policy version
  const [policyVersion, setPolicyVersion] = React.useState(1);

  function ask() {
    const q = QUESTIONS[rows.length % QUESTIONS.length];
    const key = `answer:${q.toLowerCase()}`;
    const cachedVersion = store[key];
    if (cachedVersion !== undefined) {
      setRows([...rows, { q, hit: true, ms: 1, stale: cachedVersion !== policyVersion }]);
    } else {
      setRows([...rows, { q, hit: false, ms: LLM_MS }]);
      setStore({ ...store, [key]: policyVersion });
    }
  }

  const hits = rows.filter((r) => r.hit).length;
  const cost = (rows.length - hits) * LLM_COST;
  const anyStale = rows.some((r) => r.stale);

  return (
    <DemoFrame
      title="The answer board by the window"
      hint="Ask questions; repeats are served from Redis. Then change the policy."
      onReset={() => {
        setRows([]);
        setStore({});
        setPolicyVersion(1);
        setTenantInKey(true);
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <ActionButton onClick={ask}>Ask the next question</ActionButton>
        <ActionButton variant="secondary" onClick={() => setPolicyVersion((v) => v + 1)}>
          Update the holiday policy
        </ActionButton>
        <ActionButton
          variant="secondary"
          onClick={() => {
            setStore({});
          }}
        >
          Invalidate cache
        </ActionButton>
      </div>
      <ul className="mt-3 max-h-36 space-y-0.5 overflow-auto text-[11px]" aria-live="polite">
        {rows.map((r, i) => (
          <li key={i} className="flex items-center gap-2 rounded px-2 py-0.5" style={{ backgroundColor: r.stale ? "color-mix(in srgb, var(--bad) 14%, transparent)" : "var(--surface)" }}>
            <span className="w-14 font-mono" style={{ color: r.hit ? "var(--good)" : "var(--warn)" }}>
              {r.hit ? "HIT" : "MISS"}
            </span>
            <span className="flex-1 truncate">{r.q}</span>
            <span className="font-mono text-muted">{r.ms < 10 ? "1 ms" : "2.1 s"}</span>
            {r.stale && <span style={{ color: "var(--bad)" }}>old answer!</span>}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs">
        Hit rate <strong>{rows.length ? Math.round((hits / rows.length) * 100) : 0}%</strong> · LLM cost <strong>${cost.toFixed(3)}</strong> instead of $
        {(rows.length * LLM_COST).toFixed(3)}
      </p>
      {anyStale && <p className="mt-1 text-[11px]" style={{ color: "var(--bad)" }}>The policy changed but the cache didn&apos;t. Add a TTL, or invalidate when documents change.</p>}
      <div className="mt-2">
        <Switch checked={tenantInKey} onChange={setTenantInKey} label="Tenant id is part of the cache key" />
        {!tenantInKey && (
          <p className="mt-1 text-[11px]" style={{ color: "var(--bad)" }}>
            ⚠ Acme&apos;s cached answer about Acme&apos;s holidays would now be served to Bolt&apos;s employees too.
          </p>
        )}
      </div>
    </DemoFrame>
  );
}

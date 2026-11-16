"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";
import { Switch } from "@/components/ui/Switch";

type Segment = "everyone" | "pro" | "staff";
/** 40 users with a stable hash bucket (0-99) and a plan. */
const USERS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  bucket: (i * 37 + 11) % 100,
  plan: i % 5 === 0 ? "staff" : i % 3 === 0 ? "pro" : "free",
}));

export default function FeatureFlagsDemo() {
  const [percent, setPercent] = React.useState(10);
  const [segment, setSegment] = React.useState<Segment>("everyone");
  const [kill, setKill] = React.useState(false);

  const on = (u: (typeof USERS)[number]) => {
    if (kill) return false;
    if (segment === "staff" && u.plan !== "staff") return false;
    if (segment === "pro" && u.plan === "free") return false;
    return u.bucket < percent;
  };
  const count = USERS.filter(on).length;

  return (
    <DemoFrame
      title="Switches in the office"
      hint="Flag: agentic-search. Same code everywhere; the flag decides who sees it."
      onReset={() => {
        setPercent(10);
        setSegment("everyone");
        setKill(false);
      }}
    >
      <div className="flex flex-wrap items-end gap-4">
        <ChoiceChips
          label="Who can get it"
          options={[
            { id: "staff", label: "Staff only" },
            { id: "pro", label: "Pro + staff" },
            { id: "everyone", label: "Everyone" },
          ]}
          value={segment}
          onChange={setSegment}
        />
        <label className="text-xs text-muted">
          rollout: <span className="font-mono text-text">{percent}%</span>
          <input type="range" min={0} max={100} step={5} value={percent} onChange={(e) => setPercent(+e.target.value)} className="mt-1 block w-36 accent-[var(--accent)]" />
        </label>
        <Switch checked={kill} onChange={setKill} label="🛑 Kill switch" />
      </div>
      <ul className="mt-3 grid grid-cols-10 gap-1" aria-label={`${count} of ${USERS.length} users see the new feature`}>
        {USERS.map((u) => (
          <li
            key={u.id}
            title={`user ${u.id} · ${u.plan} · bucket ${u.bucket}`}
            className="flex aspect-square items-center justify-center rounded-md text-[10px] transition-colors"
            style={{ backgroundColor: on(u) ? "color-mix(in srgb, var(--area-deployment) 55%, transparent)" : "var(--surface)" }}
          >
            {u.plan === "staff" ? "👷" : u.plan === "pro" ? "⭐" : "🙂"}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs" aria-live="polite">
        <strong>{count}</strong> of {USERS.length} users see the new search.{" "}
        {kill ? "Kill switch on: everyone is back on the old search instantly, with no deploy." : "Each user keeps the same answer on every visit (stable bucket)."}
      </p>
    </DemoFrame>
  );
}

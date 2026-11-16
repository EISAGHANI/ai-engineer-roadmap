"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

type User = "maid" | "treasurer" | "hr";
type Mode = "service" | "user";
const USERS: Record<User, { label: string; perms: string[] }> = {
  maid: { label: "Kitchen maid", perms: ["own_record", "kitchen_rota"] },
  treasurer: { label: "Treasurer", perms: ["own_record", "ledger"] },
  hr: { label: "HR officer", perms: ["own_record", "all_records"] },
};
const REQUESTS = [
  { ask: "Show my holiday balance", needs: "own_record" },
  { ask: "Show this week's kitchen rota", needs: "kitchen_rota" },
  { ask: "Show the treasury ledger", needs: "ledger" },
  { ask: "Show Omar's salary and sick days", needs: "all_records" },
];

export default function AgentAuthzDemo() {
  const [user, setUser] = React.useState<User>("maid");
  const [mode, setMode] = React.useState<Mode>("service");
  const perms = USERS[user].perms;

  return (
    <DemoFrame
      title="The messenger carries the guest's pass"
      hint="An assistant agent fetches data with tools. Whose permissions does it use?"
      onReset={() => {
        setUser("maid");
        setMode("service");
      }}
    >
      <div className="flex flex-wrap gap-3">
        <ChoiceChips label="Logged in as" options={(Object.keys(USERS) as User[]).map((k) => ({ id: k, label: USERS[k].label }))} value={user} onChange={setUser} />
        <ChoiceChips
          label="Tools run as"
          options={[
            { id: "service", label: "Agent's admin account" },
            { id: "user", label: "The logged-in user" },
          ]}
          value={mode}
          onChange={setMode}
        />
      </div>
      <ul className="mt-3 space-y-0.5 text-[11px]" aria-live="polite">
        {REQUESTS.map((r) => {
          const allowedForUser = perms.includes(r.needs);
          const granted = mode === "service" ? true : allowedForUser;
          const wrong = granted && !allowedForUser;
          return (
            <li
              key={r.ask}
              className="flex justify-between gap-2 rounded px-2 py-1"
              style={{ backgroundColor: wrong ? "color-mix(in srgb, var(--bad) 18%, transparent)" : granted ? "color-mix(in srgb, var(--good) 12%, transparent)" : "var(--surface)" }}
            >
              <span>{r.ask}</span>
              <span className="font-mono">{granted ? (wrong ? "✓ shown (should be denied!)" : "✓ shown") : "✗ 403 not allowed"}</span>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs text-muted">
        {mode === "service"
          ? "With one powerful account, anyone who can chat with the agent can see everything. The prompt saying 'only show allowed data' is not a lock."
          : "Every tool call checks the user's own permissions, so the agent can't be talked into more than the user may do."}
      </p>
    </DemoFrame>
  );
}

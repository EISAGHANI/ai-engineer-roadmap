"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

type Role = "intern" | "manager" | "hr";
type Mode = "none" | "after" | "search";
const DOCS = [
  { title: "Salary bands 2026", groups: ["hr"], score: 0.93 },
  { title: "Manager bonus guide", groups: ["manager", "hr"], score: 0.9 },
  { title: "Board pay review (draft)", groups: ["hr"], score: 0.88 },
  { title: "Pay day calendar", groups: ["everyone"], score: 0.8 },
  { title: "How to read your payslip", groups: ["everyone"], score: 0.78 },
  { title: "Overtime pay rules", groups: ["everyone"], score: 0.74 },
];
const K = 3;

export default function RagAccessDemo() {
  const [role, setRole] = React.useState<Role>("intern");
  const [mode, setMode] = React.useState<Mode>("none");
  const allowed = (g: string[]) => g.includes("everyone") || g.includes(role);

  let shown: typeof DOCS;
  let fetchedRestricted = 0;
  if (mode === "none") {
    shown = DOCS.slice(0, K);
  } else if (mode === "after") {
    const top = DOCS.slice(0, K);
    fetchedRestricted = top.filter((d) => !allowed(d.groups)).length;
    shown = top.filter((d) => allowed(d.groups));
  } else {
    shown = DOCS.filter((d) => allowed(d.groups)).slice(0, K);
  }
  const leaks = shown.filter((d) => !allowed(d.groups)).length;

  return (
    <DemoFrame
      title="The librarian checks your pass first"
      hint={`Question: "How does pay work here?" · the top ${K} chunks go to the model.`}
      onReset={() => {
        setRole("intern");
        setMode("none");
      }}
    >
      <div className="flex flex-wrap gap-3">
        <ChoiceChips
          label="User"
          options={[
            { id: "intern", label: "Intern" },
            { id: "manager", label: "Manager" },
            { id: "hr", label: "HR" },
          ]}
          value={role}
          onChange={setRole}
        />
        <ChoiceChips
          label="Permission check"
          options={[
            { id: "none", label: "None" },
            { id: "after", label: "Filter after search" },
            { id: "search", label: "Filter inside the search" },
          ]}
          value={mode}
          onChange={setMode}
        />
      </div>
      <ul className="mt-3 space-y-0.5 text-[11px]" aria-live="polite">
        {shown.map((d) => (
          <li key={d.title} className="flex justify-between rounded px-2 py-1" style={{ backgroundColor: allowed(d.groups) ? "var(--surface)" : "color-mix(in srgb, var(--bad) 18%, transparent)" }}>
            <span>{d.title}</span>
            <span className="font-mono text-muted">{d.groups.join(", ")}</span>
          </li>
        ))}
        {shown.length === 0 && <li className="rounded bg-surface px-2 py-1 text-muted">(nothing left)</li>}
      </ul>
      <p className="mt-2 text-xs">
        {leaks > 0 && <span style={{ color: "var(--bad)" }}>⚠ {leaks} restricted document{leaks > 1 ? "s" : ""} reached the model. </span>}
        {mode === "after" && fetchedRestricted > 0 && (
          <span style={{ color: "var(--warn)" }}>
            {fetchedRestricted} restricted chunk{fetchedRestricted > 1 ? "s were" : " was"} fetched (and maybe logged) then dropped, leaving only {shown.length} of {K} results.{" "}
          </span>
        )}
        {mode === "search" && <span style={{ color: "var(--good)" }}>Only allowed documents were ever searched, and the user still gets {shown.length} good results.</span>}
      </p>
    </DemoFrame>
  );
}

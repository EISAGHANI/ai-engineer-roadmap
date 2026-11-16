"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, ChoiceChips, ScoreBar } from "../ui";

const VERSIONS = [
  { v: 1, note: "First version", score: 0.78, cost: 0.011, p95: 3.1 },
  { v: 2, note: "Adds 'cite the rule number'", score: 0.86, cost: 0.012, p95: 3.3 },
  { v: 3, note: "Shorter context, 3 chunks instead of 6", score: 0.88, cost: 0.007, p95: 2.2 },
];
type Tab = "prompts" | "scores";

export default function LangfuseDemo() {
  const [tab, setTab] = React.useState<Tab>("prompts");
  const [production, setProduction] = React.useState(2);
  const [staging, setStaging] = React.useState(3);

  function promote() {
    setProduction(staging);
  }

  return (
    <DemoFrame
      title="The school's control room"
      hint="Versioned prompts with labels, and quality, cost and speed per version."
      onReset={() => {
        setTab("prompts");
        setProduction(2);
        setStaging(3);
      }}
    >
      <ChoiceChips
        label="View"
        options={[
          { id: "prompts", label: "Prompt management" },
          { id: "scores", label: "Scores per version" },
        ]}
        value={tab}
        onChange={setTab}
      />
      {tab === "prompts" ? (
        <>
          <table className="mt-3 w-full text-left text-xs">
            <thead className="text-muted">
              <tr>
                <th className="font-normal">library-bot</th>
                <th className="font-normal">Change</th>
                <th className="font-normal">Labels</th>
              </tr>
            </thead>
            <tbody>
              {VERSIONS.map((ver) => (
                <tr key={ver.v} className="border-t border-border">
                  <td className="py-1 font-mono">v{ver.v}</td>
                  <td className="py-1">{ver.note}</td>
                  <td className="py-1">
                    {production === ver.v && <span className="mr-1 rounded-full px-2 text-[10px]" style={{ backgroundColor: "color-mix(in srgb, var(--good) 25%, transparent)" }}>production</span>}
                    {staging === ver.v && production !== ver.v && (
                      <span className="rounded-full px-2 text-[10px]" style={{ backgroundColor: "color-mix(in srgb, var(--warn) 25%, transparent)" }}>staging</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 flex items-center gap-2">
            <ActionButton onClick={promote} disabled={production === staging}>
              Promote v{staging} to production
            </ActionButton>
            <span className="text-xs text-muted" aria-live="polite">
              {production === staging ? `The app now fetches v${production}. No deploy needed.` : `The app fetches the prompt labelled production (v${production}).`}
            </span>
          </div>
        </>
      ) : (
        <ul className="mt-3 space-y-2">
          {VERSIONS.map((ver) => (
            <li key={ver.v} className="grid grid-cols-[2rem_1fr_5rem_5rem] items-center gap-2 text-xs">
              <span className="font-mono">v{ver.v}</span>
              <span>
                <ScoreBar value={ver.score} color="var(--area-evals)" />
              </span>
              <span className="font-mono">{Math.round(ver.score * 100)}% pass</span>
              <span className="font-mono text-muted">
                ${ver.cost} · {ver.p95}s
              </span>
            </li>
          ))}
          <li className="text-xs text-muted">v3 is better, cheaper and faster: the numbers say it is safe to promote.</li>
        </ul>
      )}
    </DemoFrame>
  );
}

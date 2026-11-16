"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

const CASES = [
  { q: "How long can I borrow a book?", expected: "3 weeks", v1: true, v2: true },
  { q: "Can I renew online?", expected: "Yes, up to 2 times", v1: false, v2: true },
  { q: "Fine for a late book?", expected: "10 cents per day", v1: true, v2: true },
  { q: "Opening hours on Saturday?", expected: "09:00-14:00", v1: true, v2: false },
  { q: "Can I bring my dog?", expected: "Only guide dogs", v1: false, v2: true },
  { q: "Wi-Fi password?", expected: "Ask at the desk", v1: true, v2: true },
];

type Version = "none" | "v1" | "v2";

export default function GoldenDatasetDemo() {
  const [version, setVersion] = React.useState<Version>("none");
  const score = (v: "v1" | "v2") => CASES.filter((c) => c[v]).length;

  return (
    <DemoFrame title="The answer key in the drawer" hint="Run the same 6 golden questions against two prompt versions." onReset={() => setVersion("none")}>
      <ChoiceChips
        label="Run"
        options={[
          { id: "none", label: "Not run yet" },
          { id: "v1", label: "Prompt v1" },
          { id: "v2", label: "Prompt v2 (new)" },
        ]}
        value={version}
        onChange={setVersion}
      />
      <table className="mt-3 w-full text-left text-xs">
        <thead className="text-muted">
          <tr>
            <th className="font-normal">Question</th>
            <th className="font-normal">Expected</th>
            <th className="text-center font-normal">v1</th>
            <th className="text-center font-normal">v2</th>
          </tr>
        </thead>
        <tbody>
          {CASES.map((c) => {
            const regression = c.v1 && !c.v2;
            return (
              <tr key={c.q} className="border-t border-border" style={version === "v2" && regression ? { backgroundColor: "color-mix(in srgb, var(--bad) 14%, transparent)" } : undefined}>
                <td className="py-1">{c.q}</td>
                <td className="py-1 text-muted">{c.expected}</td>
                {(["v1", "v2"] as const).map((v) => (
                  <td key={v} className="py-1 text-center font-mono">
                    {version === "none" || (v === "v2" && version === "v1") ? "·" : c[v] ? <span style={{ color: "var(--good)" }}>✓</span> : <span style={{ color: "var(--bad)" }}>✗</span>}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-2 text-xs" aria-live="polite">
        {version === "none" && "Pick a version to run the test."}
        {version === "v1" && `v1 passes ${score("v1")} of ${CASES.length}.`}
        {version === "v2" &&
          `v2 passes ${score("v2")} of ${CASES.length}: better overall, but it broke the Saturday hours question (red). Without the fixed test you would never notice.`}
      </p>
    </DemoFrame>
  );
}

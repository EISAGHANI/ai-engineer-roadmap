"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

type Call = { name: string; args: string } | null;
const CASES: Array<{ input: string; expected: Call; v1: Call; v2: Call }> = [
  {
    input: "Weather in Paris tomorrow?",
    expected: { name: "get_forecast", args: "city=Paris, days=1" },
    v1: { name: "get_forecast", args: "city=Paris, days=1" },
    v2: { name: "get_forecast", args: "city=Paris, days=1" },
  },
  {
    input: "Book a table for 4 at 19:00",
    expected: { name: "book_table", args: "people=4, time=19:00" },
    v1: { name: "book_table", args: "people=4, time=07:00" },
    v2: { name: "book_table", args: "people=4, time=19:00" },
  },
  {
    input: "What's on my calendar on Friday?",
    expected: { name: "list_events", args: "day=Friday" },
    v1: { name: "get_forecast", args: "day=Friday" },
    v2: { name: "list_events", args: "day=Friday" },
  },
  {
    input: "Hi, how are you?",
    expected: null,
    v1: { name: "list_events", args: "day=today" },
    v2: null,
  },
];

const show = (c: Call) => (c ? `${c.name}(${c.args})` : "no tool");
const same = (a: Call, b: Call) => (a === null || b === null ? a === b : a.name === b.name && a.args === b.args);

function errorType(actual: Call, expected: Call) {
  if (same(actual, expected)) return null;
  if (expected === null) return "unnecessary call";
  if (actual === null) return "missing call";
  if (actual.name !== expected.name) return "wrong tool";
  return "wrong arguments";
}

export default function ToolCallAccuracyDemo() {
  const [version, setVersion] = React.useState<"v1" | "v2">("v1");
  const correct = CASES.filter((c) => same(c[version], c.expected)).length;

  return (
    <DemoFrame title="Right shop, right shopping list" hint="Compare each agent call with the expected call." onReset={() => setVersion("v1")}>
      <ChoiceChips
        label="Agent version"
        options={[
          { id: "v1", label: "Agent v1" },
          { id: "v2", label: "Agent v2" },
        ]}
        value={version}
        onChange={setVersion}
      />
      <table className="mt-3 w-full text-left text-[11px]">
        <thead className="text-muted">
          <tr>
            <th className="font-normal">Input</th>
            <th className="font-normal">Expected</th>
            <th className="font-normal">Actual</th>
            <th className="font-normal">Result</th>
          </tr>
        </thead>
        <tbody>
          {CASES.map((c) => {
            const err = errorType(c[version], c.expected);
            return (
              <tr key={c.input} className="border-t border-border">
                <td className="py-1 pr-1">{c.input}</td>
                <td className="py-1 pr-1 font-mono">{show(c.expected)}</td>
                <td className="py-1 pr-1 font-mono">{show(c[version])}</td>
                <td className="py-1" style={{ color: err ? "var(--bad)" : "var(--good)" }}>
                  {err ? `✗ ${err}` : "✓"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-2 text-sm" aria-live="polite">
        Tool call accuracy: <span className="font-mono" style={{ color: "var(--accent)" }}>{Math.round((correct / CASES.length) * 100)}%</span>{" "}
        <span className="text-xs text-muted">({correct}/{CASES.length}; the error type tells you what to fix)</span>
      </p>
    </DemoFrame>
  );
}

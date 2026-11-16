"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, Panel } from "../ui";

const NAIVE = `School News    Football Final
The new library opens    Reds    3    Blues    1
on Monday with 2,000    Greens    2    Golds    2
books and a reading    Semi-final scores above,
corner for kids.    the final is on Friday.`;

const PARSED = `## School News
The new library opens on Monday with 2,000 books and a reading corner for kids.

## Football Final
| Home   | Score | Away  |
|--------|-------|-------|
| Reds   | 3 - 1 | Blues |
| Greens | 2 - 2 | Golds |

Semi-final scores above, the final is on Friday.`;

type Mode = "naive" | "parsed";

export default function ParsingDemo() {
  const [mode, setMode] = React.useState<Mode>("naive");

  return (
    <DemoFrame title="Read the page the right way" hint="A two-column page with a table, read two ways." onReset={() => setMode("naive")}>
      <div className="grid gap-3 sm:grid-cols-[9rem_1fr]">
        <div className="rounded-sm bg-white p-2 text-[8px] leading-tight text-neutral-800 shadow" aria-label="Scanned page with two columns">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="font-bold">School News</div>
              The new library opens on Monday with 2,000 books and a reading corner for kids.
            </div>
            <div>
              <div className="font-bold">Football Final</div>
              <table className="w-full">
                <tbody>
                  <tr><td>Reds</td><td>3</td><td>Blues</td><td>1</td></tr>
                  <tr><td>Greens</td><td>2</td><td>Golds</td><td>2</td></tr>
                </tbody>
              </table>
              Semi-final scores above, the final is on Friday.
            </div>
          </div>
        </div>
        <div>
          <ChoiceChips
            label="Parser"
            options={[
              { id: "naive", label: "Naive text extraction" },
              { id: "parsed", label: "Layout-aware parsing" },
            ]}
            value={mode}
            onChange={setMode}
          />
          <pre className="mt-2 max-h-36 overflow-auto rounded-lg bg-surface p-2 font-mono text-[10px] leading-snug whitespace-pre-wrap">{mode === "naive" ? NAIVE : PARSED}</pre>
        </div>
      </div>
      <Panel className="mt-2" title='Q: "What was the score between Reds and Blues?"' tint={mode === "parsed" ? "var(--good)" : "var(--bad)"}>
        <p className="text-xs" aria-live="polite">
          {mode === "parsed"
            ? "Reds 3 - 1 Blues. The table survived as a table, so the answer is easy to find."
            : "Unclear: the columns are mixed line by line and the numbers are separated from their teams."}
        </p>
      </Panel>
    </DemoFrame>
  );
}

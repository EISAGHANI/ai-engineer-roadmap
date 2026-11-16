"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, Panel } from "../ui";

const KEYWORD = ["XR-200 manual", "XR-200 lens cleaning", "XR-300 quick start", "Microscope history"];
const VECTOR = ["Focusing a microscope", "XR-200 manual", "Microscope for beginners", "XR-200 lens cleaning"];
const KS = [
  { id: "1", label: "k = 1" },
  { id: "10", label: "k = 10" },
  { id: "60", label: "k = 60 (usual)" },
] as const;
type KId = (typeof KS)[number]["id"];

export default function HybridSearchDemo() {
  const [kid, setKid] = React.useState<KId>("60");
  const k = Number(kid);
  const scores = new Map<string, number>();
  for (const list of [KEYWORD, VECTOR]) {
    list.forEach((doc, i) => scores.set(doc, (scores.get(doc) ?? 0) + 1 / (k + i + 1)));
  }
  const fused = Array.from(scores.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <DemoFrame title="Ms Words + Mr Meaning" hint='Question: "how to focus the XR-200". Two ranked lists become one.' onReset={() => setKid("60")}>
      <div className="grid gap-2 sm:grid-cols-3">
        <Panel title="Keyword (BM25)">
          <ol className="space-y-0.5 text-xs">
            {KEYWORD.map((d, i) => (
              <li key={d}>
                <span className="font-mono text-muted">{i + 1}.</span> {d}
              </li>
            ))}
          </ol>
        </Panel>
        <Panel title="Meaning (vectors)">
          <ol className="space-y-0.5 text-xs">
            {VECTOR.map((d, i) => (
              <li key={d}>
                <span className="font-mono text-muted">{i + 1}.</span> {d}
              </li>
            ))}
          </ol>
        </Panel>
        <Panel title="Fused (RRF)" tint="var(--area-rag)">
          <ol className="space-y-0.5 text-xs" aria-live="polite">
            {fused.map(([d, s], i) => {
              const both = KEYWORD.includes(d) && VECTOR.includes(d);
              return (
                <li key={d} className={i < 3 ? "font-semibold" : "text-muted"}>
                  {d} <span className="font-mono font-normal text-muted">{s.toFixed(4)}</span>
                  {both && <span title="in both lists"> ★</span>}
                </li>
              );
            })}
          </ol>
        </Panel>
      </div>
      <ChoiceChips className="mt-3" label="RRF constant k" options={KS} value={kid} onChange={setKid} />
      <p className="mt-2 text-xs text-muted">
        Score = sum of 1 / (k + rank) over both lists. ★ = found by both librarians, so it rises to the top. A small k lets the very
        first place of one list dominate; k = 60 rewards agreement.
      </p>
    </DemoFrame>
  );
}

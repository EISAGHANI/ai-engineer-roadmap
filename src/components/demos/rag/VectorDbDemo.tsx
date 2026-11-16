"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, cosine } from "../ui";
import { QUERIES, ROWS, type QueryId } from "./data";

export default function VectorDbDemo() {
  const [qid, setQid] = React.useState<QueryId>("pets");
  const q = QUERIES.find((x) => x.id === qid) ?? QUERIES[0];
  const scored = ROWS.map((r) => ({ ...r, score: cosine(r.vec, q.vec) })).sort((a, b) => b.score - a.score);
  const top = new Set(scored.slice(0, 3).map((r) => r.id));

  return (
    <DemoFrame title="Ask the cabinet by meaning" hint="Each row stores text, its vector and metadata. Pick a search." onReset={() => setQid("pets")}>
      <ChoiceChips label="Search for" options={QUERIES.map((x) => ({ id: x.id, label: `“${x.label}”` }))} value={qid} onChange={setQid} />
      <p className="mt-2 font-mono text-[11px] text-muted">
        query vector = [{q.vec.join(", ")}] · nearest 3 by cosine similarity
      </p>
      <table className="mt-2 w-full text-left text-[11px]">
        <thead className="text-muted">
          <tr>
            <th className="font-normal">id</th>
            <th className="font-normal">text</th>
            <th className="font-normal">vector [pets, vehicles, food]</th>
            <th className="font-normal">type</th>
            <th className="text-right font-normal">score</th>
          </tr>
        </thead>
        <tbody>
          {scored.map((r) => (
            <tr key={r.id} className="border-t border-border" style={top.has(r.id) ? { backgroundColor: "color-mix(in srgb, var(--area-rag) 18%, transparent)" } : undefined}>
              <td className="py-0.5 font-mono">{r.id}</td>
              <td className="py-0.5">{r.text}</td>
              <td className="py-0.5 font-mono">[{r.vec.join(", ")}]</td>
              <td className="py-0.5">{r.type}</td>
              <td className="py-0.5 text-right font-mono">{r.score.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-muted">
        Notice row 8, &ldquo;Dog-friendly road trips&rdquo;: it is half pets, half vehicles, so it scores in the middle for both.
      </p>
    </DemoFrame>
  );
}

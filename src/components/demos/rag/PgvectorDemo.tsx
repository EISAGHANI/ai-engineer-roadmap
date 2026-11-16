"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, cosine } from "../ui";
import { QUERIES, ROWS, type QueryId } from "./data";

type Op = "<=>" | "<->" | "<#>";
const OPS: Array<{ id: Op; label: string; name: string }> = [
  { id: "<=>", label: "<=> cosine", name: "cosine distance" },
  { id: "<->", label: "<-> L2", name: "Euclidean (L2) distance" },
  { id: "<#>", label: "<#> inner product", name: "negative inner product" },
];

function distance(op: Op, a: readonly number[], b: readonly number[]) {
  if (op === "<=>") return 1 - cosine(a, b);
  if (op === "<->") return Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0));
  return -a.reduce((s, v, i) => s + v * b[i], 0);
}

export default function PgvectorDemo() {
  const [qid, setQid] = React.useState<QueryId>("pets");
  const [op, setOp] = React.useState<Op>("<=>");
  const [year, setYear] = React.useState<"any" | "2022">("any");
  const q = QUERIES.find((x) => x.id === qid) ?? QUERIES[0];
  const rows = ROWS.filter((r) => year === "any" || r.year >= 2022)
    .map((r) => ({ ...r, d: distance(op, r.vec, q.vec) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 3);

  return (
    <DemoFrame
      title="Meaning search with plain SQL"
      hint="Change the search, the distance operator and the WHERE filter."
      onReset={() => {
        setQid("pets");
        setOp("<=>");
        setYear("any");
      }}
    >
      <div className="flex flex-wrap gap-2">
        <ChoiceChips label="Search" options={QUERIES.map((x) => ({ id: x.id, label: x.label }))} value={qid} onChange={setQid} />
        <ChoiceChips label="Operator" options={OPS.map((o) => ({ id: o.id, label: o.label }))} value={op} onChange={setOp} />
        <ChoiceChips
          label="Year filter"
          options={[
            { id: "any", label: "any year" },
            { id: "2022", label: "year >= 2022" },
          ]}
          value={year}
          onChange={setYear}
        />
      </div>
      <pre className="mt-2 overflow-x-auto rounded-lg bg-surface p-2 font-mono text-[11px] leading-relaxed">
        <span style={{ color: "var(--area-system-design)" }}>SELECT</span> id, content, embedding {op} :q <span style={{ color: "var(--area-system-design)" }}>AS</span> distance{"\n"}
        <span style={{ color: "var(--area-system-design)" }}>FROM</span> books{year === "2022" ? "  WHERE year >= 2022" : ""}
        {"\n"}
        <span style={{ color: "var(--area-system-design)" }}>ORDER BY</span> embedding {op} :q <span style={{ color: "var(--area-system-design)" }}>LIMIT</span> 3;
      </pre>
      <table className="mt-2 w-full text-left text-xs" aria-live="polite">
        <thead className="text-muted">
          <tr>
            <th className="font-normal">id</th>
            <th className="font-normal">content</th>
            <th className="font-normal">year</th>
            <th className="text-right font-normal">distance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-border">
              <td className="py-1 font-mono">{r.id}</td>
              <td className="py-1">{r.text}</td>
              <td className="py-1 font-mono">{r.year}</td>
              <td className="py-1 text-right font-mono">{r.d.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-1 text-xs text-muted">
        {OPS.find((o) => o.id === op)?.name}: smaller means closer. The WHERE filter and the meaning search run in one query, next to
        your normal tables.
      </p>
    </DemoFrame>
  );
}

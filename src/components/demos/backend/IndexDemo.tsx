"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ScoreBar } from "../ui";
import { Switch } from "@/components/ui/Switch";

const SIZES = [1_000, 10_000, 100_000, 1_000_000, 10_000_000];
const NS_PER_ROW_SCAN = 80; // rough cost to read and check one row

export default function IndexDemo() {
  const [idx, setIdx] = React.useState(3);
  const [indexed, setIndexed] = React.useState(false);
  const rows = SIZES[idx];
  // A B-tree with fan-out ~200: depth = ceil(log_200(rows)), plus reading the 20 matching rows
  const depth = Math.max(1, Math.ceil(Math.log(rows) / Math.log(200)));
  const touched = indexed ? depth + 20 : rows;
  const ms = indexed ? 0.1 + depth * 0.05 : (rows * NS_PER_ROW_SCAN) / 1e6;
  const scanMs = (rows * NS_PER_ROW_SCAN) / 1e6;

  // A tiny picture: 60 shelves, with the matching ones highlighted
  const cells = Array.from({ length: 60 }, (_, i) => i);
  const match = new Set([17, 18]);

  return (
    <DemoFrame
      title="Shelves sorted by postcode"
      hint="Find one tenant's 20 newest documents. Grow the table and add an index."
      onReset={() => {
        setIdx(3);
        setIndexed(false);
      }}
    >
      <div className="flex flex-wrap items-end gap-4">
        <label className="text-xs text-muted">
          rows in documents: <span className="font-mono text-text">{rows.toLocaleString("en-US")}</span>
          <input type="range" min={0} max={SIZES.length - 1} value={idx} onChange={(e) => setIdx(+e.target.value)} className="mt-1 block w-44 accent-[var(--accent)]" />
        </label>
        <Switch checked={indexed} onChange={setIndexed} label="CREATE INDEX (tenant_id, created_at)" />
      </div>
      <div className="mt-3 grid grid-cols-[repeat(20,minmax(0,1fr))] gap-0.5" aria-hidden>
        {cells.map((c) => (
          <span
            key={c}
            className="h-2.5 rounded-[2px]"
            style={{
              backgroundColor: match.has(c)
                ? "var(--good)"
                : indexed
                  ? c === 0 || c === 9 || c === 15
                    ? "var(--area-backend)"
                    : "var(--surface)"
                  : "color-mix(in srgb, var(--warn) 55%, transparent)",
            }}
          />
        ))}
      </div>
      <p className="mt-1 text-[10px] text-muted">{indexed ? "Jump down a few tree levels straight to the right shelf." : "Every shelf is checked (orange), just to find the green ones."}</p>
      <ul className="mt-3 space-y-1 text-xs" aria-live="polite">
        <li className="flex justify-between">
          <span>rows touched</span>
          <span className="font-mono">{touched.toLocaleString("en-US")}</span>
        </li>
        <li>
          <div className="flex justify-between">
            <span>time</span>
            <span className="font-mono">{ms < 1 ? `${ms.toFixed(2)} ms` : `${ms.toFixed(0)} ms`}</span>
          </div>
          <ScoreBar value={ms} max={Math.max(scanMs, 1)} color={indexed ? "var(--good)" : "var(--warn)"} />
        </li>
      </ul>
      {indexed && <p className="mt-2 text-[11px] text-muted">The cost: every insert now also updates the index, and it takes disk space.</p>}
    </DemoFrame>
  );
}

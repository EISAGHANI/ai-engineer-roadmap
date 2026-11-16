"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

type Mode = "contiguous" | "paged";
const CELLS = 96; // GPU memory, in blocks of 16 tokens
const MAX_BLOCKS = 32; // max length a request might reach (512 tokens)
/** How many blocks each incoming request actually uses. */
const REQUESTS = [5, 9, 3, 12, 4, 7, 6, 3, 10, 5, 8, 4, 6, 2, 9, 5];
const COLORS = ["#60a5fa", "#f472b6", "#34d399", "#fbbf24", "#a78bfa", "#f87171", "#22d3ee", "#fb923c"];

export default function PagedAttentionDemo() {
  const [mode, setMode] = React.useState<Mode>("contiguous");

  // Fill memory: contiguous reserves MAX_BLOCKS per request, paged takes only what is used
  const cells: Array<{ req: number; used: boolean } | null> = Array(CELLS).fill(null);
  let pos = 0;
  let fitted = 0;
  for (let r = 0; r < REQUESTS.length; r++) {
    const need = mode === "contiguous" ? MAX_BLOCKS : REQUESTS[r];
    if (pos + need > CELLS) break;
    for (let i = 0; i < need; i++) cells[pos + i] = { req: r, used: i < REQUESTS[r] };
    pos += need;
    fitted++;
  }
  const used = cells.filter((c) => c?.used).length;
  const reservedIdle = cells.filter((c) => c && !c.used).length;

  return (
    <DemoFrame title="Trays instead of reserved counters" hint="Each square is a 16-token block of GPU memory for the KV cache." onReset={() => setMode("contiguous")}>
      <ChoiceChips
        label="Memory"
        options={[
          { id: "contiguous", label: "Reserve max length per request" },
          { id: "paged", label: "PagedAttention blocks" },
        ]}
        value={mode}
        onChange={setMode}
      />
      <div className="mt-3 grid grid-cols-[repeat(24,minmax(0,1fr))] gap-0.5" role="img" aria-label="GPU memory blocks">
        {cells.map((c, i) => (
          <span
            key={i}
            className="aspect-square rounded-[2px]"
            style={{
              backgroundColor: c ? COLORS[c.req % COLORS.length] : "var(--surface)",
              opacity: c && !c.used ? 0.25 : 1,
              backgroundImage: c && !c.used ? "repeating-linear-gradient(45deg, transparent 0 2px, rgba(0,0,0,.25) 2px 3px)" : undefined,
            }}
          />
        ))}
      </div>
      <p className="mt-1 text-[10px] text-muted">solid = tokens really stored · striped = reserved but empty · grey = free</p>
      <ul className="mt-3 grid grid-cols-3 gap-2 text-center text-xs" aria-live="polite">
        <li className="rounded-lg bg-surface p-2">
          <div className="font-mono text-lg">
            {fitted}/{REQUESTS.length}
          </div>
          <div className="text-muted">requests fit</div>
        </li>
        <li className="rounded-lg bg-surface p-2">
          <div className="font-mono text-lg">{used}</div>
          <div className="text-muted">blocks in use</div>
        </li>
        <li className="rounded-lg bg-surface p-2">
          <div className="font-mono text-lg" style={{ color: reservedIdle ? "var(--bad)" : "var(--good)" }}>
            {Math.round((reservedIdle / CELLS) * 100)}%
          </div>
          <div className="text-muted">memory wasted</div>
        </li>
      </ul>
      <p className="mt-2 text-[11px] text-muted">
        {mode === "contiguous" ? "Most reserved memory sits empty, so new requests wait even though the GPU has room." : "Blocks are handed out as each answer grows, so many more requests run at once."}
      </p>
    </DemoFrame>
  );
}

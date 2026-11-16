"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, ChoiceChips } from "../ui";

type Mode = "offset" | "cursor";
const PAGE = 4;
const INITIAL = Array.from({ length: 14 }, (_, i) => 100 - i); // newest first: ids 100..87

export default function PaginationDemo() {
  const [mode, setMode] = React.useState<Mode>("offset");
  const [items, setItems] = React.useState<number[]>(INITIAL);
  const [pages, setPages] = React.useState<number[][]>([]);
  const [cursor, setCursor] = React.useState<number | null>(null);

  function nextPage() {
    let page: number[];
    if (mode === "offset") {
      page = items.slice(pages.length * PAGE, pages.length * PAGE + PAGE);
    } else {
      const start = cursor === null ? 0 : items.findIndex((x) => x < cursor);
      page = start === -1 ? [] : items.slice(start, start + PAGE);
    }
    if (!page.length) return;
    setPages([...pages, page]);
    setCursor(page[page.length - 1]);
  }

  function newDocuments() {
    const top = items[0];
    setItems([top + 2, top + 1, ...items]);
  }

  const seen = pages.flat();
  const dupes = seen.filter((x, i) => seen.indexOf(x) !== i);

  return (
    <DemoFrame
      title="One bag at a time"
      hint="Load page 1, add new documents, then load page 2. Watch for repeats."
      onReset={() => {
        setItems(INITIAL);
        setPages([]);
        setCursor(null);
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <ChoiceChips
          label="Pagination"
          options={[
            { id: "offset", label: "OFFSET / LIMIT" },
            { id: "cursor", label: "Cursor (after id)" },
          ]}
          value={mode}
          onChange={(m) => {
            setMode(m);
            setItems(INITIAL);
            setPages([]);
            setCursor(null);
          }}
        />
        <ActionButton onClick={nextPage}>Load next page</ActionButton>
        <ActionButton variant="secondary" onClick={newDocuments}>
          ➕ 2 new documents arrive
        </ActionButton>
      </div>
      <p className="mt-2 font-mono text-[10px] text-muted">
        {mode === "offset"
          ? `next request: GET /documents?limit=${PAGE}&offset=${pages.length * PAGE}`
          : `next request: GET /documents?limit=${PAGE}${cursor !== null ? `&cursor=${btoa(`{"id":${cursor}}`)}` : ""}`}
      </p>
      <p className="mt-2 text-[11px] text-muted">Database, newest first:</p>
      <div className="flex flex-wrap gap-0.5">
        {items.map((x) => (
          <span key={x} className="rounded bg-surface px-1 font-mono text-[10px]" style={{ outline: x > 100 ? "1px solid var(--accent)" : undefined }}>
            #{x}
          </span>
        ))}
      </div>
      <ol className="mt-3 space-y-1 text-xs" aria-live="polite">
        {pages.map((p, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="w-14 text-muted">page {i + 1}</span>
            {p.map((x) => (
              <span
                key={x}
                className="rounded px-1.5 font-mono text-[11px]"
                style={{ backgroundColor: dupes.includes(x) ? "color-mix(in srgb, var(--bad) 25%, transparent)" : "var(--surface)" }}
              >
                #{x}
              </span>
            ))}
          </li>
        ))}
      </ol>
      {dupes.length > 0 && (
        <p className="mt-2 text-xs" style={{ color: "var(--bad)" }}>
          {dupes.map((d) => `#${d}`).join(", ")} shown twice: new rows pushed everything down, so the offset now points at items you already saw.
        </p>
      )}
      {mode === "cursor" && pages.length > 1 && <p className="mt-2 text-xs" style={{ color: "var(--good)" }}>No repeats: the cursor says &quot;after #{pages[pages.length - 2].at(-1)}&quot;, not &quot;skip 4&quot;.</p>}
    </DemoFrame>
  );
}

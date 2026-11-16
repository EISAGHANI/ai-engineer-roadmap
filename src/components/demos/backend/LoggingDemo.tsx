"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

type Style = "print" | "structured";
type Entry = { ts: string; rid: string; user: string; event: string; extra: string; level: "info" | "error" };

const ENTRIES: Entry[] = [
  { ts: "10:04:01.120", rid: "r-7a1", user: "u_12", event: "request", extra: "route=/v1/ask", level: "info" },
  { ts: "10:04:01.131", rid: "r-9c4", user: "u_42", event: "request", extra: "route=/v1/ask", level: "info" },
  { ts: "10:04:01.402", rid: "r-7a1", user: "u_12", event: "retrieval", extra: "chunks=5 ms=180", level: "info" },
  { ts: "10:04:01.455", rid: "r-9c4", user: "u_42", event: "retrieval", extra: "chunks=0 ms=210", level: "info" },
  { ts: "10:04:02.010", rid: "r-3e8", user: "u_07", event: "request", extra: "route=/v1/upload", level: "info" },
  { ts: "10:04:03.260", rid: "r-7a1", user: "u_12", event: "llm_call", extra: "model=claude-haiku-5-5 tokens=976 cost=0.0019", level: "info" },
  { ts: "10:04:03.300", rid: "r-9c4", user: "u_42", event: "llm_call", extra: "model=claude-haiku-5-5 tokens=310 cost=0.0006", level: "info" },
  { ts: "10:04:03.302", rid: "r-9c4", user: "u_42", event: "answer_failed", extra: "reason=no_sources status=500", level: "error" },
  { ts: "10:04:03.310", rid: "r-7a1", user: "u_12", event: "response", extra: "status=200 latency_ms=2190", level: "info" },
  { ts: "10:04:04.900", rid: "r-3e8", user: "u_07", event: "response", extra: "status=202 latency_ms=2890", level: "info" },
];

const PRINTS: Record<string, string> = {
  request: "got request",
  retrieval: "searched",
  llm_call: "called model",
  answer_failed: "ERROR something went wrong",
  response: "done",
  upload: "uploaded",
};

export default function LoggingDemo() {
  const [style, setStyle] = React.useState<Style>("print");
  const [filter, setFilter] = React.useState("");

  const f = filter.trim().toLowerCase();
  const rows = ENTRIES.filter((e) => {
    if (!f || style === "print") return true;
    return `${e.rid} ${e.user} ${e.event} ${e.level} ${e.extra}`.toLowerCase().includes(f);
  });
  const found = style === "structured" && rows.length > 0 && rows.every((r) => r.rid === "r-9c4");

  return (
    <DemoFrame
      title="The log book and the wall chart"
      hint="User u_42 says: 'my question failed at 10:04'. Find out why."
      onReset={() => {
        setStyle("print");
        setFilter("");
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <ChoiceChips
          label="Logging style"
          options={[
            { id: "print", label: "print()" },
            { id: "structured", label: "Structured + request id" },
          ]}
          value={style}
          onChange={setStyle}
        />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={style === "structured" ? "filter, e.g. u_42 or r-9c4" : "filter (nothing to filter on)"}
          className="w-48 rounded-md border border-border bg-surface px-2 py-1 font-mono text-[11px]"
          aria-label="Filter logs"
        />
      </div>
      <pre className="mt-3 max-h-44 overflow-auto rounded-lg bg-neutral-950 p-2 font-mono text-[10px] leading-relaxed text-neutral-200" aria-live="polite">
        {rows.map((e, i) => (
          <div key={i} style={{ color: e.level === "error" ? "#f87171" : undefined }}>
            {style === "print"
              ? PRINTS[e.event]
              : `{"ts":"${e.ts}","level":"${e.level}","request_id":"${e.rid}","user":"${e.user}","event":"${e.event}",${e.extra
                  .split(" ")
                  .map((kv) => `"${kv.split("=")[0]}":"${kv.split("=")[1]}"`)
                  .join(",")}}`}
          </div>
        ))}
      </pre>
      <p className="mt-2 text-xs">
        {style === "print"
          ? "Which 'ERROR' belongs to u_42? Which search came before it? No way to tell with three requests mixed together."
          : found
            ? "Found it: request r-9c4 retrieved 0 chunks, so the answer failed. Next step: check that user's documents and permissions."
            : "Type u_42 in the filter, then its request id."}
      </p>
    </DemoFrame>
  );
}

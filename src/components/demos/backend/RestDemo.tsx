"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, ChoiceChips } from "../ui";

type Method = "GET" | "POST" | "PUT" | "DELETE";
type Doc = { id: number; title: string };
const START: Doc[] = [
  { id: 1, title: "Holiday rules" },
  { id: 2, title: "Expense policy" },
];

export default function RestDemo() {
  const [docs, setDocs] = React.useState<Doc[]>(START);
  const [method, setMethod] = React.useState<Method>("GET");
  const [target, setTarget] = React.useState<"list" | "one">("one");
  const [id, setId] = React.useState(1);
  const [result, setResult] = React.useState<{ status: string; body: string } | null>(null);

  const path = target === "list" || method === "POST" ? "/v1/documents" : `/v1/documents/${id}`;

  function send() {
    const found = docs.find((d) => d.id === id);
    if (method === "GET" && (target === "list")) {
      setResult({ status: "200 OK", body: JSON.stringify(docs, null, 1) });
    } else if (method === "GET") {
      setResult(found ? { status: "200 OK", body: JSON.stringify(found) } : { status: "404 Not Found", body: '{"detail":"Document not found"}' });
    } else if (method === "POST") {
      const next = { id: Math.max(0, ...docs.map((d) => d.id)) + 1, title: `New document ${docs.length + 1}` };
      setDocs([...docs, next]);
      setResult({ status: "201 Created", body: JSON.stringify(next) });
    } else if (method === "PUT") {
      if (!found) return setResult({ status: "404 Not Found", body: '{"detail":"Document not found"}' });
      const updated = { ...found, title: `${found.title.replace(/ \(edited\)$/, "")} (edited)` };
      setDocs(docs.map((d) => (d.id === id ? updated : d)));
      setResult({ status: "200 OK", body: JSON.stringify(updated) });
    } else {
      setDocs(docs.filter((d) => d.id !== id));
      setResult({ status: "204 No Content", body: "" });
    }
  }

  const ok = result?.status.startsWith("2");

  return (
    <DemoFrame
      title="Windows with clear signs"
      hint="Pick a method and a resource, send the request and watch the data change."
      onReset={() => {
        setDocs(START);
        setMethod("GET");
        setTarget("one");
        setId(1);
        setResult(null);
      }}
    >
      <div className="flex flex-wrap items-end gap-2">
        <ChoiceChips
          label="Method"
          options={[
            { id: "GET", label: "GET" },
            { id: "POST", label: "POST" },
            { id: "PUT", label: "PUT" },
            { id: "DELETE", label: "DELETE" },
          ]}
          value={method}
          onChange={(m) => {
            setMethod(m);
            if (m !== "GET") setTarget("one");
          }}
        />
        {method === "GET" && (
          <ChoiceChips
            label="Resource"
            options={[
              { id: "list", label: "the list" },
              { id: "one", label: "one document" },
            ]}
            value={target}
            onChange={setTarget}
          />
        )}
        {path !== "/v1/documents" && (
          <label className="text-xs text-muted">
            id
            <input type="number" min={1} max={9} value={id} onChange={(e) => setId(+e.target.value)} className="ml-1 w-12 rounded border border-border bg-surface px-1 font-mono" />
          </label>
        )}
      </div>
      <div className="mt-3 flex items-center gap-2 font-mono text-xs">
        <span className="rounded bg-accent px-2 py-0.5 text-accent-ink">{method}</span>
        <span>{path}</span>
        <span className="ml-auto">
          <ActionButton onClick={send}>Send</ActionButton>
        </span>
      </div>
      {result && (
        <pre className="mt-2 rounded-lg p-2 font-mono text-[11px]" style={{ backgroundColor: `color-mix(in srgb, ${ok ? "var(--good)" : "var(--bad)"} 12%, transparent)` }} aria-live="polite">
          <div className="font-semibold">{result.status}</div>
          {result.body}
        </pre>
      )}
      <p className="mt-2 text-[11px] text-muted">
        Stored now: {docs.map((d) => `#${d.id} ${d.title}`).join(" · ") || "nothing"}
      </p>
    </DemoFrame>
  );
}

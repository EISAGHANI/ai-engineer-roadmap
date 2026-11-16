"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

const LISTS = {
  tools: {
    label: "Tools (things it can do)",
    method: "tools/list",
    items: [
      {
        name: "search_books",
        detail: { description: "Search the catalogue by title or topic.", inputSchema: { type: "object", properties: { query: { type: "string" }, limit: { type: "integer" } }, required: ["query"] } },
      },
      {
        name: "reserve_book",
        detail: { description: "Reserve a book for a member.", inputSchema: { type: "object", properties: { isbn: { type: "string" }, member_id: { type: "string" } }, required: ["isbn", "member_id"] } },
      },
    ],
  },
  resources: {
    label: "Resources (things it can show)",
    method: "resources/list",
    items: [
      { name: "books://9780441013593", detail: { name: "Dune", mimeType: "application/json" } },
      { name: "library://opening-hours", detail: { name: "Opening hours", mimeType: "text/plain" } },
    ],
  },
  prompts: {
    label: "Prompts (ready-made forms)",
    method: "prompts/list",
    items: [
      { name: "recommend_books", detail: { description: "Recommend 3 books for a reader.", arguments: [{ name: "age", required: true }, { name: "favourite_topic" }] } },
    ],
  },
} as const;
type Kind = keyof typeof LISTS;

export default function McpServerDemo() {
  const [kind, setKind] = React.useState<Kind>("tools");
  const [picked, setPicked] = React.useState(0);
  const list = LISTS[kind];
  const item = list.items[Math.min(picked, list.items.length - 1)];

  return (
    <DemoFrame
      title="The library's standard menu board"
      hint="An MCP server announces what it offers. Any MCP client can read this."
      onReset={() => {
        setKind("tools");
        setPicked(0);
      }}
    >
      <ChoiceChips
        label="What the server offers"
        options={(Object.keys(LISTS) as Kind[]).map((k) => ({ id: k, label: LISTS[k].label }))}
        value={kind}
        onChange={(k) => {
          setKind(k);
          setPicked(0);
        }}
      />
      <div className="mt-3 grid gap-2 sm:grid-cols-[10rem_1fr]">
        <ul className="space-y-1">
          {list.items.map((it, i) => (
            <li key={it.name}>
              <button
                type="button"
                onClick={() => setPicked(i)}
                aria-pressed={picked === i}
                className="w-full truncate rounded-md px-2 py-1 text-left font-mono text-[11px]"
                style={{ backgroundColor: picked === i ? "color-mix(in srgb, var(--area-agents) 22%, transparent)" : "var(--surface)" }}
              >
                {it.name}
              </button>
            </li>
          ))}
        </ul>
        <pre className="max-h-44 overflow-auto rounded-lg bg-surface p-2 font-mono text-[10px] leading-snug" aria-live="polite">
          {`// response to "${list.method}" (simplified)\n`}
          {JSON.stringify(kind === "resources" ? { uri: item.name, ...item.detail } : { name: item.name, ...item.detail }, null, 2)}
        </pre>
      </div>
      <p className="mt-2 text-xs text-muted">
        The model never sees your server code, only these names, descriptions and schemas. Write them as carefully as a prompt.
      </p>
    </DemoFrame>
  );
}

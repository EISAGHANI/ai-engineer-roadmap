"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

const QUESTIONS = {
  one: { label: "Show customer Acme with all its documents", sql: "2 tables, 1 join", nosql: "1 read of one document ✓", best: "nosql" },
  count: { label: "How many documents per country, this month?", sql: "1 query with GROUP BY ✓", nosql: "scan every customer document, count in code", best: "sql" },
  rename: { label: "Rename the 'Policies' collection everywhere", sql: "update 1 row; everything references its id ✓", nosql: "update every copy inside every customer", best: "sql" },
  extra: { label: "Some customers have extra fields (VAT id, logo)", sql: "add columns or a JSONB field", nosql: "just add the fields to those documents ✓", best: "nosql" },
} as const;
type Q = keyof typeof QUESTIONS;
type Model = "sql" | "nosql";

export default function SqlNosqlDemo() {
  const [model, setModel] = React.useState<Model>("sql");
  const [q, setQ] = React.useState<Q>("count");
  const info = QUESTIONS[q];
  const answer = model === "sql" ? info.sql : info.nosql;
  const good: boolean = info.best === model;

  return (
    <DemoFrame
      title="The ledger and the folders"
      hint="The same customers stored two ways. Some questions suit one, some the other."
      onReset={() => {
        setModel("sql");
        setQ("count");
      }}
    >
      <ChoiceChips
        label="Storage"
        options={[
          { id: "sql", label: "SQL tables" },
          { id: "nosql", label: "NoSQL documents" },
        ]}
        value={model}
        onChange={setModel}
      />
      <div className="mt-3 min-h-28 rounded-lg bg-surface p-2 font-mono text-[10px] leading-relaxed">
        {model === "sql" ? (
          <div className="grid gap-2 sm:grid-cols-2">
            <table className="w-full">
              <caption className="text-left text-muted">customers</caption>
              <tbody>
                <tr><td>id</td><td>name</td><td>country</td></tr>
                <tr><td>1</td><td>Acme</td><td>DE</td></tr>
                <tr><td>2</td><td>Bolt</td><td>PK</td></tr>
              </tbody>
            </table>
            <table className="w-full">
              <caption className="text-left text-muted">documents</caption>
              <tbody>
                <tr><td>id</td><td>customer_id</td><td>title</td></tr>
                <tr><td>10</td><td>1</td><td>Holiday rules</td></tr>
                <tr><td>11</td><td>1</td><td>Expenses</td></tr>
                <tr><td>12</td><td>2</td><td>Onboarding</td></tr>
              </tbody>
            </table>
          </div>
        ) : (
          <pre className="whitespace-pre-wrap">{`{ "_id": 1, "name": "Acme", "country": "DE", "vat": "DE123",
  "documents": [ { "title": "Holiday rules", "collection": "Policies" },
                 { "title": "Expenses",      "collection": "Policies" } ] }
{ "_id": 2, "name": "Bolt", "country": "PK",
  "documents": [ { "title": "Onboarding", "collection": "Policies" } ] }`}</pre>
        )}
      </div>
      <ChoiceChips className="mt-3" label="Question" options={(Object.keys(QUESTIONS) as Q[]).map((k) => ({ id: k, label: QUESTIONS[k].label }))} value={q} onChange={setQ} />
      <p className="mt-2 rounded-lg px-3 py-2 text-xs" aria-live="polite" style={{ backgroundColor: `color-mix(in srgb, ${good ? "var(--good)" : "var(--warn)"} 15%, transparent)` }}>
        {answer}
      </p>
      <p className="mt-1 text-[11px] text-muted">Postgres with a JSONB column gives you much of both, which is why it's the usual default.</p>
    </DemoFrame>
  );
}

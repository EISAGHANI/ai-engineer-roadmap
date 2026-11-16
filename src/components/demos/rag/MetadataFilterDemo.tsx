"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, ScoreBar } from "../ui";
import { Switch } from "@/components/ui/Switch";

const BOOKS = [
  { id: 1, title: "Volcanoes for Curious Kids", sim: 0.93, year: 2022, age: 8 },
  { id: 2, title: "The Big Book of Volcanoes", sim: 0.91, year: 2015, age: 10 },
  { id: 3, title: "Volcano Science, Grade 5", sim: 0.88, year: 2023, age: 10 },
  { id: 4, title: "Earth's Fiery Mountains", sim: 0.86, year: 2021, age: 10 },
  { id: 5, title: "Lava Lab Experiments", sim: 0.8, year: 2024, age: 12 },
  { id: 6, title: "Pompeii: A Day of Ash", sim: 0.78, year: 2019, age: 14 },
  { id: 7, title: "Mountains of the World", sim: 0.62, year: 2023, age: 10 },
  { id: 8, title: "Rocks and Minerals", sim: 0.55, year: 2022, age: 8 },
];

type Age = "any" | "8" | "10" | "12";
type Mode = "pre" | "post";

export default function MetadataFilterDemo() {
  const [recent, setRecent] = React.useState(false);
  const [age, setAge] = React.useState<Age>("any");
  const [mode, setMode] = React.useState<Mode>("pre");

  const passes = (b: (typeof BOOKS)[number]) => (!recent || b.year > 2020) && (age === "any" || b.age === Number(age));
  const ranked = [...BOOKS].sort((a, b) => b.sim - a.sim);
  const results = mode === "pre" ? ranked.filter(passes).slice(0, 3) : ranked.slice(0, 3).filter(passes);

  return (
    <DemoFrame
      title="Volcano books, after 2020, for age 10"
      hint="Add filters, then compare filtering first with filtering after the top 3."
      onReset={() => {
        setRecent(false);
        setAge("any");
        setMode("pre");
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Switch checked={recent} onChange={setRecent} label="Published after 2020" />
        <ChoiceChips
          label="Reading age"
          options={[
            { id: "any", label: "any age" },
            { id: "8", label: "age 8" },
            { id: "10", label: "age 10" },
            { id: "12", label: "age 12" },
          ]}
          value={age}
          onChange={setAge}
        />
      </div>
      <ChoiceChips
        className="mt-2"
        label="When to filter"
        options={[
          { id: "pre", label: "Filter first, then top 3" },
          { id: "post", label: "Top 3 first, then filter" },
        ]}
        value={mode}
        onChange={setMode}
      />
      <ul className="mt-3 space-y-1">
        {ranked.map((b) => {
          const inResult = results.some((r) => r.id === b.id);
          const ok = passes(b);
          return (
            <li key={b.id} className="grid grid-cols-[1fr_auto_auto_5rem] items-center gap-2 text-xs" style={{ opacity: ok ? 1 : 0.35 }}>
              <span className={inResult ? "font-semibold" : undefined}>
                {inResult && <span style={{ color: "var(--good)" }}>✓ </span>}
                {b.title}
              </span>
              <span className="font-mono text-muted">{b.year}</span>
              <span className="font-mono text-muted">age {b.age}</span>
              <ScoreBar value={b.sim} label={`similarity ${b.sim}`} />
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs" aria-live="polite">
        <strong>{results.length} result{results.length === 1 ? "" : "s"}.</strong>{" "}
        <span className="text-muted">
          {mode === "post" && results.length < 3
            ? "Filtering after the top 3 threw most of them away. Filter during the search instead."
            : "Faded rows are removed by the filters before the meaning search ranks the rest."}
        </span>
      </p>
    </DemoFrame>
  );
}

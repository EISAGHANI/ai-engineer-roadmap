"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { Panel } from "../ui";
import { Switch } from "@/components/ui/Switch";

const HISTORY = [
  { who: "pupil", text: "Can you tell me about the Titanic?" },
  { who: "librarian", text: "It was a British passenger ship that sank in 1912 on its first voyage." },
];
const MESSAGE = "how many survived it?";
const REWRITTEN = "How many passengers survived the sinking of the Titanic in 1912?";

const RAW_RESULTS = ["Survival kit checklist for hikers", "It (a horror novel)", "How many is too many? Counting games"];
const GOOD_RESULTS = ["Titanic: lifeboats and survivors", "The night the Titanic sank, 1912", "Passenger lists of RMS Titanic"];

export default function QueryRewriteDemo() {
  const [rewrite, setRewrite] = React.useState(false);
  const query = rewrite ? REWRITTEN : MESSAGE;
  const results = rewrite ? GOOD_RESULTS : RAW_RESULTS;

  return (
    <DemoFrame title="What does 'it' mean?" hint="Search with the raw message, then let a small model rewrite it first." onReset={() => setRewrite(false)}>
      <div className="space-y-1 text-xs">
        {HISTORY.map((m, i) => (
          <div key={i} className={m.who === "pupil" ? "ml-auto w-fit max-w-[85%] rounded-lg bg-surface px-2 py-1" : "w-fit max-w-[85%] rounded-lg px-2 py-1"} style={m.who === "pupil" ? undefined : { backgroundColor: "color-mix(in srgb, var(--area-rag) 14%, transparent)" }}>
            {m.text}
          </div>
        ))}
        <div className="ml-auto w-fit rounded-lg border border-accent px-2 py-1 font-medium">{MESSAGE}</div>
      </div>
      <div className="mt-3">
        <Switch checked={rewrite} onChange={setRewrite} label="Rewrite the question before searching" />
      </div>
      <div className="mt-2 grid gap-2 sm:grid-cols-2" aria-live="polite">
        <Panel title="search query actually sent">
          <p className="font-mono text-xs">{query}</p>
        </Panel>
        <Panel title="top results" tint={rewrite ? "var(--good)" : "var(--bad)"}>
          <ol className="list-decimal space-y-0.5 pl-4 text-xs">
            {results.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
        </Panel>
      </div>
    </DemoFrame>
  );
}

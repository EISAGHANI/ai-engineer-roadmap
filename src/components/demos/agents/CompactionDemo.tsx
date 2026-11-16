"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton, Panel } from "../ui";
import { Switch } from "@/components/ui/Switch";

const LIMIT = 100_000;
const THRESHOLD = 80_000;
const PER_TURN = 3_000;
const KEEP_RECENT = 10;
const SUMMARY_TOKENS = 2_000;
const FACTS = ["User: Sara, budget 50 €", "Bread bought (2.50 €)", "Eggs sold out at market, ordered for Tuesday", "Still to do: stamps, library book"];

export default function CompactionDemo() {
  const [auto, setAuto] = React.useState(true);
  const [turns, setTurns] = React.useState(5); // turns currently in full detail
  const [summarised, setSummarised] = React.useState(0); // turns folded into the summary
  const [compactions, setCompactions] = React.useState(0);

  const used = turns * PER_TURN + (summarised ? SUMMARY_TOKENS : 0);
  const full = used >= LIMIT;

  function addTurns() {
    let t = turns + 5;
    let s = summarised;
    let c = compactions;
    if (auto && t * PER_TURN + (s ? SUMMARY_TOKENS : 0) >= THRESHOLD) {
      s += t - KEEP_RECENT;
      t = KEEP_RECENT;
      c += 1;
    }
    setTurns(Math.min(t, Math.ceil(LIMIT / PER_TURN)));
    setSummarised(s);
    setCompactions(c);
  }

  function reset() {
    setTurns(5);
    setSummarised(0);
    setCompactions(0);
  }

  return (
    <DemoFrame title="Summarise the old pages" hint={`Each turn adds about ${PER_TURN.toLocaleString("en-US")} tokens. The window holds ${LIMIT.toLocaleString("en-US")}.`} onReset={reset}>
      <div className="flex flex-wrap items-center gap-3">
        <Switch
          checked={auto}
          onChange={(v) => {
            setAuto(v);
            reset();
          }}
          label="Compact at 80%"
        />
        <ActionButton onClick={addTurns} disabled={full}>
          Add 5 turns
        </ActionButton>
        <span className="font-mono text-xs text-muted">
          {turns + summarised} turns so far · {compactions} compactions
        </span>
      </div>
      <div className="relative mt-3 h-4 w-full rounded-full bg-surface" aria-label={`${used} of ${LIMIT} tokens used`} role="img">
        <div className="flex h-full overflow-hidden rounded-full">
          {summarised > 0 && <span style={{ width: `${(SUMMARY_TOKENS / LIMIT) * 100}%`, backgroundColor: "var(--area-agents)" }} />}
          <span style={{ width: `${((turns * PER_TURN) / LIMIT) * 100}%`, backgroundColor: full ? "var(--bad)" : "var(--area-llm)", transition: "width 300ms" }} />
        </div>
        <span className="absolute top-[-3px] h-[22px] w-0.5 bg-text" style={{ left: `${(THRESHOLD / LIMIT) * 100}%` }} aria-hidden="true" />
      </div>
      <p className="mt-1 text-xs text-muted">
        {used.toLocaleString("en-US")} / {LIMIT.toLocaleString("en-US")} tokens · <span style={{ color: "var(--area-agents)" }}>■</span> summary ·{" "}
        <span style={{ color: "var(--area-llm)" }}>■</span> recent turns · line = 80%
      </p>
      {summarised > 0 && (
        <Panel className="mt-2" title={`summary of ${summarised} earlier turns (kept facts)`} tint="var(--area-agents)">
          <ul className="list-disc space-y-0.5 pl-4 text-xs">
            {FACTS.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </Panel>
      )}
      <p className="mt-2 text-xs" aria-live="polite" style={{ color: full ? "var(--bad)" : undefined }}>
        {full
          ? "Context full: the next request fails. Turn compaction on and try again."
          : summarised > 0
            ? `Old turns were replaced by a ${SUMMARY_TOKENS.toLocaleString("en-US")}-token summary; the last ${KEEP_RECENT} turns stay word for word.`
            : "Keep adding turns."}
      </p>
    </DemoFrame>
  );
}

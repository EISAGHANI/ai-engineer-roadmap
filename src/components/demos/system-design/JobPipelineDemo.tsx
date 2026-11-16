"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";
import { Switch } from "@/components/ui/Switch";

const STEPS = [
  { id: "parse", label: "Parse PDF", sec: 40 },
  { id: "chunk", label: "Chunk", sec: 5 },
  { id: "embed", label: "Embed (batched)", sec: 60 },
  { id: "index", label: "Write to index", sec: 10 },
];
type Status = "waiting" | "running" | "done" | "retrying" | "failed";

export default function JobPipelineDemo() {
  const [durable, setDurable] = React.useState(true);
  const [statuses, setStatuses] = React.useState<Status[]>(STEPS.map(() => "waiting"));
  const [log, setLog] = React.useState<string[]>([]);
  const [spent, setSpent] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const crashed = React.useRef(false);

  React.useEffect(() => {
    if (!running) return;
    const i = statuses.findIndex((s) => s !== "done");
    if (i === -1) {
      setRunning(false);
      setLog((l) => [...l, `✓ done in ${spent} s of work`]);
      return;
    }
    const t = window.setTimeout(() => {
      const st = [...statuses];
      // The embedding provider times out once, the first time we reach it
      if (STEPS[i].id === "embed" && !crashed.current) {
        crashed.current = true;
        setSpent((s) => s + 30);
        if (durable) {
          st[i] = "retrying";
          setLog((l) => [...l, "embed: provider timeout → retry this step in 2 s (parse and chunk are kept)"]);
        } else {
          setLog((l) => [...l, "embed: provider timeout → whole job restarts from the beginning"]);
          setStatuses(STEPS.map(() => "waiting"));
          return;
        }
        setStatuses(st);
        return;
      }
      st[i] = "done";
      setSpent((s) => s + STEPS[i].sec);
      setLog((l) => [...l, `${STEPS[i].id}: done`]);
      setStatuses(st);
    }, 600);
    return () => window.clearTimeout(t);
  }, [running, statuses, durable, spent]);

  function start() {
    crashed.current = false;
    setStatuses(STEPS.map(() => "waiting"));
    setLog(["POST /documents → 202 Accepted, job_id=j_81"]);
    setSpent(0);
    setRunning(true);
  }

  const color: Record<Status, string> = { waiting: "var(--surface)", running: "var(--warn)", done: "color-mix(in srgb, var(--good) 30%, transparent)", retrying: "color-mix(in srgb, var(--warn) 35%, transparent)", failed: "var(--bad)" };
  const firstOpen = statuses.findIndex((s) => s !== "done");

  return (
    <DemoFrame
      title="The catering order in the back kitchen"
      hint="Ingest a 300-page PDF in steps. The embedding provider will time out once."
      onReset={() => {
        setRunning(false);
        setStatuses(STEPS.map(() => "waiting"));
        setLog([]);
        setSpent(0);
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Switch checked={durable} onChange={setDurable} label="Durable steps (retry per step)" />
        <ActionButton onClick={start} disabled={running}>
          Upload PDF
        </ActionButton>
      </div>
      <ol className="mt-3 flex flex-wrap gap-1.5">
        {STEPS.map((s, i) => (
          <li
            key={s.id}
            className="min-w-[6.5rem] flex-1 rounded-lg p-2 text-xs"
            style={{ backgroundColor: running && i === firstOpen && statuses[i] === "waiting" ? "color-mix(in srgb, var(--warn) 20%, transparent)" : color[statuses[i]] }}
          >
            <div className="font-medium">{s.label}</div>
            <div className="text-[10px] text-muted">
              {statuses[i] === "done" ? "✓ saved" : statuses[i] === "retrying" ? "↻ retrying" : running && i === firstOpen ? "working…" : `~${s.sec} s`}
            </div>
          </li>
        ))}
      </ol>
      <ul className="mt-2 space-y-0.5 font-mono text-[10px]" aria-live="polite">
        {log.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
      {!running && log.length > 1 && (
        <p className="mt-2 text-xs">
          Work done: <strong>{spent} s</strong> (the minimum is {STEPS.reduce((a, s) => a + s.sec, 0)} s).{" "}
          {durable ? "Only the failed step was repeated." : "Parsing and chunking ran twice because of one timeout."}
        </p>
      )}
    </DemoFrame>
  );
}

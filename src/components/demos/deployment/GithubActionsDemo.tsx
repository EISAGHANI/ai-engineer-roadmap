"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, Panel } from "../ui";

const WORKFLOW = `name: ci
on:
  push:
    branches: [main]
  pull_request:
    paths-ignore: ["docs/**"]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install -r requirements.txt
      - run: pytest -q
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh`;

const EVENTS = {
  pr: { label: "Pull request (code)", test: "run", deploy: "skip", note: "Tests run on the pull request; deploy is skipped because this is not main." },
  docs: { label: "Pull request (docs only)", test: "none", deploy: "none", note: "paths-ignore matched docs/**, so the workflow did not start at all." },
  main: { label: "Push to main", test: "run", deploy: "run", note: "Tests passed, then deploy ran because needs: test succeeded and the branch is main." },
} as const;
type EventId = keyof typeof EVENTS;

const ICON = { run: "✓", skip: "⏭", none: "–" } as const;
const COLOR = { run: "var(--good)", skip: "var(--muted)", none: "var(--muted)" } as const;

export default function GithubActionsDemo() {
  const [eid, setEid] = React.useState<EventId>("pr");
  const e = EVENTS[eid];

  return (
    <DemoFrame title="The checklist pinned in the kitchen" hint="The same workflow file reacts differently to different events." onReset={() => setEid("pr")}>
      <ChoiceChips label="Event" options={(Object.keys(EVENTS) as EventId[]).map((k) => ({ id: k, label: EVENTS[k].label }))} value={eid} onChange={setEid} />
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_12rem]">
        <pre className="max-h-48 overflow-auto rounded-lg bg-surface p-2 font-mono text-[10px] leading-snug">{WORKFLOW}</pre>
        <Panel title="Actions tab">
          <ul className="space-y-1 text-xs" aria-live="polite">
            {(["test", "deploy"] as const).map((job) => (
              <li key={job} className="flex items-center gap-2">
                <span className="font-mono" style={{ color: COLOR[e[job]] }}>
                  {ICON[e[job]]}
                </span>
                <span>{job}</span>
                <span className="text-muted">{e[job] === "run" ? "succeeded" : e[job] === "skip" ? "skipped" : "not triggered"}</span>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-muted">{e.note}</p>
        </Panel>
      </div>
    </DemoFrame>
  );
}

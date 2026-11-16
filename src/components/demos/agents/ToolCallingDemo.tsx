"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, Panel, StepControls, useStepper } from "../ui";

const CASES = {
  weather: {
    label: "Umbrella in Berlin?",
    question: "Do I need an umbrella in Berlin today?",
    call: '{ "name": "get_weather", "input": { "city": "Berlin" } }',
    result: '{ "temp_c": 11, "rain_chance": 0.8 }',
    answer: "Yes, take an umbrella: 80% chance of rain and 11 °C in Berlin.",
  },
  maths: {
    label: "Price with VAT",
    question: "What do 3 items at 19.99 € cost with 19% VAT?",
    call: '{ "name": "calculator", "input": { "expression": "19.99 * 3 * 1.19" } }',
    result: "71.3643",
    answer: "Three items cost 71.36 € including 19% VAT.",
  },
  hello: {
    label: "Just saying hi",
    question: "Hi there!",
    call: null,
    result: null,
    answer: "Hello! How can I help with your errands today?",
  },
} as const;
type CaseId = keyof typeof CASES;

export default function ToolCallingDemo() {
  const [cid, setCid] = React.useState<CaseId>("weather");
  const c = CASES[cid];
  const stages = c.call ? 4 : 2;
  const { shown, play, next, reset, done } = useStepper(stages, 800);

  return (
    <DemoFrame title="The model asks, your code does" hint="Run it and watch who does what." onReset={reset}>
      <div className="flex flex-wrap items-center gap-2">
        <ChoiceChips
          label="Question"
          options={(Object.keys(CASES) as CaseId[]).map((id) => ({ id, label: CASES[id].label }))}
          value={cid}
          onChange={(id) => {
            setCid(id);
            reset();
          }}
        />
        <StepControls onPlay={play} onNext={next} done={done} />
      </div>
      <div className="mt-3 space-y-1.5 text-xs" aria-live="polite">
        {shown >= 1 && <Panel title="user">{c.question}</Panel>}
        {c.call && shown >= 2 && (
          <Panel title="model → tool call (it does not run anything)" tint="var(--area-agents)">
            <code className="font-mono">{c.call}</code>
          </Panel>
        )}
        {c.result && shown >= 3 && (
          <Panel title="your code runs the tool → tool result" tint="var(--area-rag)">
            <code className="font-mono">{c.result}</code>
          </Panel>
        )}
        {shown >= stages && (
          <Panel title="model → final answer" tint="var(--good)">
            {c.answer}
          </Panel>
        )}
      </div>
      {done && !c.call && <p className="mt-2 text-xs text-muted">No tool needed: the model simply answered in text.</p>}
    </DemoFrame>
  );
}

"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, Panel } from "../ui";

const PARENT = [
  "Elephants: lifespan and health",
  "African elephants can live 60 to 70 years in the wild.",
  "Asian elephants have a similar lifespan.",
  "Elephants in zoos often live shorter lives than wild ones.",
  "Their teeth wear down with age, which affects how well they can eat.",
];
const CHILD_INDEX = 1;

type Mode = "child" | "parent";

const ANSWERS: Record<Mode, string> = {
  child: "Elephants can live 60 to 70 years.",
  parent:
    "African elephants can live 60 to 70 years in the wild, and Asian elephants about the same. In zoos they often live shorter lives.",
};

export default function ParentChildDemo() {
  const [mode, setMode] = React.useState<Mode>("child");

  return (
    <DemoFrame title="Find the sentence, send the page" hint='Question: "How long do elephants live?"' onReset={() => setMode("child")}>
      <ChoiceChips
        label="What goes to the LLM"
        options={[
          { id: "child", label: "Only the matched sentence (child)" },
          { id: "parent", label: "Its whole section (parent)" },
        ]}
        value={mode}
        onChange={setMode}
      />
      <div className="mt-3 rounded-lg border border-border p-2 text-xs">
        {PARENT.map((s, i) => {
          const isChild = i === CHILD_INDEX;
          const sent = mode === "parent" || isChild;
          return (
            <div
              key={s}
              className={i === 0 ? "mb-1 font-semibold" : "rounded px-1"}
              style={{
                backgroundColor: isChild
                  ? "color-mix(in srgb, var(--accent) 30%, transparent)"
                  : sent
                    ? "color-mix(in srgb, var(--area-rag) 16%, transparent)"
                    : undefined,
                opacity: sent ? 1 : 0.4,
                transition: "opacity 200ms, background-color 200ms",
              }}
            >
              {s}
              {isChild && <span className="ml-1 font-mono text-[10px] text-muted">← matched by search</span>}
            </div>
          );
        })}
      </div>
      <Panel className="mt-3" title="answer" tint={mode === "parent" ? "var(--good)" : "var(--warn)"}>
        <p className="text-sm" aria-live="polite">
          {ANSWERS[mode]}
        </p>
      </Panel>
      <p className="mt-2 text-xs text-muted">
        The small sentence is the best thing to <em>search</em> with; the whole section is the best thing to <em>answer</em> from.
      </p>
    </DemoFrame>
  );
}

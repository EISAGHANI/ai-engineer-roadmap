"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";
import { Switch } from "@/components/ui/Switch";

const MARKDOWN = [
  "**Holiday days**",
  "\n\n- Full-time staff get **28 days** per year",
  " [1].",
  "\n- Unused days carry over until **31 March**",
  " [2].",
  "\n- Bookings over two weeks need manager approval",
  " [1].",
  "\n\nSources: [1] Handbook p. 12 · [2] HR FAQ",
];
const TOTAL_TOKENS = 220;

/** Render the small Markdown subset safely: bold, bullet lines, citation chips. */
function render(md: string) {
  return md.split("\n").map((line, i) => {
    const bullet = line.startsWith("- ");
    const parts = (bullet ? line.slice(2) : line).split(/(\*\*[^*]+\*\*|\[\d\])/g);
    const nodes = parts.map((p, k) => {
      if (/^\*\*[^*]+\*\*$/.test(p)) return <strong key={k}>{p.slice(2, -2)}</strong>;
      if (/^\[\d\]$/.test(p))
        return (
          <sup key={k} className="rounded bg-accent px-1 text-[9px] text-accent-ink">
            {p.slice(1, -1)}
          </sup>
        );
      return <React.Fragment key={k}>{p.replace(/\*\*/g, "")}</React.Fragment>;
    });
    return bullet ? (
      <li key={i} className="ml-4 list-disc">
        {nodes}
      </li>
    ) : (
      <p key={i}>{nodes}</p>
    );
  });
}

export default function StreamingDemo() {
  const [step, setStep] = React.useState(-1);
  const [leaveEarly, setLeaveEarly] = React.useState(false);
  const [cancel, setCancel] = React.useState(true);

  React.useEffect(() => {
    if (step < 0 || step >= MARKDOWN.length) return;
    if (leaveEarly && step >= 3) return; // user closed the tab here
    const t = window.setTimeout(() => setStep(step + 1), 450);
    return () => window.clearTimeout(t);
  }, [step, leaveEarly]);

  const shownText = MARKDOWN.slice(0, Math.max(0, step)).join("");
  const left = leaveEarly && step >= 3;
  const tokensShown = Math.round((Math.max(0, step) / MARKDOWN.length) * TOTAL_TOKENS);
  const billed = left && !cancel ? TOTAL_TOKENS : tokensShown;

  return (
    <DemoFrame
      title="Bread first, then the courses"
      hint="The answer streams in as Markdown with citations, rendered piece by piece."
      onReset={() => {
        setStep(-1);
        setLeaveEarly(false);
        setCancel(true);
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <ActionButton onClick={() => setStep(0)}>Ask</ActionButton>
        <Switch checked={leaveEarly} onChange={setLeaveEarly} label="User closes the tab halfway" />
        <Switch checked={cancel} onChange={setCancel} label="Abort upstream on disconnect" />
      </div>
      <div className="mt-3 min-h-28 rounded-lg bg-surface p-3 text-xs leading-relaxed" aria-live="polite">
        {step >= 0 ? render(shownText) : <span className="text-muted">Press Ask.</span>}
        {step >= 0 && step < MARKDOWN.length && !left && <span className="animate-pulse">▍</span>}
        {left && <p className="mt-2 text-[11px] text-muted">(tab closed)</p>}
      </div>
      {step >= 0 && (
        <p className="mt-2 font-mono text-[11px]">
          tokens billed: {billed} / {TOTAL_TOKENS}
          {left && !cancel && <span style={{ color: "var(--bad)" }}> · the model kept writing for nobody</span>}
          {left && cancel && <span style={{ color: "var(--good)" }}> · generation stopped when the user left</span>}
        </p>
      )}
    </DemoFrame>
  );
}

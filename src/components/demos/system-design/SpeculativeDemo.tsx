"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";

const TARGET = "Preheat the oven to 200 degrees , then bake the bread for twenty five minutes until golden brown .".split(" ");
/** Where the small draft model guesses wrong (index into TARGET) at different text "predictability". */
const MISTAKES: Record<string, number[]> = {
  predictable: [7, 15],
  mixed: [2, 5, 7, 9, 12, 15],
  creative: [1, 2, 4, 5, 7, 8, 10, 11, 13, 14, 16],
};
const K = 4;

export default function SpeculativeDemo() {
  const [kind, setKind] = React.useState<keyof typeof MISTAKES>("predictable");
  const [passes, setPasses] = React.useState<Array<{ accepted: string[]; fixed: string | null }>>([]);
  const pos = passes.reduce((a, p) => a + p.accepted.length + (p.fixed ? 1 : 0), 0);
  const finished = pos >= TARGET.length;

  function verifyPass() {
    if (finished) return;
    const wrong = new Set(MISTAKES[kind]);
    const accepted: string[] = [];
    let i = pos;
    while (accepted.length < K && i < TARGET.length && !wrong.has(i)) {
      accepted.push(TARGET[i]);
      i++;
    }
    // The big model always contributes one token of its own: the correction (or the next token)
    const fixed = i < TARGET.length ? TARGET[i] : null;
    setPasses([...passes, { accepted, fixed }]);
  }

  return (
    <DemoFrame
      title="The helper guesses, the chef checks"
      hint={`A small model drafts ${K} words; the big model checks them in one pass and keeps the correct start.`}
      onReset={() => setPasses([])}
    >
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(MISTAKES) as Array<keyof typeof MISTAKES>).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => {
              setKind(k);
              setPasses([]);
            }}
            className="rounded-full border px-2.5 py-0.5 text-xs"
            style={{ borderColor: k === kind ? "var(--accent)" : "var(--border)" }}
          >
            {k} text
          </button>
        ))}
        <ActionButton onClick={verifyPass} disabled={finished}>
          Big-model pass
        </ActionButton>
        <ActionButton
          variant="secondary"
          onClick={() => {
            let p = passes;
            let n = pos;
            const wrong = new Set(MISTAKES[kind]);
            while (n < TARGET.length) {
              const accepted: string[] = [];
              let i = n;
              while (accepted.length < K && i < TARGET.length && !wrong.has(i)) accepted.push(TARGET[i++]);
              const fixed = i < TARGET.length ? TARGET[i] : null;
              p = [...p, { accepted, fixed }];
              n = i + (fixed ? 1 : 0);
            }
            setPasses(p);
          }}
          disabled={finished}
        >
          Run to the end
        </ActionButton>
      </div>
      <p className="mt-3 min-h-16 rounded-lg bg-surface p-2 text-xs leading-relaxed" aria-live="polite">
        {passes.map((p, i) => (
          <React.Fragment key={i}>
            {p.accepted.map((w, k) => (
              <span key={k} className="mr-1 rounded px-0.5" style={{ backgroundColor: "color-mix(in srgb, var(--good) 22%, transparent)" }}>
                {w}
              </span>
            ))}
            {p.fixed && (
              <span className="mr-1 rounded px-0.5" style={{ backgroundColor: "color-mix(in srgb, var(--area-system-design) 30%, transparent)" }}>
                {p.fixed}
              </span>
            )}
            <span className="mr-1 text-muted">|</span>
          </React.Fragment>
        ))}
      </p>
      <p className="mt-1 text-[10px] text-muted">green = drafted by the small model and accepted · purple = written by the big model · | = one big-model pass</p>
      <p className="mt-2 text-xs">
        Big-model passes: <strong>{passes.length}</strong> for {Math.min(pos, TARGET.length)} words
        {finished && (
          <>
            {" "}
            (normally {TARGET.length}) → <strong style={{ color: "var(--good)" }}>{(TARGET.length / passes.length).toFixed(1)}× faster</strong>, same text.
          </>
        )}
      </p>
    </DemoFrame>
  );
}

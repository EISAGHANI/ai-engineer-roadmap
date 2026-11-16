"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { DemoFrame } from "../DemoFrame";
import { useMotionSafe } from "@/lib/motion";

const DEFAULT = "The little robot read a long story about dinosaurs.";
const PRICE_PER_MILLION = 3; // USD, illustrative input price

/**
 * A toy tokenizer: splits on spaces, then cuts long words into ~4-letter pieces and
 * separates punctuation. Not a real BPE, but it shows the idea: pieces, not words.
 */
function toyTokenize(text: string): string[] {
  const out: string[] = [];
  for (const raw of text.split(/(\s+)/)) {
    if (!raw) continue;
    if (/^\s+$/.test(raw)) continue;
    const m = raw.match(/^([\p{L}\p{N}']+)([^\p{L}\p{N}']*)$/u);
    const word = m ? m[1] : raw;
    const punct = m ? m[2] : "";
    if (word.length <= 5) out.push(word);
    else {
      let i = 0;
      while (i < word.length) {
        const size = i === 0 ? 4 : 3;
        out.push(word.slice(i, i + size));
        i += size;
      }
    }
    if (punct) out.push(punct);
  }
  return out;
}

const palette = ["var(--area-llm)", "var(--area-rag)", "var(--area-agents)", "var(--area-system-design)", "var(--area-security)"];

export default function TokenizerDemo() {
  const [text, setText] = React.useState(DEFAULT);
  const motionSafe = useMotionSafe();
  const tokens = React.useMemo(() => toyTokenize(text), [text]);
  const cost = (tokens.length / 1_000_000) * PRICE_PER_MILLION;

  return (
    <DemoFrame
      title="Cut a sentence into tokens"
      hint="Type anything. Long words get cut into pieces; every piece costs money."
      onReset={() => setText(DEFAULT)}
    >
      <label className="block text-xs text-muted">
        Your sentence
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 160))}
          rows={2}
          className="mt-1 w-full resize-none rounded-lg border border-border bg-surface p-2 text-sm text-text outline-none focus:border-accent"
        />
      </label>
      <div className="mt-3 flex min-h-16 flex-wrap gap-1.5" aria-live="polite">
        <AnimatePresence initial={false}>
          {tokens.map((t, i) => (
            <motion.span
              key={`${i}-${t}`}
              layout={motionSafe}
              initial={motionSafe ? { scale: 0.6, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              exit={motionSafe ? { scale: 0.6, opacity: 0 } : { opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="rounded-md px-2 py-0.5 font-mono text-sm text-text"
              style={{ backgroundColor: `color-mix(in srgb, ${palette[i % palette.length]} 28%, transparent)` }}
            >
              {t}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-surface p-2">
          <dt className="text-[11px] text-muted">Words</dt>
          <dd className="font-mono text-lg">{text.trim() ? text.trim().split(/\s+/).length : 0}</dd>
        </div>
        <div className="rounded-lg bg-surface p-2">
          <dt className="text-[11px] text-muted">Tokens</dt>
          <dd className="font-mono text-lg" style={{ color: "var(--accent)" }}>
            {tokens.length}
          </dd>
        </div>
        <div className="rounded-lg bg-surface p-2">
          <dt className="text-[11px] text-muted">Cost at $3 / 1M</dt>
          <dd className="font-mono text-lg">${cost.toFixed(6)}</dd>
        </div>
      </dl>
    </DemoFrame>
  );
}

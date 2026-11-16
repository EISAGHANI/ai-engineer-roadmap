"use client";

import * as React from "react";
import { Play, StepForward } from "lucide-react";
import { DemoFrame } from "../DemoFrame";
import { useMotionSafe } from "@/lib/motion";

const WORDS = ["The", "parrot", "reads", "a", "very", "long", "story", "about", "a", "boat"];

/**
 * Generate the sentence word by word on two sides.
 * Left: no cache -> each new word re-reads every earlier word (work grows fast).
 * Right: KV cache -> each earlier word gets a sticky note once; new words only glance at notes.
 */
export default function KvCacheDemo() {
  const motionSafe = useMotionSafe();
  const [step, setStep] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(() => {
    if (!playing || !motionSafe) return;
    if (step >= WORDS.length) {
      setPlaying(false);
      return;
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), 450);
    return () => window.clearTimeout(t);
  }, [playing, step, motionSafe]);

  const noCacheWork = (step * (step + 1)) / 2; // 1 + 2 + ... + step
  const cacheWork = step; // one unit per new word

  function reset() {
    setStep(0);
    setPlaying(false);
  }

  return (
    <DemoFrame title="With and without a KV cache" hint="Play or step. Count how much re-reading each side does." onReset={reset}>
      <div className="mb-3 flex gap-2">
        <button
          type="button"
          onClick={() => (step >= WORDS.length ? reset() : setPlaying((p) => !p))}
          disabled={!motionSafe}
          title={motionSafe ? undefined : "Autoplay is off while motion is reduced; use Step"}
          className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-ink disabled:opacity-40"
        >
          <Play className="h-3.5 w-3.5" aria-hidden="true" /> {playing ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(WORDS.length, s + 1))}
          className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs"
        >
          <StepForward className="h-3.5 w-3.5" aria-hidden="true" /> Step
        </button>
        <span className="ml-auto self-center font-mono text-xs text-muted">
          word {step}/{WORDS.length}
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Side title="No cache" work={noCacheWork} color="var(--bad)" step={step} mode="reread" />
        <Side title="KV cache" work={cacheWork} color="var(--good)" step={step} mode="notes" />
      </div>
      <p className="mt-3 text-xs text-muted">
        Work = how many earlier words had to be processed again. Without a cache it grows like 1+2+3+…; with one, every
        word is processed once.
      </p>
    </DemoFrame>
  );
}

function Side({
  title,
  work,
  color,
  step,
  mode,
}: {
  title: string;
  work: number;
  color: string;
  step: number;
  mode: "reread" | "notes";
}) {
  return (
    <div className="rounded-lg bg-surface p-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">{title}</span>
        <span className="font-mono text-lg" style={{ color }}>
          {work} <span className="text-[10px] text-muted">work</span>
        </span>
      </div>
      <div className="mt-2 flex min-h-14 flex-wrap gap-1">
        {WORDS.slice(0, step).map((w, i) => {
          const isNew = i === step - 1;
          const highlighted = mode === "reread" ? true : isNew;
          return (
            <span
              key={i}
              className="relative rounded px-1.5 py-0.5 font-mono text-xs"
              style={{
                backgroundColor: highlighted ? `color-mix(in srgb, ${color} 25%, transparent)` : "var(--surface-2)",
                outline: isNew ? `1px solid ${color}` : "none",
              }}
            >
              {w}
              {mode === "notes" && !isNew && (
                <span className="absolute -top-1.5 -right-1 h-2.5 w-2.5 rotate-12 rounded-[2px]" style={{ background: "var(--accent)" }} aria-hidden="true" />
              )}
            </span>
          );
        })}
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, (work / 55) * 100)}%`, backgroundColor: color, transition: "width 300ms" }} />
      </div>
    </div>
  );
}

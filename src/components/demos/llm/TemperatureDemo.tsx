"use client";

import * as React from "react";
import { Dices } from "lucide-react";
import { DemoFrame } from "../DemoFrame";

/** Raw model scores (logits) for the next word after "The cat sat on the ..." */
const WORDS: Array<{ word: string; logit: number }> = [
  { word: "mat", logit: 3.0 },
  { word: "sofa", logit: 2.1 },
  { word: "floor", logit: 1.7 },
  { word: "roof", logit: 0.8 },
  { word: "moon", logit: -0.6 },
  { word: "piano", logit: -1.2 },
];

function distribution(temperature: number, topP: number) {
  let probs: number[];
  if (temperature === 0) {
    probs = WORDS.map((_, i) => (i === 0 ? 1 : 0));
  } else {
    const max = Math.max(...WORDS.map((w) => w.logit));
    const exps = WORDS.map((w) => Math.exp((w.logit - max) / temperature));
    const sum = exps.reduce((a, b) => a + b, 0);
    probs = exps.map((e) => e / sum);
  }
  // Nucleus: keep the most likely words until their total reaches top-p
  const order = probs.map((p, i) => ({ p, i })).sort((a, b) => b.p - a.p);
  const keep = new Set<number>();
  let total = 0;
  for (const { p, i } of order) {
    keep.add(i);
    total += p;
    if (total >= topP - 1e-9) break;
  }
  const keptSum = probs.reduce((a, p, i) => (keep.has(i) ? a + p : a), 0);
  return probs.map((p, i) => ({ ...WORDS[i], raw: p, final: keep.has(i) ? p / keptSum : 0, kept: keep.has(i) }));
}

export default function TemperatureDemo() {
  const [temperature, setTemperature] = React.useState(1);
  const [topP, setTopP] = React.useState(1);
  const [samples, setSamples] = React.useState<string[]>([]);
  const dist = React.useMemo(() => distribution(temperature, topP), [temperature, topP]);

  function sampleTen() {
    const out: string[] = [];
    for (let n = 0; n < 10; n++) {
      let r = Math.random();
      let picked = dist[0].word;
      for (const d of dist) {
        if (r < d.final) {
          picked = d.word;
          break;
        }
        r -= d.final;
      }
      out.push(picked);
    }
    setSamples(out);
  }

  function reset() {
    setTemperature(1);
    setTopP(1);
    setSamples([]);
  }

  const mood = temperature === 0 ? "always the top word" : temperature < 0.6 ? "safe and predictable" : temperature <= 1.2 ? "balanced" : "wild and surprising";

  return (
    <DemoFrame title="The cat sat on the …" hint="Move the dials, then roll the dice ten times." onReset={reset}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-xs text-muted">
          Temperature: <span className="font-mono text-text">{temperature.toFixed(1)}</span> ({mood})
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={temperature}
            onChange={(e) => {
              setTemperature(parseFloat(e.target.value));
              setSamples([]);
            }}
            className="mt-1 w-full accent-[var(--accent)]"
          />
        </label>
        <label className="text-xs text-muted">
          Top-p: <span className="font-mono text-text">{topP.toFixed(2)}</span> (keep the top {Math.round(topP * 100)}%)
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.05}
            value={topP}
            onChange={(e) => {
              setTopP(parseFloat(e.target.value));
              setSamples([]);
            }}
            className="mt-1 w-full accent-[var(--accent)]"
          />
        </label>
      </div>

      <ul className="mt-3 space-y-1" aria-label="Chance of each next word">
        {dist.map((d) => (
          <li key={d.word} className="flex items-center gap-2 text-sm">
            <span className={`w-12 font-mono ${d.kept ? "" : "text-muted line-through"}`}>{d.word}</span>
            <span className="h-3 flex-1 overflow-hidden rounded-full bg-surface">
              <span
                className="block h-full rounded-full"
                style={{
                  width: `${d.final * 100}%`,
                  backgroundColor: "var(--area-llm)",
                  transition: "width 250ms var(--ease-out)",
                }}
              />
            </span>
            <span className="w-11 text-right font-mono text-xs text-muted">{Math.round(d.final * 100)}%</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={sampleTen}
          className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-ink"
        >
          <Dices className="h-3.5 w-3.5" aria-hidden="true" /> Roll 10 times
        </button>
        <span className="flex flex-wrap gap-1" aria-live="polite">
          {samples.map((s, i) => (
            <span key={i} className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
              {s}
            </span>
          ))}
        </span>
      </div>
    </DemoFrame>
  );
}

"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";

type Cat = "harassment" | "hate" | "violence" | "self-harm";
const CATS: Cat[] = ["harassment", "hate", "violence", "self-harm"];
/** Illustrative classifier scores for messages sent to a castle-tour chatbot. */
const MESSAGES: Array<{ text: string; dir: "in" | "out"; scores: Record<Cat, number> }> = [
  { text: "What time does the castle tour start?", dir: "in", scores: { harassment: 0.01, hate: 0, violence: 0, "self-harm": 0 } },
  { text: "You're a useless bot and your castle is a dump.", dir: "in", scores: { harassment: 0.72, hate: 0.03, violence: 0.02, "self-harm": 0 } },
  { text: "How did knights fight with swords in medieval battles?", dir: "in", scores: { harassment: 0.01, hate: 0, violence: 0.48, "self-harm": 0 } },
  { text: "I feel really low and don't see the point any more.", dir: "in", scores: { harassment: 0, hate: 0, violence: 0, "self-harm": 0.81 } },
  { text: "Bot reply: people from that village are all thieves.", dir: "out", scores: { harassment: 0.35, hate: 0.77, violence: 0.02, "self-harm": 0 } },
];

export default function ModerationDemo() {
  const [threshold, setThreshold] = React.useState<Record<Cat, number>>({ harassment: 0.6, hate: 0.5, violence: 0.4, "self-harm": 0.5 });

  return (
    <DemoFrame
      title="Guards at both doors of the great hall"
      hint="Messages in and out are scored per category. Each category has its own threshold."
      onReset={() => setThreshold({ harassment: 0.6, hate: 0.5, violence: 0.4, "self-harm": 0.5 })}
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
        {CATS.map((c) => (
          <label key={c} className="text-[11px] text-muted">
            {c}: <span className="font-mono text-text">{threshold[c].toFixed(2)}</span>
            <input type="range" min={0.1} max={0.95} step={0.05} value={threshold[c]} onChange={(e) => setThreshold({ ...threshold, [c]: +e.target.value })} className="block w-full accent-[var(--accent)]" />
          </label>
        ))}
      </div>
      <ul className="mt-3 space-y-1 text-[11px]" aria-live="polite">
        {MESSAGES.map((m) => {
          const hits = CATS.filter((c) => m.scores[c] >= threshold[c]);
          const selfHarm = hits.includes("self-harm");
          const action = !hits.length ? "allow" : selfHarm ? "support" : "block";
          return (
            <li
              key={m.text}
              className="rounded px-2 py-1"
              style={{
                backgroundColor:
                  action === "block" ? "color-mix(in srgb, var(--bad) 15%, transparent)" : action === "support" ? "color-mix(in srgb, var(--area-rag) 18%, transparent)" : "var(--surface)",
              }}
            >
              <div className="flex justify-between gap-2">
                <span>
                  {m.dir === "in" ? "→ " : "← "}
                  {m.text}
                </span>
                <span className="shrink-0 font-mono">{action === "allow" ? "allowed" : action === "support" ? "supportive reply" : "blocked"}</span>
              </div>
              <div className="font-mono text-[10px] text-muted">
                {CATS.filter((c) => m.scores[c] > 0.05)
                  .map((c) => `${c} ${m.scores[c].toFixed(2)}`)
                  .join(" · ") || "no category above 0.05"}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-[11px] text-muted">
        A history question about sword fighting shouldn&apos;t be blocked, but a hateful bot reply must be. Someone who sounds low gets a caring reply with places to find help, not a refusal.
      </p>
    </DemoFrame>
  );
}

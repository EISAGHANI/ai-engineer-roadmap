"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";

const CAPACITY = 10;
const REFILL_PER_S = 1 / 3; // one new stamp every 3 seconds (sped up for the demo)

type Result = { ok: boolean };

export default function RateLimitDemo() {
  const [tokens, setTokens] = React.useState(CAPACITY);
  const [results, setResults] = React.useState<Result[]>([]);

  // Refill continuously
  React.useEffect(() => {
    const id = window.setInterval(() => {
      setTokens((t) => Math.min(CAPACITY, t + REFILL_PER_S / 4));
    }, 250);
    return () => window.clearInterval(id);
  }, []);

  function send(n: number) {
    let t = tokens;
    const out: Result[] = [];
    for (let i = 0; i < n; i++) {
      const ok = t >= 1;
      if (ok) t -= 1;
      out.push({ ok });
    }
    setTokens(t);
    setResults((r) => [...r, ...out].slice(-30));
  }

  const refused = results.filter((r) => !r.ok).length;
  const retryAfter = tokens >= 1 ? 0 : Math.ceil((1 - tokens) / REFILL_PER_S);

  return (
    <DemoFrame
      title="Ten stamps per hour each"
      hint="A token bucket: 10 stamps, one stamp back every 3 seconds. Each request uses one."
      onReset={() => {
        setTokens(CAPACITY);
        setResults([]);
      }}
    >
      <div className="flex flex-wrap gap-2">
        <ActionButton onClick={() => send(1)}>Send 1 request</ActionButton>
        <ActionButton variant="secondary" onClick={() => send(8)}>
          Burst of 8
        </ActionButton>
        <ActionButton variant="secondary" onClick={() => send(25)}>
          🤖 Runaway script: 25
        </ActionButton>
      </div>
      <div className="mt-3 flex items-center gap-1" aria-label={`${Math.floor(tokens)} of ${CAPACITY} stamps left`}>
        {Array.from({ length: CAPACITY }, (_, i) => {
          const fill = Math.max(0, Math.min(1, tokens - i));
          return (
            <span key={i} className="relative h-6 flex-1 overflow-hidden rounded-md bg-surface">
              <span className="absolute bottom-0 w-full transition-all" style={{ height: `${fill * 100}%`, backgroundColor: "var(--area-backend)" }} />
            </span>
          );
        })}
      </div>
      <p className="mt-1 text-[11px] text-muted">bucket: {tokens.toFixed(1)} / {CAPACITY} stamps</p>
      <div className="mt-2 flex flex-wrap gap-0.5" aria-live="polite">
        {results.map((r, i) => (
          <span key={i} className="rounded px-1 font-mono text-[10px]" style={{ backgroundColor: `color-mix(in srgb, ${r.ok ? "var(--good)" : "var(--bad)"} 22%, transparent)` }}>
            {r.ok ? "200" : "429"}
          </span>
        ))}
      </div>
      {refused > 0 && (
        <p className="mt-2 font-mono text-[11px]">
          HTTP 429 Too Many Requests · Retry-After: {retryAfter || 1}
        </p>
      )}
      <p className="mt-1 text-[11px] text-muted">Short bursts are fine; a runaway script gets stopped without slowing anyone else down.</p>
    </DemoFrame>
  );
}

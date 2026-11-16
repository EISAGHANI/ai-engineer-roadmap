"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, ScoreBar, StepControls, useStepper } from "../ui";

const LOG = [
  "$ vllm serve Qwen/Qwen2.5-7B-Instruct --max-model-len 16384 --enable-prefix-caching",
  "INFO Loading weights… 15.2 GiB",
  "INFO KV cache: 52,416 tokens in 3,276 blocks of 16 (PagedAttention)",
  "INFO Continuous batching: max_num_seqs=256",
  "INFO Serving OpenAI-compatible API at http://0.0.0.0:8000/v1",
  "$ curl localhost:8000/v1/chat/completions -d '{\"model\":\"Qwen/Qwen2.5-7B-Instruct\",…}'",
  '{"choices":[{"message":{"content":"RAG looks up documents first, then answers from them."}}]}',
];

/** Illustrative tokens/second on one GPU with 64 concurrent users. */
const SERVERS = {
  naive: { label: "Plain transformers generate()", tps: 450, note: "one request at a time; others wait in line" },
  vllm: { label: "vLLM", tps: 6200, note: "continuous batching + paged KV cache" },
} as const;
type ServerId = keyof typeof SERVERS;

export default function VllmDemo() {
  const { shown, play, next, reset, done } = useStepper(LOG.length, 600);
  const [server, setServer] = React.useState<ServerId>("vllm");
  const s = SERVERS[server];
  const usersServedPerMin = Math.round((s.tps * 60) / 300);

  return (
    <DemoFrame title="Your own kitchen with an organised cook" hint="Start vLLM, call it like the OpenAI API, then compare serving speed." onReset={reset}>
      <StepControls onPlay={play} onNext={next} done={done} playLabel="Start the server" />
      <pre className="mt-2 min-h-32 whitespace-pre-wrap rounded-lg bg-neutral-950 p-2 font-mono text-[10px] leading-relaxed text-neutral-200" aria-live="polite">
        {LOG.slice(0, shown).map((l, i) => (
          <div key={i} style={{ color: l.startsWith("$") ? undefined : l.startsWith("{") ? "#86efac" : "#a3a3a3" }}>
            {l}
          </div>
        ))}
      </pre>
      <div className="mt-3">
        <ChoiceChips label="Serving engine" options={(Object.keys(SERVERS) as ServerId[]).map((k) => ({ id: k, label: SERVERS[k].label }))} value={server} onChange={setServer} />
        <div className="mt-2 flex justify-between text-xs">
          <span>64 users at once</span>
          <span className="font-mono">{s.tps.toLocaleString("en-US")} tokens/s</span>
        </div>
        <ScoreBar value={s.tps} max={SERVERS.vllm.tps} color="var(--area-system-design)" />
        <p className="mt-1 text-[11px] text-muted">
          ≈ {usersServedPerMin} answers per minute · {s.note} (illustrative numbers)
        </p>
      </div>
    </DemoFrame>
  );
}

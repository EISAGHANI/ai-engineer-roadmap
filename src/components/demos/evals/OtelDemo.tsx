"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips, Panel } from "../ui";

const SPAN = {
  name: "chat claude-sonnet-5-5",
  attributes: {
    "gen_ai.operation.name": "chat",
    "gen_ai.provider.name": "anthropic",
    "gen_ai.request.model": "claude-sonnet-5-5",
    "gen_ai.request.max_tokens": 300,
    "gen_ai.usage.input_tokens": 2100,
    "gen_ai.usage.output_tokens": 64,
  },
  duration_ms: 1320,
};

const BACKENDS = [
  { id: "langfuse", label: "Langfuse" },
  { id: "jaeger", label: "Jaeger" },
  { id: "grafana", label: "Grafana Tempo" },
  { id: "datadog", label: "Datadog" },
] as const;
type BackendId = (typeof BACKENDS)[number]["id"];

export default function OtelDemo() {
  const [backend, setBackend] = React.useState<BackendId>("langfuse");
  const name = BACKENDS.find((b) => b.id === backend)?.label ?? "";

  return (
    <DemoFrame title="One diary format, any control room" hint="The app writes one standard span; switch where it is sent." onReset={() => setBackend("langfuse")}>
      <div className="grid gap-2 sm:grid-cols-2">
        <Panel title="span written by your app (OTel GenAI conventions)">
          <pre className="font-mono text-[10px] leading-snug whitespace-pre-wrap">{JSON.stringify(SPAN, null, 1)}</pre>
        </Panel>
        <div>
          <ChoiceChips label="Export to (OTLP)" options={BACKENDS} value={backend} onChange={setBackend} />
          <Panel className="mt-2" title={`${name} shows`} tint="var(--area-evals)">
            <ul className="space-y-0.5 text-xs" aria-live="polite">
              <li>
                <strong>{SPAN.name}</strong> · {SPAN.duration_ms} ms
              </li>
              <li>model: {SPAN.attributes["gen_ai.request.model"]}</li>
              <li>
                tokens: {SPAN.attributes["gen_ai.usage.input_tokens"]} in / {SPAN.attributes["gen_ai.usage.output_tokens"]} out
              </li>
            </ul>
          </Panel>
          <p className="mt-2 text-xs text-muted">Nothing in the app changed: only the exporter address. That is the point of a shared standard.</p>
        </div>
      </div>
    </DemoFrame>
  );
}

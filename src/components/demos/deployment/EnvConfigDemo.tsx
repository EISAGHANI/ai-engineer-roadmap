"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";
import { Switch } from "@/components/ui/Switch";

type Env = "dev" | "staging" | "production";
const VARS: Array<{ key: string; secret?: boolean; values: Record<Env, string>; source: Record<Env, string> }> = [
  { key: "DATABASE_URL", values: { dev: "postgres://localhost/rag", staging: "postgres://db.staging/rag", production: "postgres://db.prod/rag" }, source: { dev: ".env", staging: "platform", production: "platform" } },
  { key: "LLM_MODEL", values: { dev: "llama3.1:8b (Ollama)", staging: "claude-haiku-5-5", production: "claude-sonnet-5-5" }, source: { dev: ".env", staging: "platform", production: "platform" } },
  { key: "LOG_LEVEL", values: { dev: "debug", staging: "info", production: "warning" }, source: { dev: ".env", staging: "platform", production: "platform" } },
  { key: "RATE_LIMIT_PER_MIN", values: { dev: "1000", staging: "60", production: "30" }, source: { dev: ".env", staging: "platform", production: "platform" } },
  { key: "ANTHROPIC_API_KEY", secret: true, values: { dev: "sk-ant-…dev1", staging: "sk-ant-…stg7", production: "sk-ant-…prd3" }, source: { dev: ".env (git-ignored)", staging: "secret manager", production: "secret manager" } },
  { key: "SEARCH_URL", values: { dev: "http://localhost:6333", staging: "http://qdrant.staging", production: "http://qdrant.prod" }, source: { dev: ".env", staging: "platform", production: "platform" } },
];

export default function EnvConfigDemo() {
  const [env, setEnv] = React.useState<Env>("dev");
  const [missing, setMissing] = React.useState(false);

  return (
    <DemoFrame
      title="One truck, three settings cards"
      hint="The same image runs everywhere; only the settings change."
      onReset={() => {
        setEnv("dev");
        setMissing(false);
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <ChoiceChips
          label="Environment"
          options={[
            { id: "dev", label: "dev" },
            { id: "staging", label: "staging" },
            { id: "production", label: "production" },
          ]}
          value={env}
          onChange={setEnv}
        />
        <Switch checked={missing} onChange={setMissing} label="Forget SEARCH_URL" />
      </div>
      <p className="mt-2 font-mono text-[11px] text-muted">image: ghcr.io/eisaghani/rag-api:1.4.0 (identical in all three)</p>
      <table className="mt-2 w-full text-left text-[11px]">
        <thead className="text-muted">
          <tr>
            <th className="font-normal">variable</th>
            <th className="font-normal">value</th>
            <th className="font-normal">comes from</th>
          </tr>
        </thead>
        <tbody>
          {VARS.map((v) => {
            const gone = missing && v.key === "SEARCH_URL";
            return (
              <tr key={v.key} className="border-t border-border" style={gone ? { backgroundColor: "color-mix(in srgb, var(--bad) 16%, transparent)" } : undefined}>
                <td className="py-0.5 font-mono">{v.key}</td>
                <td className="py-0.5 font-mono">{gone ? "(not set)" : v.secret ? v.values[env].replace(/….*/, "…••••") : v.values[env]}</td>
                <td className="py-0.5 text-muted">{gone ? "—" : v.source[env]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-2 rounded-lg px-3 py-2 font-mono text-[11px]" style={{ backgroundColor: `color-mix(in srgb, ${missing ? "var(--bad)" : "var(--good)"} 14%, transparent)` }} aria-live="polite">
        {missing
          ? "Settings() failed at startup: search_url: field required. The new version never takes traffic; the old one keeps serving."
          : `Settings() loaded ${VARS.length} values for ${env}. Secrets are masked in logs.`}
      </p>
    </DemoFrame>
  );
}

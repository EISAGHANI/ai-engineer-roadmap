"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";
import { Switch } from "@/components/ui/Switch";

type Role = "user" | "admin";

function b64url(s: string) {
  return btoa(s).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}
/** A toy signature so the demo can show "signature does not match". Real JWTs use HMAC or RSA. */
function toySign(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) h = Math.imul(h ^ input.charCodeAt(i), 16777619);
  return b64url(((h >>> 0).toString(16) + "a7c3").slice(0, 12));
}

export default function JwtDemo() {
  const [role, setRole] = React.useState<Role>("user");
  const [expired, setExpired] = React.useState(false);

  // The server signed this payload at login, with role "user"
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const signedPayload = b64url(JSON.stringify({ sub: "u_42", tenant: "acme", role: "user", exp: 1763300000 }));
  const signature = toySign(`${header}.${signedPayload}`);

  // What the visitor actually sends (maybe tampered, maybe old)
  const sentPayloadObj = { sub: "u_42", tenant: "acme", role, exp: expired ? 1763200000 : 1763300000 };
  const sentPayload = b64url(JSON.stringify(sentPayloadObj));
  const sigOk = toySign(`${header}.${sentPayload}`) === signature;
  const verdict = !sigOk ? "bad-signature" : expired ? "expired" : "ok";

  return (
    <DemoFrame
      title="The stamped visitor ticket"
      hint="Anyone can read a JWT. Try to change it and see what the server says."
      onReset={() => {
        setRole("user");
        setExpired(false);
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <ChoiceChips
          label="Edit the payload role"
          options={[
            { id: "user", label: '"user" (original)' },
            { id: "admin", label: '"admin" (tampered)' },
          ]}
          value={role}
          onChange={setRole}
        />
        <Switch checked={expired} onChange={setExpired} label="Use it tomorrow (after exp)" />
      </div>
      <p className="mt-3 break-all rounded-lg bg-surface p-2 font-mono text-[10px] leading-relaxed">
        <span style={{ color: "var(--area-llm)" }}>{header}</span>.<span style={{ color: "var(--area-rag)" }}>{sentPayload}</span>.
        <span style={{ color: "var(--area-security)" }}>{signature}</span>
      </p>
      <div className="mt-2 grid gap-2 text-[11px] sm:grid-cols-3">
        <div>
          <div style={{ color: "var(--area-llm)" }}>header</div>
          <code>{'{"alg":"HS256"}'}</code>
        </div>
        <div>
          <div style={{ color: "var(--area-rag)" }}>payload (readable by anyone!)</div>
          <code className="break-all">{JSON.stringify(sentPayloadObj)}</code>
        </div>
        <div>
          <div style={{ color: "var(--area-security)" }}>signature</div>
          <span className="text-muted">made with the server&apos;s secret over header + payload</span>
        </div>
      </div>
      <p
        className="mt-3 rounded-lg px-3 py-2 font-mono text-xs"
        aria-live="polite"
        style={{ backgroundColor: `color-mix(in srgb, ${verdict === "ok" ? "var(--good)" : "var(--bad)"} 16%, transparent)` }}
      >
        {verdict === "ok" && "200 OK · signature valid, not expired → user u_42 of tenant acme"}
        {verdict === "bad-signature" && "401 · InvalidSignatureError: the payload changed, so the stamp no longer matches"}
        {verdict === "expired" && "401 · ExpiredSignatureError: log in again (or use a refresh token)"}
      </p>
    </DemoFrame>
  );
}

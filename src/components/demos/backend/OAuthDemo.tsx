"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { StepControls, useStepper } from "../ui";

const ACTORS = ["You", "DocuMind app", "Google"] as const;
type Actor = (typeof ACTORS)[number];
const STEPS: Array<{ from: Actor; to: Actor; text: string; detail: string }> = [
  { from: "You", to: "DocuMind app", text: "Click 'Connect Google Drive'", detail: "The app creates a random state and a PKCE secret." },
  { from: "DocuMind app", to: "Google", text: "Redirect: client_id, scope=drive.readonly, state, code_challenge", detail: "Only the scopes it needs: read files, nothing else." },
  { from: "You", to: "Google", text: "Log in and approve 'Read your Drive files'", detail: "Your password goes to Google only. The app never sees it." },
  { from: "Google", to: "DocuMind app", text: "Redirect back with a one-time code + state", detail: "The app checks that state matches, so nobody injected a fake code." },
  { from: "DocuMind app", to: "Google", text: "Exchange code + PKCE secret for tokens", detail: "Server to server. Google returns an access token (1 hour) and a refresh token." },
  { from: "DocuMind app", to: "Google", text: "GET /drive/files with the access token", detail: "Works only for what you approved, and you can revoke it in your Google account anytime." },
];

export default function OAuthDemo() {
  const { shown, play, next, reset, done } = useStepper(STEPS.length, 1300);
  const col = (a: Actor) => ACTORS.indexOf(a);

  return (
    <DemoFrame title="A guest card, not your house key" hint="Step through how an app gets limited access to your Google Drive." onReset={reset}>
      <StepControls onPlay={play} onNext={next} done={done} playLabel="Play the flow" />
      <div className="mt-3 grid grid-cols-3 text-center text-xs font-medium">
        {ACTORS.map((a) => (
          <div key={a} className="rounded-md bg-surface py-1">
            {a === "You" ? "🙂 " : a === "Google" ? "🔑 " : "📄 "}
            {a}
          </div>
        ))}
      </div>
      <ol className="mt-2 space-y-1.5" aria-live="polite">
        {STEPS.slice(0, shown).map((s, i) => {
          const a = col(s.from);
          const b = col(s.to);
          const left = Math.min(a, b);
          const span = Math.abs(a - b) + 1;
          return (
            <li key={i} className="grid grid-cols-3 text-[11px]">
              <div
                className="rounded-md px-2 py-1"
                style={{
                  gridColumn: `${left + 1} / span ${span}`,
                  backgroundColor: "color-mix(in srgb, var(--area-backend) 14%, transparent)",
                  textAlign: a < b ? "left" : "right",
                }}
              >
                <span className="font-mono">{a < b ? "→" : "←"}</span> {i + 1}. {s.text}
                <span className="block text-[10px] text-muted">{s.detail}</span>
              </div>
            </li>
          );
        })}
      </ol>
    </DemoFrame>
  );
}

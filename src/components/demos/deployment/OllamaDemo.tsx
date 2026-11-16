"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { StepControls, useStepper } from "../ui";
import { Switch } from "@/components/ui/Switch";

type Line = { text: string; dim?: boolean; needsNet?: boolean };

const SESSION: Line[] = [
  { text: "$ ollama pull llama3.1:8b" },
  { text: "pulling manifest… 4.9 GB ████████████ 100%", dim: true, needsNet: true },
  { text: "$ ollama run llama3.1:8b \"Explain RAG in one sentence\"" },
  { text: "RAG looks up relevant documents first and gives them to the model, so its answer is based on real sources.", dim: true },
  { text: "$ curl localhost:11434/api/generate -d '{\"model\":\"llama3.1:8b\",\"prompt\":\"hi\"}'" },
  { text: "{\"response\":\"Hello! How can I help?\",\"done\":true}", dim: true },
];

export default function OllamaDemo() {
  const [offline, setOffline] = React.useState(false);
  const [downloaded, setDownloaded] = React.useState(false);
  const { shown, play, next, reset, done } = useStepper(SESSION.length, 700);

  React.useEffect(() => {
    if (shown >= 2 && !offline) setDownloaded(true);
  }, [shown, offline]);

  const blocked = offline && !downloaded;
  const visible = blocked ? SESSION.slice(0, Math.min(shown, 2)) : SESSION.slice(0, shown);

  return (
    <DemoFrame
      title="Practising in your home kitchen"
      hint="Download a model once, then use it on your laptop, even with Wi-Fi off."
      onReset={() => {
        reset();
        setDownloaded(false);
        setOffline(false);
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Switch checked={offline} onChange={setOffline} label="Wi-Fi off ✈" />
        <StepControls onPlay={play} onNext={next} done={done} playLabel="Run commands" />
      </div>
      <pre className="mt-3 min-h-36 whitespace-pre-wrap rounded-lg bg-neutral-950 p-2 font-mono text-[10px] leading-relaxed text-neutral-200" aria-live="polite">
        {visible.map((l, i) => {
          const fail = blocked && l.needsNet;
          return (
            <div key={i} style={{ color: fail ? "#f87171" : l.dim ? "#a3a3a3" : undefined }}>
              {fail ? "Error: pull failed: no internet connection" : l.text}
            </div>
          );
        })}
      </pre>
      <p className="mt-2 text-xs text-muted">
        {blocked
          ? "Downloading needs the internet once. Turn Wi-Fi on, pull, then try again offline."
          : offline && downloaded
            ? "Still works with Wi-Fi off: the model lives on your laptop and nothing is sent anywhere."
            : "Turn Wi-Fi off after the download to see it still answer."}
      </p>
    </DemoFrame>
  );
}

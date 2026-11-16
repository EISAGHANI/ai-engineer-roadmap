"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { DemoFrame } from "../DemoFrame";
import { useMotionSafe } from "@/lib/motion";
import { cn } from "@/lib/utils";

const QUESTION = "What is the moon?";

const CARDS = [
  {
    id: "none",
    label: "No rule card",
    system: "(empty)",
    answer:
      "The Moon is Earth's only natural satellite. It orbits our planet about every 27.3 days, has a diameter of roughly 3,474 km, and its gravity causes the ocean tides.",
  },
  {
    id: "teacher",
    label: "Kindergarten teacher",
    system: "You are a kind kindergarten teacher. Use very short sentences and one fun comparison.",
    answer: "The moon is a big round rock in the sky. It is like a giant night-light that goes around the Earth. 🌙",
  },
  {
    id: "pirate",
    label: "Pirate captain",
    system: "You are a pirate captain. Answer in pirate speech, in two sentences.",
    answer: "Arr, the moon be the great silver doubloon hangin' over the sea! She pulls the tides and lights our way home, matey.",
  },
  {
    id: "json",
    label: "Strict JSON only",
    system: 'Reply ONLY with JSON: {"thing": string, "type": string, "fact": string}',
    answer: '{"thing": "Moon", "type": "natural satellite", "fact": "It causes the ocean tides."}',
  },
] as const;

export default function SystemPromptDemo() {
  const [active, setActive] = React.useState<(typeof CARDS)[number]["id"]>("none");
  const motionSafe = useMotionSafe();
  const card = CARDS.find((c) => c.id === active) ?? CARDS[0];

  return (
    <DemoFrame
      title="Same question, different rule cards"
      hint="Pick a rule card. The question never changes, only the instructions read first."
      onReset={() => setActive("none")}
    >
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="System prompt">
        {CARDS.map((c) => (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={active === c.id}
            onClick={() => setActive(c.id)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              active === c.id ? "border-accent bg-accent text-accent-ink" : "border-border hover:border-accent/60",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-2 text-sm">
        <div className="rounded-lg border border-dashed px-3 py-2" style={{ borderColor: "var(--area-llm)" }}>
          <div className="font-mono text-[10px] tracking-wide text-muted uppercase">system (read first, every time)</div>
          <div className="font-mono text-xs">{card.system}</div>
        </div>
        <div className="ml-auto w-fit max-w-[85%] rounded-lg bg-surface px-3 py-2">
          <div className="font-mono text-[10px] tracking-wide text-muted uppercase">user</div>
          {QUESTION}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            initial={motionSafe ? { opacity: 0, y: 6 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={motionSafe ? { opacity: 0, y: -6 } : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-[90%] rounded-lg px-3 py-2"
            style={{ backgroundColor: "color-mix(in srgb, var(--area-llm) 14%, transparent)" }}
            aria-live="polite"
          >
            <div className="font-mono text-[10px] tracking-wide text-muted uppercase">assistant</div>
            <span className={card.id === "json" ? "font-mono text-xs" : undefined}>{card.answer}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </DemoFrame>
  );
}

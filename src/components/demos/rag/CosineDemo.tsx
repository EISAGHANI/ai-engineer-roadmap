"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

const PRESETS = [
  { id: "same", label: "Two horse books", a: 30, b: 38, len: 1.6 },
  { id: "unrelated", label: "Horses vs taxes", a: 20, b: 110, len: 1 },
  { id: "opposite", label: "Opposite", a: 10, b: 190, len: 1 },
] as const;
type PresetId = (typeof PRESETS)[number]["id"];

export default function CosineDemo() {
  const [a, setA] = React.useState(30);
  const [b, setB] = React.useState(75);
  const [len, setLen] = React.useState(1.4);
  const [preset, setPreset] = React.useState<PresetId | "custom">("custom");
  const cos = Math.cos(((b - a) * Math.PI) / 180);
  const label = cos > 0.9 ? "same direction: same topic" : cos > 0.4 ? "somewhat related" : cos > -0.2 ? "unrelated" : "opposite";

  const cx = 150;
  const cy = 130;
  const R = 70;
  const tip = (deg: number, l: number) => [cx + Math.cos((deg * Math.PI) / 180) * R * l, cy - Math.sin((deg * Math.PI) / 180) * R * l];
  const [ax, ay] = tip(a, 1);
  const [bx, by] = tip(b, len);

  function choose(id: PresetId | "custom") {
    setPreset(id);
    const p = PRESETS.find((x) => x.id === id);
    if (p) {
      setA(p.a);
      setB(p.b);
      setLen(p.len);
    }
  }

  return (
    <DemoFrame
      title="Do the arrows point the same way?"
      hint="Turn the arrows. Making one longer does not change the score."
      onReset={() => {
        setA(30);
        setB(75);
        setLen(1.4);
        setPreset("custom");
      }}
    >
      <ChoiceChips
        label="Examples"
        options={[...PRESETS.map((p) => ({ id: p.id, label: p.label })), { id: "custom", label: "Custom" }]}
        value={preset}
        onChange={choose}
      />
      <div className="mt-2 flex gap-3">
        <svg viewBox="0 0 300 150" className="w-1/2 shrink-0 rounded-lg bg-surface" role="img" aria-label={`Angle between arrows ${Math.abs(b - a)} degrees`}>
          <defs>
            <marker id="cos-arrow-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="var(--area-rag)" />
            </marker>
            <marker id="cos-arrow-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0 0L10 5L0 10z" fill="var(--area-llm)" />
            </marker>
          </defs>
          <line x1="20" y1={cy} x2="280" y2={cy} stroke="var(--border)" />
          <line x1={cx} y1={cy} x2={ax} y2={ay} stroke="var(--area-rag)" strokeWidth="3" markerEnd="url(#cos-arrow-a)" />
          <line x1={cx} y1={cy} x2={bx} y2={by} stroke="var(--area-llm)" strokeWidth="3" markerEnd="url(#cos-arrow-b)" />
          <circle cx={cx} cy={cy} r="3" fill="var(--text)" />
        </svg>
        <div className="flex-1 space-y-2 text-xs">
          <label className="block text-muted">
            Arrow A angle: {a}°
            <input type="range" min={0} max={180} value={a} onChange={(e) => { setA(+e.target.value); setPreset("custom"); }} className="mt-1 w-full accent-[var(--area-rag)]" />
          </label>
          <label className="block text-muted">
            Arrow B angle: {b}°
            <input type="range" min={0} max={200} value={b} onChange={(e) => { setB(+e.target.value); setPreset("custom"); }} className="mt-1 w-full accent-[var(--area-llm)]" />
          </label>
          <label className="block text-muted">
            Arrow B length: {len.toFixed(1)}×
            <input type="range" min={0.5} max={1.8} step={0.1} value={len} onChange={(e) => { setLen(+e.target.value); setPreset("custom"); }} className="mt-1 w-full accent-[var(--area-llm)]" />
          </label>
        </div>
      </div>
      <p className="mt-2 text-sm" aria-live="polite">
        Cosine similarity: <span className="font-mono text-lg" style={{ color: "var(--accent)" }}>{cos.toFixed(2)}</span> · {label}
      </p>
    </DemoFrame>
  );
}

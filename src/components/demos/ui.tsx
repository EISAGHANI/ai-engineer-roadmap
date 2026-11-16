"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Small shared building blocks for demos. */

export function ChoiceChips<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: ReadonlyArray<{ id: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("flex flex-wrap items-center gap-1.5 text-xs", className)}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded-full border px-3 py-1",
            value === o.id ? "border-accent bg-accent text-accent-ink" : "border-border hover:border-accent/60",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ActionButton({
  onClick,
  disabled,
  children,
  variant = "primary",
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium disabled:opacity-40",
        variant === "primary" ? "bg-accent text-accent-ink" : "border border-border",
      )}
    >
      {children}
    </button>
  );
}

export function ScoreBar({ value, max = 1, color = "var(--area-rag)", label }: { value: number; max?: number; color?: string; label?: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <span className="block h-2 w-full overflow-hidden rounded-full bg-surface-2" role="img" aria-label={label ?? `${Math.round(pct)}%`}>
      <span className="block h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color, transition: "width 300ms var(--ease-out)" }} />
    </span>
  );
}

export function Panel({ title, children, className, tint }: { title?: string; children: React.ReactNode; className?: string; tint?: string }) {
  return (
    <div
      className={cn("rounded-lg p-3", !tint && "bg-surface", className)}
      style={tint ? { backgroundColor: `color-mix(in srgb, ${tint} 14%, transparent)` } : undefined}
    >
      {title && <div className="mb-1 font-mono text-[10px] tracking-wide text-muted uppercase">{title}</div>}
      {children}
    </div>
  );
}

/** Cosine similarity for small hand-made vectors. */
export function cosine(a: readonly number[], b: readonly number[]) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

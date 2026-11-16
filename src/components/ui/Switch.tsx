"use client";

import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  className?: string;
  hideLabel?: boolean;
}

export function Switch({ checked, onChange, label, className, hideLabel }: SwitchProps) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-2 text-sm", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={hideLabel ? label : undefined}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full border border-border transition-colors",
          checked ? "bg-accent" : "bg-surface-2",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5",
          )}
        />
      </button>
      {!hideLabel && <span>{label}</span>}
    </label>
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  idPrefix: string;
  className?: string;
}

/** Accessible tab list with roving tabindex and arrow-key navigation. */
export function Tabs({ tabs, value, onChange, idPrefix, className }: TabsProps) {
  const refs = React.useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const enabled = tabs.map((t, i) => (t.disabled ? -1 : i)).filter((i) => i >= 0);
    const pos = enabled.indexOf(index);
    let next = index;
    if (e.key === "ArrowRight") next = enabled[(pos + 1) % enabled.length];
    else if (e.key === "ArrowLeft") next = enabled[(pos - 1 + enabled.length) % enabled.length];
    else if (e.key === "Home") next = enabled[0];
    else if (e.key === "End") next = enabled[enabled.length - 1];
    else return;
    e.preventDefault();
    onChange(tabs[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div role="tablist" className={cn("flex flex-wrap gap-1 rounded-full bg-surface-2 p-1", className)}>
      {tabs.map((t, i) => {
        const selected = t.id === value;
        return (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${idPrefix}-tab-${t.id}`}
            aria-selected={selected}
            aria-controls={`${idPrefix}-panel-${t.id}`}
            tabIndex={selected ? 0 : -1}
            disabled={t.disabled}
            onClick={() => onChange(t.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors",
              selected ? "bg-surface text-text shadow-sm" : "text-muted hover:text-text",
              t.disabled && "opacity-40",
            )}
          >
            {t.icon}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export function TabPanel({
  id,
  idPrefix,
  active,
  children,
  className,
}: {
  id: string;
  idPrefix: string;
  active: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="tabpanel"
      id={`${idPrefix}-panel-${id}`}
      aria-labelledby={`${idPrefix}-tab-${id}`}
      hidden={!active}
      className={className}
    >
      {active ? children : null}
    </div>
  );
}

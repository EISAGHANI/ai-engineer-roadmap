"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/client";

interface DemoFrameProps {
  title: string;
  onReset: () => void;
  children: React.ReactNode;
  className?: string;
  /** Short line under the title telling the reader what to do. */
  hint?: string;
}

/**
 * Every demo renders inside this frame: fixed 320px box, a visible title, a Reset control.
 * Demos must be keyboard operable and must not autoplay when motion is reduced.
 */
export function DemoFrame({ title, onReset, children, className, hint }: DemoFrameProps) {
  const t = useT();
  return (
    <section
      aria-label={title}
      className={cn("flex h-80 flex-col overflow-hidden rounded-card border border-border bg-surface-2", className)}
    >
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <div lang="en">
          <div className="text-sm font-medium">{title}</div>
          {hint && <div className="text-xs text-muted">{hint}</div>}
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs text-muted hover:bg-surface hover:text-text"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> {t.ui.reset}
        </button>
      </header>
      <div className="flex-1 overflow-auto p-4" lang="en">
        {children}
      </div>
    </section>
  );
}

export function DemoFallback({ color }: { color?: string }) {
  return <Skeleton className="h-80 w-full" color={color} />;
}

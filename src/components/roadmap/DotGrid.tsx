"use client";

import * as React from "react";
import Link from "next/link";
import { useProgress, useHydrated } from "@/lib/progress";
import { areaVar, pad2 } from "@/lib/utils";
import { useLocalePath, useT } from "@/i18n/client";

export interface DotGridArea {
  id: string;
  name: string;
  number: number;
  conceptIds: string[]; // 20 ids in order
}

interface DotGridProps {
  areas: DotGridArea[];
  /** Idle shimmer on unfilled dots (only on the Home hero). Pauses when off-screen. */
  shimmer?: boolean;
  compact?: boolean;
  /** When set, these concepts are drawn filled regardless of progress (used on project pages). */
  highlightIds?: string[];
}

/**
 * The 160-dot grid from the roadmap cover: 8 rows x 20 dots.
 * Filled dots are concepts the visitor has marked as used.
 */
export function DotGrid({ areas, shimmer = false, compact = false, highlightIds }: DotGridProps) {
  const t = useT();
  const lp = useLocalePath();
  const used = useProgress((s) => s.used);
  const highlight = React.useMemo(() => new Set(highlightIds ?? []), [highlightIds]);
  const hydrated = useHydrated();
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    if (!shimmer || !ref.current || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.1 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [shimmer]);

  const dot = compact ? "h-2 w-2 rounded-[2px]" : "h-3 w-3 rounded-[3px] sm:h-3.5 sm:w-3.5";

  return (
    <div ref={ref} className="inline-grid gap-y-2" role="img" aria-label={t.dotGrid.aria}>
      {areas.map((a, rowIndex) => (
        <div key={a.id} className="flex items-center gap-3">
          {!compact && (
            <span className="w-6 font-mono text-[11px]" style={{ color: areaVar(a.id) }}>
              {pad2(a.number)}
            </span>
          )}
          <Link href={lp(`/${a.id}`)} className="flex gap-1 sm:gap-1.5" aria-label={t.dotGrid.openArea(a.name)}>
            {a.conceptIds.map((cid, i) => {
              const filled = highlightIds ? highlight.has(cid) : hydrated && Boolean(used[cid]);
              const idle = shimmer && visible && !filled && (i + rowIndex) % 7 === 0;
              return (
                <span
                  key={cid}
                  className={`${dot} ${idle ? "dot-shimmer" : ""} transition-opacity duration-300`}
                  style={{
                    backgroundColor: areaVar(a.id),
                    opacity: filled ? 1 : 0.28,
                    animationDelay: idle ? `${((i * 7 + rowIndex * 3) % 24) * 100}ms` : undefined,
                  }}
                />
              );
            })}
          </Link>
          {!compact && <span className="ml-1 text-xs text-muted">{a.name}</span>}
        </div>
      ))}
    </div>
  );
}

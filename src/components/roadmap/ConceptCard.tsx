"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronDown, Link2 } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Badge } from "@/components/ui/Badge";
import { useProgress, useHydrated } from "@/lib/progress";
import { fadeUp, transitions, useMotionSafe } from "@/lib/motion";
import { areaVar, pad2, cn } from "@/lib/utils";
import { ConceptBody } from "./ConceptBody";
import type { ConceptView } from "./types";
import { useLocalePath, useT } from "@/i18n/client";

interface ConceptCardProps {
  view: ConceptView;
  expanded: boolean;
  onToggle: () => void;
  onOpenProject: (projectId: string) => void;
  animate?: boolean;
}

/** Collapsed: one row that fits a phone screen. Expanded: the full ConceptBody opens in place. */
export function ConceptCard({ view, expanded, onToggle, onOpenProject, animate }: ConceptCardProps) {
  const c = view.concept;
  const t = useT();
  const lp = useLocalePath();
  const used = useProgress((s) => s.used);
  const setUsed = useProgress((s) => s.setUsed);
  const hydrated = useHydrated();
  const isUsed = hydrated && Boolean(used[c.id]);
  const color = areaVar(c.area);
  const motionSafe = useMotionSafe();
  const panelId = `panel-${c.id}`;
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (expanded && ref.current) {
      ref.current.scrollIntoView({ block: "nearest", behavior: motionSafe ? "smooth" : "auto" });
    }
  }, [expanded, motionSafe]);

  return (
    <motion.div
      ref={ref}
      id={c.id}
      variants={animate ? fadeUp : undefined}
      layout={motionSafe ? "position" : false}
      className={cn(
        "rounded-card border bg-surface transition-colors",
        expanded ? "border-accent/60" : "border-border hover:border-accent/40",
        isUsed && !expanded && "opacity-80",
      )}
      style={{ borderLeftColor: color, borderLeftWidth: 4 }}
    >
      <div className="flex items-center gap-3 p-3 sm:p-4">
        <Checkbox checked={isUsed} onChange={(v) => setUsed(c.id, v)} label={t.concept.usedLabel(c.name)} color={color} size="sm" />
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={panelId}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span className="w-7 shrink-0 font-mono text-sm" style={{ color }}>
            {pad2(c.number)}
          </span>
          <span className="min-w-0 flex-1">
            <span className={cn("block font-medium", isUsed && "line-through decoration-muted/60")}>{c.name}</span>
            <span className="block truncate text-sm text-muted">{c.officialTranslation ?? c.official}</span>
          </span>
          {c.demo && (
            <Badge color={color} className="hidden sm:inline-flex">
              {t.concept.tryBadge}
            </Badge>
          )}
          <ChevronDown
            className={cn("h-5 w-5 shrink-0 text-muted transition-transform", expanded && "rotate-180")}
            aria-hidden="true"
          />
        </button>
        <Link
          href={lp(`/${c.area}/${c.slug}`)}
          className="hidden shrink-0 rounded-full p-2 text-muted hover:bg-surface-2 hover:text-text sm:inline-flex"
          aria-label={t.concept.openPage(c.name)}
          title={t.concept.openPageTitle}
        >
          <Link2 className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <motion.div
        id={panelId}
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={motionSafe ? transitions.card : { duration: 0 }}
        className="overflow-hidden"
        aria-hidden={!expanded}
      >
        {expanded && (
          <div className="border-t border-border p-4 sm:p-6">
            <ConceptBody view={view} onOpenProject={onOpenProject} />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressRing";
import { useProgress, useHydrated, countUsed } from "@/lib/progress";
import { fadeUp } from "@/lib/motion";
import { areaVar, pad2 } from "@/lib/utils";

export interface AreaCardData {
  id: string;
  number: number;
  code: string;
  name: string;
  summary: string;
  phase: number[];
  weeks: string;
  conceptNames: string[];
}

export function AreaCard({ area, index }: { area: AreaCardData; index: number }) {
  const used = useProgress((s) => s.used);
  const hydrated = useHydrated();
  const done = hydrated ? countUsed(used, area.id) : 0;
  const color = areaVar(area.id);

  return (
    <motion.div variants={fadeUp} custom={index}>
      <Link
        href={`/${area.id}`}
        className="group block h-full rounded-card border border-border bg-surface p-5 transition-colors hover:border-accent/60"
        style={{ borderTopColor: color, borderTopWidth: 3 }}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs" style={{ color }}>
            {pad2(area.number)} · {area.code}
          </span>
          <Badge mono>Phase {area.phase.join(" + ")} · Weeks {area.weeks}</Badge>
        </div>
        <h3 className="text-xl font-semibold">{area.name}</h3>
        <p className="mt-1 text-sm text-muted">{area.summary}</p>
        <div className="mt-4 flex items-center gap-3">
          <ProgressBar value={done / 20} color={color} label={`${area.name} progress`} />
          <span className="shrink-0 font-mono text-xs text-muted">{done}/20</span>
        </div>
        <div className="mt-3 hidden max-h-0 overflow-hidden text-xs text-muted transition-[max-height] duration-300 group-hover:max-h-24 group-focus-visible:max-h-24 sm:block">
          {area.conceptNames.slice(0, 10).join(" · ")} …
        </div>
        <span className="mt-3 inline-flex items-center gap-1 text-sm" style={{ color }}>
          Open area <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </Link>
    </motion.div>
  );
}

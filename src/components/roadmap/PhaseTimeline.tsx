"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { areaVar } from "@/lib/utils";
import { useMotionSafe } from "@/lib/motion";
import { HOURS_PER_WEEK_DEFAULT, TOTAL_WEEKS } from "@/content/phases";

export interface TimelinePhase {
  number: number;
  weeks: string; // "3-6"
  name: string;
  description: string;
  areas: string[];
}

function parseWeeks(w: string): [number, number] {
  const [a, b] = w.split("-").map((n) => parseInt(n, 10));
  return [a, Number.isNaN(b) ? a : b];
}

/** SVG timeline of the 8 phases over 26 weeks, with a finish-date calculator. */
export function PhaseTimeline({ phases }: { phases: TimelinePhase[] }) {
  const motionSafe = useMotionSafe();
  const [hours, setHours] = React.useState(HOURS_PER_WEEK_DEFAULT);
  const scale = HOURS_PER_WEEK_DEFAULT / hours; // more hours -> fewer calendar weeks
  const weeksNeeded = Math.max(8, Math.round(TOTAL_WEEKS * scale));
  const finish = new Date();
  finish.setDate(finish.getDate() + weeksNeeded * 7);

  const W = 760;
  const left = 56;
  const right = W - 24;
  const x = (week: number) => left + ((week - 1) / TOTAL_WEEKS) * (right - left);
  const rowH = 44;
  const H = 40 + phases.length * rowH + 16;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-4">
        <label className="flex flex-col text-sm">
          <span className="text-muted">Hours per week: {hours}</span>
          <input
            type="range"
            min={5}
            max={25}
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value, 10))}
            className="mt-1 w-56 accent-[var(--accent)]"
            aria-valuetext={`${hours} hours per week`}
          />
        </label>
        <p className="text-sm">
          About <strong>{weeksNeeded} weeks</strong>. Starting today you would finish around{" "}
          <strong>{finish.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}</strong>.
        </p>
      </div>
      <div className="overflow-x-auto rounded-card border border-border bg-surface p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[640px]" role="img" aria-label="Phase timeline over 26 weeks">
          {Array.from({ length: 14 }, (_, i) => i * 2 + 1).map((wk) => (
            <g key={wk}>
              <line x1={x(wk)} x2={x(wk)} y1={28} y2={H - 12} stroke="var(--border)" strokeDasharray="2 4" />
              <text x={x(wk)} y={18} textAnchor="middle" fontSize="10" fill="var(--muted)" fontFamily="var(--font-mono)">
                w{wk}
              </text>
            </g>
          ))}
          {phases.map((p, i) => {
            const [a, b] = parseWeeks(p.weeks);
            const y = 40 + i * rowH;
            const color = areaVar(p.areas[0] ?? "llm");
            const x1 = x(a);
            const x2 = x(b + 1);
            return (
              <g key={p.number}>
                <text x={8} y={y + 20} fontSize="11" fill="var(--muted)" fontFamily="var(--font-mono)">
                  P{p.number}
                </text>
                <motion.rect
                  x={x1}
                  y={y + 6}
                  height={24}
                  rx={8}
                  fill={color}
                  fillOpacity={0.18}
                  stroke={color}
                  strokeWidth={1.25}
                  initial={motionSafe ? { width: 0 } : { width: x2 - x1 }}
                  animate={{ width: x2 - x1 }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                />
                <text x={x1 + 10} y={y + 22} fontSize="12" fill="var(--text)" fontWeight={600}>
                  {p.name}
                </text>
                {p.areas.map((areaId, k) => (
                  <Link key={areaId} href={`/${areaId}`}>
                    <circle cx={x2 + 12 + k * 14} cy={y + 18} r={5} fill={areaVar(areaId)}>
                      <title>Open {areaId}</title>
                    </circle>
                  </Link>
                ))}
              </g>
            );
          })}
        </svg>
      </div>
      <ol className="mt-4 grid gap-2 sm:grid-cols-2">
        {phases.map((p) => (
          <li key={p.number} className="rounded-lg border border-border bg-surface px-4 py-3 text-sm">
            <span className="font-mono text-xs text-muted">Phase {p.number} · Weeks {p.weeks}</span>
            <div className="font-medium">{p.name}</div>
            <div className="text-muted">{p.description}</div>
          </li>
        ))}
      </ol>
    </div>
  );
}

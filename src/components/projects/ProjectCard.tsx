"use client";

import { Star, Hammer } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { areaVar } from "@/lib/utils";
import type { ProjectView } from "./types";

const STATUS_LABEL = { planned: "Planned", "in-progress": "In progress", shipped: "Shipped" } as const;
const STATUS_COLOR = { planned: "var(--muted)", "in-progress": "var(--warn)", shipped: "var(--good)" } as const;

export function ProjectCard({ view, onOpen, highlight }: { view: ProjectView; onOpen: () => void; highlight?: boolean }) {
  const { project: p, repo } = view;
  const color = p.area ? areaVar(p.area) : "var(--accent)";
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex h-full w-full flex-col rounded-card border border-border bg-surface p-5 text-left transition-colors hover:border-accent/60"
      style={highlight ? { borderColor: color } : undefined}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 font-mono text-xs" style={{ color }}>
          <Hammer className="h-3.5 w-3.5" aria-hidden="true" /> {p.kind === "build-this" ? "BUILD THIS" : p.kind.toUpperCase()}
        </span>
        <Badge color={STATUS_COLOR[p.status]}>{STATUS_LABEL[p.status]}</Badge>
      </div>
      <h3 className="mt-2 text-lg font-semibold">{p.title}</h3>
      <p className="mt-1 line-clamp-3 flex-1 text-sm text-muted">{p.brief}</p>
      <div className="mt-3 flex items-center gap-3 text-xs text-muted">
        {repo ? (
          <>
            <span className="inline-flex items-center gap-1">
              <Star className="h-3.5 w-3.5" aria-hidden="true" /> {repo.stars}
            </span>
            {repo.language && <span>{repo.language}</span>}
          </>
        ) : (
          <span>{p.github ? p.github : "No repository yet"}</span>
        )}
        <span className="ml-auto">{view.concepts.length} concepts</span>
      </div>
    </button>
  );
}

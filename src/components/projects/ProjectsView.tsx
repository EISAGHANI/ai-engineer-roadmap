"use client";

import * as React from "react";
import { useUrlParam } from "@/lib/use-url-param";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { cn, areaVar } from "@/lib/utils";
import type { ProjectView } from "./types";

interface ProjectsViewProps {
  views: ProjectView[];
  areaOptions: Array<{ id: string; name: string }>;
}

const KINDS = [
  ["all", "All"],
  ["build-this", "Build this"],
  ["portfolio", "Portfolio"],
  ["author", "Own projects"],
] as const;

export function ProjectsView({ views, areaOptions }: ProjectsViewProps) {
  const [projectId, setProjectId] = useUrlParam("project");
  const [kind, setKind] = React.useState<string>("all");
  const [area, setArea] = React.useState<string>("all");

  const current = views.find((v) => v.project.id === projectId) ?? null;
  const open = (id: string) => setProjectId(id);
  const close = () => setProjectId(null);

  const list = views.filter(
    (v) => (kind === "all" || v.project.kind === kind) && (area === "all" || v.project.area === area),
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="font-mono text-xs tracking-wide text-accent uppercase">Build after every area</p>
      <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Projects</h1>
      <p className="prose-max mt-3 text-lg text-muted">
        Six small shipped projects beat sixty tutorials. Each project lives in its own GitHub repository; this page
        shows what it proves and pulls its stars and last push live from GitHub.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div role="group" aria-label="Project kind" className="flex rounded-full bg-surface-2 p-1 text-sm">
          {KINDS.map(([k, label]) => (
            <button
              key={k}
              type="button"
              aria-pressed={kind === k}
              onClick={() => setKind(k)}
              className={cn("rounded-full px-3 py-1.5", kind === k ? "bg-surface text-text shadow-sm" : "text-muted hover:text-text")}
            >
              {label}
            </button>
          ))}
        </div>
        <label className="ml-auto flex items-center gap-2 text-sm text-muted">
          Area
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm text-text"
          >
            <option value="all">All areas</option>
            {areaOptions.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((v) => (
          <div key={v.project.id} className="rounded-card" style={{ boxShadow: `inset 4px 0 0 ${v.project.area ? areaVar(v.project.area) : "var(--accent)"}` }}>
            <ProjectCard view={v} onOpen={() => open(v.project.id)} />
          </div>
        ))}
        {list.length === 0 && <p className="text-muted">No projects match this filter.</p>}
      </div>

      <ProjectModal view={current} onClose={close} />
    </div>
  );
}

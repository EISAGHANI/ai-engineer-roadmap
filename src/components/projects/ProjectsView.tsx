"use client";

import * as React from "react";
import { useUrlParam } from "@/lib/use-url-param";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { cn, areaVar } from "@/lib/utils";
import type { ProjectView } from "./types";
import { useT } from "@/i18n/client";

interface ProjectsViewProps {
  views: ProjectView[];
  areaOptions: Array<{ id: string; name: string }>;
}

const KINDS = ["all", "build-this", "portfolio", "author"] as const;

export function ProjectsView({ views, areaOptions }: ProjectsViewProps) {
  const t = useT();
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
      <p className="font-mono text-xs tracking-wide text-accent uppercase">{t.projects.eyebrow}</p>
      <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">{t.projects.title}</h1>
      <p className="prose-max mt-3 text-lg text-muted">
        {t.projects.lead}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div role="group" aria-label={t.projects.kindAria} className="flex rounded-full bg-surface-2 p-1 text-sm">
          {KINDS.map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={kind === k}
              onClick={() => setKind(k)}
              className={cn("rounded-full px-3 py-1.5", kind === k ? "bg-surface text-text shadow-sm" : "text-muted hover:text-text")}
            >
              {t.projects.kinds[k]}
            </button>
          ))}
        </div>
        <label className="ml-auto flex items-center gap-2 text-sm text-muted">
          {t.projects.area}
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-sm text-text"
          >
            <option value="all">{t.projects.allAreas}</option>
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
        {list.length === 0 && <p className="text-muted">{t.projects.none}</p>}
      </div>

      <ProjectModal view={current} onClose={close} />
    </div>
  );
}

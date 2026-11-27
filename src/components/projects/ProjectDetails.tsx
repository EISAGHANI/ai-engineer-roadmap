"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, GitBranch, ExternalLink, Code2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { buttonClass } from "@/components/ui/Button";
import { portfolioEvidence } from "@/content/projects";
import { areaVar, pad2, formatDate } from "@/lib/utils";
import type { ProjectView } from "./types";
import { useLocale, useLocalePath, useT } from "@/i18n/client";

const STATUS_COLOR = { planned: "var(--muted)", "in-progress": "var(--warn)", shipped: "var(--good)" } as const;

interface ProjectDetailsProps {
  view: ProjectView;
  /** When set, concept chips call this instead of navigating (used inside the modal on area pages). */
  onPickConcept?: (conceptId: string) => void;
  fullPageHref?: string;
}

/** Shared body for the project modal and the /projects/[id] page. */
export function ProjectDetails({ view, onPickConcept, fullPageHref }: ProjectDetailsProps) {
  const t = useT();
  const lp = useLocalePath();
  const locale = useLocale();
  const { project: p, repo, concepts, areaName } = view;
  const color = p.area ? areaVar(p.area) : "var(--accent)";
  const githubUrl = repo?.htmlUrl ?? (p.github ? `https://github.com/${p.github}` : undefined);
  const demoUrl = p.demoUrl ?? repo?.homepage ?? undefined;

  return (
    <div>
      <div className="h-1.5 w-24 rounded-full" style={{ background: color }} aria-hidden="true" />
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <Badge color={STATUS_COLOR[p.status]}>{t.projects.status[p.status]}</Badge>
        {areaName && <Badge color={color}>{areaName}</Badge>}
        <Badge mono>{t.projects.kindBadge[p.kind]}</Badge>
        {repo && (
          <>
            <span className="inline-flex items-center gap-1 text-muted">
              <Star className="h-4 w-4" aria-hidden="true" /> {repo.stars}
            </span>
            {repo.language && (
              <span className="inline-flex items-center gap-1 text-muted">
                <GitBranch className="h-4 w-4" aria-hidden="true" /> {repo.language}
              </span>
            )}
            <span className="inline-flex items-center gap-1 text-muted">
              <Clock className="h-4 w-4" aria-hidden="true" /> {t.projects.pushed(formatDate(repo.pushedAt, locale))}
            </span>
          </>
        )}
      </div>

      {p.screenshot && (
        <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-card border border-border bg-surface-2">
          <Image src={p.screenshot} alt={t.projects.screenshot(p.title)} fill className="object-cover" sizes="(max-width: 768px) 100vw, 720px" />
        </div>
      )}
      {!p.screenshot && p.videoUrl && (
        <video controls className="mt-4 w-full rounded-card border border-border" src={p.videoUrl} />
      )}

      <section className="mt-4 rounded-card border border-border bg-surface-2 p-4">
        <h3 className="font-mono text-xs tracking-wide text-muted uppercase">{t.projects.assignment}</h3>
        <p className="mt-1">{p.brief}</p>
      </section>

      {repo?.description && (
        <section className="mt-4">
          <h3 className="text-sm font-medium text-muted">{t.projects.fromRepo}</h3>
          <p className="mt-1">{repo.description}</p>
        </section>
      )}

      {concepts.length > 0 && (
        <section className="mt-4">
          <h3 className="text-sm font-medium text-muted">{t.projects.proves}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {concepts.map((c) =>
              onPickConcept ? (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onPickConcept(c.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm hover:bg-surface-2"
                  style={{ borderColor: areaVar(c.area) }}
                >
                  <span className="font-mono text-xs" style={{ color: areaVar(c.area) }}>
                    {pad2(c.number)}
                  </span>
                  {c.name}
                </button>
              ) : (
                <Link
                  key={c.id}
                  href={lp(`/${c.area}/${c.slug}`)}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm hover:bg-surface-2"
                  style={{ borderColor: areaVar(c.area) }}
                >
                  <span className="font-mono text-xs" style={{ color: areaVar(c.area) }}>
                    {pad2(c.number)}
                  </span>
                  {c.name}
                </Link>
              ),
            )}
          </div>
        </section>
      )}

      {p.kind !== "build-this" && (
        <section className="mt-4">
          <h3 className="text-sm font-medium text-muted">{t.projects.shouldShow}</h3>
          <ul className="mt-2 space-y-1 text-sm">
            {portfolioEvidence.map((e) => {
              const value =
                e.key === "liveDemo"
                  ? p.evidence?.liveDemo
                    ? "yes"
                    : undefined
                  : p.evidence?.[e.key];
              return (
                <li key={e.key} className="flex gap-2">
                  <span className="font-mono" style={{ color: value ? "var(--good)" : "var(--muted)" }}>
                    {value ? "✓" : "—"}
                  </span>
                  <span>
                    {t.portfolio.evidence[e.key]}
                    {value && value !== "yes" && <span className="block text-muted">{value}</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {demoUrl && (
          <a href={demoUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("primary", "md")}>
            {t.projects.liveDemo} <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        )}
        {githubUrl && (
          <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={buttonClass("secondary", "md")}>
            <Code2 className="h-4 w-4" aria-hidden="true" /> GitHub
          </a>
        )}
        {fullPageHref && (
          <Link href={fullPageHref} className={buttonClass("ghost", "md")}>
            {t.projects.fullPage}
          </Link>
        )}
      </div>
    </div>
  );
}

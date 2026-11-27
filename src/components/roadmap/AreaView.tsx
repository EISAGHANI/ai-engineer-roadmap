"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useUrlParam } from "@/lib/use-url-param";
import { motion } from "motion/react";
import { ExternalLink, Hammer } from "lucide-react";
import { ConceptCard } from "./ConceptCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectModal } from "@/components/projects/ProjectModal";
import { ProgressBar } from "@/components/ui/ProgressRing";
import { Badge } from "@/components/ui/Badge";
import { useProgress, useHydrated, countUsed } from "@/lib/progress";
import { stagger, STAGGER_LIMIT } from "@/lib/motion";
import { areaVar, pad2 } from "@/lib/utils";
import type { ConceptView } from "./types";
import type { ProjectView } from "@/components/projects/types";
import type { Resource } from "@/content/schema";
import { useLocalePath, useT } from "@/i18n/client";

interface AreaViewProps {
  area: { id: string; number: number; code: string; name: string; summary: string; phase: number[]; weeks: string; learnFrom: Resource[] };
  concepts: ConceptView[];
  projects: ProjectView[]; // build-this first, then others for this area
}

export function AreaView({ area, concepts, projects }: AreaViewProps) {
  const router = useRouter();
  const t = useT();
  const lp = useLocalePath();
  const [projectId, setProjectId] = useUrlParam("project");
  const used = useProgress((s) => s.used);
  const hydrated = useHydrated();
  const done = hydrated ? countUsed(used, area.id) : 0;
  const color = areaVar(area.id);

  const [expanded, setExpanded] = React.useState<string | null>(null);

  // Deep link: /rag#rag-05 opens that card (read after mount to avoid hydration mismatches)
  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash.startsWith(`${area.id}-`)) setExpanded(hash);
  }, [area.id]);
  const projectView = projects.find((p) => p.project.id === projectId) ?? null;

  const openProject = React.useCallback(
    (id: string) => {
      // Projects from other areas have their own page; this area's projects open in the modal.
      if (projects.some((p) => p.project.id === id)) setProjectId(id);
      else router.push(lp(`/projects/${id}`));
    },
    [projects, router, setProjectId, lp],
  );
  const closeProject = React.useCallback(() => setProjectId(null), [setProjectId]);

  // j / k move between cards, Enter toggles, when focus is not in an input
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key !== "j" && e.key !== "k") return;
      const ids = concepts.map((c) => c.concept.id);
      const i = expanded ? ids.indexOf(expanded) : -1;
      const nextIndex = e.key === "j" ? Math.min(ids.length - 1, i + 1) : Math.max(0, i - 1);
      setExpanded(ids[nextIndex]);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [concepts, expanded]);

  const base = concepts.filter((c) => c.concept.tier === "base");
  const production = concepts.filter((c) => c.concept.tier === "production");

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
          <span style={{ color }}>
            {t.area.eyebrow(pad2(area.number), area.code)}
          </span>
          <Badge mono color={color}>
            {t.areaCard.phaseWeeks(area.phase.join(" + "), area.weeks)}
          </Badge>
        </div>
        <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">{area.name}</h1>
        <p className="mt-2 text-lg text-muted">{area.summary}</p>
        <div className="mt-4 flex items-center gap-3">
          <ProgressBar value={done / 20} color={color} label={t.areaCard.progress(area.name)} />
          <span className="shrink-0 font-mono text-sm text-muted">{t.area.used(done)}</span>
        </div>
        <p className="mt-2 text-xs text-muted">
          {t.area.hintBefore}
          <kbd className="rounded border border-border px-1 font-mono">j</kbd>/
          <kbd className="rounded border border-border px-1 font-mono">k</kbd>
          {t.area.hintAfter}
        </p>
      </header>

      <Tier title={t.area.baseTitle} subtitle={t.area.baseSubtitle} color={color}>
        <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-2">
          {base.map((v, i) => (
            <ConceptCard
              key={v.concept.id}
              view={v}
              expanded={expanded === v.concept.id}
              onToggle={() => setExpanded((e) => (e === v.concept.id ? null : v.concept.id))}
              onOpenProject={openProject}
              animate={i < STAGGER_LIMIT}
            />
          ))}
        </motion.div>
      </Tier>

      <Tier title={t.area.prodTitle} subtitle={t.area.prodSubtitle} color={color}>
        <div className="space-y-2">
          {production.map((v) => (
            <ConceptCard
              key={v.concept.id}
              view={v}
              expanded={expanded === v.concept.id}
              onToggle={() => setExpanded((e) => (e === v.concept.id ? null : v.concept.id))}
              onOpenProject={openProject}
            />
          ))}
        </div>
      </Tier>

      {projects.length > 0 && (
        <section className="mt-12" aria-labelledby="build-this">
          <h2 id="build-this" className="mb-3 inline-flex items-center gap-2 font-mono text-sm tracking-wide uppercase" style={{ color }}>
            <Hammer className="h-4 w-4" aria-hidden="true" /> {t.area.buildThis}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((p, i) => (
              <ProjectCard key={p.project.id} view={p} onOpen={() => openProject(p.project.id)} highlight={i === 0} />
            ))}
          </div>
        </section>
      )}

      {area.learnFrom.length > 0 && (
        <section className="mt-10" aria-labelledby="learn-from">
          <h2 id="learn-from" className="mb-2 font-mono text-sm tracking-wide uppercase" style={{ color }}>
            {t.area.learnFrom}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {area.learnFrom.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 text-sm hover:bg-surface-2"
                >
                  {r.label} <ExternalLink className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ProjectModal
        view={projectView}
        onClose={closeProject}
        onPickConcept={(id) => {
          const local = concepts.find((c) => c.concept.id === id);
          if (local) {
            closeProject();
            setExpanded(id);
          } else {
            const [areaId] = id.split(/-(?=\d{2}$)/);
            router.push(lp(`/${areaId}#${id}`));
          }
        }}
      />
    </div>
  );
}

function Tier({ title, subtitle, color, children }: { title: string; subtitle: string; color: string; children: React.ReactNode }) {
  return (
    <section className="mt-10" aria-label={title}>
      <h2 className="font-mono text-sm tracking-wide uppercase" style={{ color }}>
        {title}
      </h2>
      <p className="mb-3 text-sm text-muted">{subtitle}</p>
      {children}
    </section>
  );
}

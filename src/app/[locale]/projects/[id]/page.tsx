import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { DotGrid } from "@/components/roadmap/DotGrid";
import { projects } from "@/content";
import { getContent } from "@/content/localized";
import { getMessages, isLocale, type Locale } from "@/i18n";
import { pageMetadata } from "@/i18n/metadata";
import { getRepoReadme, getRepoStats } from "@/lib/github";
import { buildProjectView } from "@/lib/views";

export const dynamicParams = false;

type Params = { params: Promise<{ locale: string; id: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isLocale(locale)) return {};
  const p = getContent(locale).getProject(id);
  if (!p) return {};
  return pageMetadata(locale, `/projects/${p.id}`, { title: p.title, description: p.brief });
}

export default async function ProjectPage({ params }: Params) {
  const { locale, id } = await params;
  const content = getContent(locale as Locale);
  const t = getMessages(locale as Locale).projects;
  const p = content.getProject(id);
  if (!p) notFound();
  const [repo, readme] = await Promise.all([getRepoStats(p.github), getRepoReadme(p.github)]);
  const view = buildProjectView(content, p, repo);
  const gridAreas = content.areasInPdfOrder.map((a) => ({
    id: a.id,
    name: a.name,
    number: a.number,
    conceptIds: content.getConceptsForArea(a.id).map((c) => c.id),
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href={content.href("/projects")} className="inline-flex items-center gap-1 text-sm text-muted hover:text-text">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" /> {t.allProjects}
      </Link>
      <h1 className="mt-3 text-4xl font-semibold">{p.title}</h1>
      <div className="mt-4">
        <ProjectDetails view={view} />
      </div>

      <section className="mt-10" aria-labelledby="map">
        <h2 id="map" className="text-sm font-medium text-muted">
          {t.mapTitle}
        </h2>
        <p className="mb-3 text-xs text-muted">{t.mapHint}</p>
        <div className="overflow-x-auto rounded-card border border-border bg-surface p-4">
          <DotGrid areas={gridAreas} highlightIds={p.concepts} compact />
        </div>
      </section>

      {readme && (
        <section className="mt-10" aria-labelledby="readme">
          <h2 id="readme" className="text-sm font-medium text-muted">
            {t.readme}
          </h2>
          <pre className="mt-2 max-h-[480px] overflow-auto rounded-card border border-border bg-surface-2 p-4 text-xs whitespace-pre-wrap">
            {readme}
          </pre>
        </section>
      )}
    </div>
  );
}

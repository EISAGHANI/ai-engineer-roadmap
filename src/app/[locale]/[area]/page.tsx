import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AreaView } from "@/components/roadmap/AreaView";
import { areas } from "@/content";
import { getContent } from "@/content/localized";
import { getMessages, isLocale, type Locale } from "@/i18n";
import { pageMetadata } from "@/i18n/metadata";
import { getRepoStatsMap } from "@/lib/github";
import { buildConceptView, buildProjectView } from "@/lib/views";

export const dynamicParams = false;

type Params = { params: Promise<{ locale: string; area: string }> };

export function generateStaticParams() {
  return areas.map((a) => ({ area: a.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, area } = await params;
  if (!isLocale(locale)) return {};
  const a = getContent(locale).getArea(area);
  if (!a) return {};
  return pageMetadata(locale, `/${a.id}`, { title: getMessages(locale).area.metaTitle(a.name), description: a.summary });
}

export default async function AreaPage({ params }: Params) {
  const { locale, area } = await params;
  const content = getContent(locale as Locale);
  const a = content.getArea(area);
  if (!a) notFound();

  const conceptList = content.getConceptsForArea(a.id);
  const views = await Promise.all(conceptList.map((c) => buildConceptView(content, c)));

  const areaProjects = content.getProjectsForArea(a.id);
  const ordered = [...areaProjects].sort((x, y) => (x.id === a.buildThis ? -1 : y.id === a.buildThis ? 1 : 0));
  const repos = await getRepoStatsMap(ordered.map((p) => p.github));
  const projectViews = ordered.map((p) => buildProjectView(content, p, p.github ? (repos[p.github] ?? null) : null));

  return (
    <AreaView
      area={{
        id: a.id,
        number: a.number,
        code: a.code,
        name: a.name,
        summary: a.summary,
        phase: a.phase,
        weeks: a.weeks,
        learnFrom: a.learnFrom,
      }}
      concepts={views}
      projects={projectViews}
    />
  );
}

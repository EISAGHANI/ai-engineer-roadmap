import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AreaView } from "@/components/roadmap/AreaView";
import { areas, getArea, getConceptsForArea, getProjectsForArea } from "@/content";
import { getRepoStatsMap } from "@/lib/github";
import { buildConceptView, buildProjectView } from "@/lib/views";

export const dynamicParams = false;

export function generateStaticParams() {
  return areas.map((a) => ({ area: a.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ area: string }> }): Promise<Metadata> {
  const { area } = await params;
  const a = getArea(area);
  if (!a) return {};
  return {
    title: `${a.name} · 20 concepts`,
    description: a.summary,
  };
}

export default async function AreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  const a = getArea(area);
  if (!a) notFound();

  const conceptList = getConceptsForArea(a.id);
  const views = await Promise.all(conceptList.map((c) => buildConceptView(c)));

  const areaProjects = getProjectsForArea(a.id);
  const ordered = [...areaProjects].sort((x, y) => (x.id === a.buildThis ? -1 : y.id === a.buildThis ? 1 : 0));
  const repos = await getRepoStatsMap(ordered.map((p) => p.github));
  const projectViews = ordered.map((p) => buildProjectView(p, p.github ? (repos[p.github] ?? null) : null));

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

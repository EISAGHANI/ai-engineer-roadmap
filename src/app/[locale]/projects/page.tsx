import type { Metadata } from "next";
import { ProjectsView } from "@/components/projects/ProjectsView";
import { getContent } from "@/content/localized";
import { getMessages, isLocale, type Locale } from "@/i18n";
import { pageMetadata } from "@/i18n/metadata";
import { getRepoStatsMap } from "@/lib/github";
import { buildProjectView } from "@/lib/views";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getMessages(locale);
  return pageMetadata(locale, "/projects", { title: t.projects.metaTitle, description: t.projects.metaDescription });
}

export default async function ProjectsPage({ params }: Params) {
  const content = getContent((await params).locale as Locale);
  const repos = await getRepoStatsMap(content.projects.map((p) => p.github));
  const views = content.projects.map((p) => buildProjectView(content, p, p.github ? (repos[p.github] ?? null) : null));
  const areaOptions = content.areasInLearningOrder.map((a) => ({ id: a.id, name: a.name }));
  return <ProjectsView views={views} areaOptions={areaOptions} />;
}

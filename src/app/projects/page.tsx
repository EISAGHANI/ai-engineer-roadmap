import type { Metadata } from "next";
import { ProjectsView } from "@/components/projects/ProjectsView";
import { areasInLearningOrder, projects } from "@/content";
import { getRepoStatsMap } from "@/lib/github";
import { buildProjectView } from "@/lib/views";

export const metadata: Metadata = {
  title: "Projects",
  description: "The eight build-this projects from the roadmap, the three portfolio projects, and the author's own repositories.",
};

export default async function ProjectsPage() {
  const repos = await getRepoStatsMap(projects.map((p) => p.github));
  const views = projects.map((p) => buildProjectView(p, p.github ? (repos[p.github] ?? null) : null));
  const areaOptions = areasInLearningOrder.map((a) => ({ id: a.id, name: a.name }));
  return <ProjectsView views={views} areaOptions={areaOptions} />;
}

import type { Project } from "@/content/schema";
import type { RepoStats } from "@/lib/github";

export interface ProjectView {
  project: Project;
  areaName?: string;
  repo: RepoStats | null;
  concepts: Array<{ id: string; name: string; area: string; slug: string; number: number }>;
}

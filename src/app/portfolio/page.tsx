import type { Metadata } from "next";
import Link from "next/link";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { projects } from "@/content";
import { portfolioEvidence } from "@/content/projects";
import { getRepoStatsMap } from "@/lib/github";
import { buildProjectView } from "@/lib/views";

export const metadata: Metadata = {
  title: "Your portfolio at the end",
  description: "The three complete projects the roadmap recommends, and what each should show.",
};

export default async function PortfolioPage() {
  const portfolio = projects.filter((p) => p.kind === "portfolio");
  const repos = await getRepoStatsMap(portfolio.map((p) => p.github));
  const views = portfolio.map((p) => buildProjectView(p, p.github ? (repos[p.github] ?? null) : null));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="font-mono text-xs tracking-wide text-accent uppercase">Finish line</p>
      <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Your portfolio at the end</h1>
      <p className="prose-max mt-3 text-lg text-muted">
        After the 8 areas, turn your small builds into one or two complete projects. Recruiters and clients look for a
        live link, a README that explains your choices, and numbers from your evals.
      </p>

      <section className="mt-8 rounded-card border border-border bg-surface p-5">
        <h2 className="font-mono text-sm tracking-wide text-accent uppercase">What each project should show</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {portfolioEvidence.map((e) => (
            <li key={e.key}>{e.label}</li>
          ))}
        </ul>
      </section>

      <div className="mt-8 space-y-8">
        {views.map((v) => (
          <section key={v.project.id} className="rounded-card border border-border bg-surface p-5 sm:p-8" aria-labelledby={`p-${v.project.id}`}>
            <h2 id={`p-${v.project.id}`} className="text-2xl font-semibold">
              {v.project.title}
            </h2>
            <div className="mt-3">
              <ProjectDetails view={v} fullPageHref={`/projects/${v.project.id}`} />
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted">
        Looking for the smaller build-this projects? They are on the <Link href="/projects" className="text-text underline-offset-4 hover:underline">Projects</Link> page.
      </p>
    </div>
  );
}

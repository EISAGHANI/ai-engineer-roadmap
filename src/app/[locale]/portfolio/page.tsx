import type { Metadata } from "next";
import Link from "next/link";
import { ProjectDetails } from "@/components/projects/ProjectDetails";
import { portfolioEvidence } from "@/content/projects";
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
  return pageMetadata(locale, "/portfolio", { title: t.portfolio.metaTitle, description: t.portfolio.metaDescription });
}

export default async function PortfolioPage({ params }: Params) {
  const locale = (await params).locale as Locale;
  const content = getContent(locale);
  const t = getMessages(locale).portfolio;
  const portfolio = content.projects.filter((p) => p.kind === "portfolio");
  const repos = await getRepoStatsMap(portfolio.map((p) => p.github));
  const views = portfolio.map((p) => buildProjectView(content, p, p.github ? (repos[p.github] ?? null) : null));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="font-mono text-xs tracking-wide text-accent uppercase">{t.eyebrow}</p>
      <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">{t.title}</h1>
      <p className="prose-max mt-3 text-lg text-muted">{t.lead}</p>

      <section className="mt-8 rounded-card border border-border bg-surface p-5">
        <h2 className="font-mono text-sm tracking-wide text-accent uppercase">{t.shouldShow}</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {portfolioEvidence.map((e) => (
            <li key={e.key}>{t.evidence[e.key]}</li>
          ))}
        </ul>
      </section>

      <div className="mt-8 space-y-8">
        {views.map((v) => (
          <section
            key={v.project.id}
            className="rounded-card border border-border bg-surface p-5 sm:p-8"
            aria-labelledby={`p-${v.project.id}`}
          >
            <h2 id={`p-${v.project.id}`} className="text-2xl font-semibold">
              {v.project.title}
            </h2>
            <div className="mt-3">
              <ProjectDetails view={v} fullPageHref={content.href(`/projects/${v.project.id}`)} />
            </div>
          </section>
        ))}
      </div>

      <p className="mt-10 text-sm text-muted">
        {t.smallerBefore}
        <Link href={content.href("/projects")} className="text-text underline-offset-4 hover:underline">
          {t.smallerLink}
        </Link>
        {t.smallerAfter}
      </p>
    </div>
  );
}

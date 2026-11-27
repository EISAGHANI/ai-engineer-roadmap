import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Hammer, ListChecks, Ruler } from "lucide-react";
import { DotGrid } from "@/components/roadmap/DotGrid";
import { AreaGrid } from "@/components/roadmap/AreaGrid";
import { buttonClass } from "@/components/ui/Button";
import { getContent } from "@/content/localized";
import { getMessages, isLocale, type Locale } from "@/i18n";
import { pageMetadata } from "@/i18n/metadata";
import { SITE } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return pageMetadata(locale, "/", { title: SITE.name, description: getMessages(locale).site.tagline, absoluteTitle: true });
}

export default async function HomePage({ params }: Params) {
  const locale = (await params).locale as Locale;
  const content = getContent(locale);
  const t = getMessages(locale);
  const toCard = (a: (typeof content.areasInLearningOrder)[number]) => ({
    id: a.id,
    number: a.number,
    code: a.code,
    name: a.name,
    summary: a.summary,
    phase: a.phase,
    weeks: a.weeks,
    conceptNames: content.getConceptsForArea(a.id).map((c) => c.name),
  });
  const gridAreas = content.areasInPdfOrder.map((a) => ({
    id: a.id,
    name: a.name,
    number: a.number,
    conceptIds: content.getConceptsForArea(a.id).map((c) => c.id),
  }));
  const portfolio = content.projects.filter((p) => p.kind === "portfolio");
  const ruleIcons = [ListChecks, Hammer, Ruler];

  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="font-mono text-xs tracking-wide text-accent uppercase">{t.site.edition}</p>
          <h1 className="mt-3 text-5xl font-semibold leading-none sm:text-6xl">
            AI Engineer
            <br />
            <span className="text-accent">Roadmap</span>
          </h1>
          <p className="prose-max mt-5 text-lg text-muted">{t.home.lead}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={content.href("/start")} className={buttonClass("primary", "lg")}>
              {t.home.startHere} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href={content.href("/llm")} className={buttonClass("secondary", "lg")}>
              {t.home.jumpLlm}
            </Link>
          </div>
        </div>
        <div className="justify-self-center lg:justify-self-end">
          <DotGrid areas={gridAreas} shimmer />
          <p className="mt-3 text-center text-xs text-muted">{t.home.dotsCaption}</p>
        </div>
      </section>

      <AreaGrid
        learningOrder={content.areasInLearningOrder.map(toCard)}
        pdfOrder={content.areasInPdfOrder.map(toCard)}
      />

      <section className="mt-16" aria-labelledby="rules-heading">
        <h2 id="rules-heading" className="text-2xl font-semibold">
          {t.home.threeRules}
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {content.rules.map((r, i) => {
            const Icon = ruleIcons[i] ?? ListChecks;
            return (
              <div key={r.title} className="rounded-card border border-border bg-surface p-5">
                <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                <h3 className="mt-3 font-semibold">{r.title}</h3>
                <p className="mt-1 text-sm text-muted">{r.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section
        className="mt-16 rounded-card border border-border bg-surface p-6 sm:p-8"
        aria-labelledby="portfolio-heading"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-wide text-accent uppercase">{t.home.finishLine}</p>
            <h2 id="portfolio-heading" className="mt-1 text-2xl font-semibold">
              {t.home.portfolioTitle}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted">{t.home.portfolioText}</p>
          </div>
          <Link href={content.href("/portfolio")} className={buttonClass("secondary", "md")}>
            {t.home.portfolioCta} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <ul className="mt-5 grid gap-3 md:grid-cols-3">
          {portfolio.map((p) => (
            <li key={p.id} className="rounded-lg border border-border bg-surface-2 p-4">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="mt-1 text-sm text-muted">{p.brief}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

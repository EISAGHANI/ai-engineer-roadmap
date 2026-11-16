import Link from "next/link";
import { ArrowRight, Hammer, ListChecks, Ruler } from "lucide-react";
import { DotGrid } from "@/components/roadmap/DotGrid";
import { AreaGrid } from "@/components/roadmap/AreaGrid";
import { buttonClass } from "@/components/ui/Button";
import { areasInLearningOrder, areasInPdfOrder, getConceptsForArea, rules, projects } from "@/content";
import { SITE } from "@/lib/site";

export default function HomePage() {
  const toCard = (a: (typeof areasInLearningOrder)[number]) => ({
    id: a.id,
    number: a.number,
    code: a.code,
    name: a.name,
    summary: a.summary,
    phase: a.phase,
    weeks: a.weeks,
    conceptNames: getConceptsForArea(a.id).map((c) => c.name),
  });
  const gridAreas = areasInPdfOrder.map((a) => ({
    id: a.id,
    name: a.name,
    number: a.number,
    conceptIds: getConceptsForArea(a.id).map((c) => c.id),
  }));
  const portfolio = projects.filter((p) => p.kind === "portfolio");
  const ruleIcons = [ListChecks, Hammer, Ruler];

  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="font-mono text-xs tracking-wide text-accent uppercase">{SITE.roadmapEdition}</p>
          <h1 className="mt-3 text-5xl font-semibold leading-none sm:text-6xl">
            AI Engineer
            <br />
            <span className="text-accent">Roadmap</span>
          </h1>
          <p className="prose-max mt-5 text-lg text-muted">
            8 areas · 20 concepts each · 160 things to master, the order to learn them, and what to build after each
            area. Every concept explained three ways: for an 8-year-old, with a real-world story, and for engineers.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/start" className={buttonClass("primary", "lg")}>
              Start here <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/llm" className={buttonClass("secondary", "lg")}>
              Jump to LLM basics
            </Link>
          </div>
        </div>
        <div className="justify-self-center lg:justify-self-end">
          <DotGrid areas={gridAreas} shimmer />
          <p className="mt-3 text-center text-xs text-muted">Each dot is one concept. They light up as you use them in code.</p>
        </div>
      </section>

      <AreaGrid learningOrder={areasInLearningOrder.map(toCard)} pdfOrder={areasInPdfOrder.map(toCard)} />

      <section className="mt-16" aria-labelledby="rules-heading">
        <h2 id="rules-heading" className="text-2xl font-semibold">
          Three rules
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {rules.map((r, i) => {
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

      <section className="mt-16 rounded-card border border-border bg-surface p-6 sm:p-8" aria-labelledby="portfolio-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-wide text-accent uppercase">Finish line</p>
            <h2 id="portfolio-heading" className="mt-1 text-2xl font-semibold">
              Your portfolio at the end
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted">
              After the 8 areas, turn your small builds into one or two complete projects. Recruiters and clients look
              for a live link, a README that explains your choices, and numbers from your evals.
            </p>
          </div>
          <Link href="/portfolio" className={buttonClass("secondary", "md")}>
            See the portfolio plan <ArrowRight className="h-4 w-4" aria-hidden="true" />
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

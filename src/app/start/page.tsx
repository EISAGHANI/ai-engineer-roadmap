import type { Metadata } from "next";
import Link from "next/link";
import { PhaseTimeline } from "@/components/roadmap/PhaseTimeline";
import { PrereqChecklist } from "@/components/roadmap/PrereqChecklist";
import { phases, prerequisites, rules } from "@/content";
import { buttonClass } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Start here",
  description: "How to use the AI Engineer Roadmap: prerequisites, the 8 phases over 26 weeks, and the three rules.",
};

export default function StartPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="font-mono text-xs tracking-wide text-accent uppercase">Start here</p>
      <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">How to use this roadmap</h1>
      <p className="prose-max mt-3 text-lg text-muted">
        Each of the 8 areas has 20 concepts, each explained in one line. Learn a concept, then use it in code the same
        day. Tick the box only when you have used it, not when you have watched a video about it.
      </p>

      <section className="mt-10" aria-labelledby="before">
        <h2 id="before" className="font-mono text-sm tracking-wide text-accent uppercase">
          Before you start
        </h2>
        <PrereqChecklist items={prerequisites} />
      </section>

      <section className="mt-12" aria-labelledby="order">
        <h2 id="order" className="font-mono text-sm tracking-wide text-accent uppercase">
          Suggested order · about 6 months at 10-12 hours a week
        </h2>
        <div className="mt-3">
          <PhaseTimeline phases={phases} />
        </div>
      </section>

      <section className="mt-12" aria-labelledby="rules">
        <h2 id="rules" className="font-mono text-sm tracking-wide text-accent uppercase">
          Three rules
        </h2>
        <ul className="mt-3 space-y-2">
          {rules.map((r) => (
            <li key={r.title} className="rounded-lg border border-border bg-surface px-4 py-3">
              <strong>{r.title}</strong> {r.text}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="howto">
        <h2 id="howto" className="font-mono text-sm tracking-wide text-accent uppercase">
          How to use this site
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Open an area and read the first ten concepts. Start each one with &ldquo;Explain like I&rsquo;m 8&rdquo;.</li>
          <li>Play with the &ldquo;Try it&rdquo; demo, then switch to &ldquo;For engineers&rdquo; and run the code yourself.</li>
          <li>Build the area&rsquo;s project, push it to GitHub, and only then tick the concepts you actually used.</li>
        </ol>
        <div className="mt-6">
          <Link href="/backend" className={buttonClass("primary", "lg")}>
            Begin with Phase 0: Backend 01-10
          </Link>
        </div>
      </section>
    </div>
  );
}

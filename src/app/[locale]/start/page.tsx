import type { Metadata } from "next";
import Link from "next/link";
import { PhaseTimeline } from "@/components/roadmap/PhaseTimeline";
import { PrereqChecklist } from "@/components/roadmap/PrereqChecklist";
import { buttonClass } from "@/components/ui/Button";
import { getContent } from "@/content/localized";
import { getMessages, isLocale, type Locale } from "@/i18n";
import { pageMetadata } from "@/i18n/metadata";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getMessages(locale);
  return pageMetadata(locale, "/start", { title: t.start.metaTitle, description: t.start.metaDescription });
}

export default async function StartPage({ params }: Params) {
  const locale = (await params).locale as Locale;
  const content = getContent(locale);
  const t = getMessages(locale);
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="font-mono text-xs tracking-wide text-accent uppercase">{t.start.eyebrow}</p>
      <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">{t.start.title}</h1>
      <p className="prose-max mt-3 text-lg text-muted">{t.start.lead}</p>

      <section className="mt-10" aria-labelledby="before">
        <h2 id="before" className="font-mono text-sm tracking-wide text-accent uppercase">
          {t.start.before}
        </h2>
        <PrereqChecklist items={content.prerequisites} />
      </section>

      <section className="mt-12" aria-labelledby="order">
        <h2 id="order" className="font-mono text-sm tracking-wide text-accent uppercase">
          {t.start.order}
        </h2>
        <div className="mt-3">
          <PhaseTimeline phases={content.phases} />
        </div>
      </section>

      <section className="mt-12" aria-labelledby="rules">
        <h2 id="rules" className="font-mono text-sm tracking-wide text-accent uppercase">
          {t.start.rules}
        </h2>
        <ul className="mt-3 space-y-2">
          {content.rules.map((r) => (
            <li key={r.title} className="rounded-lg border border-border bg-surface px-4 py-3">
              <strong>{r.title}</strong> {r.text}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12" aria-labelledby="howto">
        <h2 id="howto" className="font-mono text-sm tracking-wide text-accent uppercase">
          {t.start.howto}
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          {t.start.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
        <div className="mt-6">
          <Link href={content.href("/backend")} className={buttonClass("primary", "lg")}>
            {t.start.begin}
          </Link>
        </div>
      </section>
    </div>
  );
}

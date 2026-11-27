import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ConceptBody } from "@/components/roadmap/ConceptBody";
import { concepts } from "@/content";
import { getContent } from "@/content/localized";
import { getMessages, isLocale, type Locale } from "@/i18n";
import { pageMetadata } from "@/i18n/metadata";
import { buildConceptView } from "@/lib/views";
import { areaVar, pad2 } from "@/lib/utils";
import { getQuizFromDb } from "@/lib/db";

export const dynamicParams = false;

type Params = { params: Promise<{ locale: string; area: string; slug: string }> };

export function generateStaticParams() {
  return concepts.map((c) => ({ area: c.area, slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, area, slug } = await params;
  if (!isLocale(locale)) return {};
  const content = getContent(locale);
  const c = content.getConceptBySlug(area, slug);
  if (!c) return {};
  const a = content.getArea(c.area);
  const description = c.kid ?? c.officialTranslation ?? c.official;
  return pageMetadata(locale, `/${c.area}/${c.slug}`, {
    title: `${c.name} · ${a?.name ?? c.area} ${pad2(c.number)}`,
    description,
  });
}

export default async function ConceptPage({ params }: Params) {
  const { locale, area, slug } = await params;
  const content = getContent(locale as Locale);
  const t = getMessages(locale as Locale);
  const c = content.getConceptBySlug(area, slug);
  if (!c) notFound();
  const a = content.getArea(c.area);
  const view = await buildConceptView(content, c, true);
  const quiz = await getQuizFromDb(c.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href={content.href(`/${c.area}#${c.id}`)}
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-text"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        <span style={{ color: areaVar(c.area) }}>{t.concept.areaLink(pad2(a?.number ?? 0), a?.name ?? c.area)}</span>
      </Link>
      <div
        className="mt-4 rounded-card border border-border bg-surface p-5 sm:p-8"
        style={{ borderTopColor: areaVar(c.area), borderTopWidth: 4 }}
      >
        <ConceptBody view={view} quiz={quiz} showNav />
      </div>
    </div>
  );
}

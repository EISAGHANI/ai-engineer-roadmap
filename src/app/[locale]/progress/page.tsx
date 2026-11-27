import type { Metadata } from "next";
import { ProgressView } from "@/components/roadmap/ProgressView";
import { getContent } from "@/content/localized";
import { getMessages, isLocale, type Locale } from "@/i18n";
import { pageMetadata } from "@/i18n/metadata";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getMessages(locale);
  return pageMetadata(locale, "/progress", { title: t.progress.metaTitle, description: t.progress.metaDescription });
}

export default async function ProgressPage({ params }: Params) {
  const content = getContent((await params).locale as Locale);
  const areas = content.areasInLearningOrder.map((a) => ({
    id: a.id,
    name: a.name,
    number: a.number,
    concepts: content.getConceptsForArea(a.id).map((c) => ({ id: c.id, name: c.name, slug: c.slug, number: c.number })),
  }));
  return <ProgressView areas={areas} prerequisites={content.prerequisites} />;
}

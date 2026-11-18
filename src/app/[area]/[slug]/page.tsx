import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ConceptBody } from "@/components/roadmap/ConceptBody";
import { concepts, getArea, getConceptBySlug } from "@/content";
import { buildConceptView } from "@/lib/views";
import { areaVar, pad2 } from "@/lib/utils";
import { getQuizFromDb } from "@/lib/db";

export const dynamicParams = false;

export function generateStaticParams() {
  return concepts.map((c) => ({ area: c.area, slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string; slug: string }>;
}): Promise<Metadata> {
  const { area, slug } = await params;
  const c = getConceptBySlug(area, slug);
  if (!c) return {};
  const a = getArea(c.area);
  return {
    title: `${c.name} · ${a?.name ?? c.area} ${pad2(c.number)}`,
    description: c.kid ?? c.official,
    openGraph: { title: c.name, description: c.kid ?? c.official },
  };
}

export default async function ConceptPage({ params }: { params: Promise<{ area: string; slug: string }> }) {
  const { area, slug } = await params;
  const c = getConceptBySlug(area, slug);
  if (!c) notFound();
  const a = getArea(c.area);
  const view = await buildConceptView(c, true);
  const quiz = await getQuizFromDb(c.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href={`/${c.area}#${c.id}`} className="inline-flex items-center gap-1 text-sm text-muted hover:text-text">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        <span style={{ color: areaVar(c.area) }}>
          Area {pad2(a?.number ?? 0)} · {a?.name}
        </span>
      </Link>
      <div className="mt-4 rounded-card border border-border bg-surface p-5 sm:p-8" style={{ borderTopColor: areaVar(c.area), borderTopWidth: 4 }}>
        <ConceptBody view={view} quiz={quiz} showNav />
      </div>
    </div>
  );
}

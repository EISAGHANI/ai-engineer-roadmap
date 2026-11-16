import type { Metadata } from "next";
import { ProgressView } from "@/components/roadmap/ProgressView";
import { areasInLearningOrder, getConceptsForArea, prerequisites } from "@/content";

export const metadata: Metadata = {
  title: "My progress",
  description: "Your progress across the 160 concepts, stored in this browser. Export it as JSON to keep a backup.",
};

export default function ProgressPage() {
  const areas = areasInLearningOrder.map((a) => ({
    id: a.id,
    name: a.name,
    number: a.number,
    concepts: getConceptsForArea(a.id).map((c) => ({ id: c.id, name: c.name, slug: c.slug, number: c.number })),
  }));
  return <ProgressView areas={areas} prerequisites={prerequisites} />;
}

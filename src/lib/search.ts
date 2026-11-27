import Fuse from "fuse.js";
import type { Concept } from "@/content/schema";

export interface SearchItem {
  id: string;
  name: string;
  area: string;
  slug: string;
  number: number;
  official: string;
  officialTranslation?: string;
  kid?: string;
  keywords: string[];
}

export function toSearchItems(concepts: Concept[]): SearchItem[] {
  return concepts.map((c) => ({
    id: c.id,
    name: c.name,
    area: c.area,
    slug: c.slug,
    number: c.number,
    official: c.official,
    officialTranslation: c.officialTranslation,
    kid: c.kid,
    keywords: c.keywords,
  }));
}

export function createIndex(items: SearchItem[]) {
  return new Fuse(items, {
    includeScore: true,
    threshold: 0.38,
    ignoreLocation: true,
    minMatchCharLength: 2,
    keys: [
      { name: "name", weight: 0.5 },
      { name: "keywords", weight: 0.25 },
      { name: "official", weight: 0.1 },
      { name: "officialTranslation", weight: 0.05 },
      { name: "kid", weight: 0.1 },
    ],
  });
}

export function search(index: Fuse<SearchItem>, query: string, limit = 8): SearchItem[] {
  const q = query.trim();
  if (!q) return [];
  return index.search(q, { limit }).map((r) => r.item);
}

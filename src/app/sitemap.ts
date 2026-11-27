import type { MetadataRoute } from "next";
import { areas, concepts, projects } from "@/content";
import { LOCALES, LOCALE_TAGS, localePath } from "@/i18n/config";
import { SITE } from "@/lib/site";

/** One entry per page and locale, each listing its translations as hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();
  const pages: Array<{ path: string; changeFrequency: "weekly" | "monthly"; priority: number }> = [
    ...["/", "/start", "/projects", "/portfolio", "/progress", "/about"].map((path) => ({
      path,
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...areas.map((a) => ({ path: `/${a.id}`, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...concepts.map((c) => ({ path: `/${c.area}/${c.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...projects.map((p) => ({ path: `/projects/${p.id}`, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
  const url = (locale: (typeof LOCALES)[number], path: string) => {
    const p = localePath(locale, path);
    return `${base}${p === "/" ? "" : p}`;
  };
  return pages.flatMap((page) =>
    LOCALES.map((locale) => ({
      url: url(locale, page.path),
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [LOCALE_TAGS[l], url(l, page.path)])),
      },
    })),
  );
}

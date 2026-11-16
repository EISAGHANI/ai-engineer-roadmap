import type { MetadataRoute } from "next";
import { areas, concepts, projects } from "@/content";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url.replace(/\/$/, "");
  const now = new Date();
  const staticPages = ["", "/start", "/projects", "/portfolio", "/progress", "/about"].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  const areaPages = areas.map((a) => ({
    url: `${base}/${a.id}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));
  const conceptPages = concepts.map((c) => ({
    url: `${base}/${c.area}/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const projectPages = projects.map((p) => ({
    url: `${base}/projects/${p.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
  return [...staticPages, ...areaPages, ...conceptPages, ...projectPages];
}

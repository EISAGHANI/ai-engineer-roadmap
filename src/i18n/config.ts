/**
 * Locales of the site. English is the default and keeps the original URLs
 * (/rag/embeddings); every other locale lives under its own prefix (/de/rag/embeddings).
 * src/middleware.ts rewrites unprefixed URLs to the internal /en segment.
 */
export const LOCALES = ["en", "de"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

/** BCP 47 tags for dates, numbers and hreflang. */
export const LOCALE_TAGS: Record<Locale, string> = { en: "en-GB", de: "de-DE" };
export const OG_LOCALES: Record<Locale, string> = { en: "en_GB", de: "de_DE" };
export const LOCALE_NAMES: Record<Locale, string> = { en: "English", de: "Deutsch" };

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** "/rag" -> "/rag" (en) or "/de/rag" (de). Keeps query strings and hashes. */
export function localePath(locale: Locale, path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (locale === DEFAULT_LOCALE) return p;
  if (p === "/") return `/${locale}`;
  if (p.startsWith("/#") || p.startsWith("/?")) return `/${locale}${p.slice(1)}`;
  return `/${locale}${p}`;
}

/** "/de/rag" -> { locale: "de", path: "/rag" }; "/rag" and "/en/rag" -> { locale: "en", path: "/rag" }. */
export function stripLocale(pathname: string): { locale: Locale; path: string } {
  for (const l of LOCALES) {
    if (pathname === `/${l}` || pathname.startsWith(`/${l}/`)) {
      return { locale: l, path: pathname.slice(l.length + 1) || "/" };
    }
  }
  return { locale: DEFAULT_LOCALE, path: pathname || "/" };
}

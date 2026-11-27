import type { Metadata } from "next";
import { LOCALES, LOCALE_TAGS, OG_LOCALES, localePath, type Locale } from "./config";

/** canonical + hreflang alternates for a page that exists in every locale. `path` is unprefixed ("/rag"). */
export function alternatesFor(locale: Locale, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[LOCALE_TAGS[l]] = localePath(l, path);
  languages["x-default"] = localePath("en", path);
  return { canonical: localePath(locale, path), languages };
}

export function pageMetadata(
  locale: Locale,
  path: string,
  meta: { title?: string; description?: string; absoluteTitle?: boolean },
): Metadata {
  return {
    ...(meta.title ? { title: meta.absoluteTitle ? { absolute: meta.title } : meta.title } : {}),
    ...(meta.description ? { description: meta.description } : {}),
    alternates: alternatesFor(locale, path),
    openGraph: {
      ...(meta.title ? { title: meta.title } : {}),
      ...(meta.description ? { description: meta.description } : {}),
      locale: OG_LOCALES[locale],
      url: localePath(locale, path),
    },
  };
}

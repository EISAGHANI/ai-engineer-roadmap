"use client";

import * as React from "react";
import { DEFAULT_LOCALE, localePath, type Locale } from "./config";
import { getMessages } from "./index";

const LocaleContext = React.createContext<Locale>(DEFAULT_LOCALE);

/** Set once in the [locale] root layout; every client component below reads the locale from here. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return React.useContext(LocaleContext);
}

/** UI strings for the current locale. */
export function useT() {
  return getMessages(useLocale());
}

/** Turns an unprefixed path ("/rag") into the path for the current locale ("/de/rag"). */
export function useLocalePath() {
  const locale = useLocale();
  return React.useCallback((path: string) => localePath(locale, path), [locale]);
}

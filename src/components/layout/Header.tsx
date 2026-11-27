"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Sun, Moon, Sparkles, Menu, X, Accessibility, User, Languages } from "lucide-react";
import { useSettings } from "@/lib/settings";
import { useProgress, useHydrated, countUsed } from "@/lib/progress";
import { useAuth } from "@/lib/auth-client";
import dynamic from "next/dynamic";
import { ProgressRing } from "@/components/ui/ProgressRing";
import type { SearchItem } from "@/lib/search";
import { cn, areaVar } from "@/lib/utils";
import { useLocale, useLocalePath, useT } from "@/i18n/client";
import { LOCALES, localePath, stripLocale } from "@/i18n/config";

// Search (and fuse.js) loads only the first time the palette is opened.
const CommandPalette = dynamic(() => import("./CommandPalette").then((m) => m.CommandPalette), { ssr: false });

export interface HeaderArea {
  id: string;
  name: string;
  number: number;
}

interface HeaderProps {
  areas: HeaderArea[];
  searchItems: SearchItem[];
  totalConcepts: number;
}

export function Header({ areas, searchItems, totalConcepts }: HeaderProps) {
  const rawPathname = usePathname();
  // The server renders /en/... (rewritten), the browser shows /...; compare the unprefixed path.
  const pathname = stripLocale(rawPathname ?? "/").path;
  const locale = useLocale();
  const t = useT();
  const lp = useLocalePath();
  const otherLocale = LOCALES.find((l) => l !== locale) ?? "en";
  const [hash, setHash] = React.useState("");
  React.useEffect(() => {
    const read = () => setHash(window.location.hash);
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [rawPathname]);
  const switchHref = localePath(otherLocale, pathname) + hash;
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [paletteLoaded, setPaletteLoaded] = React.useState(false);
  React.useEffect(() => {
    if (paletteOpen) setPaletteLoaded(true);
  }, [paletteOpen]);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const theme = useSettings((s) => s.theme);
  const toggleTheme = useSettings((s) => s.toggleTheme);
  const simple = useSettings((s) => s.simpleMode);
  const setSimple = useSettings((s) => s.setSimpleMode);
  const reduce = useSettings((s) => s.reduceMotion);
  const setReduce = useSettings((s) => s.setReduceMotion);
  const used = useProgress((s) => s.used);
  const user = useAuth((s) => s.user);
  const hydrated = useHydrated();
  const done = hydrated ? countUsed(used) : 0;
  const areaNames = React.useMemo(
    () => Object.fromEntries(areas.map((a) => [a.id, a.name])),
    [areas],
  );

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  React.useEffect(() => setMenuOpen(false), [pathname]);

  const nav = [
    { href: "/start", label: t.header.nav.start },
    { href: "/projects", label: t.header.nav.projects },
    { href: "/portfolio", label: t.header.nav.portfolio },
    { href: "/progress", label: t.header.nav.progress },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link href={lp("/")} className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid h-8 w-8 grid-cols-2 gap-0.5 rounded-md bg-surface-2 p-1" aria-hidden="true">
            <span className="rounded-sm" style={{ background: areaVar("llm") }} />
            <span className="rounded-sm" style={{ background: areaVar("rag") }} />
            <span className="rounded-sm" style={{ background: areaVar("agents") }} />
            <span className="rounded-sm" style={{ background: areaVar("evals") }} />
          </span>
          <span className="hidden sm:inline">AI Engineer Roadmap</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label={t.header.mainNav}>
          <details className="group relative">
            <summary className="cursor-pointer list-none rounded-full px-3 py-1.5 text-sm text-muted hover:bg-surface-2 hover:text-text">
              {t.header.areas}
            </summary>
            <ul className="absolute top-full left-0 mt-1 w-64 rounded-xl border border-border bg-surface p-2 shadow-xl">
              {areas.map((a) => (
                <li key={a.id}>
                  <Link
                    href={lp(`/${a.id}`)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-surface-2"
                  >
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: areaVar(a.id) }} />
                    <span className="font-mono text-xs text-muted">{a.number.toString().padStart(2, "0")}</span>
                    {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
          {nav.map((n) => (
            <Link
              key={n.href}
              href={lp(n.href)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm hover:bg-surface-2",
                pathname === n.href ? "text-text" : "text-muted hover:text-text",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="flex h-9 items-center gap-2 rounded-full border border-border bg-surface-2 px-3 text-sm text-muted hover:text-text"
            aria-label={t.header.searchAria}
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t.header.search}</span>
            <kbd className="hidden rounded border border-border px-1 font-mono text-[10px] sm:inline">⌘K</kbd>
          </button>
          <button
            type="button"
            onClick={() => setSimple(!simple)}
            aria-pressed={simple}
            title={t.header.simpleTitle}
            className={cn(
              "flex h-9 items-center gap-1 rounded-full px-3 text-sm",
              simple ? "bg-accent text-accent-ink" : "text-muted hover:bg-surface-2 hover:text-text",
            )}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span className="hidden lg:inline">{t.header.simple}</span>
          </button>
          <button
            type="button"
            onClick={() => setReduce(!reduce)}
            aria-pressed={reduce}
            title={t.header.reduceMotion}
            aria-label={t.header.reduceMotion}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full",
              reduce ? "bg-accent text-accent-ink" : "text-muted hover:bg-surface-2 hover:text-text",
            )}
          >
            <Accessibility className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? t.header.toLight : t.header.toDark}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-text"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          </button>
          <Link
            href={switchHref}
            hrefLang={otherLocale}
            lang={otherLocale}
            aria-label={t.language.switchAria}
            title={t.language.switchAria}
            className="flex h-9 items-center gap-1 rounded-full px-2.5 text-xs font-medium text-muted hover:bg-surface-2 hover:text-text"
          >
            <Languages className="h-4 w-4" aria-hidden="true" />
            <span className="font-mono uppercase">{otherLocale}</span>
          </Link>
          <Link
            href={lp("/progress#account")}
            className="hidden h-9 items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 text-xs font-medium text-muted hover:text-text sm:flex"
            title={user ? t.header.signedInAs(user.email) : t.header.signInTitle}
          >
            <User className="h-3.5 w-3.5" aria-hidden="true" />
            {user ? (
              <>
                <span className="max-w-24 truncate text-text">{user.name}</span>
                <span className="h-2 w-2 rounded-full bg-ok" aria-hidden="true" />
              </>
            ) : (
              <span>{t.header.signIn}</span>
            )}
          </Link>
          <Link href={lp("/progress")} className="ml-1" aria-label={t.header.progressAria(done, totalConcepts)}>
            <ProgressRing value={done / totalConcepts} size={36} stroke={4} label={t.header.progressLabel(done, totalConcepts)}>
              {done}
            </ProgressRing>
          </Link>
          <button
            type="button"
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-muted md:hidden"
            aria-label={menuOpen ? t.header.closeMenu : t.header.openMenu}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-border bg-surface px-4 py-3 md:hidden" aria-label={t.header.mobileNav}>
          <ul className="grid grid-cols-2 gap-1">
            {areas.map((a) => (
              <li key={a.id}>
                <Link href={lp(`/${a.id}`)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-surface-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: areaVar(a.id) }} />
                  {a.name}
                </Link>
              </li>
            ))}
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={lp(n.href)} className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-2">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {paletteLoaded && (
        <CommandPalette items={searchItems} areaNames={areaNames} open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      )}
    </header>
  );
}

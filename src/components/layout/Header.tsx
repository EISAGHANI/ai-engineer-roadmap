"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Sun, Moon, Sparkles, Menu, X, Accessibility } from "lucide-react";
import { useSettings } from "@/lib/settings";
import { useProgress, useHydrated, countUsed } from "@/lib/progress";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { CommandPalette } from "./CommandPalette";
import type { SearchItem } from "@/lib/search";
import { cn, areaVar } from "@/lib/utils";

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
  const pathname = usePathname();
  const [paletteOpen, setPaletteOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const theme = useSettings((s) => s.theme);
  const toggleTheme = useSettings((s) => s.toggleTheme);
  const simple = useSettings((s) => s.simpleMode);
  const setSimple = useSettings((s) => s.setSimpleMode);
  const reduce = useSettings((s) => s.reduceMotion);
  const setReduce = useSettings((s) => s.setReduceMotion);
  const used = useProgress((s) => s.used);
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
    { href: "/start", label: "Start here" },
    { href: "/projects", label: "Projects" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/progress", label: "My progress" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="grid h-8 w-8 grid-cols-2 gap-0.5 rounded-md bg-surface-2 p-1" aria-hidden="true">
            <span className="rounded-sm" style={{ background: areaVar("llm") }} />
            <span className="rounded-sm" style={{ background: areaVar("rag") }} />
            <span className="rounded-sm" style={{ background: areaVar("agents") }} />
            <span className="rounded-sm" style={{ background: areaVar("evals") }} />
          </span>
          <span className="hidden sm:inline">AI Engineer Roadmap</span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Main">
          <details className="group relative">
            <summary className="cursor-pointer list-none rounded-full px-3 py-1.5 text-sm text-muted hover:bg-surface-2 hover:text-text">
              Areas
            </summary>
            <ul className="absolute top-full left-0 mt-1 w-64 rounded-xl border border-border bg-surface p-2 shadow-xl">
              {areas.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/${a.id}`}
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
              href={n.href}
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
            aria-label="Search concepts (Ctrl+K)"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden rounded border border-border px-1 font-mono text-[10px] sm:inline">⌘K</kbd>
          </button>
          <button
            type="button"
            onClick={() => setSimple(!simple)}
            aria-pressed={simple}
            title="Simple mode: hide the engineering layer and enlarge text"
            className={cn(
              "flex h-9 items-center gap-1 rounded-full px-3 text-sm",
              simple ? "bg-accent text-accent-ink" : "text-muted hover:bg-surface-2 hover:text-text",
            )}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            <span className="hidden lg:inline">Simple</span>
          </button>
          <button
            type="button"
            onClick={() => setReduce(!reduce)}
            aria-pressed={reduce}
            title="Reduce motion"
            aria-label="Reduce motion"
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
            aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-surface-2 hover:text-text"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          </button>
          <Link href="/progress" className="ml-1" aria-label={`Progress: ${done} of ${totalConcepts} concepts used`}>
            <ProgressRing value={done / totalConcepts} size={36} stroke={4} label={`${done} of ${totalConcepts}`}>
              {done}
            </ProgressRing>
          </Link>
          <button
            type="button"
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-muted md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-border bg-surface px-4 py-3 md:hidden" aria-label="Mobile">
          <ul className="grid grid-cols-2 gap-1">
            {areas.map((a) => (
              <li key={a.id}>
                <Link href={`/${a.id}`} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-surface-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: areaVar(a.id) }} />
                  {a.name}
                </Link>
              </li>
            ))}
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface-2">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <CommandPalette items={searchItems} areaNames={areaNames} open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </header>
  );
}

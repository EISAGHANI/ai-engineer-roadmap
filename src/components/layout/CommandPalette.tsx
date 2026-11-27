"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { createIndex, search, type SearchItem } from "@/lib/search";
import { areaVar, pad2, cn } from "@/lib/utils";
import { useLocalePath, useT } from "@/i18n/client";

interface CommandPaletteProps {
  items: SearchItem[];
  areaNames: Record<string, string>;
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ items, areaNames, open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const t = useT();
  const lp = useLocalePath();
  const index = React.useMemo(() => createIndex(items), [items]);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const results = React.useMemo(() => search(index, query), [index, query]);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  React.useEffect(() => setActive(0), [query]);

  function go(item: SearchItem) {
    onClose();
    router.push(lp(`/${item.area}/${item.slug}`));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t.palette.title} className="max-w-xl">
      <div className="relative">
        <Search className="pointer-events-none absolute top-3 left-3 h-5 w-5 text-muted" aria-hidden="true" />
        <input
          autoFocus
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t.palette.placeholder}
          aria-label={t.palette.aria}
          aria-controls="palette-results"
          aria-activedescendant={results[active] ? `palette-${results[active].id}` : undefined}
          className="h-11 w-full rounded-full border border-border bg-surface-2 pr-4 pl-10 text-base outline-none focus:border-accent"
        />
      </div>
      <ul id="palette-results" role="listbox" className="mt-3 max-h-80 overflow-y-auto">
        {query && results.length === 0 && (
          <li className="px-3 py-6 text-center text-sm text-muted">{t.palette.noMatch(query)}</li>
        )}
        {results.map((r, i) => (
          <li
            key={r.id}
            id={`palette-${r.id}`}
            role="option"
            aria-selected={i === active}
            onMouseEnter={() => setActive(i)}
            onClick={() => go(r)}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2",
              i === active ? "bg-surface-2" : "hover:bg-surface-2/60",
            )}
          >
            <span
              className="font-mono text-xs"
              style={{ color: areaVar(r.area) }}
            >
              {pad2(r.number)}
            </span>
            <span className="flex-1">
              <span className="block font-medium">{r.name}</span>
              <span className="block truncate text-xs text-muted">{r.officialTranslation ?? r.official}</span>
            </span>
            <span className="text-xs text-muted">{areaNames[r.area]}</span>
          </li>
        ))}
        {!query && (
          <li className="px-3 py-4 text-sm text-muted">
            {t.palette.help}
          </li>
        )}
      </ul>
    </Modal>
  );
}

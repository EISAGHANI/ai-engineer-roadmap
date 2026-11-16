"use client";

import * as React from "react";

/**
 * Read and write one query parameter (e.g. ?project=build-rag) with the History API.
 * Unlike useSearchParams this needs no Suspense boundary, so pages stay fully static.
 * Opening pushes a history entry, so the browser Back button closes what was opened.
 */
export function useUrlParam(name: string) {
  const [value, setValue] = React.useState<string | null>(null);

  React.useEffect(() => {
    const read = () => setValue(new URLSearchParams(window.location.search).get(name));
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, [name]);

  const set = React.useCallback(
    (next: string | null) => {
      const url = new URL(window.location.href);
      if (next) {
        url.searchParams.set(name, next);
        window.history.pushState(null, "", url.pathname + url.search + url.hash);
      } else {
        url.searchParams.delete(name);
        window.history.replaceState(null, "", url.pathname + url.search + url.hash);
      }
      setValue(next);
    },
    [name],
  );

  return [value, set] as const;
}

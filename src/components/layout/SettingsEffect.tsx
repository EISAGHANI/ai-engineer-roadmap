"use client";

import { useEffect } from "react";
import { useSettings } from "@/lib/settings";
import { syncProgressWithServer, useProgress } from "@/lib/progress";

/**
 * 1. Loads the persisted settings and progress from localStorage after mount
 *    (both stores use skipHydration, so the server HTML and the first client render match).
 * 2. Syncs progress with Neon Postgres via /api/progress.
 * 3. Mirrors settings onto <html> data attributes so CSS can react to them.
 */
export function SettingsEffect() {
  const theme = useSettings((s) => s.theme);
  const simple = useSettings((s) => s.simpleMode);
  const reduce = useSettings((s) => s.reduceMotion);

  useEffect(() => {
    void useSettings.persist.rehydrate();
    void Promise.resolve(useProgress.persist.rehydrate()).then(() => {
      void syncProgressWithServer();
    });
  }, []);

  useEffect(() => {
    const el = document.documentElement;
    el.dataset.theme = theme;
    el.dataset.simple = simple ? "true" : "false";
    el.dataset.reduceMotion = reduce ? "true" : "false";
  }, [theme, simple, reduce]);

  return null;
}

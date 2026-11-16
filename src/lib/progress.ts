"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useState } from "react";

export interface ProgressState {
  /** conceptId -> ISO date when the user marked it as used */
  used: Record<string, string>;
  /** prerequisite id -> done */
  prereqs: Record<string, boolean>;
  toggleUsed: (conceptId: string) => void;
  setUsed: (conceptId: string, value: boolean) => void;
  togglePrereq: (id: string) => void;
  reset: () => void;
  exportJson: () => string;
  importJson: (json: string) => { ok: boolean; count: number };
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      used: {},
      prereqs: {},
      toggleUsed: (id) => get().setUsed(id, !get().used[id]),
      setUsed: (id, value) =>
        set((s) => {
          const used = { ...s.used };
          if (value) used[id] = new Date().toISOString();
          else delete used[id];
          return { used };
        }),
      togglePrereq: (id) => set((s) => ({ prereqs: { ...s.prereqs, [id]: !s.prereqs[id] } })),
      reset: () => set({ used: {}, prereqs: {} }),
      exportJson: () =>
        JSON.stringify(
          { version: 1, exportedAt: new Date().toISOString(), used: get().used, prereqs: get().prereqs },
          null,
          2,
        ),
      importJson: (json) => {
        try {
          const data = JSON.parse(json) as { used?: unknown; prereqs?: unknown };
          const used: Record<string, string> = {};
          if (data.used && typeof data.used === "object") {
            for (const [k, v] of Object.entries(data.used as Record<string, unknown>)) {
              if (typeof v === "string") used[k] = v;
            }
          }
          const prereqs: Record<string, boolean> = {};
          if (data.prereqs && typeof data.prereqs === "object") {
            for (const [k, v] of Object.entries(data.prereqs as Record<string, unknown>)) {
              prereqs[k] = Boolean(v);
            }
          }
          set({ used, prereqs });
          return { ok: true, count: Object.keys(used).length };
        } catch {
          return { ok: false, count: 0 };
        }
      },
    }),
    // Rehydrated after mount by <SettingsEffect /> so server and first client render match.
    { name: "roadmap-progress", skipHydration: true },
  ),
);

export { countUsed, streakDays } from "./progress-utils";

/**
 * Persisted stores are empty on the server and during the first client render.
 * Use this to avoid hydration mismatches when rendering progress-dependent UI.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

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

function syncToServer(method: "PATCH" | "PUT" | "DELETE", body?: unknown) {
  if (typeof window === "undefined" || typeof fetch !== "function") return;
  void fetch("/api/progress", {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  }).catch(() => {
    // Keep local progress intact if offline or API is unreachable.
  });
}

export async function syncProgressWithServer(): Promise<void> {
  if (typeof window === "undefined" || typeof fetch !== "function") return;
  try {
    const res = await fetch("/api/progress", { cache: "no-store" });
    if (!res.ok) return;
    const remote = (await res.json()) as {
      used?: Record<string, string>;
      prereqs?: Record<string, boolean>;
      authenticated?: boolean;
    };
    if (!remote.authenticated) return;

    const remoteUsed = remote.used ?? {};
    const remotePrereqs = remote.prereqs ?? {};
    const hasRemote = Object.keys(remoteUsed).length > 0 || Object.keys(remotePrereqs).length > 0;

    if (hasRemote) {
      useProgress.setState({ used: remoteUsed, prereqs: remotePrereqs });
    } else {
      const local = useProgress.getState();
      const hasLocal = Object.keys(local.used).length > 0 || Object.keys(local.prereqs).length > 0;
      if (hasLocal) {
        syncToServer("PUT", { used: local.used, prereqs: local.prereqs });
      }
    }
  } catch {
    // Keep local progress intact if offline or API is unreachable.
  }
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      used: {},
      prereqs: {},
      toggleUsed: (id) => get().setUsed(id, !get().used[id]),
      setUsed: (id, value) => {
        const usedAt = value ? new Date().toISOString() : undefined;
        set((s) => {
          const used = { ...s.used };
          if (usedAt) used[id] = usedAt;
          else delete used[id];
          return { used };
        });
        syncToServer("PATCH", { type: "concept", id, value, usedAt });
      },
      togglePrereq: (id) => {
        const nextValue = !get().prereqs[id];
        set((s) => ({ prereqs: { ...s.prereqs, [id]: nextValue } }));
        syncToServer("PATCH", { type: "prereq", id, value: nextValue });
      },
      reset: () => {
        set({ used: {}, prereqs: {} });
        syncToServer("DELETE");
      },
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
          syncToServer("PUT", { used, prereqs });
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

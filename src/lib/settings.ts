"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "dark" | "light";
export type AreaOrder = "learning" | "pdf";

interface SettingsState {
  theme: Theme;
  simpleMode: boolean;
  reduceMotion: boolean;
  areaOrder: AreaOrder;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  setSimpleMode: (v: boolean) => void;
  setReduceMotion: (v: boolean) => void;
  setAreaOrder: (o: AreaOrder) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      simpleMode: false,
      reduceMotion: false,
      areaOrder: "learning",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
      setSimpleMode: (simpleMode) => set({ simpleMode }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setAreaOrder: (areaOrder) => set({ areaOrder }),
    }),
    // Rehydrated after mount by <SettingsEffect /> so server and first client render match.
    { name: "roadmap-settings", skipHydration: true },
  ),
);

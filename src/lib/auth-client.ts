"use client";

import { create } from "zustand";
import { useProgress } from "./progress";

export interface ClientUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthState {
  user: ClientUser | null;
  loading: boolean;
  fetchMe: () => Promise<ClientUser | null>;
  login: (params: { email: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  register: (params: { name: string; email: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>()((set) => ({
  user: null,
  loading: true,
  fetchMe: async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      if (!res.ok) {
        set({ user: null, loading: false });
        return null;
      }
      const data = (await res.json()) as { user: ClientUser | null };
      set({ user: data.user ?? null, loading: false });
      return data.user ?? null;
    } catch {
      set({ user: null, loading: false });
      return null;
    }
  },
  login: async ({ email, password }) => {
    try {
      const currentProgress = useProgress.getState();
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          progress: {
            used: currentProgress.used,
            prereqs: currentProgress.prereqs,
          },
        }),
      });
      const data = (await res.json()) as {
        user?: ClientUser;
        progress?: { used: Record<string, string>; prereqs: Record<string, boolean> };
        error?: string;
      };
      if (!res.ok || !data.user) {
        return { ok: false, error: data.error ?? "Could not sign in." };
      }
      set({ user: data.user, loading: false });
      if (data.progress) {
        useProgress.setState({
          used: data.progress.used ?? {},
          prereqs: data.progress.prereqs ?? {},
        });
      }
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error while signing in." };
    }
  },
  register: async ({ name, email, password }) => {
    try {
      const currentProgress = useProgress.getState();
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          progress: {
            used: currentProgress.used,
            prereqs: currentProgress.prereqs,
          },
        }),
      });
      const data = (await res.json()) as {
        user?: ClientUser;
        progress?: { used: Record<string, string>; prereqs: Record<string, boolean> };
        error?: string;
      };
      if (!res.ok || !data.user) {
        return { ok: false, error: data.error ?? "Could not create account." };
      }
      set({ user: data.user, loading: false });
      if (data.progress) {
        useProgress.setState({
          used: data.progress.used ?? {},
          prereqs: data.progress.prereqs ?? {},
        });
      }
      return { ok: true };
    } catch {
      return { ok: false, error: "Network error while creating account." };
    }
  },
  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore network errors on logout
    }
    set({ user: null, loading: false });
    useProgress.setState({ used: {}, prereqs: {} });
  },
}));

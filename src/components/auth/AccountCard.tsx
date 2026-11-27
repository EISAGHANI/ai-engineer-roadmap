"use client";

import * as React from "react";
import { Cloud, LogIn, LogOut, UserPlus, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/lib/auth-client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/client";

export function AccountCard() {
  const t = useT().account;
  const user = useAuth((s) => s.user);
  const loading = useAuth((s) => s.loading);
  const login = useAuth((s) => s.login);
  const register = useAuth((s) => s.register);
  const logout = useAuth((s) => s.logout);

  const [mode, setMode] = React.useState<"login" | "register">("register");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [notice, setNotice] = React.useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);

    const res =
      mode === "register"
        ? await register({ name, email, password })
        : await login({ email, password });

    setSubmitting(false);
    if (!res.ok) {
      setError(res.error ?? t.fallbackError);
      return;
    }

    setPassword("");
    setNotice(mode === "register" ? t.created : t.signedIn);
  }

  return (
    <section
      id="account"
      className="mt-6 rounded-card border border-border bg-surface p-5"
      aria-labelledby="account-heading"
    >
      {loading ? (
        <div className="flex items-center gap-3 text-sm text-muted">
          <Cloud className="h-4 w-4 animate-pulse" aria-hidden="true" />
          {t.checking}
        </div>
      ) : user ? (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="account-heading" className="text-lg font-semibold">
                {user.name}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-ok">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                {t.synced}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              {t.signedInAsBefore}
              <span className="font-mono text-text">{user.email}</span>
              {t.signedInAsAfter}
            </p>
            {notice && <p className="mt-1 text-xs text-ok">{notice}</p>}
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              setNotice(null);
              void logout();
            }}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" /> {t.signOut}
          </Button>
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="account-heading" className="text-lg font-semibold">
                {t.saveTitle}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {t.saveText}
              </p>
            </div>
            <div className="inline-flex rounded-full border border-border bg-surface-2 p-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-colors",
                  mode === "register" ? "bg-accent text-accent-ink" : "text-muted hover:text-text",
                )}
              >
                <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                {t.createAccount}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium transition-colors",
                  mode === "login" ? "bg-accent text-accent-ink" : "text-muted hover:text-text",
                )}
              >
                <LogIn className="h-3.5 w-3.5" aria-hidden="true" />
                {t.signIn}
              </button>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-4 grid gap-3 sm:grid-cols-4">
            {mode === "register" && (
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-muted">{t.name}</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </label>
            )}
            <label className={cn("block", mode === "login" && "sm:col-span-2")}>
              <span className="mb-1 block text-xs font-medium text-muted">{t.email}</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-muted">{t.password}</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className="w-full rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </label>
            <div className="flex items-end">
              <Button type="submit" disabled={submitting} className="w-full justify-center">
                {submitting
                  ? mode === "register"
                    ? t.creating
                    : t.signingIn
                  : mode === "register"
                    ? t.createSubmit
                    : t.signInSubmit}
              </Button>
            </div>
          </form>

          {error && (
            <p className="mt-3 text-sm text-danger" role="alert">
              {error}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

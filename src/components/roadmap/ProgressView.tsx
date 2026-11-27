"use client";

import * as React from "react";
import Link from "next/link";
import { Download, Upload, Trash2, Flame } from "lucide-react";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Button } from "@/components/ui/Button";
import { AccountCard } from "@/components/auth/AccountCard";
import { useProgress, useHydrated, countUsed, streakDays } from "@/lib/progress";
import { areaVar, pad2, cn } from "@/lib/utils";
import type { Prerequisite } from "@/content/schema";
import { useLocalePath, useT } from "@/i18n/client";

interface ProgressViewProps {
  areas: Array<{
    id: string;
    name: string;
    number: number;
    concepts: Array<{ id: string; name: string; slug: string; number: number }>;
  }>;
  prerequisites: Prerequisite[];
}

export function ProgressView({ areas, prerequisites }: ProgressViewProps) {
  const t = useT();
  const lp = useLocalePath();
  const used = useProgress((s) => s.used);
  const prereqs = useProgress((s) => s.prereqs);
  const reset = useProgress((s) => s.reset);
  const exportJson = useProgress((s) => s.exportJson);
  const importJson = useProgress((s) => s.importJson);
  const hydrated = useHydrated();
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const total = hydrated ? countUsed(used) : 0;
  const streak = hydrated ? streakDays(used) : 0;
  const prereqDone = prerequisites.filter((p) => hydrated && prereqs[p.id]).length;

  function download() {
    const blob = new Blob([exportJson()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-roadmap-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    const r = importJson(text);
    setMessage(r.ok ? t.progress.imported(r.count) : t.progress.importFailed);
    e.target.value = "";
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl font-semibold sm:text-5xl">{t.progress.title}</h1>
      <p className="prose-max mt-3 text-muted">
        {t.progress.lead}
      </p>

      <AccountCard />

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label={t.progress.conceptsUsed} value={`${total} / 160`} />
        <Stat label={t.progress.streak} value={`${streak}`} icon={<Flame className="h-5 w-5 text-warn" aria-hidden="true" />} />
        <Stat label={t.progress.prerequisites} value={`${prereqDone} / ${prerequisites.length}`} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="secondary" onClick={download}>
          <Download className="h-4 w-4" aria-hidden="true" /> {t.progress.export}
        </Button>
        <Button variant="secondary" onClick={() => fileRef.current?.click()}>
          <Upload className="h-4 w-4" aria-hidden="true" /> {t.progress.import}
        </Button>
        <input ref={fileRef} type="file" accept="application/json" onChange={onFile} className="hidden" aria-label={t.progress.importAria} />
        <Button
          variant="ghost"
          onClick={() => {
            if (window.confirm(t.progress.resetConfirm)) {
              reset();
              setMessage(t.progress.resetDone);
            }
          }}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" /> {t.progress.reset}
        </Button>
        {message && (
          <span className="self-center text-sm text-muted" role="status">
            {message}
          </span>
        )}
      </div>

      <div className="mt-10 space-y-6">
        {areas.map((a) => {
          const done = hydrated ? countUsed(used, a.id) : 0;
          const color = areaVar(a.id);
          return (
            <section key={a.id} className="rounded-card border border-border bg-surface p-5" aria-labelledby={`pa-${a.id}`}>
              <div className="flex items-center gap-4">
                <ProgressRing value={done / 20} size={56} stroke={6} color={color} label={t.progress.areaProgress(a.name)}>
                  {done}
                </ProgressRing>
                <div className="flex-1">
                  <h2 id={`pa-${a.id}`} className="text-lg font-semibold">
                    <Link href={lp(`/${a.id}`)} className="hover:underline">
                      {pad2(a.number)} {a.name}
                    </Link>
                  </h2>
                  <p className="text-sm text-muted">{t.progress.usedOf(done)}</p>
                </div>
              </div>
              <ul className="mt-4 grid grid-cols-5 gap-1.5 sm:grid-cols-10">
                {a.concepts.map((c) => {
                  const isUsed = hydrated && Boolean(used[c.id]);
                  return (
                    <li key={c.id}>
                      <Link
                        href={lp(`/${a.id}/${c.slug}`)}
                        title={`${pad2(c.number)} ${c.name}${isUsed ? t.progress.usedSuffix : ""}`}
                        className={cn(
                          "flex h-8 items-center justify-center rounded-md font-mono text-xs transition-colors",
                          isUsed ? "text-accent-ink" : "bg-surface-2 text-muted hover:text-text",
                        )}
                        style={isUsed ? { backgroundColor: color } : undefined}
                      >
                        {pad2(c.number)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-card border border-border bg-surface p-5">
      <div className="flex items-center gap-2 text-sm text-muted">
        {icon}
        {label}
      </div>
      <div className="mt-1 font-mono text-3xl">{value}</div>
    </div>
  );
}

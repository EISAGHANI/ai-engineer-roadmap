"use client";

import { Checkbox } from "@/components/ui/Checkbox";
import { useProgress, useHydrated } from "@/lib/progress";
import type { Prerequisite } from "@/content/schema";
import { useT } from "@/i18n/client";

export function PrereqChecklist({ items }: { items: Prerequisite[] }) {
  const t = useT();
  const prereqs = useProgress((s) => s.prereqs);
  const toggle = useProgress((s) => s.togglePrereq);
  const hydrated = useHydrated();
  return (
    <ul className="mt-3 grid gap-2 sm:grid-cols-2">
      {items.map((p) => {
        const done = hydrated && Boolean(prereqs[p.id]);
        return (
          <li key={p.id} className="flex items-start gap-3 rounded-lg border border-border bg-surface px-4 py-3">
            <Checkbox checked={done} onChange={() => toggle(p.id)} label={t.prereq.done(p.name)} className="mt-0.5" />
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-muted">{p.description}</div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

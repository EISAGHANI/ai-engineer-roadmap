"use client";

import * as React from "react";
import Link from "next/link";
import { Baby, Globe, Code2, ExternalLink, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabPanel } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { Checkbox } from "@/components/ui/Checkbox";
import { useSettings } from "@/lib/settings";
import { useProgress, useHydrated } from "@/lib/progress";
import { DemoSlot, hasDemo } from "@/components/demos";
import { illustrations } from "@/components/illustrations";
import { areaVar, pad2 } from "@/lib/utils";
import { getQuizForConcept } from "@/content";
import { TopicQuiz } from "./TopicQuiz";
import type { ConceptView } from "./types";

type Layer = "kid" | "real" | "eng";

interface ConceptBodyProps {
  view: ConceptView;
  /** Called when a project chip is clicked (opens the project modal in place). */
  onOpenProject?: (projectId: string) => void;
  showNav?: boolean;
}

/**
 * The full content of a concept: official line, three explanation layers,
 * demo, projects, related. Used inside the expanded card and on the concept page.
 */
export function ConceptBody({ view, onOpenProject, showNav }: ConceptBodyProps) {
  const { concept: c, codeHtml, related, projects, prev, next } = view;
  const simple = useSettings((s) => s.simpleMode);
  const used = useProgress((s) => s.used);
  const setUsed = useProgress((s) => s.setUsed);
  const hydrated = useHydrated();
  const isUsed = hydrated && Boolean(used[c.id]);
  const color = areaVar(c.area);
  const [layer, setLayer] = React.useState<Layer>("kid");
  const idPrefix = `concept-${c.id}`;
  const quiz = getQuizForConcept(c.id);

  React.useEffect(() => {
    if (simple && layer === "eng") setLayer("kid");
  }, [simple, layer]);

  const demoName = hasDemo(c.area, c.demo) ? c.demo : undefined;
  const Illustration = !demoName && c.illustration ? illustrations[c.illustration] : undefined;

  const tabs = [
    { id: "kid", label: "Explain like I'm 8", icon: <Baby className="h-4 w-4" aria-hidden="true" /> },
    { id: "real", label: "In the real world", icon: <Globe className="h-4 w-4" aria-hidden="true" /> },
    ...(simple ? [] : [{ id: "eng", label: "For engineers", icon: <Code2 className="h-4 w-4" aria-hidden="true" /> }]),
  ];

  return (
    <article>
      <header className="flex items-start gap-3">
        <span className="font-mono text-2xl font-semibold" style={{ color }}>
          {pad2(c.number)}
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold">{c.name}</h2>
            <Badge color={color} mono>
              {c.tier === "base" ? "The base" : "Production level"}
            </Badge>
          </div>
          <p className="mt-1 text-muted">{c.official}</p>
        </div>
        <label className="flex shrink-0 flex-col items-center gap-1 text-[11px] text-muted">
          <Checkbox checked={isUsed} onChange={(v) => setUsed(c.id, v)} label={`I used ${c.name} in code`} color={color} />
          used it
        </label>
      </header>

      <div className="mt-5">
        <Tabs tabs={tabs} value={layer} onChange={(id) => setLayer(id as Layer)} idPrefix={idPrefix} />
        <TabPanel id="kid" idPrefix={idPrefix} active={layer === "kid"} className="mt-4">
          {c.kid ? (
            <p className="prose-max text-lg leading-relaxed">{c.kid}</p>
          ) : (
            <ComingSoon what="simple explanation" />
          )}
        </TabPanel>
        <TabPanel id="real" idPrefix={idPrefix} active={layer === "real"} className="mt-4">
          {c.realWorld ? (
            <div className="prose-max">
              <h3 className="text-lg font-semibold">{c.realWorld.title}</h3>
              <p className="mt-1 leading-relaxed">{c.realWorld.text}</p>
            </div>
          ) : (
            <ComingSoon what="real-world example" />
          )}
        </TabPanel>
        {!simple && (
          <TabPanel id="eng" idPrefix={idPrefix} active={layer === "eng"} className="mt-4">
            {c.engineering ? (
              <div className="space-y-4">
                <p className="prose-max leading-relaxed">{c.engineering.text}</p>
                {codeHtml ? (
                  <div className="text-sm" dangerouslySetInnerHTML={{ __html: codeHtml }} />
                ) : c.engineering.code ? (
                  <pre className="shiki overflow-x-auto">
                    <code>{c.engineering.code.source}</code>
                  </pre>
                ) : null}
                {c.engineering.pitfalls && c.engineering.pitfalls.length > 0 && (
                  <div className="rounded-lg border border-border bg-surface-2 p-3 text-sm">
                    <div className="mb-1 flex items-center gap-1 font-medium">
                      <AlertTriangle className="h-4 w-4 text-warn" aria-hidden="true" /> Pitfalls
                    </div>
                    <ul className="list-disc space-y-1 pl-5 text-muted">
                      {c.engineering.pitfalls.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {c.engineering.docsUrl && (
                  <a
                    href={c.engineering.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm underline-offset-4 hover:underline"
                    style={{ color }}
                  >
                    Official docs <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            ) : (
              <ComingSoon what="engineering deep-dive" />
            )}
          </TabPanel>
        )}
      </div>

      <section className="mt-6" aria-label="Try it">
        <h3 className="mb-2 text-sm font-medium text-muted">Try it</h3>
        {demoName ? (
          <DemoSlot area={c.area} name={demoName} />
        ) : Illustration ? (
          <div className="overflow-hidden rounded-card border border-border bg-surface-2">
            <Illustration />
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-card border border-dashed border-border text-sm text-muted">
            Interactive demo coming soon.
          </div>
        )}
      </section>

      {quiz && <TopicQuiz key={c.id} quiz={quiz} color={color} />}

      {projects.length > 0 && (
        <section className="mt-6" aria-label="Where you will build it">
          <h3 className="mb-2 text-sm font-medium text-muted">Where you&rsquo;ll build it</h3>
          <div className="flex flex-wrap gap-2">
            {projects.map((p) =>
              onOpenProject ? (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onOpenProject(p.id)}
                  className="rounded-full border border-border bg-surface-2 px-3 py-1 text-sm hover:border-accent"
                >
                  {p.title}
                </button>
              ) : (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="rounded-full border border-border bg-surface-2 px-3 py-1 text-sm hover:border-accent"
                >
                  {p.title}
                </Link>
              ),
            )}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-6" aria-label="Related concepts">
          <h3 className="mb-2 text-sm font-medium text-muted">Related concepts</h3>
          <div className="flex flex-wrap gap-2">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/${r.area}/${r.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm hover:bg-surface-2"
                style={{ borderColor: areaVar(r.area) }}
              >
                <span className="font-mono text-xs" style={{ color: areaVar(r.area) }}>
                  {pad2(r.number)}
                </span>
                {r.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {showNav && (prev || next) && (
        <nav className="mt-8 flex justify-between gap-3 border-t border-border pt-4 text-sm" aria-label="Previous and next concept">
          {prev ? (
            <Link href={prev.href} className="inline-flex items-center gap-1 text-muted hover:text-text">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" /> {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={next.href} className="inline-flex items-center gap-1 text-muted hover:text-text">
              {next.name} <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </article>
  );
}

function ComingSoon({ what }: { what: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted">
      The {what} for this concept is being written. The official one-liner above is the summary for now.
    </p>
  );
}

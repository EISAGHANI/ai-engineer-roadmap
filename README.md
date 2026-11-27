# AI Engineer Roadmap — interactive learning site

An animated, interactive website for the **AI Engineer Roadmap** by [@ai.learnvora](https://www.instagram.com/ai.learnvora/) (LearnVora, Edition November 2026): 8 areas · 20 concepts each · 160 things to master.

Every one of the 160 concepts is explained three ways — **"Explain like I'm 8"**, **"In the real world"** and **"For engineers"** (with code) — with an interactive demo, links to the project you build it in, and a checkbox you tick only once you have used the concept in code.

> **Credit.** The roadmap, its structure, the concept names and the one-line definitions belong to LearnVora. This site is a learning companion built on top of it, not a replacement. See [LICENSE](./LICENSE).

## Languages

The site is available in **English** (the original URLs, e.g. `/rag/embeddings`) and **German** (`/de/rag/embeddings`). A switch in the header moves between the two versions of the same page; `hreflang` alternates and a bilingual sitemap tell search engines about both.

- UI strings: `src/i18n/messages/en.ts` and `de.ts` (same keys, checked by TypeScript and `tests/i18n.test.ts`).
- Content: `src/content/i18n/de/` holds German area summaries, phases, rules, projects and all 160 concepts (`kid`, `realWorld`, `engineering` text and pitfalls, plus a translation of each `official` line). Ids, slugs, code samples, demos and links are never translated; anything missing falls back to English.
- Routing: every page lives under `src/app/[locale]/`; `src/middleware.ts` rewrites unprefixed URLs to English and serves German under `/de`.
- Still English on German pages: code samples, the interactive demos and the quiz questions.

## Stack

Next.js (App Router, TypeScript) · Tailwind CSS v4 · [Motion](https://motion.dev) · Shiki · Zustand (progress in `localStorage`) · Fuse.js (⌘K search) · Zod-validated content · Vitest · GitHub Actions · Vercel.

## Run it

```bash
npm install
cp .env.example .env.local   # optional: set NEXT_PUBLIC_SITE_URL and GITHUB_TOKEN
npm run dev                  # http://localhost:3000
```

Useful scripts:

| Script | What it does |
| --- | --- |
| `npm run build` | Production build: 8 area pages, 160 concept pages, project pages, sitemap |
| `npm run test` | Content schema, 160-count, id resolution, demo registry, progress helpers |
| `npm run check:kid` | Plain-language check for every "Explain like I'm 8" line |
| `npm run lint` / `npm run typecheck` | ESLint and `tsc --noEmit` |

## Project layout

```
src/
  app/[locale]/        routes (English unprefixed, German under /de): /, /start, /[area], /[area]/[slug], /projects, /projects/[id], /portfolio, /progress, /about
  components/
    ui/                Button, Card, Badge, Tabs, Modal, ProgressRing, Switch, Checkbox, Skeleton
    layout/            Header (search, simple mode, reduce motion, theme), Footer, CommandPalette
    roadmap/           DotGrid, AreaCard/AreaGrid, PhaseTimeline, ConceptCard, ConceptBody, AreaView, ProgressView
    demos/             one interactive demo per concept, lazily loaded through demos/index.tsx
    illustrations/     static SVGs for concepts without a demo yet
    projects/          ProjectCard, ProjectModal, ProjectDetails (live GitHub stats via ISR)
  i18n/                locales, UI dictionaries (messages/en.ts, de.ts), LocaleProvider, hreflang helpers
  content/
    schema.ts          Zod schemas (Concept, Area, Project, Phase)
    localized.ts       getContent(locale): English source merged with a translation
    i18n/de/           German content: areas, phases, projects, concepts/<area>.ts
    areas.ts phases.ts projects.ts
    concepts/<area>.ts 20 concepts per area — the `official` line is verbatim from the roadmap
  lib/                 progress store, settings, search index, motion helpers, GitHub fetch, view builders
scripts/               check-kid-text.mjs + jargon/everyday word lists
tests/                 Vitest
```

## Adding content

Read [CONTENT-GUIDE.md](./CONTENT-GUIDE.md). In short: every concept in `src/content/concepts/<area>.ts` gets `kid`, `realWorld`, `engineering` (text, code, pitfalls, docsUrl), `related`, `projects`, `keywords`, and a `demo` (component key registered in `src/components/demos/index.tsx`) or an `illustration`. The build fails if a field breaks the schema; `npm run check:kid` fails if a kid line uses jargon.

## Adding a project

Add an entry to `src/content/projects.ts` with `github: "owner/repo"`, the concept ids it proves and a `status`. Stars, language and last push are fetched from the GitHub API at build time and revalidated hourly. Optional: a screenshot in `public/projects/<id>.webp` and a `demoUrl`.

## Deploy

Push to `main`; Vercel builds from the repo. Environment variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GITHUB_OWNER`, optional `GITHUB_TOKEN` (read-only, raises the API limit). CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests, the kid-text check and a production build on every push and PR.

## Status

See [PLAN.md](./PLAN.md) for the step-by-step build plan and what is done. Current state: full scaffold, all 160 concepts seeded with their official definitions, the three explanation layers and four demos for LLM 01–05, projects and progress wired up. The remaining explanation layers and demos are being written area by area.

Built by [Mohammad Eisa](https://github.com/EISAGHANI).

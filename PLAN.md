# Build plan and status

Source of truth for how this site is built. The full plan (design system, data model, demo ideas, content guide) is in the planning document; this file is the working checklist for the implementing agent.

Counts to keep true: **8 areas · 20 concepts each · 160 concepts · 8 build-this projects · 3 portfolio projects · 8 phases (0–7)**.

## Steps

- [x] **Step 0 — Inputs confirmed.** Roadmap read (11 pages), counts verified, author repos recorded in `projects.ts`.
- [x] **Step 1 — Scaffold.** Next.js App Router + TypeScript + Tailwind v4, folder layout, README, LICENSE, CONTENT-GUIDE, CI workflow. _Note: scaffolded by hand (no `create-next-app`), first real `npm install`/`next build` runs in CI and on Vercel._
- [x] **Step 2 — Content schema + seed.** `schema.ts`, `areas.ts`, `phases.ts`, `projects.ts`, 8 × `concepts/<area>.ts` with all 160 official one-liners verbatim; `tests/content.test.ts`.
- [x] **Step 3 — Design tokens, layout, UI primitives, motion helpers.**
- [x] **Step 4 — Progress store (Zustand + localStorage) and ⌘K search (Fuse).**
- [x] **Step 5 — Home (160-dot grid, area tiles, rules, portfolio teaser) and Start (prereqs, phase timeline, hours slider).**
- [x] **Step 6 — Area pages, concept cards with three layers, 160 concept pages, demo registry.**
- [ ] **Step 7 — Write the content, one area at a time** (`kid`, `realWorld`, `engineering`, `related`, `keywords`), in phase order. Run `npm run check:kid` after each file. Commit per area: `content: <area> concepts 01-20`.
  - [x] 7a LLM (all 20)
  - [x] 7b RAG (all 20)
  - [x] 7c AI Agents (all 20)
  - [ ] 7d Evals
  - [ ] 7e Deployment
  - [ ] 7f Backend
  - [ ] 7g AI System Design
  - [ ] 7h AI Security
  - [ ] When 7a is complete, make `kid`, `realWorld`, `engineering` required in `schema.ts` for the LLM area (and per area as each finishes), so placeholders cannot ship.
- [ ] **Step 8 — Interactive demos, one area at a time.** Every base concept (01–10) gets a `demo`; every production concept gets a `demo` or an `illustration`. Follow the demo contract (`DemoFrame`, 320 px, Reset, keyboard, reduced-motion step mode). Register in `src/components/demos/index.tsx`.
  - [x] 8a LLM base concepts 01–10: Tokenizer, TransformerStack (illustration), Attention, ContextWindow, KvCache, Temperature, SystemPrompt, FewShot, ChainOfThought, ReasoningModel
  - [x] 8a LLM production concepts 11–20: StructuredOutput, PromptCaching, TokenPricing, Hallucination, Multimodal, LoRA, QLoRA, Quantization, Distillation, OpenVsClosed
  - [x] 8b RAG: 20 demos (embedding map, cosine, chunking, vector DB, pgvector SQL, HNSW hops, filters, BM25, RRF, rerank, query rewrite, HyDE, contextual retrieval, parent-child, parsing, citations, GraphRAG, agentic RAG, Recall@k, MRR/nDCG)
  - [x] 8c AI Agents: 20 demos (tool calling, agent loop, ReAct, planning, reflection, short/long-term memory, MCP server/client, skills, handoffs, orchestrator-worker, LangGraph, Agents SDK trace, checkpoints, human-in-the-loop, context engineering, compaction, stop conditions, A2A)
  - [ ] 8d–8h other areas
- [x] **Step 9 — Projects, portfolio, project modal** with live GitHub stats (ISR 1 h), `?project=` deep links, `/projects/[id]` pages with README.
  - [ ] Create the project repositories named in `projects.ts` (or rename them there) and add screenshots to `public/projects/`.
- [x] **Step 10 — Progress page** (rings, 160-tick grid, streak, export/import, reset), theme / simple mode / reduce-motion toggles, About, 404.
  - [ ] Share card as PNG.
  - [ ] Playwright smoke tests (tick → reload → progress page; project modal; ⌘K search).
- [x] **Step 11 — CI** (lint, typecheck, unit tests, kid-text check, build).
  - [ ] Lighthouse CI with budgets (Performance 0.9, Accessibility 0.95, Best Practices 0.9, SEO 0.9) on `/`, `/rag`, `/rag/embeddings`.
  - [ ] Bundle-size check (First Load JS ≤ 180 KB per route).
  - [ ] Vercel project connected; `NEXT_PUBLIC_SITE_URL` set to the production URL.
- [ ] **Step 12 — Fresh-eyes review** of 10 random concept pages by an agent that has not seen the code; fix jargon leaks and broken links; record in `docs/review-1.md`.

## Conventions

- Conventional Commits: `feat:`, `content:`, `fix:`, `chore:`, `test:`.
- Never reword the `official` one-liners. They are the roadmap author's text.
- Kid lines: ≤ 220 characters, ≤ 2 sentences, no jargon (see `scripts/jargon.json`), one everyday object.
- One recurring scene per area for the real-world analogies (LLM: the well-read parrot in a library; RAG: a school library; Agents: a robot running errands in a town; Evals: a school test and a fair teacher; System Design: a busy restaurant kitchen; Security: a castle with gates and guards; Deployment: a food truck; Backend: a post office).
- Every animation must teach something. `prefers-reduced-motion` and the in-app toggle must stop all autonomous motion.

# Content guide

Each concept is written in three voices for three readers, in this order. Write the `kid` line **last**, after the engineering text, so it is a true simplification and not a vague one.

## The three layers

| Layer | Reader | Length | Rules |
| --- | --- | --- | --- |
| `kid` | An 8-year-old or a non-technical adult | 1–2 sentences, max 220 characters | Everyday words only. One idea. Uses a thing the reader has touched (toy, sandwich, school bag, football). No acronyms, no numbers above 100. |
| `realWorld` | Any adult | `title` + 2–4 sentences (max 500 chars) | One concrete scene with a person doing something. The scene maps 1:1 onto the mechanism (who is the model, what is the prompt, what is the cache). Keep the same scene across an area. |
| `engineering` | A developer | 2–5 sentences + 5–20 lines of code + up to 4 pitfalls + 1 docs link | Precise terms, the real names of libraries and parameters, what breaks in production. The code shows the concept, not a whole app. |

`official` is copied character-for-character from the roadmap. It is the only text that must never be reworded.

## Recurring scenes per area

| Area | Scene | Cast |
| --- | --- | --- |
| LLM | A very well-read parrot in a library | Parrot = model, librarian = you, note cards = tokens, reading desk = context window |
| RAG | A school library with a helpful librarian | Books = documents, index cards = embeddings, shelf labels = metadata, two librarians = hybrid search |
| AI Agents | A robot helper doing errands in a town | Shopping list = plan, shops = tools, notebook = memory, town hall rules = MCP |
| Evals | A school test and a fair teacher | Answer key = golden dataset, teacher = judge, marking scheme = rubric |
| AI System Design | A busy restaurant kitchen | Orders = requests, chefs = models, the pass = queue, menu board = cache |
| AI Security | A castle with gates and guards | Visitors = inputs, guards = guardrails, keys = secrets, spies = injection |
| Deployment | A food truck that must open every day | Truck = container, route plan = CI/CD, spare truck = rollback |
| Backend | A post office | Letters = requests, stamps = status codes, PO box = database, queue = message queue |

## Plain-language check

`npm run check:kid` reads every `concepts/*.ts` file and fails on:

- a `kid` string that contains a word from `scripts/jargon.json` (unless the word is in the concept's own name),
- a `kid` string longer than 220 characters or with more than 2 sentences.

It warns when no everyday noun from `scripts/everyday.json` appears. The same rules run in `tests/content.test.ts`.

## Other fields

- `related`: 2–4 ids of other concepts, cross-area allowed (e.g. `llm-05` KV Cache → `system-design-11` PagedAttention). A test checks every id resolves.
- `projects`: project ids from `projects.ts` that use this concept.
- `keywords`: 3–8 search words a learner might type ("word pieces", "price", "count").
- `demo`: the key of a component registered in `src/components/demos/index.tsx`. Required for concepts 01–10 before an area is called done.
- `illustration`: the key of a static SVG in `src/components/illustrations/index.tsx`, for concepts that have no demo yet.

## Demo contract

A demo lives in `src/components/demos/<area>/<Name>.tsx`, exports a default component with no props, renders inside `DemoFrame` (fixed 320 px box, visible title, a Reset control), works with keyboard only, never requires typing (pre-fill a friendly sentence where text input helps), and reads `useMotionSafe()` to replace autoplay with a Step button when motion is reduced.

## Worked example

See `llm-05` (KV Cache) in `src/content/concepts/llm.ts` and `src/components/demos/llm/KvCacheDemo.tsx`.

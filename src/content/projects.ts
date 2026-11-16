import type { ProjectInput } from "./schema";

/**
 * Projects shown on the site.
 * - "build-this": the one project each roadmap area ends with (brief is verbatim from the PDF).
 * - "portfolio": the three finish-line projects from page 11.
 * - "author": the site owner's own repositories.
 * `github` is "owner/repo"; live stars and last push are fetched from the GitHub API.
 */
const projects: ProjectInput[] = [
  {
    id: "build-llm",
    kind: "build-this",
    area: "llm",
    title: "Command-line chatbot",
    brief:
      "A command-line chatbot with a system prompt, streaming replies, a JSON output mode and a live token + cost counter for every message.",
    github: "EISAGHANI/roadmap-01-llm-chatbot",
    concepts: ["llm-01", "llm-06", "llm-07", "llm-11", "llm-13", "system-design-06", "backend-04"],
    status: "planned",
  },
  {
    id: "build-rag",
    kind: "build-this",
    area: "rag",
    title: "Chat with your PDFs",
    brief:
      "'Chat with your PDFs': parse, chunk, embed into pgvector, hybrid search + reranking, answers with citations. Measure Recall@5 on 30 test questions.",
    github: "EISAGHANI/roadmap-02-chat-with-pdfs",
    concepts: [
      "rag-01",
      "rag-03",
      "rag-05",
      "rag-08",
      "rag-09",
      "rag-10",
      "rag-15",
      "rag-16",
      "rag-19",
    ],
    status: "planned",
  },
  {
    id: "build-agents",
    kind: "build-this",
    area: "agents",
    title: "Research agent with its own MCP server",
    brief:
      "A research agent with web search and page-fetch tools, a written plan, a step limit, notes saved as memory, and one MCP server you wrote yourself.",
    github: "EISAGHANI/roadmap-03-research-agent",
    concepts: ["agents-01", "agents-02", "agents-04", "agents-07", "agents-08", "agents-19"],
    status: "planned",
  },
  {
    id: "build-evals",
    kind: "build-this",
    area: "evals",
    title: "Evals for the RAG app",
    brief:
      "Add 50 golden questions to your RAG app, an LLM judge for faithfulness and relevance, Langfuse tracing, and a CI check that fails when scores drop.",
    github: "EISAGHANI/roadmap-02-chat-with-pdfs",
    concepts: ["evals-01", "evals-03", "evals-06", "evals-07", "evals-11", "evals-15", "evals-16"],
    status: "planned",
  },
  {
    id: "build-system-design",
    kind: "build-this",
    area: "system-design",
    title: "Small AI gateway",
    brief:
      "Put a small AI gateway in front of your app: routing between two models, fallback, semantic cache, per-user token budget and a latency + cost dashboard.",
    github: "EISAGHANI/roadmap-05-ai-gateway",
    concepts: [
      "system-design-01",
      "system-design-02",
      "system-design-03",
      "system-design-05",
      "system-design-07",
      "system-design-20",
      "llm-05",
    ],
    status: "planned",
  },
  {
    id: "build-security",
    kind: "build-this",
    area: "security",
    title: "Red-team your own agent",
    brief:
      "Red-team your own agent with 20 injection and jailbreak prompts. Then add guardrails, output checks, tool permissions and an approval step, and test again.",
    github: "EISAGHANI/roadmap-03-research-agent",
    concepts: [
      "security-01",
      "security-03",
      "security-05",
      "security-06",
      "security-09",
      "security-14",
      "security-20",
    ],
    status: "planned",
  },
  {
    id: "build-deployment",
    kind: "build-this",
    area: "deployment",
    title: "Dockerize and deploy the RAG app",
    brief:
      "Dockerize your RAG app and deploy it with GitHub Actions. Add an eval gate, a health check, versioned prompts and a one-step rollback.",
    github: "EISAGHANI/roadmap-02-chat-with-pdfs",
    concepts: [
      "deployment-01",
      "deployment-04",
      "deployment-05",
      "deployment-06",
      "deployment-16",
      "deployment-18",
      "deployment-20",
    ],
    status: "planned",
  },
  {
    id: "build-backend",
    kind: "build-this",
    area: "backend",
    title: "FastAPI service with streaming LLM answers",
    brief:
      "A FastAPI service with JWT login, Postgres, a Redis cache, a background worker that ingests documents, rate limiting, and an SSE endpoint that streams LLM answers.",
    github: "EISAGHANI/roadmap-08-fastapi-service",
    concepts: [
      "backend-01",
      "backend-03",
      "backend-04",
      "backend-06",
      "backend-08",
      "backend-11",
      "backend-13",
      "backend-14",
    ],
    status: "planned",
  },
  {
    id: "portfolio-docs-assistant",
    kind: "portfolio",
    area: "rag",
    title: "Docs assistant for a real company",
    brief:
      "RAG over 200+ real documents, hybrid search, citations, an eval suite with 50 questions, deployed behind auth.",
    github: "EISAGHANI/documind-ai",
    concepts: ["rag-09", "rag-16", "evals-01", "backend-06", "system-design-17"],
    evidence: { liveDemo: false },
    status: "in-progress",
  },
  {
    id: "portfolio-agent",
    kind: "portfolio",
    area: "agents",
    title: "Agent that does a real job",
    brief:
      "An agent with 3-5 tools (one of them your own MCP server), approvals for risky steps, traces and a step budget.",
    concepts: ["agents-01", "agents-08", "agents-16", "evals-15", "agents-19"],
    evidence: { liveDemo: false },
    status: "planned",
  },
  {
    id: "portfolio-gateway",
    kind: "portfolio",
    area: "system-design",
    title: "AI gateway",
    brief:
      "One API in front of several models: routing, fallbacks, semantic cache, per-user budgets and a cost dashboard.",
    concepts: [
      "system-design-01",
      "system-design-02",
      "system-design-03",
      "system-design-05",
      "evals-19",
    ],
    evidence: { liveDemo: false },
    status: "planned",
  },
  {
    id: "documind-ai",
    kind: "author",
    area: "rag",
    title: "DocuMind AI",
    brief:
      "A multi-tenant RAG platform for enterprise documents: upload, chunk, embed, search with citations, with separate data per tenant.",
    github: "EISAGHANI/documind-ai",
    concepts: [
      "rag-01",
      "rag-03",
      "rag-05",
      "rag-09",
      "rag-16",
      "system-design-17",
      "security-17",
      "backend-13",
    ],
    status: "in-progress",
  },
];

/** The four things page 11 says every portfolio project should show. */
export const portfolioEvidence = [
  { key: "liveDemo", label: "A live demo link and a short video of it working." },
  {
    key: "evalResults",
    label: "Your eval results: what you measured, the score before and after your changes.",
  },
  { key: "costLatency", label: "Cost and latency per request, and how you brought them down." },
  { key: "security", label: "What you did about security: injection tests, permissions, secrets." },
] as const;

export default projects;

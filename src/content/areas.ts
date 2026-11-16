import type { Area } from "./schema";

/**
 * The 8 areas of the AI Engineer Roadmap (LearnVora, Nov 2026).
 * `number` is the area number as printed in the PDF; learning order comes from phases.ts.
 */
const areas: Area[] = [
  {
    id: "llm",
    number: 1,
    code: "LLM",
    name: "LLM",
    summary: "How the model works inside, and how to talk to it so you get what you want.",
    phase: [1],
    weeks: "3-6",
    color: "area-llm",
    buildThis: "build-llm",
    learnFrom: [
      { label: "Hugging Face LLM Course", url: "https://huggingface.co/learn/llm-course" },
      { label: "Attention Is All You Need (paper)", url: "https://arxiv.org/abs/1706.03762" },
      {
        label: "Claude prompt engineering guide",
        url: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview",
      },
    ],
  },
  {
    id: "rag",
    number: 2,
    code: "RAG",
    name: "RAG",
    summary: "Make the model answer from your own documents instead of its memory.",
    phase: [2],
    weeks: "7-10",
    color: "area-rag",
    buildThis: "build-rag",
    learnFrom: [
      { label: "pgvector", url: "https://github.com/pgvector/pgvector" },
      {
        label: "Anthropic: Contextual Retrieval",
        url: "https://www.anthropic.com/news/contextual-retrieval",
      },
      { label: "Sentence Transformers (embeddings)", url: "https://sbert.net/" },
    ],
  },
  {
    id: "agents",
    number: 3,
    code: "AGT",
    name: "AI Agents",
    summary: "Models that use tools in a loop until the job is done.",
    phase: [3],
    weeks: "11-14",
    color: "area-agents",
    buildThis: "build-agents",
    learnFrom: [
      { label: "Model Context Protocol", url: "https://modelcontextprotocol.io/" },
      {
        label: "Anthropic: Building effective agents",
        url: "https://www.anthropic.com/engineering/building-effective-agents",
      },
      { label: "LangGraph docs", url: "https://langchain-ai.github.io/langgraph/" },
      { label: "OpenAI Agents SDK", url: "https://openai.github.io/openai-agents-python/" },
    ],
  },
  {
    id: "evals",
    number: 4,
    code: "EVL",
    name: "Evals",
    summary: "How you prove the AI works, and catch it the day it stops working.",
    phase: [4],
    weeks: "15-17",
    color: "area-evals",
    buildThis: "build-evals",
    learnFrom: [
      {
        label: "Hamel Husain: Your AI product needs evals",
        url: "https://hamel.dev/blog/posts/evals/",
      },
      { label: "Langfuse docs", url: "https://langfuse.com/docs" },
      {
        label: "OpenTelemetry GenAI conventions",
        url: "https://opentelemetry.io/docs/specs/semconv/gen-ai/",
      },
    ],
  },
  {
    id: "system-design",
    number: 5,
    code: "SYS",
    name: "AI System Design",
    summary: "Make AI apps fast, reliable and affordable when real traffic arrives.",
    phase: [6],
    weeks: "21-23",
    color: "area-system-design",
    buildThis: "build-system-design",
    learnFrom: [
      { label: "vLLM docs", url: "https://docs.vllm.ai/" },
      { label: "PagedAttention paper", url: "https://arxiv.org/abs/2309.06180" },
      { label: "Speculative decoding paper", url: "https://arxiv.org/abs/2211.17192" },
    ],
  },
  {
    id: "security",
    number: 6,
    code: "SEC",
    name: "AI Security",
    summary: "LLM apps can be attacked with plain text. Learn the attacks, then the defences.",
    phase: [7],
    weeks: "24-26",
    color: "area-security",
    buildThis: "build-security",
    learnFrom: [
      { label: "OWASP Top 10 for LLM Applications", url: "https://genai.owasp.org/llm-top-10/" },
      {
        label: "Simon Willison on prompt injection",
        url: "https://simonwillison.net/series/prompt-injection/",
      },
    ],
  },
  {
    id: "deployment",
    number: 7,
    code: "OPS",
    name: "Deployment",
    summary: "Ship it, keep it running, and roll it back when something breaks.",
    phase: [5],
    weeks: "18-20",
    color: "area-deployment",
    buildThis: "build-deployment",
    learnFrom: [
      { label: "Docker: Get started", url: "https://docs.docker.com/get-started/" },
      {
        label: "Kubernetes Basics tutorial",
        url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
      },
      { label: "GitHub Actions docs", url: "https://docs.github.com/en/actions" },
      { label: "Ollama", url: "https://ollama.com/" },
    ],
  },
  {
    id: "backend",
    number: 8,
    code: "API",
    name: "Backend",
    summary: "Every AI product is a backend with a model inside it.",
    phase: [0, 5],
    weeks: "1-2, 18-20",
    color: "area-backend",
    buildThis: "build-backend",
    learnFrom: [
      { label: "FastAPI docs", url: "https://fastapi.tiangolo.com/" },
      { label: "Pydantic docs", url: "https://docs.pydantic.dev/" },
      {
        label: "MDN: HTTP status codes",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status",
      },
      { label: "Redis docs", url: "https://redis.io/docs/" },
    ],
  },
];

export default areas;

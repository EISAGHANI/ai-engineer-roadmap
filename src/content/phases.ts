import type { Phase, Prerequisite } from "./schema";

/** Suggested order from page 2 of the roadmap: about 6 months at 10-12 hours a week. */
const phases: Phase[] = [
  {
    number: 0,
    weeks: "1-2",
    name: "Foundations",
    description: "Python, Git, basic SQL, and Backend 01-10 (APIs, HTTP, async, streaming, auth).",
    areas: ["backend"],
  },
  {
    number: 1,
    weeks: "3-6",
    name: "LLM",
    description: "How models work, prompting, structured outputs, cost. Area 01.",
    areas: ["llm"],
  },
  {
    number: 2,
    weeks: "7-10",
    name: "RAG",
    description: "Search your own documents and answer with citations. Area 02.",
    areas: ["rag"],
  },
  {
    number: 3,
    weeks: "11-14",
    name: "AI Agents",
    description:
      "Tools, the agent loop, memory, MCP. Read Security 01-04 before you give an agent real tools. Area 03.",
    areas: ["agents"],
  },
  {
    number: 4,
    weeks: "15-17",
    name: "Evals",
    description: "Test sets, judges, tracing. From here on, every change is measured. Area 04.",
    areas: ["evals"],
  },
  {
    number: 5,
    weeks: "18-20",
    name: "Deployment + Backend 11-20",
    description: "Ship your app: Docker, CI/CD, queues, caching, rate limits. Areas 07 and 08.",
    areas: ["deployment", "backend"],
  },
  {
    number: 6,
    weeks: "21-23",
    name: "AI System Design",
    description: "Routing, caching, serving, cost. Make it hold up under real traffic. Area 05.",
    areas: ["system-design"],
  },
  {
    number: 7,
    weeks: "24-26",
    name: "AI Security",
    description: "Injection, guardrails, permissions, red teaming. Area 06.",
    areas: ["security"],
  },
];

export const prerequisites: Prerequisite[] = [
  {
    id: "python",
    name: "Python",
    description: "Functions, classes, virtual environments, pip, reading other people's code.",
  },
  {
    id: "git",
    name: "Git and GitHub",
    description: "Commit, branch, pull request. Every project in this roadmap goes on GitHub.",
  },
  {
    id: "sql",
    name: "Basic SQL",
    description: "SELECT, JOIN, INDEX. You will store everything in Postgres.",
  },
  {
    id: "llm-call",
    name: "One LLM API call",
    description:
      "Get an API key from any provider and print a reply from Python. That's enough to begin.",
  },
];

export const rules = [
  {
    title: "01-10 first.",
    text: "In every area the first ten concepts are the base. Come back for 11-20 after you have shipped something.",
  },
  {
    title: "Build after every area.",
    text: "Each area page ends with one project. Six small shipped projects beat sixty tutorials.",
  },
  {
    title: "Measure from Phase 4 on.",
    text: "Once you know evals, every prompt or model change gets tested before it goes live.",
  },
];

export const HOURS_PER_WEEK_DEFAULT = 11;
export const TOTAL_WEEKS = 26;

export default phases;

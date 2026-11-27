import type { ContentTranslation } from "../types";
import llm from "./concepts/llm";
import rag from "./concepts/rag";
import agents from "./concepts/agents";
import evals from "./concepts/evals";
import systemDesign from "./concepts/system-design";
import security from "./concepts/security";
import deployment from "./concepts/deployment";
import backend from "./concepts/backend";

/**
 * Deutsche Inhalte. Die offiziellen Einzeiler der Roadmap bleiben im englischen
 * Original (`official`); hier steht nur ihre Übersetzung.
 */
const de: ContentTranslation = {
  areas: {
    llm: {
      summary: "Wie das Modell innen funktioniert und wie du mit ihm sprichst, damit du bekommst, was du willst.",
      learnFrom: {
        "https://huggingface.co/learn/llm-course": "Hugging Face LLM-Kurs",
        "https://arxiv.org/abs/1706.03762": "Attention Is All You Need (Paper)",
        "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview": "Claude: Leitfaden zum Prompt Engineering",
      },
    },
    rag: {
      summary: "Lass das Modell aus deinen eigenen Dokumenten antworten statt aus seinem Gedächtnis.",
      learnFrom: {
        "https://sbert.net/": "Sentence Transformers (Embeddings)",
      },
    },
    agents: {
      name: "KI-Agenten",
      summary: "Modelle, die in einer Schleife Werkzeuge nutzen, bis die Aufgabe erledigt ist.",
      learnFrom: {
        "https://langchain-ai.github.io/langgraph/": "LangGraph-Doku",
      },
    },
    evals: {
      summary: "Wie du beweist, dass die KI funktioniert, und merkst, an welchem Tag sie aufhört zu funktionieren.",
      learnFrom: {
        "https://langfuse.com/docs": "Langfuse-Doku",
        "https://opentelemetry.io/docs/specs/semconv/gen-ai/": "OpenTelemetry-Konventionen für GenAI",
      },
    },
    "system-design": {
      name: "KI-Systemdesign",
      summary: "Mach KI-Apps schnell, zuverlässig und bezahlbar, wenn echter Traffic kommt.",
      learnFrom: {
        "https://docs.vllm.ai/": "vLLM-Doku",
        "https://arxiv.org/abs/2309.06180": "PagedAttention (Paper)",
        "https://arxiv.org/abs/2211.17192": "Speculative Decoding (Paper)",
      },
    },
    security: {
      name: "KI-Sicherheit",
      summary: "LLM-Apps lassen sich mit einfachem Text angreifen. Lerne die Angriffe, dann die Abwehr.",
      learnFrom: {
        "https://genai.owasp.org/llm-top-10/": "OWASP Top 10 für LLM-Anwendungen",
        "https://simonwillison.net/series/prompt-injection/": "Simon Willison über Prompt Injection",
      },
    },
    deployment: {
      summary: "Bring es live, halte es am Laufen und rolle es zurück, wenn etwas kaputtgeht.",
      learnFrom: {
        "https://docs.docker.com/get-started/": "Docker: Erste Schritte",
        "https://kubernetes.io/docs/tutorials/kubernetes-basics/": "Kubernetes-Grundlagen (Tutorial)",
        "https://docs.github.com/en/actions": "GitHub-Actions-Doku",
      },
    },
    backend: {
      summary: "Jedes KI-Produkt ist ein Backend mit einem Modell darin.",
      learnFrom: {
        "https://fastapi.tiangolo.com/": "FastAPI-Doku",
        "https://docs.pydantic.dev/": "Pydantic-Doku",
        "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status": "MDN: HTTP-Statuscodes",
        "https://redis.io/docs/": "Redis-Doku",
      },
    },
  },
  phases: {
    0: {
      name: "Grundlagen",
      description: "Python, Git, einfaches SQL und Backend 01-10 (APIs, HTTP, Async, Streaming, Auth).",
    },
    1: { name: "LLM", description: "Wie Modelle funktionieren, Prompting, strukturierte Ausgaben, Kosten. Bereich 01." },
    2: { name: "RAG", description: "Durchsuche deine eigenen Dokumente und antworte mit Quellenangaben. Bereich 02." },
    3: {
      name: "KI-Agenten",
      description:
        "Werkzeuge, die Agent-Schleife, Gedächtnis, MCP. Lies Sicherheit 01-04, bevor du einem Agenten echte Werkzeuge gibst. Bereich 03.",
    },
    4: {
      name: "Evals",
      description: "Testsets, Judges, Tracing. Ab hier wird jede Änderung gemessen. Bereich 04.",
    },
    5: {
      name: "Deployment + Backend 11-20",
      description: "Bring deine App live: Docker, CI/CD, Queues, Caching, Rate Limits. Bereiche 07 und 08.",
    },
    6: {
      name: "KI-Systemdesign",
      description: "Routing, Caching, Serving, Kosten. Mach es fit für echten Traffic. Bereich 05.",
    },
    7: { name: "KI-Sicherheit", description: "Injection, Guardrails, Berechtigungen, Red Teaming. Bereich 06." },
  },
  prerequisites: {
    python: {
      name: "Python",
      description: "Funktionen, Klassen, virtuelle Umgebungen, pip, fremden Code lesen.",
    },
    git: {
      name: "Git und GitHub",
      description: "Commit, Branch, Pull Request. Jedes Projekt dieser Roadmap kommt auf GitHub.",
    },
    sql: {
      name: "Einfaches SQL",
      description: "SELECT, JOIN, INDEX. Du speicherst alles in Postgres.",
    },
    "llm-call": {
      name: "Ein LLM-API-Aufruf",
      description:
        "Hol dir einen API-Key bei irgendeinem Anbieter und gib eine Antwort aus Python aus. Das reicht für den Anfang.",
    },
  },
  rules: [
    {
      title: "Erst 01-10.",
      text: "In jedem Bereich sind die ersten zehn Konzepte die Grundlage. Komm für 11-20 zurück, wenn du etwas veröffentlicht hast.",
    },
    {
      title: "Nach jedem Bereich etwas bauen.",
      text: "Jede Bereichsseite endet mit einem Projekt. Sechs kleine fertige Projekte schlagen sechzig Tutorials.",
    },
    {
      title: "Ab Phase 4 wird gemessen.",
      text: "Sobald du Evals kennst, wird jede Änderung an Prompt oder Modell getestet, bevor sie live geht.",
    },
  ],
  projects: {
    "build-llm": {
      title: "Chatbot für die Kommandozeile",
      brief:
        "Ein Chatbot für die Kommandozeile mit System-Prompt, gestreamten Antworten, einem JSON-Ausgabemodus und einem Live-Zähler für Tokens und Kosten bei jeder Nachricht.",
    },
    "build-rag": {
      title: "Chatte mit deinen PDFs",
      brief:
        "„Chatte mit deinen PDFs“: parsen, chunken, in pgvector einbetten, hybride Suche + Reranking, Antworten mit Quellenangaben. Miss Recall@5 an 30 Testfragen.",
    },
    "build-agents": {
      title: "Recherche-Agent mit eigenem MCP-Server",
      brief:
        "Ein Recherche-Agent mit Werkzeugen für Websuche und Seitenabruf, einem schriftlichen Plan, einem Schrittlimit, Notizen als Gedächtnis und einem MCP-Server, den du selbst geschrieben hast.",
    },
    "build-evals": {
      title: "Evals für die RAG-App",
      brief:
        "Ergänze deine RAG-App um 50 Golden-Fragen, einen LLM-Judge für Faithfulness und Relevanz, Langfuse-Tracing und einen CI-Check, der fehlschlägt, wenn die Scores sinken.",
    },
    "build-system-design": {
      title: "Kleines KI-Gateway",
      brief:
        "Stell ein kleines KI-Gateway vor deine App: Routing zwischen zwei Modellen, Fallback, semantischer Cache, Token-Budget pro Nutzer und ein Dashboard für Latenz + Kosten.",
    },
    "build-security": {
      title: "Red-Teaming für deinen eigenen Agenten",
      brief:
        "Greif deinen eigenen Agenten mit 20 Injection- und Jailbreak-Prompts an. Ergänze dann Guardrails, Ausgabeprüfungen, Werkzeug-Berechtigungen und einen Freigabeschritt und teste erneut.",
    },
    "build-deployment": {
      title: "RAG-App dockerisieren und deployen",
      brief:
        "Pack deine RAG-App in Docker und deploye sie mit GitHub Actions. Ergänze ein Eval-Gate, einen Health Check, versionierte Prompts und ein Rollback in einem Schritt.",
    },
    "build-backend": {
      title: "FastAPI-Service mit gestreamten LLM-Antworten",
      brief:
        "Ein FastAPI-Service mit JWT-Login, Postgres, Redis-Cache, einem Hintergrund-Worker, der Dokumente einliest, Rate Limiting und einem SSE-Endpunkt, der LLM-Antworten streamt.",
    },
    "portfolio-docs-assistant": {
      title: "Doku-Assistent für eine echte Firma",
      brief:
        "RAG über 200+ echte Dokumente, hybride Suche, Quellenangaben, eine Eval-Suite mit 50 Fragen, hinter einem Login deployt.",
    },
    "portfolio-agent": {
      title: "Ein Agent, der eine echte Aufgabe erledigt",
      brief:
        "Ein Agent mit 3-5 Werkzeugen (eins davon dein eigener MCP-Server), Freigaben für riskante Schritte, Traces und einem Schrittbudget.",
    },
    "portfolio-gateway": {
      title: "KI-Gateway",
      brief:
        "Eine API vor mehreren Modellen: Routing, Fallbacks, semantischer Cache, Budgets pro Nutzer und ein Kosten-Dashboard.",
    },
    "documind-ai": {
      title: "DocuMind AI",
      brief:
        "Eine mandantenfähige RAG-Plattform für Unternehmensdokumente: hochladen, chunken, einbetten, mit Quellenangaben suchen, mit getrennten Daten pro Mandant.",
    },
  },
  concepts: { ...llm, ...rag, ...agents, ...evals, ...systemDesign, ...security, ...deployment, ...backend },
};

export default de;

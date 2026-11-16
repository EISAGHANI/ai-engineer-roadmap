import type { ConceptInput } from "../schema";

/** Area: deployment. Official one-liners are verbatim from the AI Engineer Roadmap (LearnVora, Nov 2026). */
const concepts: ConceptInput[] = [
  {
    id: "deployment-01",
    area: "deployment",
    number: 1,
    slug: "docker",
    name: "Docker",
    tier: "base",
    official:
      "Package your app and everything it needs into a container that runs the same everywhere.",
    kid: "When you go on a trip, you pack everything you need into one suitcase. Docker packs an app and all it needs into one box, so it runs the same on every computer.",
    realWorld: {
      title: "The truck that brings its own kitchen",
      text: "Our burger stand used to borrow kitchens: one had a different oven, another no fridge, and the burgers came out different every day. So the owner built a food truck with its own oven, fridge and spices. Now it parks anywhere in the city and the burgers taste the same everywhere. The truck is the container; the blueprint used to build it is the image.",
    },
    engineering: {
      text: "Docker packages an application with its runtime, libraries and configuration into an image, built from a Dockerfile, and runs it as an isolated container that behaves the same on a laptop, in CI and in production. Images are layered and cached, stored in registries and versioned with tags. For Python AI services: use slim base images, install dependencies before copying code so the layer cache works, run as a non-root user, and keep model weights and secrets out of the image.",
      code: {
        lang: "dockerfile",
        source:
          "FROM python:3.12-slim\n\nWORKDIR /app\nENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1\n\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt   # cached until requirements change\n\nCOPY src/ ./src/\nRUN useradd --create-home app\nUSER app                                              # don't run as root\n\nEXPOSE 8000\nCMD [\"uvicorn\", \"src.main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]\n\n# docker build -t rag-api:1.4.0 .\n# docker run -p 8000:8000 --env-file .env rag-api:1.4.0",
      },
      pitfalls: [
        "Secrets copied into an image stay in its layers even if deleted later; pass them at runtime.",
        "Huge images (CUDA, model weights) are slow to pull; use slim bases and download weights separately.",
        "'latest' is not a version; tag images with version numbers or commit SHAs.",
      ],
      docsUrl: "https://docs.docker.com/get-started/",
    },
    demo: "DockerDemo",
    related: ["deployment-02", "deployment-03", "deployment-07"],
    projects: ["build-deployment"],
    keywords: ["docker", "container", "image", "dockerfile", "packaging", "portable"],
  },
  {
    id: "deployment-02",
    area: "deployment",
    number: 2,
    slug: "docker-compose",
    name: "Docker Compose",
    tier: "base",
    official:
      "Run several containers together (API, database, Redis) from one file.",
    kid: "A festival needs a burger truck, a drinks truck and an ice truck parked side by side. Docker Compose sets up the whole group from one map that says what goes where.",
    realWorld: {
      title: "One plan for the whole festival",
      text: "For the street festival, our burger truck needs neighbours: a drinks truck, an ice truck to keep everything cold and a van with bread. Instead of phoning each driver, the organiser hands out one plan: who parks where, who connects to which power line, who starts first. One command, and the whole festival is set up the same way every time.",
    },
    engineering: {
      text: "Docker Compose defines a multi-container application (API, worker, Postgres, Redis, vector database) in one compose.yaml: images or builds, ports, environment, volumes, networks, dependencies and health checks. docker compose up starts everything together, with service names usable as hostnames. It is ideal for local development, CI integration tests and simple single-server deployments; larger production systems usually move to Kubernetes or a managed platform.",
      code: {
        lang: "yaml",
        source:
          "# compose.yaml\nservices:\n  api:\n    build: .\n    ports: [\"8000:8000\"]\n    env_file: .env\n    depends_on:\n      db: { condition: service_healthy }     # wait until Postgres really accepts connections\n      redis: { condition: service_started }\n  worker:\n    build: .\n    command: python -m src.worker            # same image, different job\n    env_file: .env\n  db:\n    image: pgvector/pgvector:pg17\n    environment: { POSTGRES_PASSWORD: dev }\n    volumes: [\"pgdata:/var/lib/postgresql/data\"]\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U postgres\"]\n      interval: 5s\n  redis:\n    image: redis:7\nvolumes:\n  pgdata:\n\n# docker compose up -d   ->  api, worker, db and redis on one network",
      },
      pitfalls: [
        "depends_on alone only orders startup; without a health condition the API may start before the database is ready.",
        "Data disappears with the container unless it lives in a named volume.",
        "Development settings such as default passwords and open ports must not reach production.",
      ],
      docsUrl: "https://docs.docker.com/compose/",
    },
    demo: "ComposeDemo",
    related: ["deployment-01", "deployment-18", "backend-11"],
    projects: ["build-deployment"],
    keywords: ["docker compose", "compose.yaml", "multi-container", "services", "local development"],
  },
  {
    id: "deployment-03",
    area: "deployment",
    number: 3,
    slug: "kubernetes-basics",
    name: "Kubernetes Basics",
    tier: "base",
    official:
      "Pods, deployments and services: running and scaling containers on a cluster.",
    kid: "Imagine a manager watching a hundred food trucks: if one breaks down she sends a new one, and if crowds come she sends more. Kubernetes is that manager for apps on many computers.",
    realWorld: {
      title: "The fleet manager",
      text: "With fifty trucks across the city, the owner hires a fleet manager and tells her: 'always keep three burger trucks open, and send customers to the shortest queue'. She checks constantly. A truck breaks down? She sends a replacement. A new menu? She swaps trucks one at a time so the street is never empty. The owner says what he wants; she keeps it true.",
    },
    engineering: {
      text: "Kubernetes runs containers across a cluster of machines and keeps the actual state matching a declared desired state. Pods are the smallest unit (one or more containers); Deployments manage replicated pods with rolling updates and self-healing; Services give a stable network name and balance traffic across pods; ConfigMaps and Secrets supply configuration. It provides scaling, scheduling (including GPU nodes) and recovery at the cost of real operational complexity; managed offerings such as EKS, GKE and AKS reduce it.",
      code: {
        lang: "yaml",
        source:
          "apiVersion: apps/v1\nkind: Deployment\nmetadata: { name: rag-api }\nspec:\n  replicas: 3                                   # desired state: always 3 pods\n  selector: { matchLabels: { app: rag-api } }\n  template:\n    metadata: { labels: { app: rag-api } }\n    spec:\n      containers:\n        - name: api\n          image: ghcr.io/eisaghani/rag-api:1.4.0\n          ports: [{ containerPort: 8000 }]\n          envFrom: [{ secretRef: { name: rag-api-secrets } }]\n          readinessProbe: { httpGet: { path: /ready, port: 8000 } }\n          resources: { requests: { cpu: 250m, memory: 512Mi } }\n---\napiVersion: v1\nkind: Service\nmetadata: { name: rag-api }\nspec:\n  selector: { app: rag-api }\n  ports: [{ port: 80, targetPort: 8000 }]       # one stable address for all 3 pods",
      },
      pitfalls: [
        "Kubernetes has many moving parts; a single VM or a managed platform is often enough at first.",
        "Without resource requests and limits, one pod can starve its neighbours.",
        "Without readiness probes, traffic reaches pods that are still loading models.",
      ],
      docsUrl: "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
    },
    demo: "KubernetesDemo",
    related: ["deployment-12", "deployment-13", "deployment-18", "deployment-01"],
    projects: ["build-deployment"],
    keywords: ["kubernetes", "k8s", "pods", "deployment", "service", "cluster", "orchestration"],
  },
  {
    id: "deployment-04",
    area: "deployment",
    number: 4,
    slug: "ci-cd-pipelines",
    name: "CI/CD Pipelines",
    tier: "base",
    official:
      "Test, build and deploy automatically on every push.",
    kid: "Every time the cook changes a recipe, a helper in the kitchen tastes it, packs it and drives it to the trucks. CI/CD does those checks and that delivery for code, every single time.",
    realWorld: {
      title: "From the test kitchen to every truck",
      text: "Whenever the chef tweaks the burger recipe, the same routine runs: the test kitchen cooks it, three tasters check it, the recipe card is printed, and only then is it sent to every truck. Nobody skips a step and nobody forgets truck number seven. If a taster says 'too salty', the new recipe never leaves the kitchen.",
    },
    engineering: {
      text: "Continuous integration runs automated checks (lint, type checks, unit and integration tests, evals, security scans, builds) on every push and pull request. Continuous delivery or deployment then packages the build into an artifact, such as a container image, and releases it to staging and production automatically or after one approval. Pipelines make releases frequent, repeatable and low-risk. Keep them fast, deterministic and required for merging, and deploy the exact artifact that was tested.",
      code: {
        lang: "yaml",
        source:
          "# A typical pipeline, top to bottom (simplified)\non: push\njobs:\n  test:                       # CI: on every push\n    steps: [checkout, install, lint, typecheck, unit-tests, evals]\n  build:                      # build once and tag with the commit SHA\n    needs: test\n    steps: [docker build -t app:$SHA, push to registry]\n  deploy-staging:\n    needs: build\n    steps: [deploy app:$SHA to staging, smoke-tests]\n  deploy-production:          # CD: the same image, after staging passes\n    needs: deploy-staging\n    environment: production   # can require a manual approval\n    steps: [deploy app:$SHA to production]",
      },
      pitfalls: [
        "Rebuilding per environment means production runs something that was never tested; promote one artifact.",
        "Flaky tests teach people to re-run and ignore failures; fix or remove them.",
        "Slow pipelines get bypassed; cache dependencies and run jobs in parallel.",
      ],
      docsUrl: "https://docs.github.com/en/actions/get-started/continuous-integration",
    },
    demo: "CicdDemo",
    related: ["deployment-05", "deployment-06", "evals-11", "deployment-14"],
    projects: ["build-deployment"],
    keywords: ["ci/cd", "pipeline", "continuous integration", "continuous delivery", "automation", "release"],
  },
  {
    id: "deployment-05",
    area: "deployment",
    number: 5,
    slug: "github-actions",
    name: "GitHub Actions",
    tier: "base",
    official:
      "GitHub's built-in CI/CD. Workflows are written in YAML.",
    kid: "GitHub Actions is a helper robot that lives next to your code. Whenever you save new code, it follows your written list of jobs: check, test, build and deliver.",
    realWorld: {
      title: "The checklist pinned in the kitchen",
      text: "In the truck company's kitchen a checklist is pinned to the wall: 'when a new recipe arrives: 1. cook a test batch, 2. let two tasters try it, 3. print recipe cards, 4. send them to the trucks'. A kitchen helper follows it to the letter, every time, and writes down what happened. The checklist lives in the recipe book, so changing the routine is just editing a page.",
    },
    engineering: {
      text: "GitHub Actions is GitHub's built-in CI/CD. Workflows are YAML files in .github/workflows that run jobs on events such as push, pull_request, schedule or manual dispatch. Jobs run on GitHub-hosted or self-hosted runners, are made of steps that run shell commands or reusable actions, and can depend on each other, run in parallel or as a matrix. Secrets, environments with protection rules, caching and artifacts are built in.",
      code: {
        lang: "yaml",
        source:
          "# .github/workflows/deploy.yml\nname: build-and-deploy\non:\n  push:\n    branches: [main]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: { python-version: \"3.12\", cache: pip }\n      - run: pip install -r requirements.txt\n      - run: pytest -q\n  image:\n    needs: test\n    runs-on: ubuntu-latest\n    permissions: { contents: read, packages: write }\n    steps:\n      - uses: actions/checkout@v4\n      - uses: docker/login-action@v3\n        with: { registry: ghcr.io, username: \"${{ github.actor }}\", password: \"${{ secrets.GITHUB_TOKEN }}\" }\n      - uses: docker/build-push-action@v6\n        with: { push: true, tags: \"ghcr.io/eisaghani/rag-api:${{ github.sha }}\" }",
      },
      pitfalls: [
        "Pin third-party actions to a version or commit SHA; a hijacked action runs with your secrets.",
        "Give each workflow only the permissions it needs, using the permissions key.",
        "Secrets are not passed to workflows triggered from forks; design pull request checks for that.",
      ],
      docsUrl: "https://docs.github.com/en/actions",
    },
    demo: "GithubActionsDemo",
    related: ["deployment-04", "deployment-06", "security-11"],
    projects: ["build-deployment"],
    keywords: ["github actions", "workflow", "yaml", "runner", "ci", "jobs", "steps"],
  },
  {
    id: "deployment-06",
    area: "deployment",
    number: 6,
    slug: "eval-gates-in-ci",
    name: "Eval Gates in CI",
    tier: "base",
    official:
      "The deploy stops if eval scores fall below your threshold.",
    kid: "Before a new recipe goes to the trucks, tasters score it. If it scores lower than the old recipe, the new one stays in the kitchen.",
    realWorld: {
      title: "The tasting panel at the gate",
      text: "Every new recipe now meets a tasting panel at the kitchen door. Each version is scored on 50 test dishes against the current one. The rule is simple: at least 90% of dishes must pass, and the score may not drop by more than two points. A cheaper sauce that saves money but fails the tasting never reaches a customer.",
    },
    engineering: {
      text: "An eval gate is a required CI/CD step that runs the evaluation suite against the candidate (a new prompt, model, retrieval setting or code change) and blocks the merge or deployment when scores fall below absolute thresholds or regress against the baseline. It turns evals from a report into a release control. Gate on a few reliable metrics, handle LLM non-determinism with tolerances or repeated runs, and post a per-case diff on the pull request.",
      code: {
        lang: "python",
        source:
          "# evals/gate.py: a non-zero exit code blocks the pipeline\nimport json, sys\n\ncurrent = json.load(open(\"results.json\"))            # this pull request\nbaseline = json.load(open(\"baseline.json\"))          # main branch, stored as an artifact\n\nchecks = {\n    \"pass rate >= 0.90\":    current[\"pass_rate\"] >= 0.90,\n    \"faithfulness >= 0.85\": current[\"faithfulness\"] >= 0.85,\n    \"no drop > 2 points\":   current[\"pass_rate\"] >= baseline[\"pass_rate\"] - 0.02,\n    \"p95 latency <= 3 s\":   current[\"p95_latency_s\"] <= 3.0,\n}\nfor name, ok in checks.items():\n    print((\"PASS  \" if ok else \"FAIL  \") + name)\nsys.exit(0 if all(checks.values()) else 1)",
      },
      pitfalls: [
        "Thresholds set without measuring score variance make gates flaky; measure the noise first.",
        "Gate on what users care about (correctness, safety), not only on cheap proxy metrics.",
        "Keep an override path for emergencies, but log every override.",
      ],
      docsUrl: "https://hamel.dev/blog/posts/evals/",
    },
    demo: "EvalGateDemo",
    related: ["evals-11", "deployment-04", "evals-01"],
    projects: ["build-deployment"],
    keywords: ["eval gate", "quality gate", "ci", "threshold", "regression", "block deploy"],
  },
  {
    id: "deployment-07",
    area: "deployment",
    number: 7,
    slug: "environment-configs",
    name: "Environment Configs",
    tier: "base",
    official:
      "Separate settings and secrets for dev, staging and production.",
    kid: "The same recipe uses a small pan at home and a giant pan at the festival. Environment settings are the notes that say which pan, which key and which address to use in each place.",
    realWorld: {
      title: "One truck, three settings cards",
      text: "The truck is identical whether it is parked for practice in the yard, at a test market or at the big festival. What changes is a settings card in the glovebox: which supplier to call, which card machine to use, how many staff to expect. Swap the card, not the truck. The till PIN is never written on the card; it is kept in a locked box.",
    },
    engineering: {
      text: "Environment configuration separates what changes between dev, staging and production (database URLs, API keys, model names, feature flags, log levels, rate limits) from the code and the build artifact, usually through environment variables (the twelve-factor approach) that are loaded and validated at startup. Secrets come from a secret manager or the platform's secret store, never from the repository. A typed settings class makes a missing value fail at startup instead of at the first request.",
      code: {
        lang: "python",
        source:
          "from pydantic import SecretStr\nfrom pydantic_settings import BaseSettings, SettingsConfigDict\n\nclass Settings(BaseSettings):\n    model_config = SettingsConfigDict(env_file=\".env\")   # .env only for local development\n\n    environment: str = \"dev\"                  # dev | staging | production\n    database_url: str\n    llm_model: str = \"claude-haiku-5-5\"\n    anthropic_api_key: SecretStr              # never printed in logs\n    max_tokens_per_request: int = 2_000\n\nsettings = Settings()                         # fails at startup if something is missing\nprint(settings.environment, settings.llm_model)",
      },
      pitfalls: [
        "Committing a .env file leaks secrets; add it to .gitignore and commit a .env.example instead.",
        "Config that silently differs between staging and production makes staging tests meaningless.",
        "Reading config lazily hides missing values until the first request in production.",
      ],
      docsUrl: "https://12factor.net/config",
    },
    demo: "EnvConfigDemo",
    related: ["security-11", "deployment-08", "deployment-15"],
    projects: ["build-deployment"],
    keywords: ["environment variables", "config", "dev staging production", "settings", "dotenv", "twelve-factor"],
  },
  {
    id: "deployment-08",
    area: "deployment",
    number: 8,
    slug: "infrastructure-as-code",
    name: "Infrastructure as Code",
    tier: "base",
    official:
      "Define servers, databases and networks in code (Terraform, Pulumi) instead of clicking.",
    kid: "Instead of building every truck by hand, you write the instructions once and a machine builds the same truck again and again. Infrastructure as code does that for the computers an app needs.",
    realWorld: {
      title: "Building trucks from a blueprint",
      text: "The first trucks were assembled by hand, and each ended up slightly different: one fridge bigger, one cable missing. Now the company keeps a written blueprint: chassis, oven, fridge, wiring, paint. The workshop builds every new truck from it, and changes go through the blueprint, checked by a second mechanic, never as a quick fix on one truck.",
    },
    engineering: {
      text: "Infrastructure as Code (IaC) defines cloud resources (networks, databases, buckets, clusters, GPU instances, DNS, permissions) in versioned code, and a tool plans and applies the changes needed to reach that state. Terraform and OpenTofu use HCL and a state file; Pulumi and AWS CDK use general-purpose languages. The benefits are reproducible environments, code review for infrastructure, drift detection and easy teardown. Store state remotely with locking, and keep secrets out of the code.",
      code: {
        lang: "hcl",
        source:
          "# main.tf: a Postgres database for the RAG app on AWS\nresource \"aws_db_instance\" \"rag\" {\n  identifier          = \"rag-${var.environment}\"\n  engine              = \"postgres\"\n  engine_version      = \"17\"\n  instance_class      = var.environment == \"production\" ? \"db.m7g.large\" : \"db.t4g.micro\"\n  allocated_storage   = 50\n  username            = \"rag\"\n  password            = var.db_password          # from a secret store, never hard-coded\n  skip_final_snapshot = var.environment != \"production\"\n}\n\n# terraform plan   -> shows exactly what will change\n# terraform apply  -> makes it so",
      },
      pitfalls: [
        "Changes made by hand in the cloud console drift from the code and get overwritten.",
        "Losing or corrupting the state file is painful; use remote state with locking.",
        "Always read the plan: a renamed resource can mean delete and recreate, including a database.",
      ],
      docsUrl: "https://developer.hashicorp.com/terraform/intro",
    },
    demo: "IacDemo",
    related: ["deployment-07", "deployment-10", "deployment-03"],
    projects: ["build-deployment"],
    keywords: ["infrastructure as code", "iac", "terraform", "pulumi", "opentofu", "cloud resources"],
  },
  {
    id: "deployment-09",
    area: "deployment",
    number: 9,
    slug: "serverless-functions",
    name: "Serverless Functions",
    tier: "base",
    official:
      "Run code on demand without managing servers (AWS Lambda, Cloudflare Workers, Vercel).",
    kid: "Instead of owning a truck that waits all day, you rent a cook and a kitchen only for the minutes someone orders. Serverless runs your code only when it is needed, and you pay only for that time.",
    realWorld: {
      title: "A pop-up kitchen for each order",
      text: "Some nights nobody wants burgers, yet a parked truck still costs money. So for the late-night menu the company uses pop-up kitchens: when an order arrives, a kitchen appears, cooks one meal and disappears. They pay per meal cooked, never for waiting. The catch: the first order of the night waits a little while the kitchen warms up.",
    },
    engineering: {
      text: "Serverless functions (AWS Lambda, Cloudflare Workers, Vercel Functions) and serverless container platforms run code on demand in response to requests or events, scale automatically down to zero and bill per invocation and duration. They suit APIs with spiky traffic, webhooks and glue code. Their limits matter for AI apps: cold starts, execution time limits, memory caps and, on most platforms, no GPUs. Long LLM calls need streaming or a queue, and heavy inference usually runs elsewhere.",
      code: {
        lang: "python",
        source:
          "# handler.py: an AWS Lambda function behind an HTTP endpoint\nimport json\nfrom anthropic import Anthropic\n\nclient = Anthropic()          # created once per warm instance and reused between calls\n\ndef handler(event, context):\n    question = json.loads(event[\"body\"])[\"question\"]\n    reply = client.messages.create(\n        model=\"claude-haiku-5-5\",\n        max_tokens=300,\n        messages=[{\"role\": \"user\", \"content\": question}],\n    )\n    return {\"statusCode\": 200, \"body\": json.dumps({\"answer\": reply.content[0].text})}\n\n# You pay per request and per millisecond; nothing when nobody calls it.",
      },
      pitfalls: [
        "Cold starts add delay to the first request after idle time; keep dependencies small.",
        "Execution time limits can cut off long LLM generations; stream, or move the work to a queue.",
        "Per-request pricing gets expensive under high, steady traffic; compare with always-on servers.",
      ],
      docsUrl: "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html",
    },
    demo: "ServerlessDemo",
    related: ["deployment-12", "system-design-15", "deployment-10"],
    projects: ["build-deployment"],
    keywords: ["serverless", "lambda", "functions", "cloudflare workers", "vercel", "scale to zero", "cold start"],
  },
  {
    id: "deployment-10",
    area: "deployment",
    number: 10,
    slug: "gpu-instances",
    name: "GPU Instances",
    tier: "base",
    official:
      "Renting GPU machines in the cloud to serve or fine-tune models.",
    kid: "Some jobs need a super-strong engine, like towing a giant trailer. GPU computers are the strong engines for AI, and you can rent them by the hour instead of buying one.",
    realWorld: {
      title: "Renting the heavy-duty tow truck",
      text: "Most days the trucks just drive around town. But once a month the company moves a giant mobile oven, which needs a heavy-duty tow truck. Buying one would be a waste, so they rent it by the hour from a garage. Heavy-duty trucks are in demand, so sometimes the garage is booked out, and the cheapest rental can be called back at short notice.",
    },
    engineering: {
      text: "GPU instances are cloud virtual machines with accelerators (for example NVIDIA L4, A100, H100 or newer) used to serve or fine-tune open models. Choose by VRAM (the weights plus the KV cache must fit), memory bandwidth, interconnect for multi-GPU work, and price. Options range from the big cloud providers to specialised GPU clouds and serverless GPU platforms. Spot or preemptible instances are much cheaper but can be reclaimed, and high-end GPUs are often in short supply.",
      code: {
        lang: "bash",
        source:
          "# Rough sizing: does an 8B model in 16-bit fit on a 24 GB L4?\n#   weights: 8B x 2 bytes = 16 GB, plus KV cache and overhead of ~4-6 GB  -> tight but OK\n# A 70B model in 16-bit needs ~140 GB -> several 80 GB GPUs, or quantize to 4-bit.\n\n# Serve an open model with vLLM (OpenAI-compatible API on port 8000)\npip install vllm\nvllm serve meta-llama/Llama-3.1-8B-Instruct --max-model-len 8192 --gpu-memory-utilization 0.90\n\n# Watch memory and utilisation while it runs\nnvidia-smi",
      },
      pitfalls: [
        "Idle GPUs cost the same as busy ones; shut them down or scale to zero when unused.",
        "Spot instances can disappear mid-job; checkpoint training and plan for restarts.",
        "Check that weights plus KV cache fit in VRAM before renting; long contexts need much more memory.",
      ],
      docsUrl: "https://docs.vllm.ai/",
    },
    demo: "GpuDemo",
    related: ["system-design-09", "system-design-13", "llm-18", "deployment-08"],
    projects: ["build-deployment"],
    keywords: ["gpu", "cloud gpu", "vram", "h100", "a100", "inference server", "spot instances"],
  },
  {
    id: "deployment-11",
    area: "deployment",
    number: 11,
    slug: "ollama-for-local-models",
    name: "Ollama for Local Models",
    tier: "production",
    official:
      "Run open models on your own laptop with one command. Good for testing and privacy.",
    kid: "Instead of phoning a restaurant, you cook the meal in your own kitchen from one simple recipe card. Ollama runs AI models on your own computer with one command, and nothing leaves your house.",
    realWorld: {
      title: "Practising at home",
      text: "Before trying a new dish in the trucks, the cooks practise at home. They don't need the big kitchen: a small home version of the recipe is enough to test ideas, and no customer ever sees the mistakes. Ollama is that home kitchen: it downloads small, compressed versions of open models and runs them on a laptop, even without internet.",
    },
    engineering: {
      text: "Ollama downloads and runs open-weight models (Llama, Qwen, Mistral, Gemma and more) locally with one command, mostly as quantized GGUF models, and exposes a local REST API plus an OpenAI-compatible endpoint. It is ideal for development without API costs, for private data that must not leave the machine, for offline use and for quick model comparisons. It is not built for high-throughput, multi-user serving; use vLLM or similar for that.",
      code: {
        lang: "bash",
        source:
          "# Install from ollama.com, then:\nollama pull llama3.1:8b            # about 5 GB, 4-bit quantized\nollama run llama3.1:8b \"Explain RAG in one sentence\"\n\n# Local REST API on port 11434 (OpenAI-compatible under /v1)\ncurl http://localhost:11434/api/generate -d '{\n  \"model\": \"llama3.1:8b\",\n  \"prompt\": \"Explain RAG in one sentence\",\n  \"stream\": false\n}' ",
      },
      pitfalls: [
        "Small local models are far weaker than frontier models; don't judge your product's quality on them.",
        "The default context length is often small; set it explicitly for long documents.",
        "Speed depends heavily on RAM and GPU; CPU-only machines are slow.",
      ],
      docsUrl: "https://ollama.com/",
    },
    demo: "OllamaDemo",
    related: ["llm-20", "llm-18", "deployment-10"],
    projects: ["build-deployment"],
    keywords: ["ollama", "local models", "llama", "offline", "privacy", "gguf", "laptop"],
  },
  {
    id: "deployment-12",
    area: "deployment",
    number: 12,
    slug: "autoscaling",
    name: "Autoscaling",
    tier: "production",
    official:
      "Add or remove instances automatically as traffic goes up and down.",
    kid: "When a football game ends and a crowd rushes out, more food trucks drive in, and later they drive home again. Autoscaling adds or removes copies of an app by itself as visitors come and go.",
    realWorld: {
      title: "More trucks when the crowd arrives",
      text: "On a quiet Tuesday two trucks are enough. When the stadium empties after a match, the queue explodes. The dispatcher has a rule: if each truck has more than 20 people waiting, send another truck, up to ten; if the queues stay short for 15 minutes, send one home, but never fewer than two. Nobody has to watch the queues all night.",
    },
    engineering: {
      text: "Autoscaling adds or removes instances (pods, VMs or serverless instances) based on load signals such as CPU, memory, requests in flight, queue length or custom metrics like tokens per second, between a minimum and a maximum. Horizontal scaling adds copies; vertical scaling makes one copy bigger. LLM services often scale better on queue depth or concurrent requests than on CPU, and GPU-backed services scale slowly because each new instance must start and load the model.",
      code: {
        lang: "yaml",
        source:
          "apiVersion: autoscaling/v2\nkind: HorizontalPodAutoscaler\nmetadata: { name: rag-api }\nspec:\n  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: rag-api }\n  minReplicas: 2                      # never fewer, even at night\n  maxReplicas: 10                     # a cost ceiling\n  metrics:\n    - type: Resource\n      resource:\n        name: cpu\n        target: { type: Utilization, averageUtilization: 70 }\n  behavior:\n    scaleDown: { stabilizationWindowSeconds: 900 }   # wait 15 minutes before removing pods",
      },
      pitfalls: [
        "Scaling on CPU misses LLM bottlenecks; queue length or concurrency is often a better signal.",
        "New instances take time to start and load models; scale early and keep a warm minimum.",
        "Without a maximum, a traffic spike or a bug becomes a huge bill.",
      ],
      docsUrl: "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/",
    },
    demo: "AutoscalingDemo",
    related: ["deployment-13", "deployment-03", "system-design-08", "deployment-09"],
    projects: ["build-deployment"],
    keywords: ["autoscaling", "horizontal scaling", "hpa", "replicas", "load", "scale out"],
  },
  {
    id: "deployment-13",
    area: "deployment",
    number: 13,
    slug: "load-balancing",
    name: "Load Balancing",
    tier: "production",
    official:
      "Spread requests across instances so no single one gets overloaded.",
    kid: "At a busy market, a helper gives each new customer a ticket for the truck with the shortest queue. A load balancer does that for app visitors, so no single copy gets overloaded.",
    realWorld: {
      title: "The helper with the sign at the entrance",
      text: "At the festival entrance stands a helper with a sign. She sends each arriving customer to a different truck in turn, and if one truck's queue is clearly longer, she sends people elsewhere. When a truck's lights go out, she stops sending anyone there until it is back. Customers only see one entrance, never which truck served them.",
    },
    engineering: {
      text: "A load balancer spreads incoming requests across healthy instances behind one address, using algorithms such as round robin, least connections or weighted routing, and removes instances that fail health checks. It enables horizontal scaling, rolling deployments and high availability; layer-7 balancers can also route by path or header and terminate TLS. For LLM serving, least-outstanding-requests routing beats round robin because request durations vary enormously.",
      code: {
        lang: "nginx",
        source:
          "# nginx.conf: spread requests over three API instances\nupstream rag_api {\n    least_conn;                         # pick the instance with the fewest active requests\n    server api-1:8000 max_fails=3 fail_timeout=30s;\n    server api-2:8000 max_fails=3 fail_timeout=30s;\n    server api-3:8000 max_fails=3 fail_timeout=30s;\n}\n\nserver {\n    listen 80;\n    location / {\n        proxy_pass http://rag_api;\n        proxy_read_timeout 120s;        # LLM answers can take a while\n        proxy_buffering off;            # needed for streaming (SSE) responses\n    }\n}",
      },
      pitfalls: [
        "Round robin with very uneven request lengths overloads some instances; prefer least connections.",
        "Default proxy timeouts can cut off long LLM responses; raise them for those routes.",
        "Sticky sessions hide uneven load and break when an instance dies; keep instances stateless.",
      ],
      docsUrl: "https://nginx.org/en/docs/http/load_balancing.html",
    },
    demo: "LoadBalancingDemo",
    related: ["deployment-12", "deployment-18", "backend-04"],
    projects: ["build-deployment"],
    keywords: ["load balancing", "load balancer", "round robin", "least connections", "nginx", "high availability"],
  },
  {
    id: "deployment-14",
    area: "deployment",
    number: 14,
    slug: "canary-releases",
    name: "Canary Releases",
    tier: "production",
    official:
      "Send a small share of traffic to the new version first, then roll it out to everyone.",
    kid: "Before baking a new cake for everyone, you let a few friends try a slice first. If they like it, more people get it; if not, you go back to the old cake.",
    realWorld: {
      title: "One truck tries the new burger first",
      text: "The new burger doesn't go to all fifty trucks on day one. First, one truck in a quiet street serves it to about one customer in twenty. The company compares complaints, leftovers and sales with the old recipe. Looks good after a day? Ten trucks. Then all of them. If customers complain, only that one truck switches back.",
    },
    engineering: {
      text: "A canary release sends a small share of real traffic (say 5%) to the new version while the rest stays on the current one, compares error rate, latency, cost and quality metrics, and raises the share step by step, rolling back automatically if metrics get worse. It limits the blast radius of bad releases, including LLM regressions that offline evals missed. Traffic is split by the load balancer, a service mesh, an API gateway or tools such as Argo Rollouts and Flagger.",
      code: {
        lang: "yaml",
        source:
          "apiVersion: argoproj.io/v1alpha1\nkind: Rollout\nmetadata: { name: rag-api }\nspec:\n  replicas: 10\n  selector: { matchLabels: { app: rag-api } }\n  strategy:\n    canary:\n      steps:\n        - setWeight: 5            # 5% of traffic to the new version\n        - pause: { duration: 30m }\n        - setWeight: 25\n        - pause: { duration: 1h }\n        - setWeight: 100          # everyone, if nothing went wrong\n  # Analysis templates can roll back automatically when error rate or latency rises.\n  # template: the same pod template as a Deployment (omitted here)",
      },
      pitfalls: [
        "With little traffic, 5% may be too few requests to spot a problem; wait longer or raise the share.",
        "Compare canary and baseline over the same period; time-of-day effects mislead.",
        "Database changes must work with both versions at the same time.",
      ],
      docsUrl: "https://argo-rollouts.readthedocs.io/en/stable/features/canary/",
    },
    demo: "CanaryDemo",
    related: ["deployment-20", "deployment-15", "evals-12"],
    projects: ["build-deployment"],
    keywords: ["canary release", "progressive delivery", "traffic split", "rollout", "blast radius"],
  },
  {
    id: "deployment-15",
    area: "deployment",
    number: 15,
    slug: "feature-flags",
    name: "Feature Flags",
    tier: "production",
    official:
      "Turn a feature on or off for some users without redeploying.",
    kid: "Like a switch on a toy, a feature flag turns a new part of an app on or off. You can turn it on for just a few people, without rebuilding anything.",
    realWorld: {
      title: "Switches in the office, not in the trucks",
      text: "The company wants to try a vegan menu. Instead of printing new menus for every truck, all trucks already carry it hidden, and a switchboard in the office decides which trucks show it: first two trucks, then a whole district, then everyone. If the supplier runs out of vegan patties, one click hides the menu everywhere again.",
    },
    engineering: {
      text: "Feature flags are runtime switches, evaluated per request, user or segment, that turn code paths on or off without a deployment. They separate deploying from releasing and enable gradual rollouts, beta groups, A/B tests, kill switches for risky features (for example a new agent tool) and per-customer configuration. Use a flag service or library (LaunchDarkly, Unleash, or OpenFeature-compatible providers), give every flag an owner and an expiry date, and remove flags when you are done.",
      code: {
        lang: "python",
        source:
          "from openfeature import api\nfrom openfeature.evaluation_context import EvaluationContext\n\nclient = api.get_client()\n\ndef answer(question: str, user) -> str:\n    ctx = EvaluationContext(targeting_key=user.id, attributes={\"plan\": user.plan})\n    if client.get_boolean_value(\"agentic-search\", False, ctx):   # off by default\n        return agentic_rag(question)        # new, being rolled out to 10% of users\n    return classic_rag(question)\n\n# Flip the flag in the flag service: no deploy, instant rollback.",
      },
      pitfalls: [
        "Old flags pile up into confusing dead code; remove them after a full rollout.",
        "Every flag doubles the paths to test; keep only a few active at a time.",
        "Cache flag values locally so the flag service is not a single point of failure.",
      ],
      docsUrl: "https://openfeature.dev/docs/reference/intro",
    },
    demo: "FeatureFlagsDemo",
    related: ["deployment-14", "evals-12", "deployment-07"],
    projects: ["build-deployment"],
    keywords: ["feature flags", "feature toggles", "kill switch", "gradual rollout", "launchdarkly", "openfeature"],
  },
  {
    id: "deployment-16",
    area: "deployment",
    number: 16,
    slug: "prompt-versioning",
    name: "Prompt Versioning",
    tier: "production",
    official:
      "Treat prompts like code: versioned, reviewed and easy to revert.",
    kid: "Every time the cook changes the recipe card, she writes a new number on it and keeps the old cards. If the new one tastes worse, she simply picks up the old card again.",
    realWorld: {
      title: "Numbered recipe cards in a binder",
      text: "The cooks used to scribble changes onto one recipe card, and nobody remembered why the burgers changed in May. Now every change is a new numbered card in a binder, with a note about who changed what and why, and a tasting score. The truck menu points to 'card 14'. Going back to card 13 takes one second.",
    },
    engineering: {
      text: "Prompt versioning treats prompts as code: stored in version control or a prompt registry, changed through review, tested by evals, released by label (production, staging) and logged with every request so you know which prompt produced which output. Templates separate the fixed instructions from the variables. Together with eval gates and feature flags, it allows safe iteration and instant rollback without a redeploy.",
      code: {
        lang: "python",
        source:
          "# prompts/library_bot/v14.md is a reviewed file in git.\n# prompts/registry.yaml maps labels to versions:\n#   library_bot: { production: v14, staging: v15 }\nimport yaml\nfrom pathlib import Path\n\nREGISTRY = yaml.safe_load(Path(\"prompts/registry.yaml\").read_text())\n\ndef load_prompt(name: str, label: str = \"production\") -> tuple[str, str]:\n    version = REGISTRY[name][label]\n    return version, Path(f\"prompts/{name}/{version}.md\").read_text()\n\nversion, system_prompt = load_prompt(\"library_bot\")\nreply = llm(system=system_prompt, user=question)\nlog.info(\"answered\", prompt=f\"library_bot@{version}\", trace_id=trace_id)   # traceable",
      },
      pitfalls: [
        "Editing prompts in production without review or evals is the most common cause of silent regressions.",
        "If requests don't log the prompt version, you can't explain or reproduce an output.",
        "A prompt version only means something together with the model version it was tested on.",
      ],
      docsUrl: "https://langfuse.com/docs/prompts/get-started",
    },
    demo: "PromptVersioningDemo",
    related: ["deployment-17", "evals-16", "evals-11", "deployment-20"],
    projects: ["build-deployment"],
    keywords: ["prompt versioning", "prompt management", "prompt registry", "git", "rollback", "prompts as code"],
  },
  {
    id: "deployment-17",
    area: "deployment",
    number: 17,
    slug: "model-versioning",
    name: "Model Versioning",
    tier: "production",
    official:
      "Pin exact model versions and record which version served each request.",
    kid: "If you always buy 'the newest' flour, your cake can taste different without warning. Model versioning means writing down exactly which flour you used, so every cake comes out the same.",
    realWorld: {
      title: "Exactly which flour, from which batch",
      text: "One Monday the burgers tasted different and nobody knew why. The supplier had quietly switched to a new flour for 'standard buns'. Now the company orders an exact flour and batch, writes the batch on every delivery note, and tests a new batch in one truck before switching. A new flour is a change like any other.",
    },
    engineering: {
      text: "Model versioning pins exact model identifiers or dated snapshots instead of floating aliases such as 'latest', records the model id and parameters with every request, and treats model upgrades as deployments that go through evals and canaries. For self-hosted and fine-tuned models, a model registry (MLflow, Hugging Face Hub revisions) stores artifacts with versions, lineage and stage labels. Providers retire old models, so upgrades must be planned, and changing an embedding model means re-embedding everything.",
      code: {
        lang: "python",
        source:
          "# config/models.yaml: pinned, reviewed and versioned together with the code\n#   answer_model: { id: \"claude-sonnet-5-5\", temperature: 0.2, tested_with: \"library_bot@v14\" }\n#   embed_model:  { id: \"text-embedding-3-small\", dims: 1536 }   # changing it = re-embed all\nfrom huggingface_hub import snapshot_download\n\n# Self-hosted or fine-tuned: pin an exact revision (a commit hash), not \"main\"\npath = snapshot_download(\"meta-llama/Llama-3.1-8B-Instruct\", revision=PINNED_REVISION)\n\nlog.info(\"answered\", model=cfg.answer_model.id, revision=PINNED_REVISION, trace_id=trace_id)",
      },
      pitfalls: [
        "Floating aliases such as 'latest' change behaviour under you; pin versions in production.",
        "Changing the embedding model invalidates every stored vector; plan a full re-embed.",
        "Providers retire old models; track deprecation dates and test the successor early.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/about-claude/models/overview",
    },
    demo: "ModelVersioningDemo",
    related: ["deployment-16", "llm-20", "rag-01", "deployment-14"],
    projects: ["build-deployment"],
    keywords: ["model versioning", "model registry", "pinning", "snapshot", "deprecation", "mlflow"],
  },
  {
    id: "deployment-18",
    area: "deployment",
    number: 18,
    slug: "health-checks",
    name: "Health Checks",
    tier: "production",
    official:
      "Endpoints that tell the platform whether your app is alive and ready for traffic.",
    kid: "Every morning the manager asks each truck: is your door open and is your oven hot? Trucks that don't answer get no customers until they are fixed.",
    realWorld: {
      title: "Two questions every few seconds",
      text: "The dispatcher radios each truck every ten seconds with two questions. 'Are you alive?' If a truck stops answering, a mechanic is sent to restart it. 'Are you ready to serve?' A truck that is alive but still heating its oven says no, so the helper at the entrance doesn't send customers there yet. Two different questions, two different reactions.",
    },
    engineering: {
      text: "Health checks are endpoints or commands the platform polls to decide what to do with an instance. Liveness asks whether the process is healthy (restart it if not); readiness asks whether it can serve traffic right now (remove it from the load balancer if not, for example while it loads a model or warms a cache). Startup probes give slow-starting services extra time. Keep liveness cheap and independent of dependencies; readiness may check critical dependencies with short timeouts.",
      code: {
        lang: "python",
        source:
          "from fastapi import FastAPI, Response\n\napp = FastAPI()\nstate = {\"model_loaded\": False}\n\n@app.get(\"/live\")\ndef live():\n    return {\"status\": \"ok\"}              # cheap: the process responds\n\n@app.get(\"/ready\")\nasync def ready(response: Response):\n    checks = {\n        \"model_loaded\": state[\"model_loaded\"],\n        \"database\": await db_ping(timeout_s=0.5),\n        \"vector_index\": await vector_ping(timeout_s=0.5),\n    }\n    if not all(checks.values()):\n        response.status_code = 503        # take me out of the load balancer for now\n    return checks",
      },
      pitfalls: [
        "A liveness check that calls the database restarts every pod when the database blips; keep it local.",
        "Without readiness checks, traffic hits instances that are still loading models.",
        "Health endpoints without timeouts can hang and make the check itself fail.",
      ],
      docsUrl: "https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/",
    },
    demo: "HealthCheckDemo",
    related: ["deployment-03", "deployment-13", "deployment-19", "backend-02"],
    projects: ["build-deployment"],
    keywords: ["health checks", "liveness", "readiness", "probes", "monitoring", "uptime"],
  },
  {
    id: "deployment-19",
    area: "deployment",
    number: 19,
    slug: "alerts-and-dashboards",
    name: "Alerts and Dashboards",
    tier: "production",
    official:
      "Get alerted on errors, latency or cost spikes, and see the trends at a glance.",
    kid: "A bus driver has a dashboard with lights that turn red when something is wrong. App dashboards show how an app is doing, and alerts ring a bell when a person needs to act.",
    realWorld: {
      title: "The big screen and the pager",
      text: "In the office a big screen shows every truck: customers per hour, waiting time, burgers wasted, money spent on ingredients. Nobody stares at it all day. Instead, a pager beeps when something matters: a truck's waiting time is over 15 minutes, or ingredient costs are double the usual. The screen is for understanding; the pager is for acting.",
    },
    engineering: {
      text: "Dashboards show key metrics over time: request rate, error rate, latency percentiles, tokens and cost per feature, eval and feedback scores, GPU utilisation. Alerts notify on-call people when a metric crosses a threshold, or deviates from normal, for a set time. For AI apps, add cost spikes, tokens per user, refusal rate, empty-retrieval rate and provider errors (429 and 5xx). Alert on symptoms users feel, attach a runbook to each alert, and remove noisy alerts that train people to ignore them.",
      code: {
        lang: "yaml",
        source:
          "# Prometheus alerting rules\ngroups:\n  - name: rag-api\n    rules:\n      - alert: HighP95Latency\n        expr: histogram_quantile(0.95, sum(rate(request_duration_seconds_bucket[5m])) by (le)) > 4\n        for: 10m\n        labels: { severity: page }\n        annotations: { summary: \"p95 latency above 4 s for 10 minutes\", runbook: \"docs/runbooks/latency.md\" }\n      - alert: LLMCostSpike\n        expr: sum(rate(llm_cost_usd_total[1h])) > 2 * sum(rate(llm_cost_usd_total[1h] offset 1d))\n        for: 30m\n        labels: { severity: ticket }\n        annotations: { summary: \"LLM spend is double yesterday's at this time\" }",
      },
      pitfalls: [
        "Too many alerts cause alert fatigue; page only for problems users feel.",
        "An alert without a runbook leaves the person on call guessing.",
        "Averages on dashboards hide problems; show percentiles and break them down by feature and model.",
      ],
      docsUrl: "https://sre.google/sre-book/monitoring-distributed-systems/",
    },
    demo: "AlertsDemo",
    related: ["evals-18", "evals-19", "deployment-18", "backend-20"],
    projects: ["build-deployment"],
    keywords: ["alerts", "dashboards", "monitoring", "prometheus", "grafana", "on-call", "metrics"],
  },
  {
    id: "deployment-20",
    area: "deployment",
    number: 20,
    slug: "rollbacks",
    name: "Rollbacks",
    tier: "production",
    official:
      "Go back to the last good version in one step.",
    kid: "If customers don't like the new recipe, you go straight back to the old recipe card. A rollback puts the last good version of an app back in one step.",
    realWorld: {
      title: "The spare trucks with yesterday's menu",
      text: "When the company switches trucks to a new menu, it keeps yesterday's trucks fuelled and ready around the corner. If the new menu causes chaos (wrong prices, angry customers), the dispatcher sends the old trucks back with one radio call. Nobody has to rebuild anything at night under pressure. Going back must be faster and safer than fixing forward.",
    },
    engineering: {
      text: "A rollback restores the last known-good version in one step: redeploy the previous image tag, undo the Kubernetes rollout, switch traffic back in a blue-green setup, turn a feature flag off, or move a prompt or model label back. It only works if artifacts are immutable and versioned, configuration and prompts are versioned too, and database migrations stay backwards compatible. Script it as one command and practise it.",
      code: {
        lang: "bash",
        source:
          "# Kubernetes: go back to the previous version of the Deployment\nkubectl rollout history deployment/rag-api\nkubectl rollout undo deployment/rag-api                  # the previous revision\nkubectl rollout undo deployment/rag-api --to-revision=41\n\n# Container platforms: redeploy the last good immutable tag\ndocker pull ghcr.io/eisaghani/rag-api:1.4.0\n\n# Prompts and models: move the production label back (no deploy needed)\n#   prompts/registry.yaml  ->  library_bot: { production: v13 }",
      },
      pitfalls: [
        "Migrations that drop or rename columns make rolling back the code impossible; use expand-and-contract.",
        "Rolling back code doesn't undo side effects such as emails sent or data written.",
        "An untested rollback path fails exactly when you need it; rehearse it.",
      ],
      docsUrl: "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/kubectl_rollout_undo/",
    },
    demo: "RollbackDemo",
    related: ["deployment-14", "deployment-16", "deployment-17", "deployment-15"],
    projects: ["build-deployment"],
    keywords: ["rollback", "revert", "undo deploy", "blue green", "previous version", "recovery"],
  },
];

export default concepts;

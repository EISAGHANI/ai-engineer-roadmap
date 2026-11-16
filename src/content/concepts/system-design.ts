import type { ConceptInput } from "../schema";

/** Area: system-design. Official one-liners are verbatim from the AI Engineer Roadmap (LearnVora, Nov 2026). */
const concepts: ConceptInput[] = [
  {
    id: "system-design-01",
    area: "system-design",
    number: 1,
    slug: "model-routing",
    name: "Model Routing",
    tier: "base",
    official:
      "Easy requests go to a cheap, fast model; hard ones go to a strong model.",
    kid: "In a restaurant kitchen, the young helper makes the simple sandwich and the head chef cooks the fancy dishes. Model routing sends easy questions to a small, cheap model and hard ones to a strong model.",
    realWorld: {
      title: "Not every order needs the head chef",
      text: "Our restaurant has one brilliant, expensive head chef and three quick kitchen helpers. If the head chef makes every toast and every salad, orders pile up and wages explode. So the person at the pass reads each ticket: toast and salads go to the helpers, the tasting menu goes to the head chef. Guests get the same quality where it matters, faster and cheaper.",
    },
    engineering: {
      text: "Model routing picks a model per request: small, fast, cheap models for simple tasks (classification, extraction, short FAQ answers, rewriting) and frontier models for hard reasoning, long context or high-stakes answers. Routers use rules (task type, input length, user tier), a small classifier or an LLM judging difficulty, or a cascade that tries the cheap model first and escalates when confidence or validation fails. Measure quality per route with evals; routing usually cuts cost by large factors at little quality loss.",
      code: {
        lang: "python",
        source:
          "SMALL, LARGE = \"claude-haiku-5-5\", \"claude-sonnet-5-5\"\n\ndef route(question: str, task: str) -> str:\n    if task in {\"classify\", \"extract\", \"rewrite\"}:\n        return SMALL                                   # rules first: cheap and predictable\n    if len(question) > 2_000 or task == \"analysis\":\n        return LARGE\n    verdict = llm(SMALL, f\"Is this easy or hard to answer well? One word.\\n\\n{question}\")\n    return LARGE if \"hard\" in verdict.lower() else SMALL\n\nasync def answer(question: str, task: str = \"qa\") -> str:\n    model = route(question, task)\n    reply = await llm_async(model, question)\n    if model == SMALL and not passes_checks(reply):    # cascade: escalate on failure\n        reply = await llm_async(LARGE, question)\n    log.info(\"routed\", model=model, task=task)\n    return reply",
      },
      pitfalls: [
        "A router that is itself an expensive model call can eat the savings; prefer rules and small classifiers.",
        "Routing without per-route evals hides quality drops on the cheap path.",
        "Users notice inconsistent tone or format between models; align prompts and output formats.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/about-claude/models/choosing-a-model",
    },
    demo: "ModelRoutingDemo",
    related: ["system-design-20", "llm-13", "system-design-02", "llm-19"],
    projects: ["build-system-design"],
    keywords: ["model routing", "router", "cascade", "cheap model", "frontier model", "cost", "llm gateway"],
  },
  {
    id: "system-design-02",
    area: "system-design",
    number: 2,
    slug: "model-fallbacks",
    name: "Model Fallbacks",
    tier: "base",
    official:
      "If a provider fails or times out, retry on a backup model or provider.",
    kid: "If the main oven breaks during dinner, a good kitchen switches to the backup oven so guests still get their cake. Model fallbacks switch to a backup model or company when the main one fails.",
    realWorld: {
      title: "The backup oven",
      text: "Halfway through a busy Saturday, the main oven dies. A kitchen without a plan sends guests home. Our kitchen has a smaller backup oven and a deal with the bakery next door. The rule on the wall: if the oven doesn't heat within two minutes, switch. Dishes from the backup look a little different, but nobody leaves hungry.",
    },
    engineering: {
      text: "Model fallbacks keep an AI feature working when a provider has an outage, overload (429, 503, 529), timeout or a regional problem: after limited retries, the request goes to a backup model at the same provider, the same model on another cloud (Bedrock, Vertex), or another provider. Gateways such as LiteLLM, Portkey or OpenRouter implement fallback chains, timeouts and circuit breakers. Keep prompts and output schemas portable, eval the backup path, and log which model actually answered.",
      code: {
        lang: "python",
        source:
          "import asyncio\n\nCHAIN = [\n    (\"anthropic\", \"claude-sonnet-5-5\"),\n    (\"bedrock\",   \"claude-sonnet-5-5\"),       # same model, different cloud\n    (\"anthropic\", \"claude-haiku-5-5\"),        # smaller, but answers\n]\n\nasync def complete_with_fallback(messages, timeout_s: float = 20):\n    last_error = None\n    for provider, model in CHAIN:\n        if breaker.is_open(provider):          # skip providers that failed a lot recently\n            continue\n        try:\n            reply = await asyncio.wait_for(call(provider, model, messages), timeout_s)\n            log.info(\"answered\", provider=provider, model=model)\n            return reply\n        except (TimeoutError, Overloaded, ServerError) as e:\n            breaker.record_failure(provider)\n            last_error = e\n    raise AllProvidersFailed() from last_error",
      },
      pitfalls: [
        "A backup path that is never tested fails when you need it; send a little traffic through it or test it regularly.",
        "Long timeouts before failing over make users wait twice; use time-to-first-token based timeouts.",
        "Different models need slightly different prompts; check output schemas on every path.",
      ],
      docsUrl: "https://docs.litellm.ai/docs/routing",
    },
    demo: "FallbackDemo",
    related: ["system-design-16", "backend-16", "system-design-01", "deployment-19"],
    projects: ["build-system-design"],
    keywords: ["fallbacks", "failover", "redundancy", "backup provider", "circuit breaker", "outage", "llm gateway"],
  },
  {
    id: "system-design-03",
    area: "system-design",
    number: 3,
    slug: "semantic-caching",
    name: "Semantic Caching",
    tier: "base",
    official:
      "Return a saved answer when a new question means the same thing as an old one.",
    kid: "If many guests order the same soup, the kitchen keeps a pot ready instead of cooking each bowl from scratch. Semantic caching reuses a saved answer when a new question means the same as an old one.",
    realWorld: {
      title: "A pot of soup already on the stove",
      text: "Guests ask for 'today's soup', 'the soup of the day' and 'whatever soup you have'. Different words, same order. Instead of cooking each bowl from scratch, the kitchen keeps a pot ready and serves the same soup to all three. But if a guest asks for 'soup without onions', reusing the pot would be wrong, so the waiter listens carefully before ladling.",
    },
    engineering: {
      text: "A semantic cache embeds each incoming question, searches previously answered questions by vector similarity, and returns the stored answer if similarity exceeds a threshold, skipping the LLM call. Unlike exact-match caching it catches paraphrases, but it can return wrong answers for questions that look alike yet differ (dates, negations, names, tenants). Tune the threshold on labelled pairs, scope the cache per tenant and prompt version, set TTLs, and use it mostly for FAQ-like, non-personal traffic.",
      code: {
        lang: "python",
        source:
          "import numpy as np\n\nTHRESHOLD = 0.93                      # tuned on labelled \"same / different\" question pairs\n\nasync def answer(question: str, tenant: str) -> str:\n    q_vec = await embed(question)\n    hit = await vector_store.search(\n        collection=\"answer_cache\", vector=q_vec, top_k=1,\n        filter={\"tenant\": tenant, \"prompt_version\": \"v14\"},   # never share across tenants\n    )\n    if hit and hit[0].score >= THRESHOLD:\n        metrics.increment(\"semantic_cache.hit\")\n        return hit[0].payload[\"answer\"]\n\n    reply = await ask_llm(question, tenant)\n    await vector_store.upsert(\"answer_cache\", vector=q_vec,\n                              payload={\"answer\": reply, \"tenant\": tenant,\n                                       \"prompt_version\": \"v14\", \"ttl_hours\": 24})\n    return reply",
      },
      pitfalls: [
        "Similar-looking questions can need different answers ('cancel my order' vs 'don't cancel my order').",
        "A cache shared across users or tenants can leak private answers.",
        "Answers go stale when documents change; expire entries and clear them on re-ingestion.",
      ],
      docsUrl: "https://redis.io/docs/latest/develop/ai/redisvl/user_guide/llmcache/",
    },
    demo: "SemanticCacheDemo",
    related: ["backend-11", "system-design-04", "rag-02", "system-design-20"],
    projects: ["build-system-design"],
    keywords: ["semantic caching", "semantic cache", "embeddings", "similarity threshold", "llm cache", "cost"],
  },
  {
    id: "system-design-04",
    area: "system-design",
    number: 4,
    slug: "prefix-caching",
    name: "Prefix Caching",
    tier: "base",
    official:
      "Reuse the computation for a shared prompt start (same system prompt, same document).",
    kid: "Every pizza starts with the same dough and sauce, so the kitchen prepares that base once and only adds the different toppings. Prefix caching reuses the work for the same opening part of many questions.",
    realWorld: {
      title: "The same pizza base, ready to go",
      text: "Every pizza on our menu starts with the same dough, sauce and cheese. Preparing that base from scratch for each order wastes most of the cook's time. So the kitchen keeps bases prepared, and for each order only the toppings are added. The trick only works if the base is exactly the same and comes first; change one ingredient at the bottom, and the whole pizza must be made fresh.",
    },
    engineering: {
      text: "Prefix caching (prompt caching at the provider) stores the model's computed state (the KV cache) for the beginning of a prompt, so requests that start with the identical prefix (system prompt, tool definitions, a long document, conversation history) skip recomputing it. That cuts time to first token and input cost: providers charge a fraction of the normal price for cached input tokens. Put stable content first and variable content last, keep the prefix byte-identical, and watch the cache-hit metrics. vLLM and SGLang do automatic prefix caching for self-hosted models.",
      code: {
        lang: "python",
        source:
          "from anthropic import Anthropic\n\nclient = Anthropic()\nHANDBOOK = open(\"employee_handbook.md\").read()        # ~60k tokens, same for every question\n\ndef ask(question: str):\n    return client.messages.create(\n        model=\"claude-sonnet-5-5\",\n        max_tokens=500,\n        system=[\n            {\"type\": \"text\", \"text\": \"You answer questions about the employee handbook.\"},\n            {\"type\": \"text\", \"text\": HANDBOOK,\n             \"cache_control\": {\"type\": \"ephemeral\"}},  # cache everything up to here\n        ],\n        messages=[{\"role\": \"user\", \"content\": question}],   # only this part changes\n    )\n\nr = ask(\"How many holiday days do I get?\")\nprint(r.usage.cache_creation_input_tokens, r.usage.cache_read_input_tokens)\n# first call writes the cache; later calls within the cache lifetime read it cheaply",
      },
      pitfalls: [
        "A timestamp or user name near the top of the prompt changes the prefix and breaks every cache hit.",
        "Caches expire after a few minutes of inactivity; low-traffic features may rarely hit.",
        "Writing to the cache can cost more than a normal request; it pays off only when the prefix is reused.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/build-with-claude/prompt-caching",
    },
    demo: "PrefixCacheDemo",
    related: ["llm-12", "llm-05", "system-design-07", "system-design-11"],
    projects: ["build-system-design"],
    keywords: ["prefix caching", "prompt caching", "kv cache", "cache_control", "time to first token", "input cost"],
  },
  {
    id: "system-design-05",
    area: "system-design",
    number: 5,
    slug: "token-budgets",
    name: "Token Budgets",
    tier: "base",
    official:
      "Cap input and output tokens per request, per user or per feature.",
    kid: "The kitchen gives each table a limit: at most three dishes, so one hungry table can't use up all the food. Token budgets set how much each question, person or feature may use.",
    realWorld: {
      title: "A limit per table",
      text: "One evening a table kept ordering 'one more dish' all night, and by ten the kitchen had run out of food for everyone else. Now each table gets a card: three dishes per order, ten per evening. Big parties can ask the manager for a bigger card. The kitchen can plan, nobody gets a surprise bill, and one table can never empty the fridge.",
    },
    engineering: {
      text: "Token budgets cap usage at several levels: max_tokens per response, a maximum input size per request (trim or reject oversized context), per-user or per-tenant daily or monthly limits, and per-feature or per-agent-run limits on total tokens, steps and dollars. Budgets prevent runaway agent loops, abuse and surprise bills, and make costs predictable. Count tokens before sending, track usage from the response, enforce limits atomically in a shared store, and tell users clearly when they hit a limit.",
      code: {
        lang: "python",
        source:
          "from anthropic import Anthropic\n\nclient = Anthropic()\nMAX_INPUT, MAX_OUTPUT, DAILY_USER_BUDGET = 20_000, 800, 200_000\n\nasync def ask(user_id: str, messages: list[dict]) -> str:\n    n_in = client.messages.count_tokens(model=\"claude-haiku-5-5\", messages=messages).input_tokens\n    if n_in > MAX_INPUT:\n        messages = trim_history(messages, MAX_INPUT)               # or reject with 413\n    used_today = int(await redis.get(f\"tokens:{user_id}:{today()}\") or 0)\n    if used_today + n_in + MAX_OUTPUT > DAILY_USER_BUDGET:\n        raise BudgetExceeded(\"Daily limit reached, resets at midnight UTC\")\n\n    r = client.messages.create(model=\"claude-haiku-5-5\", max_tokens=MAX_OUTPUT, messages=messages)\n    spent = r.usage.input_tokens + r.usage.output_tokens\n    await redis.incrby(f\"tokens:{user_id}:{today()}\", spent)       # record what was really used\n    return r.content[0].text",
      },
      pitfalls: [
        "Agents without a total budget can loop for hours; cap steps, tokens and dollars per run.",
        "Too small a max_tokens cuts answers off mid-sentence; check stop_reason and handle it.",
        "Budgets enforced per instance instead of in a shared store are easy to exceed.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/build-with-claude/token-counting",
    },
    demo: "TokenBudgetDemo",
    related: ["llm-13", "evals-19", "agents-19", "backend-14"],
    projects: ["build-system-design"],
    keywords: ["token budgets", "max_tokens", "quotas", "usage limits", "cost control", "token counting"],
  },
  {
    id: "system-design-06",
    area: "system-design",
    number: 6,
    slug: "streaming-responses",
    name: "Streaming Responses",
    tier: "base",
    official:
      "Send tokens to the user as they are generated, so the app feels fast.",
    kid: "A good waiter brings the bread first, then the soup, then the main dish, so you never sit at an empty table. Streaming responses send an answer word by word as it is made.",
    realWorld: {
      title: "Bread first, then the courses",
      text: "In one restaurant, the waiter waits until all three courses are ready and serves everything at once after forty minutes. Guests think the kitchen forgot them. In ours, bread arrives in two minutes, soup soon after, then the main course. The total cooking time is the same, but the guests feel looked after the whole time, and if they're full after the soup, the kitchen stops cooking.",
    },
    engineering: {
      text: "Streaming responses send output tokens to the client as they are generated, usually over Server-Sent Events, so users start reading after the time to first token instead of waiting for the whole answer. Design for it end to end: provider streaming APIs, a backend that forwards chunks without buffering, a UI that renders partial Markdown, citations or JSON progressively, and cancellation that stops generation (and billing) when the user leaves or presses stop. Log the final text and usage once the stream ends.",
      code: {
        lang: "typescript",
        source:
          "// Next.js route handler that streams an Anthropic answer to the browser\nimport Anthropic from \"@anthropic-ai/sdk\";\n\nconst client = new Anthropic();\n\nexport async function POST(req: Request) {\n  const { question } = await req.json();\n  const stream = client.messages.stream({\n    model: \"claude-sonnet-5-5\",\n    max_tokens: 800,\n    messages: [{ role: \"user\", content: question }],\n  });\n  req.signal.addEventListener(\"abort\", () => stream.abort());   // user left: stop paying\n\n  const body = new ReadableStream({\n    async start(controller) {\n      for await (const event of stream) {\n        if (event.type === \"content_block_delta\" && event.delta.type === \"text_delta\") {\n          controller.enqueue(new TextEncoder().encode(event.delta.text));\n        }\n      }\n      controller.close();\n    },\n  });\n  return new Response(body, { headers: { \"Content-Type\": \"text/plain; charset=utf-8\" } });\n}",
      },
      pitfalls: [
        "Not cancelling upstream when the client disconnects keeps generating, and billing, for nobody.",
        "Rendering half-finished Markdown or JSON naively makes the UI flicker or break; parse incrementally.",
        "Moderation and validation are harder mid-stream; decide what to check before and after.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/build-with-claude/streaming",
    },
    demo: "StreamingDemo",
    related: ["backend-04", "system-design-07", "backend-05"],
    projects: ["build-system-design"],
    keywords: ["streaming", "streaming responses", "sse", "server-sent events", "cancellation", "perceived latency"],
  },
  {
    id: "system-design-07",
    area: "system-design",
    number: 7,
    slug: "time-to-first-token",
    name: "Time to First Token",
    tier: "base",
    official:
      "The wait before the first word appears. This is what users feel as speed.",
    kid: "When you sit down in a restaurant, what you notice most is how long until the first plate arrives. Time to first token is that wait: how long until the first word of an answer shows up.",
    realWorld: {
      title: "How long until the first plate?",
      text: "Guests don't time the whole dinner; they remember how long they sat in front of an empty table. So our manager tracks one number: minutes from order to first plate. It depends on the queue in the kitchen, on how long the cook spends reading a complicated order, and on prep work like fetching ingredients from the cellar. Shorten any of those, and the restaurant feels faster.",
    },
    engineering: {
      text: "Time to first token (TTFT) is the delay between sending a request and receiving the first output token. With streaming, it is the latency users feel most. It is made of network time, queueing at the provider or your server, any work before the call (retrieval, reranking, tool calls, guardrails) and prefill: processing all input tokens, which grows with prompt length. Reduce it with shorter or cached prompts (prefix caching), faster or smaller models, parallel pre-steps, regional endpoints and enough serving capacity. Track it as a percentile.",
      code: {
        lang: "python",
        source:
          "import time\nfrom anthropic import Anthropic\n\nclient = Anthropic()\n\ndef measure(question: str, context: str) -> dict:\n    t0 = time.perf_counter()\n    ttft = None\n    with client.messages.stream(\n        model=\"claude-haiku-5-5\", max_tokens=400,\n        messages=[{\"role\": \"user\", \"content\": f\"{context}\\n\\nQuestion: {question}\"}],\n    ) as stream:\n        for _ in stream.text_stream:\n            if ttft is None:\n                ttft = time.perf_counter() - t0          # first visible text\n        total = time.perf_counter() - t0\n    usage = stream.get_final_message().usage\n    return {\"ttft_s\": round(ttft, 2), \"total_s\": round(total, 2),\n            \"input_tokens\": usage.input_tokens, \"output_tokens\": usage.output_tokens}\n# Track p50/p95 TTFT per route; a long prompt or a slow retrieval step shows up here first.",
      },
      pitfalls: [
        "Measuring only total latency hides that users wait on retrieval and tool steps before any text.",
        "Long system prompts and stuffed context inflate prefill time; trim or cache them.",
        "Reasoning models think before answering, so TTFT can be long; show progress meanwhile.",
      ],
      docsUrl: "https://docs.vllm.ai/en/latest/design/metrics.html",
    },
    demo: "TtftDemo",
    related: ["system-design-06", "evals-18", "system-design-04", "system-design-08"],
    projects: ["build-system-design"],
    keywords: ["time to first token", "ttft", "latency", "prefill", "streaming", "perceived speed"],
  },
  {
    id: "system-design-08",
    area: "system-design",
    number: 8,
    slug: "throughput-vs-latency",
    name: "Throughput vs Latency",
    tier: "base",
    official:
      "More requests per second (big batches) vs a faster single reply. You trade one for the other.",
    kid: "A kitchen can cook one meal perfectly fast, or cook forty meals at once so more people eat each hour, but each one takes longer. Throughput vs latency is choosing between those two.",
    realWorld: {
      title: "One fast plate or forty plates an hour?",
      text: "If the chef cooks one plate at a time, each guest gets food in eight minutes, but only a few guests are served per hour. If she fills the whole stove with forty pans, the kitchen serves many more guests per hour, but each plate takes a bit longer because she moves between pans. A quiet café chooses fast plates; a wedding caterer chooses many plates. Both are right for their guests.",
    },
    engineering: {
      text: "Latency is how long one request takes (time to first token, time per output token, total time); throughput is how much work the system completes per unit of time (requests or tokens per second). On GPUs, batching more concurrent requests raises throughput and lowers cost per token, but each request gets slower because they share compute. Choose operating points per workload: interactive chat needs low latency with moderate batching; offline jobs maximise throughput. Tune with max batch size, concurrency limits and separate deployments per workload.",
      code: {
        lang: "bash",
        source:
          "# Benchmark one vLLM deployment at different concurrency levels\nfor c in 1 8 32 128; do\n  vllm bench serve \\\n    --model meta-llama/Llama-3.1-8B-Instruct \\\n    --dataset-name random --random-input-len 1000 --random-output-len 300 \\\n    --num-prompts 500 --max-concurrency $c\ndone\n# Typical shape of the results:\n#   concurrency 1   -> fastest per user, lowest total tokens/s (GPU mostly idle)\n#   concurrency 128 -> slower per user, many times more tokens/s overall\n# Pick the highest concurrency whose p95 latency still meets your target.",
      },
      pitfalls: [
        "Benchmarking with one user and then serving hundreds gives a false picture; test at real concurrency.",
        "Optimising average throughput can blow up p95 latency for interactive users.",
        "Mixing interactive and bulk traffic on one deployment lets batch jobs slow down live users.",
      ],
      docsUrl: "https://docs.vllm.ai/en/latest/performance/optimization.html",
    },
    demo: "ThroughputLatencyDemo",
    related: ["system-design-10", "evals-18", "system-design-14", "deployment-12"],
    projects: ["build-system-design"],
    keywords: ["throughput", "latency", "batch size", "concurrency", "tokens per second", "trade-off"],
  },
  {
    id: "system-design-09",
    area: "system-design",
    number: 9,
    slug: "inference-serving-with-vllm",
    name: "Inference Serving with vLLM",
    tier: "base",
    official:
      "An open-source server for running open models fast on your own GPUs.",
    kid: "Instead of ordering food from a restaurant every day, you set up your own kitchen with a super-organised cook. vLLM is that organised cook for running open models fast on your own computers.",
    realWorld: {
      title: "Your own kitchen with a super-organised cook",
      text: "Ordering from restaurants every night is easy but adds up, and you can't change the recipes. So the company opens its own kitchen with its own recipes. A kitchen alone is slow if the cook works on one dish at a time, so it hires a cook famous for organisation: dozens of orders on the stove at once, no wasted space on the counter, and a menu that looks just like the restaurant's so waiters don't need retraining.",
    },
    engineering: {
      text: "vLLM is an open-source inference server for open-weight models on your own GPUs. It combines continuous batching, PagedAttention memory management, prefix caching, quantization support (AWQ, GPTQ, FP8), tensor and pipeline parallelism, speculative decoding and structured output, and exposes an OpenAI-compatible API, so existing client code works by changing the base URL. Alternatives include SGLang, TensorRT-LLM, TGI and llama.cpp. Self-hosting gives control, privacy and potentially lower cost at scale, but you own capacity planning and operations.",
      code: {
        lang: "bash",
        source:
          "pip install vllm\n\n# Serve an open model with an OpenAI-compatible API on port 8000\nvllm serve Qwen/Qwen2.5-7B-Instruct \\\n  --max-model-len 16384 \\\n  --gpu-memory-utilization 0.90 \\\n  --enable-prefix-caching\n\n# Any OpenAI client works by pointing at it\npython - <<'EOF'\nfrom openai import OpenAI\nclient = OpenAI(base_url=\"http://localhost:8000/v1\", api_key=\"unused\")\nr = client.chat.completions.create(\n    model=\"Qwen/Qwen2.5-7B-Instruct\",\n    messages=[{\"role\": \"user\", \"content\": \"Explain RAG in one sentence.\"}],\n)\nprint(r.choices[0].message.content)\nEOF",
      },
      pitfalls: [
        "Self-hosting means owning GPUs, scaling, upgrades and on-call; compare total cost, not just token price.",
        "Max context length drives KV cache memory; set it to what you need, not the model's maximum.",
        "Open models differ in chat templates and tool-call formats; test them with your prompts and evals.",
      ],
      docsUrl: "https://docs.vllm.ai/en/latest/getting_started/quickstart.html",
    },
    demo: "VllmDemo",
    related: ["system-design-10", "system-design-11", "deployment-10", "llm-20"],
    projects: ["build-system-design"],
    keywords: ["vllm", "inference server", "self-hosting", "open models", "openai-compatible", "gpu serving"],
  },
  {
    id: "system-design-10",
    area: "system-design",
    number: 10,
    slug: "continuous-batching",
    name: "Continuous Batching",
    tier: "base",
    official:
      "New requests join the running batch at every step instead of waiting for the batch to finish.",
    kid: "A smart cook in the kitchen doesn't wait for every pan to finish; the moment one dish is plated, a new order goes in that spot. Continuous batching keeps every spot busy the same way.",
    realWorld: {
      title: "A free burner never stays empty",
      text: "An old-fashioned cook starts eight dishes together and waits until all eight are done before starting the next eight. The quick omelette finishes in two minutes, then its burner sits empty for twenty minutes while the stew finishes. Our cook works differently: the moment the omelette is plated, the next order goes on that burner. Same stove, far more dishes per hour, and short orders don't wait for long ones.",
    },
    engineering: {
      text: "LLM requests have very different output lengths. Static batching waits for every sequence in a batch to finish, so short requests idle their slot while long ones complete, and new requests wait for the next batch. Continuous (in-flight) batching schedules at the level of each decoding step: finished sequences leave and waiting requests join immediately. That raises GPU utilisation and throughput several times and cuts queueing delay. It is standard in vLLM, SGLang, TGI and TensorRT-LLM; tune it with the maximum number of concurrent sequences and token budgets per step.",
      code: {
        lang: "bash",
        source:
          "# Continuous batching is on by default in vLLM; these knobs shape it\nvllm serve meta-llama/Llama-3.1-8B-Instruct \\\n  --max-num-seqs 128 \\              # how many requests can share the GPU at once\n  --max-num-batched-tokens 8192 \\   # work per scheduling step (prefill + decode)\n  --enable-chunked-prefill           # split long prompts so they don't stall running requests\n\n# Watch it work: running vs waiting requests and GPU KV cache usage\ncurl -s localhost:8000/metrics | grep -E \"num_requests_(running|waiting)|kv_cache_usage\"",
      },
      pitfalls: [
        "Too low a max-num-seqs leaves the GPU idle; too high runs out of KV cache memory and causes preemption.",
        "Very long prompts can stall decoding for everyone; enable chunked prefill.",
        "Throughput gains need concurrent traffic; one user at a time sees no benefit.",
      ],
      docsUrl: "https://www.anyscale.com/blog/continuous-batching-llm-inference",
    },
    demo: "ContinuousBatchingDemo",
    related: ["system-design-09", "system-design-08", "system-design-11"],
    projects: ["build-system-design"],
    keywords: ["continuous batching", "in-flight batching", "static batching", "gpu utilization", "vllm", "scheduling"],
  },
  {
    id: "system-design-11",
    area: "system-design",
    number: 11,
    slug: "pagedattention",
    name: "PagedAttention",
    tier: "production",
    official:
      "Store the KV cache in small pages, like OS memory, so far less GPU memory is wasted.",
    kid: "Instead of giving every cook a huge counter just in case, the kitchen hands out small trays only when they need more room. PagedAttention gives memory to the computer's work in small pieces, so little goes to waste.",
    realWorld: {
      title: "Trays instead of reserved counters",
      text: "The kitchen used to reserve a whole two-metre counter for every order, in case it became a ten-course meal. Most orders used half a metre, and the rest stood empty while new orders waited for space. Now every order gets small trays, one at a time, as it needs them, from a shared stack. The same kitchen fits three times as many orders, and two orders with the same starter can even share a tray.",
    },
    engineering: {
      text: "During generation each request keeps a KV cache that grows with every token. Older servers reserved one contiguous block per request sized for the maximum length, wasting most GPU memory through over-reservation and fragmentation. PagedAttention, introduced by vLLM, splits the KV cache into fixed-size blocks allocated on demand and tracked by a block table, like virtual memory pages in an operating system. Waste drops to the last partial block, many more requests fit in memory (higher batch size and throughput), and identical prefixes can share blocks.",
      code: {
        lang: "python",
        source:
          "# Rough KV cache math for a Llama-3-8B-style model (16-bit, grouped-query attention)\nlayers, kv_heads, head_dim, bytes_per = 32, 8, 128, 2\nkv_per_token = 2 * layers * kv_heads * head_dim * bytes_per      # K and V -> 131,072 bytes ≈ 128 KB\n\nfree_gb, max_len, avg_len, block = 40, 8192, 1200, 16\nreserve_per_request = kv_per_token * max_len                     # contiguous: reserve the max\npaged_per_request = kv_per_token * (-(-avg_len // block) * block) # paged: only what is used\n\nprint(\"requests that fit, contiguous:\", int(free_gb * 2**30 // reserve_per_request))   # ~40\nprint(\"requests that fit, paged:     \", int(free_gb * 2**30 // paged_per_request))     # ~270",
      },
      pitfalls: [
        "Setting max-model-len far above real needs still shrinks how many sequences can be scheduled.",
        "When KV memory runs out, requests get preempted and recomputed; watch preemption metrics.",
        "Long-context traffic changes the math; size GPUs for your real prompt and output lengths.",
      ],
      docsUrl: "https://blog.vllm.ai/2023/06/20/vllm.html",
    },
    demo: "PagedAttentionDemo",
    related: ["llm-05", "system-design-10", "system-design-09", "system-design-04"],
    projects: ["build-system-design"],
    keywords: ["pagedattention", "kv cache", "memory fragmentation", "gpu memory", "vllm", "blocks"],
  },
  {
    id: "system-design-12",
    area: "system-design",
    number: 12,
    slug: "speculative-decoding",
    name: "Speculative Decoding",
    tier: "production",
    official:
      "A small draft model guesses a few tokens; the big model checks them all in one pass.",
    kid: "A helper quickly guesses the next few words of a recipe card, and the head chef checks them all at a glance, keeping the right ones. Speculative decoding speeds up a big model with a small helper's guesses.",
    realWorld: {
      title: "The helper guesses, the chef checks",
      text: "The head chef writes every recipe card slowly and carefully, one word at a time. Her apprentice is fast and often right about obvious words. So the apprentice writes the next five words in pencil, and the chef reads them all in one glance: the first three are right, so she keeps them and writes the fourth herself. Cards come out identical to what the chef alone would write, just faster.",
    },
    engineering: {
      text: "Speculative decoding speeds up generation without changing the output distribution. A small draft model (or extra heads such as Medusa or EAGLE, or n-gram lookup from the prompt) proposes k tokens; the large target model verifies all of them in a single forward pass and accepts the longest correct prefix plus one token of its own. Because decoding is memory-bound, verifying several tokens costs about the same as generating one, so speedups of two to three times are common when acceptance is high. Gains fall at large batch sizes and for unpredictable text.",
      code: {
        lang: "bash",
        source:
          "# vLLM: a small draft model proposes 5 tokens per step; the big model verifies them\nvllm serve meta-llama/Llama-3.1-70B-Instruct \\\n  --tensor-parallel-size 4 \\\n  --speculative-config '{\"model\": \"meta-llama/Llama-3.2-1B-Instruct\", \"num_speculative_tokens\": 5}'\n\n# Or n-gram speculation: copy likely continuations from the prompt itself\n# (great for editing, summarising and RAG answers that quote the context)\n#   --speculative-config '{\"method\": \"ngram\", \"num_speculative_tokens\": 5, \"prompt_lookup_max\": 4}'\n\n# Check the acceptance rate in the metrics; low acceptance means little speedup.",
      },
      pitfalls: [
        "The draft model must share the target's tokenizer and be much faster, or the gains vanish.",
        "At high batch sizes the GPU is already busy, so speculation helps much less.",
        "Low acceptance on creative or unusual text can even slow things down; measure on your traffic.",
      ],
      docsUrl: "https://docs.vllm.ai/en/latest/features/spec_decode.html",
    },
    demo: "SpeculativeDemo",
    related: ["llm-19", "system-design-09", "system-design-07"],
    projects: ["build-system-design"],
    keywords: ["speculative decoding", "draft model", "acceptance rate", "eagle", "medusa", "faster generation"],
  },
  {
    id: "system-design-13",
    area: "system-design",
    number: 13,
    slug: "gpu-vs-api-cost",
    name: "GPU vs API Cost",
    tier: "production",
    official:
      "When renting GPUs and self-hosting beats paying per token, and when it doesn't.",
    kid: "Ordering takeaway is cheap for a few meals, but if you feed a hundred people every day, owning a kitchen costs less. GPU vs API cost is working out when running your own models is cheaper than paying per use.",
    realWorld: {
      title: "Takeaway or your own kitchen?",
      text: "For a few lunches a week, ordering takeaway is clearly cheaper: no rent, no equipment, no staff. A canteen feeding hundreds every day is different: its own kitchen costs a lot even on quiet days, but each meal ends up much cheaper. The break-even depends on how busy the kitchen really is. An empty kitchen still costs rent, and running one well needs skilled people.",
    },
    engineering: {
      text: "API pricing is per token with no fixed cost; self-hosting on rented GPUs is a fixed hourly cost whose cost per token depends on utilisation. Self-hosting tends to win only with steady, high volume, a model small enough to serve efficiently (often a fine-tuned or distilled open model), strict data-residency needs, or latency control. Compare total cost of ownership: GPU hours including idle and redundancy, engineering and on-call time, and quality differences versus frontier APIs. Re-check regularly, because API prices keep falling.",
      code: {
        lang: "python",
        source:
          "# Break-even sketch (illustrative numbers; plug in your own quotes)\napi_price_per_m = {\"input\": 0.80, \"output\": 4.00}          # $ per million tokens\ntokens_per_day = {\"input\": 400e6, \"output\": 60e6}\napi_monthly = 30 * sum(tokens_per_day[k] / 1e6 * api_price_per_m[k] for k in tokens_per_day)\n\ngpu_hourly, gpus = 2.50, 2                                 # 2 GPUs for redundancy, 24/7\ncapacity_tokens_per_s = 2 * 2_500                          # measured with your model and traffic\nneeded_tokens_per_s = sum(tokens_per_day.values()) / 86_400\nutilisation = needed_tokens_per_s / capacity_tokens_per_s\nself_hosted_monthly = gpu_hourly * gpus * 24 * 30 + 6_000  # + share of an engineer's time\n\nprint(f\"API ${api_monthly:,.0f}/mo vs self-hosted ${self_hosted_monthly:,.0f}/mo \"\n      f\"at {utilisation:.0%} GPU utilisation\")",
      },
      pitfalls: [
        "Comparing token prices with GPU prices at 100% utilisation; real traffic has nights and weekends.",
        "Forgetting engineering, monitoring and on-call costs of running your own serving stack.",
        "A cheaper self-hosted model that answers worse can cost more in support and lost users.",
      ],
      docsUrl: "https://docs.vllm.ai/en/latest/performance/benchmarks.html",
    },
    demo: "GpuVsApiDemo",
    related: ["deployment-10", "llm-20", "system-design-09", "system-design-20"],
    projects: ["build-system-design"],
    keywords: ["gpu vs api", "self-hosting cost", "tco", "break-even", "utilization", "cost per token"],
  },
  {
    id: "system-design-14",
    area: "system-design",
    number: 14,
    slug: "batch-inference",
    name: "Batch Inference",
    tier: "production",
    official:
      "Send big offline jobs as a batch at a lower price when nobody is waiting for the answer.",
    kid: "Cooking a hundred lunch box meals for tomorrow is cheaper than cooking each one when someone walks in. Batch inference sends big jobs that nobody is waiting for right now, at a lower price.",
    realWorld: {
      title: "Tomorrow's lunch boxes, cooked tonight",
      text: "A school orders 500 lunch boxes for tomorrow's trip. Nobody is waiting at the counter, so the kitchen doesn't cook them during the dinner rush. It cooks them overnight when the stoves are free, in big trays, and charges the school half the usual price. The lunches are ready by morning, the dinner guests never notice, and everyone saves money.",
    },
    engineering: {
      text: "Batch inference processes large offline workloads (classifying a backlog, generating embeddings, enriching documents, running eval suites, synthetic data) asynchronously instead of request by request. Provider batch APIs (Anthropic Message Batches, OpenAI Batch) accept thousands of requests in one job, return results within about 24 hours and cost roughly half the normal price, with separate rate limits. Self-hosted, offline batch runs at maximum batch size for best throughput. Use custom ids to join results, and handle partial failures.",
      code: {
        lang: "python",
        source:
          "from anthropic import Anthropic\n\nclient = Anthropic()\ntickets = load_support_tickets()                      # e.g. 20,000 old tickets to label\n\nbatch = client.messages.batches.create(requests=[\n    {\n        \"custom_id\": f\"ticket-{t.id}\",\n        \"params\": {\n            \"model\": \"claude-haiku-5-5\",\n            \"max_tokens\": 20,\n            \"messages\": [{\"role\": \"user\",\n                          \"content\": f\"Label as billing, bug, feature or other:\\n{t.text}\"}],\n        },\n    }\n    for t in tickets\n])\nprint(batch.id, batch.processing_status)              # check back later (or poll)\n\n# Later:\nfor result in client.messages.batches.results(batch.id):\n    if result.result.type == \"succeeded\":\n        save_label(result.custom_id, result.result.message.content[0].text)\n    else:\n        retry_later(result.custom_id)                  # errored or expired items",
      },
      pitfalls: [
        "Batch results can take hours; never use batch APIs for anything a user is waiting on.",
        "Some items fail or expire; track them by custom_id and resubmit.",
        "A wrong prompt multiplied by 20,000 is expensive; test on a small sample first.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/build-with-claude/batch-processing",
    },
    demo: "BatchInferenceDemo",
    related: ["system-design-15", "system-design-20", "system-design-08", "evals-14"],
    projects: ["build-system-design"],
    keywords: ["batch inference", "batch api", "message batches", "offline processing", "50% discount", "bulk jobs"],
  },
  {
    id: "system-design-15",
    area: "system-design",
    number: 15,
    slug: "async-job-pipelines",
    name: "Async Job Pipelines",
    tier: "production",
    official:
      "Put long AI tasks in a queue and run them in workers, outside the web request.",
    kid: "When a big catering order comes in, the waiter writes a ticket and the kitchen works through it step by step in the back, without making the guest stand at the counter. Async job pipelines run long AI work like that.",
    realWorld: {
      title: "The catering order in the back kitchen",
      text: "A company orders food for 300 people. Nobody stands at the counter while it is made. The order becomes a ticket on the back-kitchen board: chop, cook, pack, deliver. Each station takes tickets from the board, and if the oven fails halfway, the ticket returns to the board at the cooking step, not back to chopping. The customer can check the board and see exactly where their order is.",
    },
    engineering: {
      text: "Async job pipelines move long or heavy AI work (document ingestion, long agent runs, report generation, video or audio processing, bulk evals) out of the web request into queued, multi-step workflows run by workers. Each step (parse, chunk, embed, index, summarise) is idempotent and retried independently with backoff, progress is stored so failures resume from the last completed step, and the client gets a job id plus progress over polling, SSE or webhooks. Tools range from Celery and RQ to durable workflow engines such as Temporal, Inngest and Hatchet.",
      code: {
        lang: "python",
        source:
          "# A durable ingestion workflow with Temporal: each activity retries on its own,\n# and a crash resumes after the last completed step instead of starting over.\nfrom datetime import timedelta\nfrom temporalio import workflow\nfrom temporalio.common import RetryPolicy\n\nRETRY = RetryPolicy(initial_interval=timedelta(seconds=2), backoff_coefficient=2, maximum_attempts=5)\n\n@workflow.defn\nclass IngestDocument:\n    @workflow.run\n    async def run(self, doc_id: str) -> str:\n        opts = dict(start_to_close_timeout=timedelta(minutes=10), retry_policy=RETRY)\n        pages = await workflow.execute_activity(parse_pdf, doc_id, **opts)\n        chunks = await workflow.execute_activity(chunk_pages, pages, **opts)\n        vectors = await workflow.execute_activity(embed_chunks, chunks, **opts)    # batched calls\n        await workflow.execute_activity(upsert_vectors, vectors, **opts)\n        return f\"{doc_id}: {len(chunks)} chunks indexed\"",
      },
      pitfalls: [
        "Steps that aren't idempotent create duplicates when retried; key every write by document and step.",
        "Huge payloads passed between steps slow everything; pass references to object storage instead.",
        "Without per-step progress, users and on-call engineers can't tell stuck from slow.",
      ],
      docsUrl: "https://docs.temporal.io/workflows",
    },
    demo: "JobPipelineDemo",
    related: ["backend-12", "backend-13", "system-design-14", "agents-15"],
    projects: ["build-system-design"],
    keywords: ["async job pipelines", "workflows", "temporal", "celery", "workers", "durable execution", "ingestion"],
  },
  {
    id: "system-design-16",
    area: "system-design",
    number: 16,
    slug: "provider-rate-limits",
    name: "Provider Rate Limits",
    tier: "production",
    official:
      "Requests and tokens per minute are capped. Handle it with queues, backoff and spreading load.",
    kid: "The supplier only delivers forty boxes of vegetables per hour, however much the kitchen shouts. Provider rate limits work the same way: AI companies only accept so many questions and words each minute.",
    realWorld: {
      title: "Forty boxes an hour, no more",
      text: "Our vegetable supplier delivers at most forty boxes an hour and three tons a day. When the kitchen orders a hundred boxes at once, sixty come back with a note: 'too many, try again later'. So the kitchen plans: orders go on a list, are sent steadily, big orders are spread out, and when the supplier says 'wait', the kitchen waits. For big events, it also uses a second supplier.",
    },
    engineering: {
      text: "Model providers cap requests per minute (RPM), input and output tokens per minute (ITPM, OTPM) and sometimes daily usage, per organisation, model and usage tier; exceeding them returns 429 with retry headers. Production systems handle this with client-side rate limiting that tracks remaining capacity from response headers, a queue with a controlled send rate, priority for interactive traffic over background jobs, exponential backoff with jitter, spreading load across models, regions or providers, prompt caching (cached tokens may count less), and requesting higher tiers ahead of launches.",
      code: {
        lang: "python",
        source:
          "import asyncio\nfrom aiolimiter import AsyncLimiter\n\n# Stay under the provider's limits on our side instead of collecting 429s\nrpm = AsyncLimiter(max_rate=900, time_period=60)          # a bit below a 1,000 RPM limit\ntpm = AsyncLimiter(max_rate=380_000, time_period=60)      # a bit below a 400k input TPM limit\ninteractive = asyncio.Semaphore(64)\n\nasync def call_llm(messages, est_tokens: int):\n    async with interactive, rpm:\n        await tpm.acquire(est_tokens)                     # reserve the tokens we expect to send\n        resp = await client.messages.with_raw_response.create(\n            model=\"claude-sonnet-5-5\", max_tokens=500, messages=messages)\n        remaining = resp.headers.get(\"anthropic-ratelimit-input-tokens-remaining\")\n        metrics.gauge(\"provider.input_tokens_remaining\", float(remaining or 0))\n        return resp.parse()\n# Background jobs use a separate, lower limiter so they never starve live users.",
      },
      pitfalls: [
        "Retrying 429s immediately makes it worse; honour retry-after and add jitter.",
        "Limits are per model and per organisation; one batch job can starve the whole product.",
        "Launches and demos hit limits first; check your tier and request increases early.",
      ],
      docsUrl: "https://docs.claude.com/en/api/rate-limits",
    },
    demo: "ProviderRateLimitDemo",
    related: ["backend-14", "backend-16", "system-design-02", "system-design-14"],
    projects: ["build-system-design"],
    keywords: ["rate limits", "rpm", "tpm", "429", "provider limits", "throttling", "usage tiers"],
  },
  {
    id: "system-design-17",
    area: "system-design",
    number: 17,
    slug: "multi-tenant-design",
    name: "Multi-tenant Design",
    tier: "production",
    official:
      "Many customers on one system, each with separate data, limits and costs.",
    kid: "One big kitchen cooks for several restaurants, but each restaurant's recipes are kept in its own locked box and each gets its own share of the stove. Multi-tenant design keeps many customers apart in one system.",
    realWorld: {
      title: "One kitchen, many restaurants",
      text: "Our kitchen cooks for three restaurants. Each one's secret recipes live in its own locked drawer, labelled with its name, and cooks must check the label before opening any drawer. Each restaurant has a fixed share of stove time, so a huge party at one doesn't make the others' guests wait. At the end of the month, every restaurant gets a bill for exactly what it used.",
    },
    engineering: {
      text: "Multi-tenant design serves many customers (tenants) from shared infrastructure while isolating them. Isolation models range from a shared database with a tenant_id on every row (enforced with row-level security), to a schema or database per tenant, to dedicated deployments for large customers. In AI apps, tenant isolation must cover vector search filters or namespaces, caches, prompts and fine-tuned models, file storage and logs. Add per-tenant rate limits, token budgets and fair queuing against noisy neighbours, per-tenant cost attribution, and tenant-aware evals and data deletion.",
      code: {
        lang: "sql",
        source:
          "-- Postgres row-level security: the database itself enforces tenant isolation\nALTER TABLE chunks ENABLE ROW LEVEL SECURITY;\n\nCREATE POLICY tenant_isolation ON chunks\n  USING (tenant_id = current_setting('app.tenant_id')::bigint);\n\n-- Each request sets its tenant from the verified login token, then queries normally:\nSET LOCAL app.tenant_id = '42';\nSELECT id, text\nFROM chunks\nORDER BY embedding <=> $1          -- pgvector similarity\nLIMIT 5;                           -- only tenant 42's chunks can ever come back\n\n-- The application role must not own the table or bypass RLS.",
      },
      pitfalls: [
        "One missing tenant filter in a vector search leaks another customer's documents into answers.",
        "Caches and prompt logs keyed without the tenant become a cross-tenant leak.",
        "Without per-tenant limits, one big customer's batch job slows everyone down.",
      ],
      docsUrl: "https://www.postgresql.org/docs/current/ddl-rowsecurity.html",
    },
    demo: "MultiTenantDemo",
    related: ["security-17", "rag-07", "system-design-05", "backend-14"],
    projects: ["build-system-design"],
    keywords: ["multi-tenant", "tenant isolation", "row level security", "noisy neighbour", "saas", "per-tenant limits"],
  },
  {
    id: "system-design-18",
    area: "system-design",
    number: 18,
    slug: "rag-vs-fine-tuning",
    name: "RAG vs Fine-tuning",
    tier: "production",
    official:
      "RAG for fresh or private facts. Fine-tuning for style, format or one narrow skill.",
    kid: "To serve this week's special, the cook reads the new recipe card from the shelf; to cook in the house style, the cook goes to cooking school. RAG is reading from the shelf, and fine-tuning is the school.",
    realWorld: {
      title: "Read the card, or go to school?",
      text: "A new cook must serve today's specials, which change daily. Sending him to cooking school for each special would be absurd: he just reads today's card. But to plate everything in our restaurant's signature style, every time, without thinking, a few weeks of training works far better than a note on the wall. Most great cooks use both: trained in the style, reading today's card.",
    },
    engineering: {
      text: "RAG supplies knowledge at query time by retrieving relevant documents into the prompt: best for facts that change, private or per-user data, large corpora, and answers that need citations and access control. Fine-tuning changes the model's weights with examples: best for consistent style, tone or format, a narrow task done cheaper by a smaller model, domain language, or teaching a behaviour that prompts can't reliably produce. Fine-tuning is poor at adding fresh facts. Start with prompting plus RAG, measure with evals, and fine-tune for the gaps; combining both is common.",
      code: {
        lang: "python",
        source:
          "# A quick decision helper, used as a team checklist\ndef choose(needs: set[str]) -> str:\n    rag = {\"fresh facts\", \"private documents\", \"citations\", \"per-user access\", \"large corpus\"}\n    tune = {\"house style\", \"strict format\", \"narrow task at scale\", \"smaller cheaper model\",\n            \"domain jargon\"}\n    r, t = len(needs & rag), len(needs & tune)\n    if r and t:\n        return \"both: fine-tune for style or format, retrieve for facts\"\n    if r:\n        return \"RAG\"\n    if t:\n        return \"fine-tuning (after trying better prompts and few-shot examples)\"\n    return \"start with prompting and evals\"\n\nprint(choose({\"private documents\", \"citations\"}))            # RAG\nprint(choose({\"strict format\", \"narrow task at scale\"}))     # fine-tuning\nprint(choose({\"fresh facts\", \"house style\"}))                # both",
      },
      pitfalls: [
        "Fine-tuning to teach facts gives confident answers that go stale and can't cite sources.",
        "Skipping prompt engineering and evals before fine-tuning wastes time on the wrong fix.",
        "RAG quality is mostly retrieval quality; a fine-tune won't fix bad chunks or search.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview",
    },
    demo: "RagVsFinetuneDemo",
    related: ["llm-16", "rag-01", "llm-19", "llm-14"],
    projects: ["build-system-design"],
    keywords: ["rag vs fine-tuning", "fine-tuning", "rag", "knowledge", "style", "decision"],
  },
  {
    id: "system-design-19",
    area: "system-design",
    number: 19,
    slug: "context-window-management",
    name: "Context Window Management",
    tier: "production",
    official:
      "Decide what goes in the window: trim, summarise, retrieve only what's needed.",
    kid: "A cook's counter has little room, so she keeps today's food on it, writes a short note about yesterday and fetches the rest from the shelf. Context window management decides what goes on the counter.",
    realWorld: {
      title: "Only so much room on the counter",
      text: "During a long shift, the counter fills up with old bowls, notes and ingredients from earlier orders, until there's no room to work and the cook grabs the wrong jar. A tidy cook clears what's finished, writes a short note about what still matters ('table 4 is allergic to nuts'), keeps the current order's ingredients close, and fetches anything else from the shelf only when needed.",
    },
    engineering: {
      text: "Context window management decides which tokens go into each model call: system prompt, tool definitions, retrieved chunks, conversation history, tool results and scratchpads. Even with long windows, more context costs more, slows prefill, and degrades attention to what matters. Strategies include trimming to the last N turns, summarising or compacting older history, retrieving only relevant past messages or memories, truncating large tool outputs, deduplicating and reranking retrieved chunks, and keeping a stable, cacheable prefix. Measure answer quality as context grows.",
      code: {
        lang: "python",
        source:
          "def build_context(system: str, history: list[dict], question: str, budget: int = 24_000) -> list[dict]:\n    \"\"\"Keep the newest turns verbatim, compress the rest, add only relevant chunks.\"\"\"\n    recent = history[-6:]                                     # last 3 exchanges word for word\n    older = history[:-6]\n    summary = summarize(older) if older else \"\"               # e.g. 300 tokens instead of 30,000\n    chunks = rerank(question, retrieve(question, k=20))[:5]   # only the best evidence\n\n    messages = []\n    if summary:\n        messages.append({\"role\": \"user\", \"content\": f\"Summary of earlier conversation:\\n{summary}\"})\n        messages.append({\"role\": \"assistant\", \"content\": \"Understood.\"})\n    messages += recent\n    messages.append({\"role\": \"user\", \"content\": format_chunks(chunks) + \"\\n\\nQuestion: \" + question})\n\n    while count_tokens(system, messages) > budget and len(messages) > 3:\n        messages.pop(2 if summary else 0)                     # drop the oldest verbatim turn\n    return messages",
      },
      pitfalls: [
        "Stuffing the whole window because it fits raises cost and often lowers answer quality.",
        "Summaries silently drop details like constraints and allergies; pin critical facts separately.",
        "Changing early context every turn breaks prompt caching; keep the stable part first.",
      ],
      docsUrl: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
    },
    demo: "ContextWindowDemo",
    related: ["llm-04", "agents-17", "agents-18", "rag-10"],
    projects: ["build-system-design"],
    keywords: ["context window", "context management", "summarization", "trimming", "compaction", "long context"],
  },
  {
    id: "system-design-20",
    area: "system-design",
    number: 20,
    slug: "cost-optimization",
    name: "Cost Optimization",
    tier: "production",
    official:
      "Routing, caching, batching, shorter prompts and smaller models, together, to cut the bill.",
    kid: "A smart kitchen saves money in many small ways: helpers cook easy dishes, soup is made in big pots, and nothing is cooked twice. Cost optimization combines all those tricks to make the bill smaller.",
    realWorld: {
      title: "Many small savings add up",
      text: "The restaurant's food bill doubled in a year. No single trick fixed it. Helpers now cook the simple dishes, popular soups are made once in big pots, the bases are prepped ahead, tomorrow's catering is cooked in the quiet night hours at a lower cost, and portions match what guests actually eat. Each change saved a little; together they cut the bill by more than half, and the guests didn't notice anything except faster food.",
    },
    engineering: {
      text: "LLM cost optimization starts with measurement: cost per request, per feature, per tenant and per successful outcome. The big levers, roughly in order of effort: shorter prompts and capped outputs, prompt or prefix caching for stable context, model routing to smaller models, semantic or exact caching, batch APIs for offline work, fewer and better retrieved chunks, limiting agent steps, and distilled, fine-tuned or self-hosted models at high volume. Savings multiply. Guard every change with evals, so cheaper never silently means worse.",
      code: {
        lang: "python",
        source:
          "# Estimate the combined effect before building anything (savings multiply, they don't add)\nbaseline = 12_000                                   # $ per month today\nlevers = {\n    \"trim prompts and cap outputs\": 0.80,           # remaining share of cost\n    \"prompt caching of the handbook\": 0.75,\n    \"route 70% of traffic to a small model\": 0.45,\n    \"semantic cache for FAQ traffic\": 0.85,\n    \"nightly jobs through the batch API\": 0.93,\n}\ncost = baseline\nfor name, remaining in levers.items():\n    cost *= remaining\n    print(f\"{name:<40} -> ${cost:,.0f}/month\")\nprint(f\"total saving: {1 - cost / baseline:.0%}  (re-run evals after each step!)\")",
      },
      pitfalls: [
        "Optimising without per-feature cost data targets the wrong place; measure first.",
        "Cheaper routes and smaller prompts can quietly lower quality; gate each change with evals.",
        "Engineering time is a cost too; start with the levers that save the most for the least work.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/about-claude/pricing",
    },
    demo: "CostOptimizationDemo",
    related: ["system-design-01", "system-design-03", "system-design-04", "evals-19"],
    projects: ["build-system-design"],
    keywords: ["cost optimization", "llm cost", "routing", "caching", "batch", "finops", "cost per request"],
  },
];

export default concepts;

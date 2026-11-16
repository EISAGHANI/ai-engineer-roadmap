import type { ConceptInput } from "../schema";

/** Area: llm. Official one-liners are verbatim from the AI Engineer Roadmap (LearnVora, Nov 2026). */
const concepts: ConceptInput[] = [
  {
    id: "llm-01",
    area: "llm",
    number: 1,
    slug: "tokenization",
    name: "Tokenization",
    tier: "base",
    official:
      "Text is cut into tokens (word pieces) before the model reads it. Limits and prices are counted in tokens.",
    kid: "Before a computer reads your sentence, it cuts it into little pieces, like cutting a sandwich into bites. Longer sentences mean more bites, and more bites cost more.",
    realWorld: {
      title: "The parrot's note cards",
      text: "Our well-read parrot cannot read a whole page at once. The librarian cuts every sentence into small note cards, one word or word-piece per card, and hands them over one by one. The library charges per card, so a long letter costs more than a short one, and the parrot's desk only has room for so many cards.",
    },
    engineering: {
      text: "A tokenizer (usually BPE or SentencePiece) maps text to integer ids from a fixed vocabulary of 30k-200k entries. Common words are one token; rare words, code and non-English text split into several. Context limits, rate limits and prices are all counted in tokens, so the same prompt can cost more in one language than another. Always measure token counts with the provider's own tokenizer rather than estimating from characters.",
      code: {
        lang: "python",
        source:
          "import tiktoken\n\nenc = tiktoken.get_encoding(\"cl100k_base\")\ntext = \"Tokenization cuts text into word pieces.\"\nids = enc.encode(text)\nprint(len(ids), ids)              # 8 tokens, e.g. [3404, 2065, 15061, ...]\nprint([enc.decode([i]) for i in ids])  # ['Token', 'ization', ' cuts', ' text', ...]\n\n# Rule of thumb for English: ~4 characters or ~0.75 words per token.\n# Measure, don't guess: other languages and code use far more tokens.",
      },
      pitfalls: [
        "A 'word' is not a token: 'Tokenization' is two tokens, an emoji can be three.",
        "Non-English text often costs 2-4x more tokens for the same meaning.",
        "Different models use different tokenizers; counts are not portable between providers.",
      ],
      docsUrl: "https://platform.openai.com/tokenizer",
    },
    demo: "TokenizerDemo",
    related: ["llm-04", "llm-13"],
    projects: ["build-llm"],
    keywords: ["tokenization", "tokens", "word pieces", "bpe", "price", "count"],
  },
  {
    id: "llm-02",
    area: "llm",
    number: 2,
    slug: "transformer-architecture",
    name: "Transformer Architecture",
    tier: "base",
    official:
      "The network design behind GPT, Claude and Llama: stacked attention and feed-forward layers.",
    kid: "A transformer is the recipe for building a smart word-guesser. It stacks the same two steps many times: look at all the words, then think about them.",
    realWorld: {
      title: "A tower of reading rooms",
      text: "Imagine the parrot's brain as a tall tower. On every floor there are two rooms: in the first room the parrot looks at all the note cards and decides which ones matter to each other; in the second room it thinks about what it just noticed. The cards go up floor by floor, and at the top the parrot guesses the next word. GPT, Claude and Llama are all towers built from the same two rooms, just with different heights.",
    },
    engineering: {
      text: "A decoder-only transformer is a stack of identical blocks, each with a multi-head self-attention layer followed by a position-wise feed-forward network, with residual connections and layer normalisation around both. Token embeddings plus positional information go in at the bottom; a final linear layer over the vocabulary produces next-token logits. Model size is mostly the number of blocks, the hidden width and the number of attention heads.",
      code: {
        lang: "python",
        source:
          "# One transformer block, in pseudo-PyTorch\nclass Block(nn.Module):\n    def __init__(self, d_model, n_heads):\n        self.ln1 = nn.LayerNorm(d_model)\n        self.attn = nn.MultiheadAttention(d_model, n_heads)\n        self.ln2 = nn.LayerNorm(d_model)\n        self.ffn = nn.Sequential(nn.Linear(d_model, 4 * d_model), nn.GELU(),\n                                 nn.Linear(4 * d_model, d_model))\n\n    def forward(self, x):\n        x = x + self.attn(self.ln1(x))   # room 1: look at the other tokens\n        x = x + self.ffn(self.ln2(x))    # room 2: think about what you saw\n        return x\n\n# A model = embeddings -> N x Block -> final norm -> vocab logits",
      },
      pitfalls: [
        "Attention cost grows with the square of the sequence length; long prompts are expensive.",
        "The architecture is the same across vendors; data, scale and training make the difference.",
      ],
      docsUrl: "https://arxiv.org/abs/1706.03762",
    },
    illustration: "TransformerStack",
    related: ["llm-03"],
    projects: ["build-llm"],
    keywords: ["transformer", "architecture", "attention", "feed-forward", "layers", "gpt", "llama"],
  },
  {
    id: "llm-03",
    area: "llm",
    number: 3,
    slug: "self-attention",
    name: "Self-Attention",
    tier: "base",
    official:
      "Every token looks at the other tokens and decides which ones matter for its meaning.",
    kid: "When you read \"the dog chased its ball\", you know \"its\" means the dog. The computer does the same: every word looks around at the other words to find out what it means.",
    realWorld: {
      title: "Friends at a table",
      text: "Put all the note cards around a table. Each card can look at every other card and decide who its best friends are. The card \"its\" looks around and points at \"dog\". The card \"ball\" points at \"chased\". The parrot writes down these friendships for every card, and that is how it understands who did what in the sentence.",
    },
    engineering: {
      text: "For each token the model computes a query, a key and a value vector. The attention weight between two tokens is the softmax of the scaled dot product of one token's query with the other's key; the output is the weighted sum of the values. Multiple heads learn different relationships in parallel (syntax, coreference, position). In a decoder a causal mask stops tokens from attending to later positions.",
      code: {
        lang: "python",
        source:
          "import torch, math\n\ndef attention(Q, K, V, mask=None):\n    # Q, K, V: (seq_len, d_k)\n    scores = Q @ K.T / math.sqrt(K.shape[-1])   # how much each token looks at each other\n    if mask is not None:\n        scores = scores.masked_fill(mask == 0, float(\"-inf\"))  # causal: no peeking ahead\n    weights = torch.softmax(scores, dim=-1)       # rows sum to 1\n    return weights @ V                            # mix the values by those weights\n\n# weights[i, j] = how much token i attends to token j",
      },
      pitfalls: [
        "Attention is O(n^2) in sequence length for both compute and memory.",
        "Attention weights are not a faithful explanation of model reasoning; treat visualisations as hints.",
      ],
      docsUrl: "https://jalammar.github.io/illustrated-transformer/",
    },
    demo: "AttentionDemo",
    related: ["llm-02", "llm-05"],
    projects: ["build-llm"],
    keywords: ["self-attention", "attention", "query", "key", "value", "heads"],
  },
  {
    id: "llm-04",
    area: "llm",
    number: 4,
    slug: "context-windows",
    name: "Context Windows",
    tier: "base",
    official:
      "The most tokens (prompt + answer) a model can handle in one call.",
    kid: "The computer has a desk with room for only so many note cards at once. Your question and its answer both have to fit on the desk, or the cards fall off.",
    realWorld: {
      title: "The parrot's desk",
      text: "The parrot works at one desk, and the desk has a fixed size. The librarian lays out the question cards on one side; the parrot's answer cards go on the other side. If the question already fills most of the desk, there is little room left for the answer. A bigger desk (a bigger context window) costs more and the parrot takes longer to look over all the cards.",
    },
    engineering: {
      text: "The context window is the maximum number of tokens a single request may hold: system prompt, conversation history, retrieved documents, tool results and the generated answer all count. Exceeding it fails the request or silently truncates history. Larger windows cost more per request and models often attend less reliably to content in the middle of very long inputs, so retrieval and summarisation usually beat stuffing everything in.",
      code: {
        lang: "python",
        source:
          "MAX_CONTEXT = 128_000          # model limit, in tokens\nRESERVE_FOR_ANSWER = 2_000\n\ndef fits(messages, count_tokens):\n    used = sum(count_tokens(m[\"content\"]) for m in messages)\n    return used + RESERVE_FOR_ANSWER <= MAX_CONTEXT\n\n# Typical strategy when it does not fit:\n# 1. drop or summarise the oldest turns\n# 2. retrieve only the relevant chunks instead of whole documents\n# 3. cap tool results (e.g. first 2k tokens of a web page)",
      },
      pitfalls: [
        "The window is shared between input and output; a huge prompt leaves no room for the answer.",
        "'Lost in the middle': facts placed mid-prompt are recalled worse than those at the start or end.",
        "Filling the window every call is the fastest way to blow your budget.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/build-with-claude/context-windows",
    },
    demo: "ContextWindowDemo",
    related: ["llm-01", "system-design-19", "agents-18"],
    projects: ["build-llm"],
    keywords: ["context", "windows", "limit", "tokens", "prompt", "truncate"],
  },
  {
    id: "llm-05",
    area: "llm",
    number: 5,
    slug: "kv-cache",
    name: "KV Cache",
    tier: "base",
    official:
      "Saved keys and values of earlier tokens, so each new token doesn't redo the whole prompt.",
    kid: "When you read a long story out loud, you don't go back to page one for every new word. The computer keeps notes about the words it already read, so it only has to think about the new one.",
    realWorld: {
      title: "The parrot's sticky notes",
      text: "Our well-read parrot is answering a long question. Instead of re-reading the whole question each time it says a word, it sticks a small note on every word the first time it reads it. For the next word it just glances at the notes. More words mean more notes on the desk, which is why very long questions need a bigger desk.",
    },
    engineering: {
      text: "During autoregressive decoding every new token attends to all previous tokens. Without a cache the model recomputes the key and value projections for the whole sequence at each step, which is quadratic work over a generation. The KV cache stores K and V per layer and per head for every processed token, so each step only computes the new token's Q, K, V and attends over the cached K/V. Memory grows linearly with sequence length and is usually the limit on batch size in serving.",
      code: {
        lang: "python",
        source:
          "# Hugging Face transformers: the cache is on by default\nout = model.generate(**inputs, max_new_tokens=50, use_cache=True)\n\n# Rough KV-cache size per token (bytes):\n# 2 (K and V) * layers * kv_heads * head_dim * bytes_per_value\n# Llama-3 8B, fp16: 2 * 32 * 8 * 128 * 2 = 131072 bytes = 128 KB per token\n# 8k tokens -> ~1 GB of GPU memory for ONE sequence\nkv_per_token = 2 * 32 * 8 * 128 * 2\nprint(kv_per_token * 8192 / 1e9, \"GB\")",
      },
      pitfalls: [
        "Cache memory, not compute, is what caps how many users you can serve at once.",
        "Changing anything at the start of the prompt invalidates the cached prefix.",
        "Multi-turn chat re-sends history; without prefix caching you pay for it every turn.",
      ],
      docsUrl: "https://huggingface.co/docs/transformers/kv_cache",
    },
    demo: "KvCacheDemo",
    related: ["llm-03", "llm-12", "system-design-11", "system-design-04"],
    projects: ["build-llm", "build-system-design"],
    keywords: ["cache", "keys and values", "decoding", "memory", "attention"],
  },
  {
    id: "llm-06",
    area: "llm",
    number: 6,
    slug: "temperature-and-top-p",
    name: "Temperature and Top-p",
    tier: "base",
    official:
      "Sampling knobs. Low values give predictable answers, high values give varied ones.",
    kid: "When the parrot picks its next word, a dial decides how brave it is. Turn the dial low and it says the safe, usual word; turn it high and it picks surprising ones.",
    realWorld: {
      title: "The parrot's dice",
      text: "For every next word the parrot has a list of choices, each with a chance: 'mat' 60%, 'sofa' 25%, 'moon' 2%. Temperature is how much it shakes that list before choosing: low keeps the favourite on top, high flattens the list so rare words get picked. Top-p says: only roll among the words that together make up the top 90%, and throw the silly ones away.",
    },
    engineering: {
      text: "At each step the model outputs logits over its vocabulary. Temperature T divides the logits before the softmax: T < 1 sharpens the distribution (more deterministic), T > 1 flattens it (more diverse), and T = 0 is effectively greedy decoding. Top-p (nucleus sampling) keeps the smallest set of tokens whose cumulative probability reaches p and samples only from that set, cutting off the long tail. Use low temperature for extraction, classification and code, higher for brainstorming, and change one knob at a time.",
      code: {
        lang: "python",
        source:
          "import numpy as np\n\ndef sample(logits, temperature=1.0, top_p=1.0, rng=np.random.default_rng()):\n    if temperature == 0:\n        return int(np.argmax(logits))               # greedy: always the top word\n    probs = np.exp((logits - logits.max()) / temperature)\n    probs /= probs.sum()                             # softmax with temperature\n    order = np.argsort(probs)[::-1]                  # most likely first\n    cut = np.searchsorted(np.cumsum(probs[order]), top_p) + 1\n    keep = order[:cut]                               # nucleus: smallest set reaching top_p\n    return int(rng.choice(keep, p=probs[keep] / probs[keep].sum()))\n\n# With an API you only set the knobs:\n# client.messages.create(..., temperature=0.2)   # factual answers, code",
      },
      pitfalls: [
        "Temperature 0 does not guarantee identical outputs; batching and hardware can still change results.",
        "Tuning temperature and top-p together makes the effect hard to reason about; adjust one.",
        "Some reasoning models do not accept custom temperature values.",
      ],
      docsUrl: "https://huggingface.co/blog/how-to-generate",
    },
    demo: "TemperatureDemo",
    related: ["llm-10", "llm-14"],
    projects: ["build-llm"],
    keywords: ["temperature", "top-p", "sampling", "randomness", "creativity", "nucleus", "deterministic"],
  },
  {
    id: "llm-07",
    area: "llm",
    number: 7,
    slug: "system-prompts",
    name: "System Prompts",
    tier: "base",
    official:
      "Standing instructions that set the model's role, rules and output style.",
    kid: "Before a game starts, the teacher tells everyone the rules. A system prompt is the rule card the computer reads first, so it knows who to be and how to answer.",
    realWorld: {
      title: "The parrot's job card",
      text: "Before the parrot meets any visitor, the librarian pins a card above its perch: 'You are a children's science guide. Use short sentences. Never give medical advice.' Every question is answered with that card in view, so the same parrot can be a strict exam coach in one room and a friendly storyteller in another.",
    },
    engineering: {
      text: "The system prompt is a separate message (the `system` parameter in Anthropic's Messages API, a system or developer role message in OpenAI's) that frames every turn: role, task, constraints, tone, output format and what to do when unsure. Keep stable instructions here and per-request data in the user turn. Be explicit, give the reason behind each rule, and version system prompts like code, because one small edit changes behaviour in every conversation.",
      code: {
        lang: "python",
        source:
          "from anthropic import Anthropic\n\nclient = Anthropic()\nSYSTEM = \"\"\"You are a patient tutor for absolute beginners.\n- Explain in at most 3 short sentences, then give one everyday example.\n- If you are not sure, say \"I don't know\" instead of guessing.\n- Answer in the language the user writes in.\"\"\"\n\nreply = client.messages.create(\n    model=\"claude-sonnet-5-5\",   # use your current model\n    max_tokens=300,\n    system=SYSTEM,                # standing instructions for every turn\n    messages=[{\"role\": \"user\", \"content\": \"What is a token?\"}],\n)\nprint(reply.content[0].text)",
      },
      pitfalls: [
        "A system prompt is not a security boundary: users can try to override it with prompt injection.",
        "Never put secrets or API keys in it; assume it can leak.",
        "A long list of contradictory rules is followed less reliably than a few clear ones.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/system-prompts",
    },
    demo: "SystemPromptDemo",
    related: ["llm-08", "security-01", "deployment-16"],
    projects: ["build-llm"],
    keywords: ["system prompt", "role", "instructions", "persona", "rules", "tone", "style"],
  },
  {
    id: "llm-08",
    area: "llm",
    number: 8,
    slug: "few-shot-prompting",
    name: "Few-shot Prompting",
    tier: "base",
    official:
      "Put 2-5 worked examples in the prompt so the model copies the pattern.",
    kid: "If you show a friend two or three finished puzzles, they quickly see how to solve the next one. Giving the computer a few examples works the same way.",
    realWorld: {
      title: "Showing the parrot how it's done",
      text: "The librarian wants book labels in one exact style. Instead of explaining rules, she shows the parrot three finished labels: 'Dune | Herbert | Sci-Fi', 'Emma | Austen | Classic', 'It | King | Horror'. Then she hands it a new book. The parrot copies the pattern, separators and all, because examples teach a format better than long instructions.",
    },
    engineering: {
      text: "Few-shot prompting puts 2-5 input/output pairs before the real input. The model infers the format, label set, tone and edge-case handling from them (in-context learning) with no training. Pick examples that are diverse and cover tricky cases, keep their format identical, and wrap them in clear delimiters such as XML tags. Examples cost input tokens on every call, so pair them with prompt caching when the prefix is stable.",
      code: {
        lang: "python",
        source:
          "examples = [\n    (\"I waited 40 minutes and the food was cold.\", \"negative\"),\n    (\"Friendly staff, will come back!\", \"positive\"),\n    (\"It was okay, nothing special.\", \"neutral\"),\n]\nshots = \"\\n\".join(\n    f\"<example><review>{t}</review><label>{l}</label></example>\" for t, l in examples\n)\nprompt = f\"\"\"Classify the review as positive, negative or neutral.\n{shots}\n<review>The pizza was great but delivery took forever.</review>\n<label>\"\"\"\n# The model continues the pattern with one label, e.g. \"neutral\"",
      },
      pitfalls: [
        "The model copies everything, including mistakes and accidental patterns such as every example having the same length.",
        "Unbalanced examples bias the output toward the most common label.",
        "Three to five good examples usually beat twenty average ones, and cost far fewer tokens.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/multishot-prompting",
    },
    demo: "FewShotDemo",
    related: ["llm-07", "llm-12", "llm-11"],
    projects: ["build-llm"],
    keywords: ["few-shot", "examples", "in-context learning", "pattern", "format", "multishot"],
  },
  {
    id: "llm-09",
    area: "llm",
    number: 9,
    slug: "chain-of-thought",
    name: "Chain of Thought",
    tier: "base",
    official:
      "Ask the model to reason step by step before it answers. Helps on multi-step problems.",
    kid: "When the teacher asks a hard sum, writing each step on paper helps you get it right. Asking the computer to think step by step does the same thing.",
    realWorld: {
      title: "Working it out on scrap paper",
      text: "A visitor asks the parrot: 'A book costs 12 euros. I have 50 and buy three. How much is left?' Blurting out a number, the parrot often gets it wrong. When the librarian adds 'work it out step by step first', the parrot writes: three books cost 36, 50 minus 36 is 14, so 14 euros are left. Each written step gives the next one something solid to stand on.",
    },
    engineering: {
      text: "Chain-of-thought prompting asks the model to write intermediate reasoning before the final answer, for example 'Think step by step' or a <thinking> section followed by an <answer> section. Each generated token conditions the next, so writing out steps lets the model spend more computation on arithmetic, logic and planning. Keep reasoning and answer separate so your code parses only the answer, and remember that reasoning tokens are billed and slow the reply. Reasoning models do this internally, so explicit CoT matters most for standard models.",
      code: {
        lang: "python",
        source:
          "import re\n\nprompt = \"\"\"A shop sells pens at 3 euros each, or 4 for 10 euros.\nWhat is the cheapest way to buy exactly 10 pens?\n\nThink it through step by step inside <thinking> tags.\nThen give only the final answer inside <answer> tags.\"\"\"\n\ntext = call_llm(prompt)                           # your LLM call\nanswer = re.search(r\"<answer>(.*?)</answer>\", text, re.S).group(1).strip()\n# <thinking>: 2 packs of 4 = 20 euros for 8 pens, plus 2 single pens = 6 euros\nprint(answer)                                     # \"26 euros\"",
      },
      pitfalls: [
        "The written reasoning is not guaranteed to be the real reason for the answer; don't treat it as an audit trail.",
        "It adds output tokens: higher cost and slower replies on easy tasks where it does not help.",
        "Parse only the final answer; never show raw reasoning to users unchecked.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/chain-of-thought",
    },
    demo: "ChainOfThoughtDemo",
    related: ["llm-10", "agents-03"],
    projects: ["build-llm"],
    keywords: ["chain of thought", "step by step", "reasoning", "cot", "thinking", "multi-step"],
  },
  {
    id: "llm-10",
    area: "llm",
    number: 10,
    slug: "reasoning-models",
    name: "Reasoning Models",
    tier: "base",
    official:
      "Models trained to think at length before answering. Slower and pricier, better on hard tasks.",
    kid: "Some puzzles need a quick guess, others need you to sit and think. Reasoning models are computers that stop and think longer, so they are slower but much better at hard puzzles.",
    realWorld: {
      title: "The quick parrot and the careful owl",
      text: "The library hires an owl to sit next to the parrot. The parrot answers instantly and is perfect for 'where is the toilet?'. The owl takes a minute, scribbles notes nobody sees and checks its own work, so it wins at tricky maths and planning questions. The owl also charges more per question, so the librarian sends only the hard ones its way.",
    },
    engineering: {
      text: "Reasoning models (OpenAI's o-series, Claude with extended thinking, DeepSeek-R1, Gemini thinking models) are trained with reinforcement learning to produce a long internal chain of thought before they answer. They score far higher on maths, code and multi-step planning, but they generate many more output tokens, so they cost more and take longer, especially before the first visible word. You usually control the effort with a thinking budget or effort setting. Route easy requests to a standard model and only hard ones to a reasoning model.",
      code: {
        lang: "python",
        source:
          "from anthropic import Anthropic\n\nclient = Anthropic()\nreply = client.messages.create(\n    model=\"claude-sonnet-5-5\",                          # use your current model\n    max_tokens=16000,\n    thinking={\"type\": \"enabled\", \"budget_tokens\": 8000},  # room to think first\n    messages=[{\"role\": \"user\", \"content\": \"Plan a 3-city rail trip under 300 euros...\"}],\n)\nfor block in reply.content:\n    if block.type == \"text\":\n        print(block.text)                                # the final answer only\nprint(reply.usage.output_tokens)                         # thinking is billed as output",
      },
      pitfalls: [
        "Thinking tokens are billed as output tokens: a short answer can still be expensive.",
        "The wait before the first visible word is much longer; stream progress or run them as background jobs.",
        "Very detailed step-by-step instructions can hurt; give the goal and constraints and let the model plan.",
        "Thinking-budget parameter names differ by provider and change between versions; check the current docs.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/build-with-claude/extended-thinking",
    },
    demo: "ReasoningModelDemo",
    related: ["llm-06", "llm-09", "system-design-01"],
    projects: ["build-llm"],
    keywords: ["reasoning models", "extended thinking", "thinking budget", "o1", "slow", "hard tasks", "routing"],
  },
  {
    id: "llm-11",
    area: "llm",
    number: 11,
    slug: "structured-outputs",
    name: "Structured Outputs",
    tier: "production",
    official:
      "Force the reply into JSON that matches your schema, so your code can parse it every time.",
    kid: "Imagine a form with boxes for name, age and colour. Instead of writing a messy letter, the computer must fill in every box, so another computer can read it without guessing.",
    realWorld: {
      title: "The parrot fills in a form",
      text: "The library's catalogue machine cannot read chatty answers like 'Oh, that one is by Austen, lovely book!'. So the librarian gives the parrot a form with three boxes: title, author, year. The parrot may only answer by filling in the boxes, and a form with an empty or wrong box is handed back. Now the catalogue machine can read every answer.",
    },
    engineering: {
      text: "Structured outputs constrain generation to a JSON Schema, either through the provider's native JSON-schema mode or by forcing a tool call whose input schema is your target type. Constrained decoding means the reply always parses and has the required fields and types, which removes fragile regex parsing. Define the schema once with Pydantic or Zod, still validate the result, and keep schemas small: very large or deeply nested schemas are slower and more error-prone.",
      code: {
        lang: "python",
        source:
          "from anthropic import Anthropic\nfrom pydantic import BaseModel\n\nclass Book(BaseModel):\n    title: str\n    author: str\n    year: int\n\nclient = Anthropic()\nreply = client.messages.create(\n    model=\"claude-sonnet-5-5\",                          # use your current model\n    max_tokens=200,\n    tools=[{\"name\": \"save_book\", \"description\": \"Save one book\",\n            \"input_schema\": Book.model_json_schema()}],\n    tool_choice={\"type\": \"tool\", \"name\": \"save_book\"},  # the reply MUST use this schema\n    messages=[{\"role\": \"user\", \"content\": \"Emma, written by Jane Austen in 1815\"}],\n)\nbook = Book.model_validate(reply.content[0].input)     # a typed object, not a string\nprint(book.year + 1)                                    # 1816",
      },
      pitfalls: [
        "Valid JSON is not correct JSON: the values can still be wrong, so validate meaning too.",
        "A schema that forces an answer leaves no room for 'unknown'; add nullable fields or a 'not found' option.",
        "Very large or deeply nested schemas slow generation and raise error rates.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/build-with-claude/tool-use",
    },
    demo: "StructuredOutputDemo",
    related: ["llm-08", "security-06", "backend-19", "agents-01"],
    projects: ["build-llm"],
    keywords: ["structured outputs", "json", "schema", "pydantic", "parse", "tool use", "format"],
  },
  {
    id: "llm-12",
    area: "llm",
    number: 12,
    slug: "prompt-caching",
    name: "Prompt Caching",
    tier: "production",
    official:
      "Reuse an unchanged prompt prefix across calls to cut cost and latency.",
    kid: "If you read the same long story every morning, you would keep a bookmark instead of starting again. The computer keeps the start of a long question ready, so repeat questions are faster and cheaper.",
    realWorld: {
      title: "The rulebook stays open on the desk",
      text: "Every visitor to the law section asks about the same 300-page rulebook. Without caching, the parrot reads the whole rulebook again for each visitor. With caching, the librarian leaves the rulebook open on the desk for a few minutes: the next visitor only adds their own question, so the answer comes faster and the library pays much less for the reading.",
    },
    engineering: {
      text: "Prompt caching stores the processed state of a prompt prefix (system prompt, tool definitions, long documents, earlier turns) on the provider's side. A later request with a byte-identical prefix reads it from the cache instead of reprocessing it, which bills those tokens at a fraction of the normal input price and shortens the time to first token. Some providers cache automatically above a minimum length; Anthropic uses explicit cache_control breakpoints. Put stable content first and variable content last, and watch the cache fields in the usage data.",
      code: {
        lang: "python",
        source:
          "from anthropic import Anthropic\n\nclient = Anthropic()\nRULEBOOK = open(\"rulebook.txt\").read()               # long and never changes\n\ndef ask(question: str):\n    return client.messages.create(\n        model=\"claude-sonnet-5-5\",                    # use your current model\n        max_tokens=500,\n        system=[\n            {\"type\": \"text\", \"text\": \"Answer using the rulebook only.\"},\n            {\"type\": \"text\", \"text\": RULEBOOK,\n             \"cache_control\": {\"type\": \"ephemeral\"}},  # cache everything up to here\n        ],\n        messages=[{\"role\": \"user\", \"content\": question}],  # only this part changes\n    )\n\nr = ask(\"Can I park here on Sundays?\")\nprint(r.usage.cache_creation_input_tokens, r.usage.cache_read_input_tokens)",
      },
      pitfalls: [
        "Any change in the prefix, even a timestamp or a reordered tool list, misses the cache.",
        "Caches expire after a few minutes without use; low-traffic apps may rarely hit them.",
        "Writing to the cache can cost more than a normal request; it pays off only when the prefix is reused.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/build-with-claude/prompt-caching",
    },
    demo: "PromptCachingDemo",
    related: ["llm-05", "system-design-04", "llm-13", "llm-08"],
    projects: ["build-llm"],
    keywords: ["prompt caching", "cache", "prefix", "cost", "latency", "reuse", "cache_control"],
  },
  {
    id: "llm-13",
    area: "llm",
    number: 13,
    slug: "token-pricing",
    name: "Token Pricing",
    tier: "production",
    official:
      "Input, output and cached tokens cost different amounts. Know your cost per call.",
    kid: "A taxi charges for every kilometre you ride. The computer charges for every little word piece it reads and writes, and writing usually costs more than reading.",
    realWorld: {
      title: "The parrot's price list",
      text: "The library pays the parrot per note card. Reading a card of the question is cheap, writing a card of the answer costs several times more, and re-reading a card that is already open on the desk costs almost nothing. A visitor who pastes a whole book and asks for a one-line answer pays mostly for reading; one who asks for a long essay pays mostly for writing.",
    },
    engineering: {
      text: "Providers price input tokens, output tokens and cached input tokens separately, quoted per million tokens. Output is typically several times the input price, and reasoning or thinking tokens are billed as output. Cost per call is input tokens times the input price plus output tokens times the output price, adjusted for cache reads and writes. Log the usage object of every response, compute cost per request and per feature, and alert on spikes, because one prompt change can multiply the bill overnight.",
      code: {
        lang: "python",
        source:
          "PRICES = {  # USD per 1M tokens - example numbers, check your provider's price page\n    \"input\": 3.00, \"output\": 15.00, \"cache_read\": 0.30,\n}\n\ndef cost_usd(usage) -> float:\n    return (\n        usage.input_tokens * PRICES[\"input\"]                      # fresh input\n        + usage.output_tokens * PRICES[\"output\"]\n        + (usage.cache_read_input_tokens or 0) * PRICES[\"cache_read\"]\n    ) / 1_000_000\n\n# 2,000 tokens in + 500 out = $0.006 + $0.0075 = $0.0135 per call\n# x 100,000 calls a month  = $1,350",
      },
      pitfalls: [
        "Output is the expensive side: ask for shorter answers before you shorten prompts.",
        "Prices differ per model and change often; keep them in config, not in code.",
        "Long conversations re-send every earlier message, so each new turn costs more than the last.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/about-claude/pricing",
    },
    demo: "TokenPricingDemo",
    related: ["llm-01", "llm-12", "evals-19", "system-design-20"],
    projects: ["build-llm"],
    keywords: ["token pricing", "cost", "price", "input tokens", "output tokens", "budget", "bill"],
  },
  {
    id: "llm-14",
    area: "llm",
    number: 14,
    slug: "hallucinations",
    name: "Hallucinations",
    tier: "production",
    official:
      "Confident but wrong answers. Reduce them with grounding, citations and permission to say 'I don't know'.",
    kid: "Sometimes a friend who doesn't know an answer makes one up so they don't look silly. Computers can do that too, so we give them the right book to read and let them say: I don't know.",
    realWorld: {
      title: "The parrot that never says 'I don't know'",
      text: "Visitors love the parrot because it always answers. But asked about a book the library does not have, it invents a title, an author and even a page number, all with total confidence. The librarian fixes this three ways: she puts the real book on the desk (grounding), asks the parrot to point at the page it used (citations), and praises it for saying 'I don't know'.",
    },
    engineering: {
      text: "LLMs generate the most plausible continuation, not verified facts, so they can produce fluent, confident and false statements: invented citations, APIs, numbers or events. Mitigations: ground answers in retrieved sources (RAG), require citations to specific passages, explicitly allow 'I don't know', use low temperature for factual tasks, and check outputs with rules or an LLM judge for faithfulness. Measure the hallucination rate on a golden dataset instead of trusting spot checks.",
      code: {
        lang: "python",
        source:
          "SYSTEM = \"\"\"Answer ONLY from the documents below.\nAfter every claim, add the id of the document you used, like [doc-2].\nIf the documents do not contain the answer, reply exactly: I don't know.\"\"\"\n\ndef answer(question: str, docs: list[dict]) -> str:\n    context = \"\\n\".join(f\"<doc id='{d['id']}'>{d['text']}</doc>\" for d in docs)\n    text = call_llm(system=SYSTEM, user=f\"{context}\\n\\nQuestion: {question}\")\n    if text.strip() != \"I don't know\" and \"[doc-\" not in text:\n        raise ValueError(\"Answer has no citation - treat it as unverified\")\n    return text",
      },
      pitfalls: [
        "Grounding reduces hallucinations but does not remove them; models can still misread the source.",
        "Confident wording says nothing about correctness.",
        "Invented package names in generated code are a real security risk; check dependencies exist.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations",
    },
    demo: "HallucinationDemo",
    related: ["rag-16", "evals-06", "llm-06", "rag-18"],
    projects: ["build-llm"],
    keywords: ["hallucinations", "made up", "wrong answers", "grounding", "citations", "i don't know", "factuality"],
  },
  {
    id: "llm-15",
    area: "llm",
    number: 15,
    slug: "multimodal-inputs",
    name: "Multimodal Inputs",
    tier: "production",
    official:
      "Sending images, PDFs or audio to the model along with text.",
    kid: "You can explain your broken bike in words, or just show a picture. Some computers can look at pictures, read whole pages and listen to sounds, not only read typed words.",
    realWorld: {
      title: "Showing the parrot a photo",
      text: "A visitor holds up a photo of a crumpled shop receipt and asks: 'How much did I spend on fruit?' A parrot that only reads typed words is stuck. A parrot that can also look at pictures reads the receipt, finds the apples and bananas and adds them up. Some parrots can also listen to a voice message or flip through a whole PDF.",
    },
    engineering: {
      text: "Multimodal models accept images, PDFs and sometimes audio or video next to text in the same message. Each image or page is turned into tokens, so a large image can cost as much as hundreds or thousands of words; resize to what the task needs. Common uses: document and receipt extraction, chart reading, screenshot debugging and UI checks. Put the image before the question, give one task per call, and combine with structured outputs for reliable extraction.",
      code: {
        lang: "python",
        source:
          "import base64\nfrom anthropic import Anthropic\n\nclient = Anthropic()\nimage = base64.standard_b64encode(open(\"receipt.jpg\", \"rb\").read()).decode()\n\nreply = client.messages.create(\n    model=\"claude-sonnet-5-5\",                       # use your current model\n    max_tokens=300,\n    messages=[{\n        \"role\": \"user\",\n        \"content\": [\n            {\"type\": \"image\", \"source\": {\"type\": \"base64\",\n             \"media_type\": \"image/jpeg\", \"data\": image}},\n            {\"type\": \"text\", \"text\": \"How much did I spend on fruit? List the lines you used.\"},\n        ],\n    }],\n)\nprint(reply.content[0].text)",
      },
      pitfalls: [
        "Images are billed as tokens; big images and many PDF pages get expensive fast.",
        "Small text, handwriting and dense tables are read less reliably; crop and enlarge the part that matters.",
        "Images can hide instructions too: treat them as untrusted input.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/build-with-claude/vision",
    },
    demo: "MultimodalDemo",
    related: ["llm-13", "rag-15", "security-02", "llm-11"],
    projects: ["build-llm"],
    keywords: ["multimodal", "images", "vision", "pdf", "audio", "photo", "screenshot"],
  },
  {
    id: "llm-16",
    area: "llm",
    number: 16,
    slug: "fine-tuning-with-lora",
    name: "Fine-tuning with LoRA",
    tier: "production",
    official:
      "Train small adapter matrices instead of all the weights. A cheap way to specialise a model.",
    kid: "Instead of rebuilding a whole bike to make it faster, you clip on a small motor. LoRA clips small new parts onto a big model and only trains those, so it is quick and cheap.",
    realWorld: {
      title: "Sticky notes in the parrot's books",
      text: "Teaching the parrot medical words by rewriting every book in the library would take years. Instead, the librarian adds a thin stack of sticky notes to each shelf that slightly change how the parrot reads it. Only the sticky notes are written and trained; the books stay untouched. Swap the notes and the same parrot becomes a legal or a cooking expert.",
    },
    engineering: {
      text: "LoRA (Low-Rank Adaptation) freezes the pretrained weight matrix W and learns a low-rank update B·A, where A is r×d and B is d×r with a small rank r (often 8-64). For one 4096×4096 projection, rank 16 trains about 131k parameters instead of 16.8 million, under 1%. Adapters are small files that can be merged into the base weights or swapped per task or customer at serving time. Use fine-tuning for style, format or a narrow skill; use RAG for facts that change.",
      code: {
        lang: "python",
        source:
          "from transformers import AutoModelForCausalLM\nfrom peft import LoraConfig, get_peft_model\n\nmodel = AutoModelForCausalLM.from_pretrained(\"meta-llama/Llama-3.1-8B\")\nconfig = LoraConfig(\n    r=16,                                  # rank: size of the small matrices\n    lora_alpha=32,                         # how strongly the update is applied\n    target_modules=[\"q_proj\", \"v_proj\"],   # which layers get adapters\n    lora_dropout=0.05,\n    task_type=\"CAUSAL_LM\",\n)\nmodel = get_peft_model(model, config)\nmodel.print_trainable_parameters()\n# trainable params: ~6.8M || all params: ~8B || trainable%: ~0.08",
      },
      pitfalls: [
        "Fine-tuning teaches behaviour and style well, new facts poorly; facts belong in RAG.",
        "A few hundred clean, consistent examples beat thousands of noisy ones.",
        "Always compare against the base model on a held-out set; it is easy to make a model worse.",
      ],
      docsUrl: "https://huggingface.co/docs/peft/main/en/conceptual_guides/lora",
    },
    demo: "LoRADemo",
    related: ["llm-17", "llm-18", "system-design-18", "llm-19"],
    projects: ["build-llm"],
    keywords: ["lora", "fine-tuning", "adapters", "peft", "low-rank", "training", "specialise"],
  },
  {
    id: "llm-17",
    area: "llm",
    number: 17,
    slug: "qlora",
    name: "QLoRA",
    tier: "production",
    official:
      "LoRA on top of a 4-bit quantized base model, so fine-tuning fits on one GPU.",
    kid: "To fit a huge puzzle on a small table, you shrink the picture first, then add your small changes on top. QLoRA squeezes a big model so training fits on one computer.",
    realWorld: {
      title: "Pocket-size books with sticky notes",
      text: "The full library does not fit in the librarian's small workroom. So she prints every book as a tiny pocket edition (4-bit quantization) that takes a quarter of the space, then adds her sticky notes (LoRA) on top as usual. The pocket books are slightly harder to read, but everything now fits on one desk and the notes come out almost as good.",
    },
    engineering: {
      text: "QLoRA loads the frozen base model in 4-bit NF4 quantization, adds LoRA adapters in 16-bit, and backpropagates through the quantized weights into the adapters. Double quantization and paged optimizers save more memory. This makes it possible to fine-tune a 7-8B model on one 24 GB consumer GPU, and the original paper fine-tuned a 65B model on a single 48 GB GPU, with quality close to 16-bit LoRA. Each step is slower because weights are dequantized on the fly.",
      code: {
        lang: "python",
        source:
          "import torch\nfrom transformers import AutoModelForCausalLM, BitsAndBytesConfig\nfrom peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training\n\nbnb = BitsAndBytesConfig(\n    load_in_4bit=True,\n    bnb_4bit_quant_type=\"nf4\",              # 4-bit NormalFloat\n    bnb_4bit_use_double_quant=True,         # also compress the scaling constants\n    bnb_4bit_compute_dtype=torch.bfloat16,\n)\nmodel = AutoModelForCausalLM.from_pretrained(\n    \"meta-llama/Llama-3.1-8B\", quantization_config=bnb)\nmodel = prepare_model_for_kbit_training(model)\nmodel = get_peft_model(model, LoraConfig(\n    r=16, lora_alpha=32, target_modules=\"all-linear\", task_type=\"CAUSAL_LM\"))\n# Base weights take ~5-6 GB instead of ~16 GB in bf16",
      },
      pitfalls: [
        "Merge adapters into the 16-bit base model for deployment, not into the 4-bit one.",
        "Training steps are slower than with 16-bit LoRA.",
        "bitsandbytes 4-bit training needs a supported GPU, in practice usually NVIDIA.",
      ],
      docsUrl: "https://arxiv.org/abs/2305.14314",
    },
    demo: "QLoRADemo",
    related: ["llm-16", "llm-18", "deployment-10"],
    projects: ["build-llm"],
    keywords: ["qlora", "4-bit", "nf4", "fine-tuning", "single gpu", "memory", "bitsandbytes"],
  },
  {
    id: "llm-18",
    area: "llm",
    number: 18,
    slug: "quantization",
    name: "Quantization",
    tier: "production",
    official:
      "Store weights in fewer bits (8-bit, 4-bit) to save memory and run faster, at a small quality cost.",
    kid: "A picture saved with fewer colours takes less space but still looks almost the same. Quantization stores the model's numbers in a simpler way, so it gets smaller and faster.",
    realWorld: {
      title: "Rounding the parrot's notes",
      text: "The parrot's brain is full of very precise numbers like 0.4817263. Writing every one in full fills whole shelves. If the librarian rounds them to 0.48 the books shrink to half; rounding to 0.5 shrinks them to a quarter. The parrot still talks almost as well, but round too hard and it starts to mumble.",
    },
    engineering: {
      text: "Quantization stores weights (and sometimes activations or the KV cache) in fewer bits: going from 16-bit to 8-bit halves memory, 4-bit quarters it. A 7B-parameter model needs about 14 GB in fp16, 7 GB in 8-bit and roughly 4 GB in 4-bit. Post-training methods such as GPTQ, AWQ and the GGUF formats used by llama.cpp and Ollama keep the quality loss small down to about 4 bits; below that it drops quickly. Smaller weights also mean faster generation, because inference is usually limited by memory bandwidth.",
      code: {
        lang: "python",
        source:
          "def weights_gb(params_billion: float, bits: int) -> float:\n    \"\"\"Memory for the weights alone.\"\"\"\n    return params_billion * 1e9 * bits / 8 / 1e9\n\nfor bits in (16, 8, 4):\n    print(f\"{bits}-bit: {weights_gb(7, bits):.1f} GB\")\n# 16-bit: 14.0 GB   8-bit: 7.0 GB   4-bit: 3.5 GB   (+ KV cache and overhead)\n\n# Run a 4-bit model locally (Ollama serves quantized GGUF models):\n#   ollama run llama3.1:8b",
      },
      pitfalls: [
        "Quality loss differs per task: test on your own eval set, not only leaderboard scores.",
        "Weights are not the whole memory bill; the KV cache grows with context length and batch size.",
        "Below 4 bits most models degrade sharply.",
      ],
      docsUrl: "https://huggingface.co/docs/transformers/main/en/quantization/overview",
    },
    demo: "QuantizationDemo",
    related: ["llm-17", "deployment-11", "system-design-13", "llm-05"],
    projects: ["build-llm"],
    keywords: ["quantization", "4-bit", "8-bit", "int8", "gguf", "memory", "compression"],
  },
  {
    id: "llm-19",
    area: "llm",
    number: 19,
    slug: "distillation",
    name: "Distillation",
    tier: "production",
    official:
      "Train a small 'student' model to copy the answers of a big 'teacher' model.",
    kid: "A young cook watches a great chef again and again, then learns to make the same dishes. A small computer brain learns by copying the answers of a big one, and ends up fast and cheap.",
    realWorld: {
      title: "The owl teaches a young parrot",
      text: "The careful owl gives excellent answers but is slow and expensive. So the library asks the owl ten thousand typical questions and writes all its answers into a book. A young parrot is trained on that answer book until it replies the same way. It is not as wise as the owl on everything, but on the library's everyday questions it is nearly as good and many times faster.",
    },
    engineering: {
      text: "Knowledge distillation trains a smaller student model to imitate a larger teacher. Classic distillation matches the teacher's full output probability distribution (soft labels); with API models you usually distil on generated outputs, fine-tuning the student on prompt-response pairs from the teacher. It works best on a narrow, well-defined task, where a small model can come close to a frontier model at a fraction of the cost and latency. Check the teacher provider's terms: some forbid using outputs to train competing models.",
      code: {
        lang: "python",
        source:
          "# 1. Collect teacher answers for realistic inputs\ndataset = []\nfor ticket in support_tickets[:5000]:\n    label = big_model(f\"Classify this ticket as billing, bug, feature or other:\\n{ticket}\")\n    dataset.append({\"input\": ticket, \"output\": label})\n\n# 2. Fine-tune a small open model on the teacher's answers (e.g. with LoRA)\nstudent = train_student(\"Qwen/Qwen2.5-1.5B-Instruct\", dataset)\n\n# 3. Compare on a held-out golden set before moving traffic\nprint(accuracy(student, golden_set), accuracy(big_model, golden_set))",
      },
      pitfalls: [
        "The student copies the teacher's mistakes too; clean or verify the training data.",
        "A distilled model is strong only on the task it was distilled for.",
        "Some model licences and API terms forbid training on their outputs.",
      ],
      docsUrl: "https://arxiv.org/abs/1503.02531",
    },
    demo: "DistillationDemo",
    related: ["llm-16", "llm-10", "system-design-01", "llm-20"],
    projects: ["build-llm"],
    keywords: ["distillation", "teacher", "student", "smaller model", "compress", "cheaper"],
  },
  {
    id: "llm-20",
    area: "llm",
    number: 20,
    slug: "open-vs-closed-models",
    name: "Open vs Closed Models",
    tier: "production",
    official:
      "Open weights you can host yourself (Llama, Qwen, Mistral) vs API-only models (GPT, Claude, Gemini).",
    kid: "Some toys you can take home, open up and change, others you can only play with at the shop. Open models you can run yourself; closed ones you use through a company's service.",
    realWorld: {
      title: "Buying a parrot or renting one",
      text: "The library can buy its own parrot (open weights): it lives in the building, never leaves, can be retrained freely, but needs a cage, food and a keeper. Or it can rent the world's smartest parrot by phone (a closed API): no cage to clean and always the newest version, but every question leaves the building and the owner sets the price.",
    },
    engineering: {
      text: "Open-weight models (Llama, Qwen, Mistral, Gemma, DeepSeek) can be downloaded, fine-tuned and served on your own hardware or a host you choose, giving data control, deep customisation and predictable cost at high volume, at the price of running GPUs and operations yourself. Closed models (GPT, Claude, Gemini) are API-only, usually lead on the hardest tasks, need no infrastructure and bill per token. Many products mix both: a closed model for hard requests, an open one for high-volume, private or offline work. 'Open weights' is not always open source: read the licence.",
      code: {
        lang: "python",
        source:
          "from openai import OpenAI\n\n# Same client code, two backends\nclosed = OpenAI()                                         # a vendor's hosted API\nlocal = OpenAI(base_url=\"http://localhost:11434/v1\",      # Ollama's OpenAI-compatible API\n               api_key=\"ollama\")                          # any string works locally\n\ndef ask(client, model: str, question: str) -> str:\n    r = client.chat.completions.create(\n        model=model, messages=[{\"role\": \"user\", \"content\": question}])\n    return r.choices[0].message.content\n\nprint(ask(local, \"llama3.1:8b\", \"Summarise GDPR in one line\"))  # never leaves your machine",
      },
      pitfalls: [
        "Self-hosting is cheaper only at steady high volume; idle GPUs still cost money.",
        "Open-weight licences can restrict commercial use or user numbers; read them.",
        "Closed models change versions; pin model ids and re-run your evals when you upgrade.",
      ],
      docsUrl: "https://ollama.com/",
    },
    demo: "OpenVsClosedDemo",
    related: ["deployment-11", "system-design-13", "deployment-17", "llm-18"],
    projects: ["build-llm"],
    keywords: ["open source", "open weights", "closed models", "api", "llama", "self-hosting", "privacy"],
  },
];

export default concepts;

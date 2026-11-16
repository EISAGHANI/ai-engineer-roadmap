import type { ConceptInput } from "../schema";

/** Area: evals. Official one-liners are verbatim from the AI Engineer Roadmap (LearnVora, Nov 2026). */
const concepts: ConceptInput[] = [
  {
    id: "evals-01",
    area: "evals",
    number: 1,
    slug: "golden-datasets",
    name: "Golden Datasets",
    tier: "base",
    official:
      "A fixed set of inputs with expected outputs. Every change is tested against it.",
    kid: "A teacher keeps an answer key for the class test. Every time the computer changes, we give it the same test and check its answers against the key.",
    realWorld: {
      title: "The answer key in the drawer",
      text: "The teacher keeps one fixed test in her drawer: 50 questions with the correct answers written by her. Whenever the school's homework robot gets an update, she gives it exactly the same test and marks it against the key. If last month it scored 46 and now 41, something got worse, and she knows which questions broke.",
    },
    engineering: {
      text: "A golden dataset is a fixed, versioned set of inputs with expected outputs (or grading criteria), written or checked by people, that every change is tested against. Start with 30-100 cases drawn from real usage, cover the main tasks plus known edge cases and past failures, tag them by category, and grow it continuously. Keep it out of prompts and training data, and treat changes to it like code changes.",
      code: {
        lang: "python",
        source:
          "# golden.jsonl: one test case per line, written and checked by people\n# {\"id\": \"q01\", \"question\": \"How long can I borrow a book?\", \"expected\": \"3 weeks\", \"tags\": [\"loans\"]}\n# {\"id\": \"q02\", \"question\": \"Can I renew online?\", \"expected\": \"Yes, up to 2 times\", \"tags\": [\"loans\"]}\nimport json\n\ncases = [json.loads(line) for line in open(\"golden.jsonl\")]\nresults = []\nfor case in cases:\n    answer = rag_app(case[\"question\"])\n    passed = grade(answer, case[\"expected\"])      # exact match, rules or an LLM judge\n    results.append({\"id\": case[\"id\"], \"passed\": passed, \"answer\": answer})\n\nscore = sum(r[\"passed\"] for r in results) / len(results)\nprint(f\"{score:.0%} of {len(cases)} golden questions passed\")",
      },
      pitfalls: [
        "A golden set made only of easy questions gives false confidence; include hard and tricky cases.",
        "If the cases leak into prompts or fine-tuning data, the score stops meaning anything.",
        "Re-check expected answers when the underlying facts change, or correct answers get marked wrong.",
      ],
      docsUrl: "https://hamel.dev/blog/posts/evals/",
    },
    demo: "GoldenDatasetDemo",
    related: ["evals-11", "evals-13", "evals-02", "rag-19"],
    projects: ["build-evals"],
    keywords: ["golden dataset", "test set", "eval set", "expected output", "benchmark", "regression"],
  },
  {
    id: "evals-02",
    area: "evals",
    number: 2,
    slug: "error-analysis",
    name: "Error Analysis",
    tier: "base",
    official:
      "Read real failures, group them by type, fix the biggest group first.",
    kid: "When lots of pupils get questions wrong, the teacher sorts the mistakes into piles. She fixes the biggest pile first, because that helps the most pupils.",
    realWorld: {
      title: "Sorting the wrong answers into piles",
      text: "After the test the teacher doesn't just count wrong answers. She reads each one and writes a short note: 'mixed up the dates', 'used the wrong chapter', 'didn't answer the question'. Then she sorts the notes into piles. Twenty mistakes come from using the wrong chapter, three from dates. She teaches the chapter lesson again first.",
    },
    engineering: {
      text: "Error analysis means reading real failures (traces where the output was wrong or unhelpful), writing a short free-text note for each, grouping the notes into failure categories, and counting them. It turns vague 'the bot is bad sometimes' into a ranked list of concrete problems, each of which can get a targeted fix and its own eval. It is the highest-value eval activity and should come before building automated metrics.",
      code: {
        lang: "python",
        source:
          "import pandas as pd\n\n# 1. Read 50-100 real failing traces and write one short note per failure\nnotes = pd.read_csv(\"failure_notes.csv\")            # columns: trace_id, note\n# 2. Group the notes into a few failure categories (by hand, or with an LLM's help)\nnotes[\"category\"] = notes[\"note\"].map(categorise)\n# 3. Count them and fix the biggest group first\nprint(notes[\"category\"].value_counts())\n# wrong document retrieved        23\n# ignores the date in the question 11\n# refuses although it knows        6",
      },
      pitfalls: [
        "Choosing metrics before reading failures leads to measuring the wrong things.",
        "Look at real traces, not only at aggregate scores.",
        "Re-do it after big changes: fixing one category often reveals the next.",
      ],
      docsUrl: "https://hamel.dev/blog/posts/evals/",
    },
    demo: "ErrorAnalysisDemo",
    related: ["evals-01", "evals-15", "evals-13"],
    projects: ["build-evals"],
    keywords: ["error analysis", "failure modes", "categories", "open coding", "debugging", "traces"],
  },
  {
    id: "evals-03",
    area: "evals",
    number: 3,
    slug: "llm-as-a-judge",
    name: "LLM as a Judge",
    tier: "base",
    official:
      "A strong model with a clear rubric grades outputs, so you can score thousands of them.",
    kid: "Marking thousands of test papers is too much for one teacher. So a very clever helper marks them using the teacher's clear marking rules.",
    realWorld: {
      title: "A trusted assistant marks the papers",
      text: "The teacher can mark ten essays herself, but not ten thousand. So she trains a trusted assistant: here is the question, here is a good answer, here are the rules for pass and fail. The assistant marks every paper and writes one sentence explaining each mark. Each week the teacher re-marks a few papers herself to check that the assistant still agrees with her.",
    },
    engineering: {
      text: "LLM-as-a-judge uses a strong model with a clear prompt and rubric to grade outputs, often against a reference answer, so you can evaluate thousands of cases cheaply and catch differences that string matching misses (same meaning, different words). Use binary pass/fail or small scales, ask for brief reasoning before the verdict, set temperature 0, and validate the judge against human labels before trusting its numbers.",
      code: {
        lang: "python",
        source:
          "import json\n\nJUDGE_PROMPT = \"\"\"You grade answers from a library help bot.\n\nQuestion: {question}\nReference answer: {reference}\nBot answer: {answer}\n\nIs the bot answer correct and complete compared with the reference?\nThink briefly, then reply with JSON: {{\"reasoning\": \"...\", \"verdict\": \"pass\" or \"fail\"}}\"\"\"\n\ndef judge(question, reference, answer) -> bool:\n    out = strong_llm(JUDGE_PROMPT.format(question=question, reference=reference, answer=answer),\n                     temperature=0)\n    return json.loads(out)[\"verdict\"] == \"pass\"\n\n# Check the judge against human labels before you trust it (see Human Labeling).",
      },
      pitfalls: [
        "Judges have biases: they prefer longer answers, their own model family and the first option shown.",
        "A judge that is never compared with human labels is an unverified opinion.",
        "Vague criteria such as 'is it good?' produce noisy scores; be specific.",
      ],
      docsUrl: "https://hamel.dev/blog/posts/llm-judge/",
    },
    demo: "JudgeDemo",
    related: ["evals-05", "evals-04", "evals-13", "evals-06"],
    projects: ["build-evals"],
    keywords: ["llm as a judge", "llm judge", "automated grading", "evaluator", "rubric", "grading"],
  },
  {
    id: "evals-04",
    area: "evals",
    number: 4,
    slug: "pairwise-comparison",
    name: "Pairwise Comparison",
    tier: "base",
    official:
      "The judge sees two answers and picks the better one. More stable than a 1-10 score.",
    kid: "Picking the better of two pictures is easier than giving one picture an exact score. The judge looks at two answers side by side and simply picks the better one.",
    realWorld: {
      title: "Which of these two essays is better?",
      text: "Ask five teachers to mark one essay out of ten and you get 6, 7, 8, 7 and 5. Ask them which of two essays is better and they almost always agree. So when the school compares last year's homework robot with the new one, it puts their answers side by side and asks 'which one would you rather receive?', and counts the wins.",
    },
    engineering: {
      text: "Pairwise comparison shows the judge two candidate outputs for the same input and asks which is better (or tie). Relative judgements are more consistent than absolute 1-10 scores, which drift and cluster. It is ideal for comparing prompts, models or versions. Judges have position bias, so run each pair twice with the order swapped and count inconsistent verdicts as ties; aggregate as win rates or Elo-style ratings.",
      code: {
        lang: "python",
        source:
          "PAIRWISE = \"\"\"Question: {q}\n\nAnswer A:\n{a}\n\nAnswer B:\n{b}\n\nWhich answer is more helpful and correct? Reply with exactly \"A\", \"B\" or \"tie\".\"\"\"\n\ndef compare(q, answer_1, answer_2) -> str:\n    first = strong_llm(PAIRWISE.format(q=q, a=answer_1, b=answer_2), temperature=0)\n    second = strong_llm(PAIRWISE.format(q=q, a=answer_2, b=answer_1), temperature=0)  # swapped\n    if first == \"A\" and second == \"B\":\n        return \"answer_1\"\n    if first == \"B\" and second == \"A\":\n        return \"answer_2\"\n    return \"tie\"          # inconsistent verdicts = position bias, count as a tie",
      },
      pitfalls: [
        "Always swap the order: many judges prefer whichever answer comes first.",
        "Pairwise tells you which is better, not whether either is good enough; keep an absolute pass bar too.",
        "Comparing many versions needs many pairs; use a fixed baseline or a rating system.",
      ],
      docsUrl: "https://arxiv.org/abs/2306.05685",
    },
    demo: "PairwiseDemo",
    related: ["evals-03", "evals-12", "evals-05"],
    projects: ["build-evals"],
    keywords: ["pairwise comparison", "preference", "a vs b", "win rate", "position bias", "elo"],
  },
  {
    id: "evals-05",
    area: "evals",
    number: 5,
    slug: "rubric-scoring",
    name: "Rubric Scoring",
    tier: "base",
    official:
      "Grade against written criteria (correct, complete, tone), each on a clear scale.",
    kid: "Instead of just saying 'good' or 'bad', the teacher has a list: is it right, is it complete, is it polite. Each part gets its own small score, so everyone knows what to improve.",
    realWorld: {
      title: "The marking scheme on the board",
      text: "For the history essay the teacher writes the marking scheme on the board: facts correct (up to 4 points), answers the whole question (up to 4), clear and friendly writing (up to 4). Now two teachers marking the same essay give almost the same scores, and every pupil can see exactly where they lost points.",
    },
    engineering: {
      text: "Rubric scoring grades outputs against written criteria, each on a small, clearly defined scale with descriptions of every level (for example correctness, completeness, tone, format), instead of one holistic score. Explicit levels make human and LLM graders more consistent and the results actionable. Keep criteria independent, prefer 2-4 levels over 1-10, and define how criteria combine into pass or fail.",
      code: {
        lang: "python",
        source:
          "import json\n\nRUBRIC = \"\"\"Score the answer on each criterion from 1 to 4:\n- correct:  1 = wrong, 2 = partly wrong, 3 = correct with gaps, 4 = fully correct\n- complete: 1 = misses the point, 4 = covers everything the question asks\n- tone:     1 = rude or confusing, 4 = friendly and clear for a pupil\nReturn JSON: {\"correct\": n, \"complete\": n, \"tone\": n, \"notes\": \"...\"}\"\"\"\n\nscores = json.loads(judge_llm(RUBRIC + f\"\\n\\nQuestion: {q}\\nAnswer: {a}\"))\npassed = scores[\"correct\"] >= 3 and scores[\"complete\"] >= 3 and scores[\"tone\"] >= 2",
      },
      pitfalls: [
        "Scales without written level descriptions drift between graders and over time.",
        "Averaging criteria hides failures: a wrong but friendly answer should not pass.",
        "Too many criteria make grading slow and noisy; three to five is usually enough.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/test-and-evaluate/develop-tests",
    },
    demo: "RubricDemo",
    related: ["evals-03", "evals-13", "evals-07"],
    projects: ["build-evals"],
    keywords: ["rubric", "scoring", "criteria", "grading scale", "marking scheme"],
  },
  {
    id: "evals-06",
    area: "evals",
    number: 6,
    slug: "faithfulness",
    name: "Faithfulness",
    tier: "base",
    official:
      "Is every claim in the answer backed by the retrieved context?",
    kid: "If a pupil says 'the book says dinosaurs had feathers', you check the book to see if it really says that. Faithfulness checks every sentence of the answer against the pages it used.",
    realWorld: {
      title: "Did the book really say that?",
      text: "A pupil hands in a report using three library books. The teacher takes each sentence and looks for it in the books. 'Dinosaurs lived 66 million years ago': found. 'Some had feathers': found. 'They were all green': not in any of the books. Three of four sentences are backed by the sources, so the report is 75% faithful, however nice it sounds.",
    },
    engineering: {
      text: "Faithfulness (groundedness) measures whether every claim in a generated answer is supported by the retrieved context, independent of whether it is true in the world. The usual method splits the answer into atomic claims and has a judge check each one against the context; the score is supported claims divided by total claims. It is the main hallucination metric for RAG; libraries such as Ragas and DeepEval implement it.",
      code: {
        lang: "python",
        source:
          "CLAIMS = \"List every factual claim in this answer, one per line:\\n{answer}\"\nCHECK = \"\"\"Context:\n{context}\n\nClaim: {claim}\nIs the claim fully supported by the context? Reply \"yes\" or \"no\".\"\"\"\n\ndef faithfulness(answer: str, context: str) -> float:\n    claims = [c for c in llm(CLAIMS.format(answer=answer)).splitlines() if c.strip()]\n    supported = [llm(CHECK.format(context=context, claim=c)).strip().lower() == \"yes\"\n                 for c in claims]\n    return sum(supported) / len(claims) if claims else 1.0\n\n# 1.0 = every claim is backed by the retrieved chunks; 0.75 = a quarter is unsupported",
      },
      pitfalls: [
        "A faithful answer can still be wrong if the retrieved context was wrong.",
        "Claim extraction quality limits the metric; check a sample by hand.",
        "An answer of 'I don't know' is perfectly faithful, so pair it with answer relevance.",
      ],
      docsUrl: "https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/faithfulness/",
    },
    demo: "FaithfulnessDemo",
    related: ["llm-14", "rag-16", "evals-07", "evals-08"],
    projects: ["build-evals"],
    keywords: ["faithfulness", "groundedness", "hallucination", "supported claims", "ragas", "rag evaluation"],
  },
  {
    id: "evals-07",
    area: "evals",
    number: 7,
    slug: "answer-relevance",
    name: "Answer Relevance",
    tier: "base",
    official:
      "Does the answer actually address the question that was asked?",
    kid: "If the teacher asks 'what colour is the sky?' and you talk about clouds, you might be right but you didn't answer. Answer relevance checks that the answer fits the question.",
    realWorld: {
      title: "Right facts, wrong question",
      text: "Asked 'what time does the library close on Saturday?', one pupil answers '14:00'. Another writes a lovely paragraph about the library's history and its 20,000 books, every word true. The teacher marks the second answer as off-topic: true facts are worthless if they don't answer what was asked.",
    },
    engineering: {
      text: "Answer relevance measures whether the response addresses the actual question: directly, completely and without unnecessary content, regardless of factual accuracy. It is judged with an LLM rubric, or computed by generating likely questions from the answer and comparing them with the original question by embedding similarity (as Ragas does). Use it together with faithfulness: one checks the answer is grounded, the other that it is on point.",
      code: {
        lang: "python",
        source:
          "RELEVANCE = \"\"\"Question: {q}\nAnswer: {a}\n\nDoes the answer address what was asked? Score from 1 to 5:\n5 = answers it directly, 3 = partly, or buried in unrelated content, 1 = off-topic.\nReply with the number only.\"\"\"\n\nscore = int(judge_llm(RELEVANCE.format(q=question, a=answer)))\nrelevant = score >= 4",
      },
      pitfalls: [
        "Relevance says nothing about truth; an on-topic answer can be invented.",
        "Over-penalising detail pushes bots towards terse, unhelpful answers; define what is enough.",
        "Ambiguous questions need a rule for when asking a clarifying question counts as relevant.",
      ],
      docsUrl: "https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/answer_relevance/",
    },
    demo: "AnswerRelevanceDemo",
    related: ["evals-06", "evals-05", "evals-08"],
    projects: ["build-evals"],
    keywords: ["answer relevance", "relevancy", "on topic", "addresses the question", "rag evaluation"],
  },
  {
    id: "evals-08",
    area: "evals",
    number: 8,
    slug: "context-precision",
    name: "Context Precision",
    tier: "base",
    official:
      "How much of the retrieved context was actually useful for the answer?",
    kid: "If you bring ten books to answer a question but only two help, most of the pile was a waste. Context precision checks how much of what was fetched was actually useful.",
    realWorld: {
      title: "How much of the pile was useful?",
      text: "For the question 'how long do elephants live?', the librarian's pile has five books. Only two help: the elephant lifespan book and the zoo animals book. The other three are about ivory, herds and circus history. The teacher notes that only 2 of 5 books were useful, and that the useful ones were not even on top. A smaller, better-sorted pile would have been faster to read.",
    },
    engineering: {
      text: "Context precision measures how much of the retrieved context is relevant to answering the question, usually weighted by rank so useful chunks near the top count more (an average precision over the retrieved list). Low precision means noisy context: higher cost, distraction and more hallucination risk. It complements recall (did we fetch everything needed?) and is improved by reranking, filtering and fewer, better chunks.",
      code: {
        lang: "python",
        source:
          "def context_precision(retrieved: list[str], question: str, reference: str) -> float:\n    \"\"\"Share of useful chunks, rewarding useful chunks that are ranked first.\"\"\"\n    useful = [judge_useful(chunk, question, reference) for chunk in retrieved]  # True / False\n    precisions = [sum(useful[: i + 1]) / (i + 1) for i, u in enumerate(useful) if u]\n    return sum(precisions) / max(1, sum(useful))\n\n# retrieved: [useful, noise, useful, noise, noise]  ->  (1/1 + 2/3) / 2 = 0.83",
      },
      pitfalls: [
        "High precision with low recall means a clean but incomplete pile; track both.",
        "Judging usefulness needs a reference answer or careful criteria.",
        "Sending fewer chunks raises precision but can drop needed facts; tune k with both metrics.",
      ],
      docsUrl: "https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_precision/",
    },
    demo: "ContextPrecisionDemo",
    related: ["rag-19", "rag-10", "evals-06", "rag-20"],
    projects: ["build-evals"],
    keywords: ["context precision", "retrieval precision", "noise", "relevant chunks", "rag evaluation"],
  },
  {
    id: "evals-09",
    area: "evals",
    number: 9,
    slug: "tool-call-accuracy",
    name: "Tool Call Accuracy",
    tier: "base",
    official:
      "Did the agent pick the right tool, with the right arguments?",
    kid: "If you ask the robot for the weather in Paris, it should pick the weather tool and type 'Paris', not the calendar tool or 'Berlin'. We check that it picks the right tool with the right details.",
    realWorld: {
      title: "Right shop, right shopping list",
      text: "The teacher tests the errand robot with ten little jobs. 'Weather in Paris tomorrow?' should go to the weather station with 'Paris, 1 day'. 'Hello!' should go to no shop at all. For each job she checks two things: did it walk into the right shop, and did it hand over the right note? Right shop with the wrong city still counts as a mistake.",
    },
    engineering: {
      text: "Tool call accuracy evaluates whether an agent selects the correct tool (or correctly selects none) and passes correct arguments, compared against expected calls in a test set. Check the tool name exactly and the arguments by exact match, normalisation or a judge for free-text fields. Test 'no tool needed' cases and similar-looking tools, and report errors by type: wrong tool, missing call, bad arguments and unnecessary call.",
      code: {
        lang: "python",
        source:
          "cases = [\n    {\"input\": \"Weather in Paris tomorrow?\",\n     \"expected\": {\"name\": \"get_forecast\", \"args\": {\"city\": \"Paris\", \"days\": 1}}},\n    {\"input\": \"Hi!\", \"expected\": None},                      # no tool should be called\n]\n\ndef tool_call_correct(actual, expected) -> bool:\n    if expected is None:\n        return actual is None\n    return (actual is not None and actual[\"name\"] == expected[\"name\"]\n            and all(actual[\"args\"].get(k) == v for k, v in expected[\"args\"].items()))\n\nhits = [tool_call_correct(first_tool_call(agent, c[\"input\"]), c[\"expected\"]) for c in cases]\nprint(f\"tool call accuracy: {sum(hits) / len(hits):.0%}\")",
      },
      pitfalls: [
        "Forgetting 'no tool' cases hides an agent that calls tools for everything.",
        "Exact argument matching is brittle for free text ('NYC' vs 'New York'); normalise or judge.",
        "Correct single calls do not guarantee a correct sequence; add trajectory evals.",
      ],
      docsUrl: "https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/agents/",
    },
    demo: "ToolCallAccuracyDemo",
    related: ["agents-01", "evals-10", "evals-01"],
    projects: ["build-evals"],
    keywords: ["tool call accuracy", "function calling eval", "tool selection", "arguments", "agent evaluation"],
  },
  {
    id: "evals-10",
    area: "evals",
    number: 10,
    slug: "trajectory-evals",
    name: "Trajectory Evals",
    tier: "base",
    official:
      "Judge the whole path of steps the agent took, not only its final answer.",
    kid: "Two pupils get the right answer, but one guessed and crossed things out ten times. The teacher also looks at the working, not just the final answer.",
    realWorld: {
      title: "Marking the working, not just the answer",
      text: "Two robots both come home with the right shopping. One went bakery, market, home. The other went to the bakery three times, rode a taxi it wasn't allowed to use and took two hours. Checking only the bag, both pass. The teacher also reads each robot's route, and the second one fails for wasted trips and broken rules.",
    },
    engineering: {
      text: "Trajectory evaluation judges the whole sequence of an agent's steps (tool calls, arguments, intermediate reasoning and order), not only the final output. It catches agents that reach right answers through wasteful, unsafe or lucky paths, which become costly or dangerous in production. Combine rule-based checks (step count, forbidden tools, repeated calls, required order) with an LLM judge or comparison against reference trajectories, using traces as input.",
      code: {
        lang: "python",
        source:
          "trace = run_agent_with_trace(\"Is the author of our class reader older than 60?\")\nsteps = [(s.tool, s.args) for s in trace.tool_calls]\n\nchecks = {\n    \"looked in our docs first\": steps[0][0] == \"search_docs\",\n    \"no repeated calls\":        len(steps) == len(set(map(str, steps))),\n    \"stayed within 6 steps\":    len(steps) <= 6,\n    \"never used web search\":    all(tool != \"web_search\" for tool, _ in steps),\n}\nverdict = judge_llm(f\"Was this sequence of steps sensible and efficient?\\n{steps}\")\nprint(checks, verdict)",
      },
      pitfalls: [
        "There are often several valid paths; don't require one exact trajectory.",
        "Trajectory evals need good traces; instrument the agent first.",
        "Long trajectories are expensive to judge; combine cheap rules with sampled LLM review.",
      ],
      docsUrl: "https://docs.langchain.com/langsmith/evaluate-on-intermediate-steps",
    },
    demo: "TrajectoryDemo",
    related: ["evals-09", "evals-15", "agents-19", "agents-02"],
    projects: ["build-evals"],
    keywords: ["trajectory evaluation", "agent evaluation", "intermediate steps", "path", "efficiency"],
  },
  {
    id: "evals-11",
    area: "evals",
    number: 11,
    slug: "regression-evals-in-ci",
    name: "Regression Evals in CI",
    tier: "production",
    official:
      "Run the eval suite on every prompt or code change and block the change if scores drop.",
    kid: "Before the new homework robot is allowed into class, it must pass the same test as the old one. If its score drops, it has to stay outside until it is fixed.",
    realWorld: {
      title: "The test at the classroom door",
      text: "Every time someone changes the homework robot, even one word of its instructions, it must sit the answer-key test at the classroom door before going in. The old robot scored 92%. If the new one scores 86%, the door stays shut and the change goes back to the workshop with a list of the questions that broke.",
    },
    engineering: {
      text: "Regression evals in CI run the eval suite automatically on every change to prompts, models, retrieval or code (typically on pull requests) and fail the build when scores fall below a threshold or drop versus the baseline. This treats prompts like code and stops silent quality regressions. Keep the CI suite fast and affordable (a curated subset), cache LLM calls where possible, report per-case diffs, and run the full suite nightly.",
      code: {
        lang: "yaml",
        source:
          "# .github/workflows/evals.yml\nname: evals\non:\n  pull_request:\n    paths: [\"prompts/**\", \"src/rag/**\"]\njobs:\n  evals:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: { python-version: \"3.12\" }\n      - run: pip install -r requirements.txt\n      - run: python evals/run.py --dataset evals/golden.jsonl --out results.json\n        env:\n          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}\n      - run: python evals/gate.py results.json --min-pass-rate 0.90 --max-drop 0.02",
      },
      pitfalls: [
        "LLM outputs vary between runs; allow a small tolerance or run several samples.",
        "A slow, expensive suite gets skipped; keep the CI set small and the full set nightly.",
        "Only a failing check stops a change: make the gate required, not just a report.",
      ],
      docsUrl: "https://docs.github.com/en/actions",
    },
    demo: "RegressionCiDemo",
    related: ["evals-01", "deployment-06", "deployment-04", "deployment-16"],
    projects: ["build-evals"],
    keywords: ["regression evals", "ci", "eval gate", "github actions", "pull request", "threshold"],
  },
  {
    id: "evals-12",
    area: "evals",
    number: 12,
    slug: "a-b-testing-prompts",
    name: "A/B Testing Prompts",
    tier: "production",
    official:
      "Send two prompt versions to real users and compare the numbers.",
    kid: "The teacher gives half the class worksheet A and the other half worksheet B. At the end she counts which group learned more, and only then picks a winner.",
    realWorld: {
      title: "Two worksheets, two halves of the class",
      text: "The teacher isn't sure whether the new worksheet is better. So pupils whose names start with A to L get the old one, M to Z the new one, and nobody switches. After a month she compares the test results. With only ten pupils per group a small difference could be luck; with two hundred per group she can trust it.",
    },
    engineering: {
      text: "A/B testing serves two prompt (or model) versions to randomly split, sticky groups of real users and compares business and quality metrics such as thumbs-up rate, task success, escalation rate, latency and cost. It measures what offline evals cannot: real user behaviour. Decide the metric and sample size in advance, run until the difference is statistically significant, watch guardrail metrics, and only test variants that already passed offline evals.",
      code: {
        lang: "python",
        source:
          "import hashlib\n\ndef variant_for(user_id: str) -> str:\n    \"\"\"Stable 50/50 split: the same user always sees the same prompt.\"\"\"\n    bucket = int(hashlib.sha256(user_id.encode()).hexdigest(), 16) % 100\n    return \"prompt_v2\" if bucket < 50 else \"prompt_v1\"\n\nvariant = variant_for(user.id)\nanswer = llm(system=PROMPTS[variant], user=question)\nlog_event(\"answer_shown\", user=user.id, variant=variant)\n# Later: compare thumbs-up rate, resolution rate and cost per variant,\n# and declare a winner only once the difference is statistically significant.",
      },
      pitfalls: [
        "Stopping as soon as one variant looks ahead produces false winners; fix the sample size first.",
        "Non-sticky assignment (users switching variants) muddles the results.",
        "Optimising one metric can hurt another; watch cost, latency and complaints too.",
      ],
      docsUrl: "https://en.wikipedia.org/wiki/A/B_testing",
    },
    demo: "AbTestDemo",
    related: ["evals-04", "evals-20", "deployment-15", "deployment-14"],
    projects: ["build-evals"],
    keywords: ["a/b testing", "experiment", "split test", "variants", "statistical significance"],
  },
  {
    id: "evals-13",
    area: "evals",
    number: 13,
    slug: "human-labeling",
    name: "Human Labeling",
    tier: "production",
    official:
      "People grade a sample of outputs. This is the truth you check your judges against.",
    kid: "Before trusting the helper who marks the tests, the teacher marks some papers herself and compares. If they agree, the helper can be trusted with the rest.",
    realWorld: {
      title: "The teacher marks a sample herself",
      text: "Every Friday the teacher takes 20 random papers that the assistant already marked and marks them again herself, without looking at the assistant's marks. They agree on 18. On the two where they disagree, she finds the assistant is too generous with half-finished answers, so she rewrites its marking rules. People's marks are the ground truth everything else is checked against.",
    },
    engineering: {
      text: "Human labeling has domain experts grade a sample of real outputs with clear guidelines. These labels are the ground truth for checking automated evaluators: you measure agreement between the LLM judge and the humans, tune the judge prompt where they disagree, and only then rely on the judge at scale. Use clear instructions, measure inter-annotator agreement, label continuously on fresh production samples, and give labelers an efficient review tool.",
      code: {
        lang: "python",
        source:
          "from sklearn.metrics import cohen_kappa_score\n\nsample = traces.sample(n=200, random_state=7)            # fresh real outputs\nlabels = collect_labels(sample, labelers=[\"ana\", \"ben\"],\n                        question=\"Is the answer correct? yes / no\")\nprint(\"labelers agree (kappa):\", cohen_kappa_score(labels[\"ana\"], labels[\"ben\"]))\n\nhuman = resolve_disagreements(labels)                    # the ground truth\njudge = [llm_judge(t) for t in sample.itertuples()]\nagreement = sum(h == j for h, j in zip(human, judge)) / len(human)\nprint(f\"judge matches humans {agreement:.0%} of the time\")",
      },
      pitfalls: [
        "Without written guidelines, labelers disagree and the 'truth' is noise.",
        "Labeling only once lets the judge drift unnoticed; repeat on fresh samples.",
        "Domain questions (medical, legal) need domain experts, not general crowd workers.",
      ],
      docsUrl: "https://hamel.dev/blog/posts/llm-judge/",
    },
    demo: "HumanLabelingDemo",
    related: ["evals-03", "evals-01", "evals-02"],
    projects: ["build-evals"],
    keywords: ["human labeling", "annotation", "ground truth", "inter-annotator agreement", "judge alignment"],
  },
  {
    id: "evals-14",
    area: "evals",
    number: 14,
    slug: "synthetic-test-data",
    name: "Synthetic Test Data",
    tier: "production",
    official:
      "Have an LLM generate varied test cases, edge cases included, then review them yourself.",
    kid: "Writing hundreds of test questions by hand is slow. A computer can write lots of practice questions quickly, and then the teacher checks them before they go in the test.",
    realWorld: {
      title: "The assistant drafts practice questions",
      text: "The teacher needs 200 test questions about the library rules but only has time to write 20. Her assistant reads the rules and drafts 200: easy ones, tricky wording, questions with spelling mistakes, and questions the rules cannot answer. The teacher reads through them, throws out the wrong or silly ones, and keeps the good ones.",
    },
    engineering: {
      text: "Synthetic test data uses an LLM to generate evaluation inputs (and sometimes expected outputs) from documents, schemas or seed examples, to cover more cases than people can write: paraphrases, edge cases, typos, adversarial and out-of-scope questions, and personas. Steer generation with explicit dimensions to get diversity, generate from real documents so answers are checkable, and have people review cases before they join the golden set.",
      code: {
        lang: "python",
        source:
          "import json\n\nGENERATE = \"\"\"You write test questions for a library help bot.\nBased on this policy document, write 10 varied questions a pupil might ask:\n3 easy, 3 with tricky wording, 2 with typos, 2 the document cannot answer.\nReturn JSON: [{{\"question\": \"...\", \"expected\": \"...\", \"type\": \"...\"}}]\n\nDocument:\n{doc}\"\"\"\n\ncases = []\nfor doc in policy_docs:\n    cases += json.loads(llm(GENERATE.format(doc=doc), temperature=0.9))\n# A person reviews every case before it joins the golden dataset.",
      },
      pitfalls: [
        "Synthetic questions are often cleaner and easier than real users' messages; mix in real ones.",
        "Generated expected answers can be wrong; review them.",
        "Using the same model to generate and to answer the tests flatters it.",
      ],
      docsUrl: "https://docs.ragas.io/en/stable/getstarted/rag_testset_generation/",
    },
    demo: "SyntheticDataDemo",
    related: ["evals-01", "evals-13", "security-20"],
    projects: ["build-evals"],
    keywords: ["synthetic data", "test generation", "generated test cases", "edge cases", "data augmentation"],
  },
  {
    id: "evals-15",
    area: "evals",
    number: 15,
    slug: "tracing",
    name: "Tracing",
    tier: "production",
    official:
      "Record every step of a request (prompts, tool calls, time, tokens) so you can debug it later.",
    kid: "A trace is like the story of one question: who did what, in which order, and how long each part took. When something goes wrong, you read the diary to find the step that broke.",
    realWorld: {
      title: "The robot's diary for every errand",
      text: "For every errand the robot keeps a diary page: 09:00 read the request, 09:01 searched the catalogue for 'elephants' and got 5 books, 09:02 asked the brain for an answer (2,100 words read, 1.7 seconds), 09:03 replied. When a pupil complains about a wrong answer, the teacher opens that page and sees that the search found the wrong books.",
    },
    engineering: {
      text: "Tracing records every step of a request as a tree of spans: the overall request, retrieval, each LLM call with its exact prompt, response, model, tokens, cost and latency, tool calls with arguments and results, and errors. Traces are essential for debugging non-deterministic LLM apps, for error analysis and for building eval datasets from real usage. Instrument from day one with an SDK or OpenTelemetry, and include ids that link traces to users and feedback.",
      code: {
        lang: "python",
        source:
          "from langfuse import observe\n\n@observe()                                   # every decorated call becomes a span\ndef retrieve(question: str) -> list[str]:\n    return hybrid_search(question, limit=5)\n\n@observe()\ndef answer(question: str) -> str:\n    chunks = retrieve(question)\n    return llm(question=question, context=chunks)\n\nanswer(\"How long can I borrow a book?\")\n# Trace: answer (1.9 s) -> retrieve (0.2 s) -> llm call (1.7 s, 2,100 tokens, $0.008)",
      },
      pitfalls: [
        "Traces contain user data and prompts; mask personal data and control access.",
        "Tracing only LLM calls misses retrieval and tool failures; trace the whole request.",
        "Unsampled tracing at high volume gets expensive; sample, but keep every error.",
      ],
      docsUrl: "https://langfuse.com/docs/tracing",
    },
    demo: "TracingDemo",
    related: ["evals-16", "evals-17", "evals-02", "security-19"],
    projects: ["build-evals"],
    keywords: ["tracing", "observability", "spans", "debugging", "llm calls", "traces"],
  },
  {
    id: "evals-16",
    area: "evals",
    number: 16,
    slug: "langfuse",
    name: "Langfuse",
    tier: "production",
    official:
      "Open-source LLM observability: traces, prompt management, evals and cost tracking.",
    kid: "Langfuse is like a big notebook app for teachers: it keeps every robot diary, every version of the instructions, every mark and every cost in one place.",
    realWorld: {
      title: "The school's control room",
      text: "The school sets up one control room for its homework robot. One wall shows every diary page from today. Another shows each version of the robot's instruction card and which version is in use. A third shows the marks from the assistant and the teachers, and a fourth shows how much the robot costs per day. When something breaks, everything needed is in one room.",
    },
    engineering: {
      text: "Langfuse is an open-source LLM engineering platform (self-hostable or cloud) for tracing, prompt management with versions and labels, evaluations (LLM-as-a-judge, human annotation, datasets and experiments), and cost and latency tracking. It integrates through Python and JS SDKs, OpenTelemetry and integrations for OpenAI, LangChain, LlamaIndex and others. It is one of several such tools, alongside LangSmith, Arize Phoenix and Braintrust.",
      code: {
        lang: "python",
        source:
          "from langfuse import get_client, observe\nfrom langfuse.openai import openai             # drop-in wrapper: calls are traced automatically\n\nlangfuse = get_client()                         # reads LANGFUSE_PUBLIC_KEY, SECRET_KEY and HOST\n\n@observe()\ndef ask(question: str) -> str:\n    prompt = langfuse.get_prompt(\"library-bot\", label=\"production\")   # a versioned prompt\n    reply = openai.chat.completions.create(\n        model=\"gpt-5-mini\",                     # any model\n        messages=[{\"role\": \"system\", \"content\": prompt.compile()},\n                  {\"role\": \"user\", \"content\": question}])\n    return reply.choices[0].message.content\n\nask(\"Can I renew a book online?\")\nlangfuse.flush()",
      },
      pitfalls: [
        "Self-hosting means running and upgrading its databases yourself.",
        "Prompts fetched at runtime need caching and a fallback if the service is down.",
        "Decide what data may leave your systems before sending traces to a cloud service.",
      ],
      docsUrl: "https://langfuse.com/docs",
    },
    demo: "LangfuseDemo",
    related: ["evals-15", "evals-17", "deployment-16", "evals-19"],
    projects: ["build-evals"],
    keywords: ["langfuse", "observability", "prompt management", "llm ops", "traces", "open source"],
  },
  {
    id: "evals-17",
    area: "evals",
    number: 17,
    slug: "opentelemetry-for-llms",
    name: "OpenTelemetry for LLMs",
    tier: "production",
    official:
      "The open tracing standard, with conventions for LLM calls, so traces work across tools.",
    kid: "If every school wrote report cards differently, no one could compare them. OpenTelemetry is one shared report card format, so any tool can read the robot's diaries.",
    realWorld: {
      title: "One diary format for every school",
      text: "Each school used to keep robot diaries in its own format, so moving to a new control room meant rewriting every diary. Now all schools agree on one diary format, with fixed boxes for 'which brain', 'words read', 'words written' and 'time taken'. Any control room that reads the format can show any school's diaries, and switching rooms is easy.",
    },
    engineering: {
      text: "OpenTelemetry (OTel) is the vendor-neutral open standard for traces, metrics and logs. Its GenAI semantic conventions define standard span names and attributes for LLM calls and agents (such as gen_ai.request.model, gen_ai.usage.input_tokens and gen_ai.usage.output_tokens). Instrument once with OTel SDKs or auto-instrumentation libraries and export over OTLP to any compatible backend, so LLM traces sit alongside the rest of your system's traces.",
      code: {
        lang: "python",
        source:
          "from opentelemetry import trace\nfrom opentelemetry.sdk.trace import TracerProvider\nfrom opentelemetry.sdk.trace.export import BatchSpanProcessor\nfrom opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter\n\nprovider = TracerProvider()\nprovider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter()))   # any OTLP backend\ntrace.set_tracer_provider(provider)\ntracer = trace.get_tracer(\"library-bot\")\n\nwith tracer.start_as_current_span(\"chat claude-sonnet-5-5\") as span:\n    span.set_attribute(\"gen_ai.operation.name\", \"chat\")\n    span.set_attribute(\"gen_ai.request.model\", \"claude-sonnet-5-5\")\n    reply = client.messages.create(model=\"claude-sonnet-5-5\", max_tokens=300, messages=msgs)\n    span.set_attribute(\"gen_ai.usage.input_tokens\", reply.usage.input_tokens)\n    span.set_attribute(\"gen_ai.usage.output_tokens\", reply.usage.output_tokens)",
      },
      pitfalls: [
        "The GenAI conventions are still evolving; attribute names can change between versions.",
        "Recording full prompts and outputs in spans can leak personal data; make it opt-in.",
        "Auto-instrumentation libraries differ in coverage; check what they actually capture.",
      ],
      docsUrl: "https://opentelemetry.io/docs/specs/semconv/gen-ai/",
    },
    demo: "OtelDemo",
    related: ["evals-15", "evals-16", "deployment-19"],
    projects: ["build-evals"],
    keywords: ["opentelemetry", "otel", "otlp", "semantic conventions", "gen_ai", "observability standard"],
  },
  {
    id: "evals-18",
    area: "evals",
    number: 18,
    slug: "p95-latency",
    name: "P95 Latency",
    tier: "production",
    official:
      "95% of requests are faster than this. It shows the slow tail that an average hides.",
    kid: "If most pupils at school finish a test in 10 minutes but a few need an hour, the average hides those few. P95 tells you how long the slowest pupils, except the very last few, have to wait.",
    realWorld: {
      title: "The slow end of the queue",
      text: "The library help desk says 'the average wait is 2 minutes'. But the librarian looks closer: 95 out of 100 pupils are served within 3 minutes, and the last 5 wait up to 12 minutes because their questions need the archive. The average looked fine; the p95 of 3 minutes and the long tail behind it show what the unlucky pupils really feel.",
    },
    engineering: {
      text: "P95 latency is the 95th percentile of response times: 95% of requests are faster, 5% slower. Averages hide tail latency, which LLM apps have plenty of (long outputs, retries, cold caches, tool calls, provider slowdowns). Track p50, p95 and p99 per endpoint and model, measure time to first token separately for streaming, and set SLOs and alerts on percentiles rather than averages.",
      code: {
        lang: "python",
        source:
          "import numpy as np\n\nlatencies_ms = load_latencies(last=\"24h\")              # one number per request\nprint(\"average:\", round(np.mean(latencies_ms)), \"ms\")\nprint(\"p50:\", np.percentile(latencies_ms, 50), \"ms\")\nprint(\"p95:\", np.percentile(latencies_ms, 95), \"ms\")   # 95% of requests are faster than this\nprint(\"p99:\", np.percentile(latencies_ms, 99), \"ms\")\n# An average of 1,200 ms can hide a p95 of 6,000 ms: one user in twenty waits 6 seconds.",
      },
      pitfalls: [
        "Averaging percentiles across servers or hours is wrong; compute them from raw data or histograms.",
        "A few slow requests per user session make most users feel the tail; look at p99 too.",
        "Compare like with like: long-answer and short-answer endpoints need separate percentiles.",
      ],
      docsUrl: "https://sre.google/sre-book/service-level-objectives/",
    },
    demo: "P95Demo",
    related: ["system-design-07", "evals-19", "deployment-19", "system-design-08"],
    projects: ["build-evals"],
    keywords: ["p95 latency", "percentile", "tail latency", "response time", "slo", "p99"],
  },
  {
    id: "evals-19",
    area: "evals",
    number: 19,
    slug: "cost-per-request",
    name: "Cost per Request",
    tier: "production",
    official:
      "Total token + infra spend divided by requests. Track it per feature.",
    kid: "If the school spends 300 euros on the robot and it answers 1,000 questions, each question costs 30 cents. Knowing the price per question shows which jobs are too expensive.",
    realWorld: {
      title: "What does one answer cost?",
      text: "At the end of the month the school adds up the robot's bills: the brain, the search catalogue and the electricity. Divided by the questions answered, each answer costs 3 cents. Split by job, homework help costs 1 cent but essay feedback costs 12 cents, because it reads whole essays and writes long replies. Now the school knows which job to make cheaper first.",
    },
    engineering: {
      text: "Cost per request is total spend (model tokens, embeddings, reranking, vector database, servers, third-party APIs) divided by requests, tracked per feature, customer or model. LLM costs vary hugely between requests with input size, output length, retries and agent steps, so log the cost on every request from the usage data and look at distributions, not only averages. It drives pricing, routing and optimisation decisions and catches runaway agents.",
      code: {
        lang: "python",
        source:
          "PRICE = {\"claude-sonnet-5-5\": {\"in\": 3.00, \"out\": 15.00}}   # USD per 1M tokens, example values\n\ndef request_cost(model: str, usage, infra_usd: float = 0.0002) -> float:\n    p = PRICE[model]\n    tokens = (usage.input_tokens * p[\"in\"] + usage.output_tokens * p[\"out\"]) / 1e6\n    return tokens + infra_usd                    # plus a share of search, database and servers\n\n# Log it on every request with the feature name, then aggregate in SQL:\n# SELECT feature, avg(cost_usd), percentile_cont(0.95) WITHIN GROUP (ORDER BY cost_usd)\n# FROM requests WHERE ts > now() - interval '7 days' GROUP BY feature;",
      },
      pitfalls: [
        "Forgetting embeddings, retries and agent sub-calls undercounts the real cost.",
        "Averages hide expensive outliers; watch the p95 cost per request too.",
        "Prices change; store the price used with each record or recompute from tokens.",
      ],
      docsUrl: "https://langfuse.com/docs/model-usage-and-cost",
    },
    demo: "CostPerRequestDemo",
    related: ["llm-13", "system-design-20", "evals-18", "system-design-05"],
    projects: ["build-evals"],
    keywords: ["cost per request", "unit economics", "token cost", "spend", "per feature", "budget"],
  },
  {
    id: "evals-20",
    area: "evals",
    number: 20,
    slug: "user-feedback-loops",
    name: "User Feedback Loops",
    tier: "production",
    official:
      "Thumbs up/down and user corrections flow back into your test datasets.",
    kid: "When a pupil says 'this answer was wrong', the teacher writes that question into next year's test. Mistakes people point out become new test questions, so they never sneak back.",
    realWorld: {
      title: "Complaints become test questions",
      text: "Under every answer from the homework robot there are two buttons: thumbs up and thumbs down. When a pupil presses thumbs down and writes the right answer, the case lands on the teacher's desk. She checks it, and if the pupil was right, she adds that question to the answer-key test. From then on, every new version of the robot is tested on that exact mistake.",
    },
    engineering: {
      text: "User feedback loops capture explicit signals (thumbs up or down, ratings, corrections, regenerate clicks) and implicit ones (follow-up rephrasing, abandonment, escalation to a human), link them to traces, and route negative cases to review. Reviewed cases become new golden dataset entries and error-analysis input, so each real failure turns into a permanent regression test. Watch feedback rates per version as an online quality metric.",
      code: {
        lang: "python",
        source:
          "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.post(\"/feedback\")\ndef feedback(trace_id: str, thumbs_up: bool, correction: str | None = None):\n    store_feedback(trace_id, thumbs_up, correction)\n    if not thumbs_up:\n        trace = load_trace(trace_id)\n        review_queue.add({                       # a person reviews it before it becomes a test\n            \"question\": trace.input,\n            \"bad_answer\": trace.output,\n            \"suggested_answer\": correction,\n        })\n\n# Weekly: reviewed cases are added to golden.jsonl, so the same mistake is tested forever.",
      },
      pitfalls: [
        "Very few users give explicit feedback; also use implicit signals.",
        "Thumbs-down is noisy (users dislike true but unwelcome answers); review before adding to tests.",
        "Feedback and corrections are user data; get consent and remove personal details.",
      ],
      docsUrl: "https://langfuse.com/docs/scores/user-feedback",
    },
    demo: "FeedbackLoopDemo",
    related: ["evals-01", "evals-02", "evals-12", "evals-13"],
    projects: ["build-evals"],
    keywords: ["user feedback", "thumbs up", "feedback loop", "corrections", "data flywheel", "online evaluation"],
  },
];

export default concepts;

import type { ConceptInput } from "../schema";

/** Area: agents. Official one-liners are verbatim from the AI Engineer Roadmap (LearnVora, Nov 2026). */
const concepts: ConceptInput[] = [
  {
    id: "agents-01",
    area: "agents",
    number: 1,
    slug: "tool-calling",
    name: "Tool Calling",
    tier: "base",
    official:
      "The model returns a function name + arguments. Your code runs it and sends the result back.",
    kid: "A robot helper can't open the shop door itself, so it writes a note: 'buy bread, 2 loaves'. You do the shopping and tell the robot what happened, and it carries on.",
    realWorld: {
      title: "The robot's errand notes",
      text: "Our robot helper lives in a small town full of shops. It cannot press the buttons in the bakery itself; instead it hands you a neat note: 'bakery: buy, item = bread, amount = 2'. You go to the bakery and tell the robot 'done, it cost 4 euros'. The robot reads that and decides what to do next. The robot chooses; your code does.",
    },
    engineering: {
      text: "With tool calling you describe functions (name, description and a JSON Schema for the inputs) in the request. Instead of answering in text, the model can reply with a tool call: the tool name plus arguments that match the schema. Your code validates the arguments, runs the function and sends the result back as a tool result, after which the model continues. The model never executes anything itself, so permissions, validation and error handling live in your code.",
      code: {
        lang: "python",
        source:
          "from anthropic import Anthropic\n\nclient = Anthropic()\ntools = [{\n    \"name\": \"get_weather\",\n    \"description\": \"Current weather for a city\",\n    \"input_schema\": {\"type\": \"object\",\n                     \"properties\": {\"city\": {\"type\": \"string\"}},\n                     \"required\": [\"city\"]},\n}]\nmessages = [{\"role\": \"user\", \"content\": \"Do I need an umbrella in Berlin today?\"}]\nreply = client.messages.create(model=\"claude-sonnet-5-5\", max_tokens=500,\n                               tools=tools, messages=messages)\n\ncall = next(b for b in reply.content if b.type == \"tool_use\")   # input: {\"city\": \"Berlin\"}\nresult = get_weather(**call.input)                              # YOUR code runs the tool\nmessages += [{\"role\": \"assistant\", \"content\": reply.content},\n             {\"role\": \"user\", \"content\": [{\"type\": \"tool_result\",\n              \"tool_use_id\": call.id, \"content\": result}]}]\nfinal = client.messages.create(model=\"claude-sonnet-5-5\", max_tokens=500,\n                               tools=tools, messages=messages)\nprint(final.content[0].text)",
      },
      pitfalls: [
        "Validate tool arguments before running anything; the model can produce wrong or harmful values.",
        "Tool names and descriptions are prompts: vague ones cause wrong tool choices.",
        "Return errors as tool results the model can read, instead of crashing the loop.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/build-with-claude/tool-use",
    },
    demo: "ToolCallingDemo",
    related: ["agents-02", "llm-11", "security-09", "agents-08"],
    projects: ["build-agents"],
    keywords: ["tool calling", "function calling", "tools", "tool use", "json schema", "arguments"],
  },
  {
    id: "agents-02",
    area: "agents",
    number: 2,
    slug: "the-agent-loop",
    name: "The Agent Loop",
    tier: "base",
    official:
      "Think, call a tool, read the result, repeat until the task is done.",
    kid: "The robot looks at its list, does one job, checks what happened, and then picks the next job. It keeps going round and round until the whole list is done.",
    realWorld: {
      title: "Round and round the town",
      text: "The robot's job is 'get everything for Sunday breakfast'. It thinks about what is missing, walks to one shop, looks at what it got, and thinks again. Eggs sold out at the market? It tries the supermarket next. It keeps circling think, go, look until the bag is full, then heads home. Each lap is one turn of the agent loop.",
    },
    engineering: {
      text: "An agent is an LLM in a loop: send the conversation and the tool definitions to the model; if it returns tool calls, run them, append the results and call the model again; stop when it answers without tool calls or a stop condition fires. The loop itself is a few lines of code. The hard parts are good tools, clear instructions, context management, stop conditions and observability.",
      code: {
        lang: "python",
        source:
          "def run_agent(task: str, max_steps: int = 10) -> str:\n    messages = [{\"role\": \"user\", \"content\": task}]\n    for step in range(max_steps):\n        reply = llm(messages=messages, tools=TOOLS)            # think\n        messages.append({\"role\": \"assistant\", \"content\": reply.content})\n        calls = [b for b in reply.content if b.type == \"tool_use\"]\n        if not calls:\n            return reply.text                                  # done: no more tools needed\n        results = [{\"type\": \"tool_result\", \"tool_use_id\": c.id,\n                    \"content\": run_tool(c.name, c.input)}      # act\n                   for c in calls]\n        messages.append({\"role\": \"user\", \"content\": results})  # observe\n    return \"Stopped: step limit reached\"",
      },
      pitfalls: [
        "Every step re-sends the whole history, so cost and latency grow with each turn.",
        "Without a step limit a confused agent loops forever.",
        "When the steps are known in advance, a simple workflow is cheaper and more reliable than an agent.",
      ],
      docsUrl: "https://www.anthropic.com/engineering/building-effective-agents",
    },
    demo: "AgentLoopDemo",
    related: ["agents-01", "agents-19", "agents-03", "rag-18"],
    projects: ["build-agents"],
    keywords: ["agent loop", "agentic loop", "think act observe", "autonomous", "iteration"],
  },
  {
    id: "agents-03",
    area: "agents",
    number: 3,
    slug: "react-pattern",
    name: "ReAct Pattern",
    tier: "base",
    official:
      "Reasoning steps and actions take turns. The classic agent prompt pattern.",
    kid: "Before each move, the robot says out loud what it is thinking, then does one thing, then says what it saw. Thinking and doing take turns, like talking yourself through a game.",
    realWorld: {
      title: "The robot talks itself through it",
      text: "Asked 'can I reach the bakery by bus before it closes?', the robot says: 'Thought: I need the opening hours.' Action: it reads the bakery sign. 'Observation: open until 18:00.' 'Thought: now the bus time.' Action: it checks the timetable. By alternating thoughts and actions, every step is planned with the facts it has just learned.",
    },
    engineering: {
      text: "ReAct (Reason + Act, Yao et al., 2022) interleaves reasoning traces and actions in one transcript: Thought, Action, Observation, repeated until a final Answer. Reasoning helps choose the next action and update the plan; observations ground the reasoning in real data and reduce hallucination. Modern tool-calling APIs implement the same idea natively: the model writes some reasoning, emits a tool call and reads the tool result.",
      code: {
        lang: "python",
        source:
          "REACT_PROMPT = \"\"\"Answer the question. Tools: search[query], calculator[expression].\nUse this format and repeat Thought/Action/Observation as needed:\n\nThought: what you need to find out next\nAction: tool[input]\nObservation: (the code inserts the tool result here)\n...\nThought: I now know the answer\nAnswer: the final answer\n\nQuestion: {question}\"\"\"\n\n# The code stops generation at \"Observation:\", runs the Action,\n# appends the real result and lets the model continue.",
      },
      pitfalls: [
        "Text-parsed ReAct is fragile; prefer native tool calling, which returns structured actions.",
        "Long reasoning before every action costs tokens and time.",
        "Observations come from tools and are untrusted; they can contain injected instructions.",
      ],
      docsUrl: "https://arxiv.org/abs/2210.03629",
    },
    demo: "ReActDemo",
    related: ["agents-02", "llm-09", "agents-04"],
    projects: ["build-agents"],
    keywords: ["react", "reason and act", "thought action observation", "reasoning", "prompt pattern"],
  },
  {
    id: "agents-04",
    area: "agents",
    number: 4,
    slug: "planning",
    name: "Planning",
    tier: "base",
    official:
      "Break the goal into steps before acting, and update the plan as results come in.",
    kid: "Before going shopping, the robot writes a list: bakery, then market, then home. If a shop is closed, it crosses that line out and writes a new plan.",
    realWorld: {
      title: "The shopping list that changes",
      text: "For 'organise a birthday picnic' the robot first writes a plan: order the cake, buy balloons, book a spot in the park, invite friends. Then it works down the list. When the bakery says it is fully booked, the robot doesn't give up: it changes the plan to 'buy a cake at the supermarket' and carries on. A written plan keeps long jobs on track.",
    },
    engineering: {
      text: "Planning makes the agent break a goal into steps before acting, either explicitly (plan-and-execute: a planner writes steps, an executor runs them, a replanner updates the remaining steps after each result) or implicitly through reasoning. An explicit plan improves long tasks, gives a checklist to track progress and makes behaviour easier to inspect. Keep the plan in state or a file, update it as results arrive, and don't over-plan steps that depend on earlier results.",
      code: {
        lang: "python",
        source:
          "import json\n\nPLAN_PROMPT = \"\"\"Goal: {goal}\nWrite a numbered plan of 3-7 concrete steps. Return JSON: {{\"steps\": [\"...\"]}}\"\"\"\n\nplan = json.loads(llm(PLAN_PROMPT.format(goal=goal)))[\"steps\"]\ndone = []\nwhile plan:\n    step = plan.pop(0)\n    result = run_agent(f\"Goal: {goal}\\nDone so far: {done}\\nNow do: {step}\")\n    done.append({\"step\": step, \"result\": result})\n    plan = json.loads(llm(                                  # replan with what we learned\n        f\"Goal: {goal}\\nDone: {done}\\nRemaining plan: {plan}\\n\"\n        'Update the remaining steps. Return JSON: {\"steps\": [...]}'))[\"steps\"]",
      },
      pitfalls: [
        "Plans written before seeing any data are often wrong; replan after each step.",
        "Very long plans waste tokens and drift; keep the steps few and concrete.",
        "For long tasks, store the plan outside the context window, for example in a todo file.",
      ],
      docsUrl: "https://www.anthropic.com/engineering/building-effective-agents",
    },
    demo: "PlanningDemo",
    related: ["agents-05", "agents-12", "agents-02"],
    projects: ["build-agents"],
    keywords: ["planning", "plan and execute", "decomposition", "todo list", "replanning"],
  },
  {
    id: "agents-05",
    area: "agents",
    number: 5,
    slug: "reflection",
    name: "Reflection",
    tier: "base",
    official:
      "The agent reviews its own output and tries again to fix mistakes.",
    kid: "After drawing a picture, you look at it again and notice you forgot the sun, so you add it. The robot also checks its own work and fixes mistakes before handing it over.",
    realWorld: {
      title: "Checking the bag before going home",
      text: "Before leaving the market, the robot reads its list again and looks into its bag: 'the list says 6 eggs, the bag has 4'. It goes back for two more. For writing jobs it does the same: it writes a draft, reads it as a strict teacher would, notes what is wrong, and writes a better version. One or two checks catch most slips.",
    },
    engineering: {
      text: "Reflection (self-critique, evaluator-optimizer) adds a step where the model, or a second model, reviews an output against criteria or test results, and the agent revises using that feedback. It works best when the critique is grounded in something checkable: failing tests, linter errors, schema validation or a rubric. Limit the rounds to one to three; unguided self-critique can talk a model out of a correct answer.",
      code: {
        lang: "python",
        source:
          "def write_with_reflection(task: str, tests, rounds: int = 3) -> str:\n    code = llm(f\"Write a Python function for: {task}\")\n    for _ in range(rounds):\n        failures = run_tests(code, tests)          # grounded feedback, not just opinion\n        if not failures:\n            return code\n        critique = llm(f\"Code:\\n{code}\\nFailing tests:\\n{failures}\\nExplain the bug briefly.\")\n        code = llm(f\"Task: {task}\\nCode:\\n{code}\\nCritique: {critique}\\n\"\n                   \"Return only the fixed code.\")\n    return code   # best effort after the round limit",
      },
      pitfalls: [
        "Self-critique without an external signal can make good answers worse.",
        "Every round costs a full extra call; cap the rounds.",
        "A separate judge prompt or model critiques better than 'check your work' in the same turn.",
      ],
      docsUrl: "https://www.anthropic.com/engineering/building-effective-agents",
    },
    demo: "ReflectionDemo",
    related: ["agents-04", "evals-03", "llm-09"],
    projects: ["build-agents"],
    keywords: ["reflection", "self-critique", "evaluator optimizer", "revise", "self-correction"],
  },
  {
    id: "agents-06",
    area: "agents",
    number: 6,
    slug: "short-term-memory",
    name: "Short-term Memory",
    tier: "base",
    official:
      "What the agent holds in the current context: the conversation and recent tool results.",
    kid: "While you chat with a friend, you remember what they said a minute ago. The robot remembers the current chat too, but only the last few pages fit on its desk.",
    realWorld: {
      title: "The robot's small notepad",
      text: "During one errand the robot keeps a small notepad: what you asked, which shops it visited, what each shop said. That is its short-term memory, and it reads the whole notepad before every move. The notepad has few pages, so on a very long day the oldest notes fall out, and the robot may forget that you wanted brown bread.",
    },
    engineering: {
      text: "Short-term memory is everything in the model's context for the current task: system prompt, conversation turns, tool calls and tool results. It is limited by the context window and paid for on every call, and long tool outputs fill it quickly. Manage it deliberately: trim or summarise old turns, truncate large tool results, pin key facts such as decisions and user constraints, and move durable facts into long-term memory.",
      code: {
        lang: "python",
        source:
          "MAX_TOKENS = 30_000\n\ndef build_context(history: list[dict], pinned: str) -> tuple[str, list[dict]]:\n    \"\"\"Pinned facts go in the system prompt; keep as many recent turns as fit.\"\"\"\n    system = f\"{SYSTEM_PROMPT}\\n\\nKey facts so far:\\n{pinned}\"\n    kept, used = [], count_tokens(system)\n    for msg in reversed(history):                  # newest first\n        size = count_tokens(str(msg[\"content\"]))\n        if used + size > MAX_TOKENS:\n            break                                  # older turns fall out\n        kept.insert(0, msg)\n        used += size\n    return system, kept",
      },
      pitfalls: [
        "Huge tool results, such as a whole web page, can crowd out the actual conversation.",
        "Cutting the history between a tool call and its result breaks the message format.",
        "Anything important must be pinned or saved, or it silently disappears when old turns are trimmed.",
      ],
      docsUrl: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
    },
    demo: "ShortTermMemoryDemo",
    related: ["agents-07", "agents-18", "llm-04"],
    projects: ["build-agents"],
    keywords: ["short-term memory", "context", "conversation history", "messages", "working memory"],
  },
  {
    id: "agents-07",
    area: "agents",
    number: 7,
    slug: "long-term-memory",
    name: "Long-term Memory",
    tier: "base",
    official:
      "Facts saved outside the context (files, database, vector store) and recalled in later sessions.",
    kid: "The robot keeps a notebook at home where it writes down things worth remembering, like your favourite fruit. Next week the robot reads it again and still knows.",
    realWorld: {
      title: "The notebook on the kitchen shelf",
      text: "When you tell the robot 'I don't eat meat', it writes that in a notebook it keeps at home. The next morning it starts with an empty notepad, but before shopping it looks up anything in the notebook about food, finds the note and skips the butcher. Long-term memory is whatever survives from one day to the next.",
    },
    engineering: {
      text: "Long-term memory stores information outside the context window so it persists across sessions: user preferences, learned facts, outcomes of past tasks or procedures. Implementations range from files the agent edits (a memory.md) to key-value stores, SQL and vector stores searched by relevance. The agent writes memories through tools or a background extraction step and retrieves the relevant ones into context at the start of a task. Decide what is worth storing, how it is updated or deleted, and who can see it.",
      code: {
        lang: "python",
        source:
          "from datetime import date\n\ndef remember(user_id: str, fact: str):\n    \"\"\"A tool the agent can call to save something worth keeping.\"\"\"\n    store.add(user_id=user_id, text=fact, embedding=embed(fact), saved=date.today())\n\ndef recall(user_id: str, task: str, k: int = 5) -> str:\n    hits = store.search(user_id=user_id, embedding=embed(task), limit=k)\n    return \"\\n\".join(f\"- {h.text}\" for h in hits)\n\nsystem = f\"\"\"You are a helpful assistant.\nWhat you remember about this user:\n{recall(user_id, task)}\"\"\"",
      },
      pitfalls: [
        "Stale or wrong memories are worse than none; let users view, correct and delete them.",
        "Memory is personal data: scope it per user and follow privacy rules such as GDPR.",
        "Saving everything creates noise; save durable facts and decisions, not every message.",
      ],
      docsUrl: "https://langchain-ai.github.io/langgraph/concepts/memory/",
    },
    demo: "LongTermMemoryDemo",
    related: ["agents-06", "rag-04", "security-07"],
    projects: ["build-agents"],
    keywords: ["long-term memory", "persistent memory", "user preferences", "vector store", "remember"],
  },
  {
    id: "agents-08",
    area: "agents",
    number: 8,
    slug: "mcp-servers",
    name: "MCP Servers",
    tier: "base",
    official:
      "Model Context Protocol servers offer tools, resources and prompts in one standard format.",
    kid: "Every shop in town puts up the same kind of sign that lists what it sells and how to ask for it. An MCP server is that sign, so any robot can understand any shop.",
    realWorld: {
      title: "Every shop uses the same menu board",
      text: "In the old town every shop had its own rules: one wanted written orders, another only spoke French. Then the town hall introduced one standard menu board: what you can do here (tools), what you can read here (resources) and ready-made order forms (prompts). Now any robot that understands the board can shop anywhere. The weather station, the library and the calendar office each put one up.",
    },
    engineering: {
      text: "The Model Context Protocol (MCP), introduced by Anthropic in 2024 and now widely adopted, standardises how applications expose context and actions to LLMs. An MCP server offers tools (functions the model can call), resources (readable data such as files or records) and prompts (reusable templates) over JSON-RPC, via stdio for local servers or Streamable HTTP for remote ones. Write a server once and any MCP client can use it.",
      code: {
        lang: "python",
        source:
          "from mcp.server.fastmcp import FastMCP\n\nmcp = FastMCP(\"library\")\n\n@mcp.tool()\ndef search_books(query: str, limit: int = 5) -> list[str]:\n    \"\"\"Search the library catalogue by title or topic.\"\"\"\n    return catalogue.search(query)[:limit]\n\n@mcp.resource(\"books://{isbn}\")\ndef book_details(isbn: str) -> str:\n    \"\"\"The full record for one book.\"\"\"\n    return catalogue.get(isbn).to_json()\n\nif __name__ == \"__main__\":\n    mcp.run()        # stdio by default; use Streamable HTTP for remote servers",
      },
      pitfalls: [
        "A server's tool descriptions go straight into the model's context; keep them short and clear.",
        "Only connect servers you trust: a malicious server can inject instructions or leak data.",
        "Tools run with the server's permissions; apply least privilege and authenticate remote servers.",
      ],
      docsUrl: "https://modelcontextprotocol.io/",
    },
    demo: "McpServerDemo",
    related: ["agents-09", "security-18", "agents-01", "agents-10"],
    projects: ["build-agents"],
    keywords: ["mcp", "model context protocol", "mcp server", "tools", "resources", "prompts"],
  },
  {
    id: "agents-09",
    area: "agents",
    number: 9,
    slug: "mcp-clients",
    name: "MCP Clients",
    tier: "base",
    official:
      "The app side (IDE, chat app, your agent) that connects to MCP servers and uses their tools.",
    kid: "A robot with one universal plug can use any shop that has the matching socket. The MCP client is that plug inside an app, so it can connect to lots of shops.",
    realWorld: {
      title: "The robot's universal plug",
      text: "The robot has one universal plug. Plug it into the weather station and it can suddenly check forecasts; plug it into the calendar office and it can read your appointments. The robot needed no new programming for either, because both speak the same standard. Chat apps, code editors and your own agents can all carry this plug.",
    },
    engineering: {
      text: "An MCP client lives inside a host application (a chat app, an IDE, your agent) and keeps a connection to one MCP server: it performs the initialize handshake, lists the server's tools, resources and prompts, and calls them on the model's behalf. The host passes the discovered tools to the LLM and routes each tool call to the right client. Hosts decide which servers are allowed, ask users for consent on sensitive actions and handle authentication for remote servers.",
      code: {
        lang: "python",
        source:
          "import asyncio\nfrom mcp import ClientSession, StdioServerParameters\nfrom mcp.client.stdio import stdio_client\n\nasync def main():\n    params = StdioServerParameters(command=\"python\", args=[\"library_server.py\"])\n    async with stdio_client(params) as (read, write):\n        async with ClientSession(read, write) as session:\n            await session.initialize()                    # handshake\n            tools = await session.list_tools()            # what can this server do?\n            print([t.name for t in tools.tools])          # ['search_books']\n            result = await session.call_tool(\"search_books\", {\"query\": \"volcanoes\"})\n            print(result.content)\n\nasyncio.run(main())",
      },
      pitfalls: [
        "Many servers mean many tool definitions in context; load only what the task needs.",
        "Ask the user to confirm before tools with side effects run.",
        "Tool names can clash between servers; namespace them.",
      ],
      docsUrl: "https://github.com/modelcontextprotocol/python-sdk",
    },
    demo: "McpClientDemo",
    related: ["agents-08", "agents-17", "security-18"],
    projects: ["build-agents"],
    keywords: ["mcp client", "host", "connect", "list tools", "call tool", "integration"],
  },
  {
    id: "agents-10",
    area: "agents",
    number: 10,
    slug: "agent-skills",
    name: "Agent Skills",
    tier: "base",
    official:
      "Folders of instructions and scripts that the agent loads only when a task needs them.",
    kid: "The robot doesn't carry every cookbook all day. It keeps a shelf of folders with short labels and only opens the folder it needs, like the cake folder on cake day.",
    realWorld: {
      title: "A shelf of labelled folders",
      text: "The robot's backpack is small, so it cannot carry every instruction manual. At home it keeps a shelf of folders, each with a one-line label: 'baking cakes', 'fixing bikes', 'filling in tax forms'. Each morning it only reads the labels. When today's job is a cake, it opens just the baking folder, with its recipe steps and a timer tool inside.",
    },
    engineering: {
      text: "Agent Skills, introduced by Anthropic in 2025, are folders containing a SKILL.md file (a name and description in YAML frontmatter, then detailed instructions) plus optional scripts and reference files. Only the name and description are loaded into context up front; the agent reads the full instructions, and runs the bundled scripts, only when a task matches. This progressive disclosure gives an agent many specialised capabilities without filling its context window.",
      code: {
        lang: "markdown",
        source:
          "---\nname: invoice-pdf\ndescription: Create German invoices as PDF from order data. Use when the user asks for an invoice or a Rechnung.\n---\n\n# Invoice PDF\n\n1. Read the order JSON and validate it with `scripts/validate.py`.\n2. Fill `templates/invoice.html` (VAT 19%, invoice numbers like RE-2026-0042).\n3. Render it with `scripts/render_pdf.py` and return the file path.\n\nSee `reference/legal-requirements.md` for the mandatory invoice fields.",
      },
      pitfalls: [
        "The description decides when a skill is used; write it like a trigger, with concrete phrases.",
        "Skills can run scripts: install them only from sources you trust.",
        "Keep SKILL.md short and move long details into reference files that are read on demand.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview",
    },
    demo: "AgentSkillsDemo",
    related: ["agents-08", "agents-17", "security-10"],
    projects: ["build-agents"],
    keywords: ["agent skills", "skill.md", "progressive disclosure", "instructions", "scripts", "capabilities"],
  },
  {
    id: "agents-11",
    area: "agents",
    number: 11,
    slug: "multi-agent-handoffs",
    name: "Multi-agent Handoffs",
    tier: "production",
    official:
      "One agent passes the task, with its context, to a more specialised agent.",
    kid: "At the town hall, the front desk listens to you and then walks you to the right office, telling them what you need. You don't have to explain everything again.",
    realWorld: {
      title: "The town hall front desk",
      text: "A visitor arrives at the town hall: 'my bin wasn't emptied and I want my money back'. The front-desk robot doesn't handle refunds itself. It walks the visitor to the money office and hands over a note with the story so far. The money robot, which knows the refund rules, takes over the conversation from there.",
    },
    engineering: {
      text: "In a handoff one agent transfers control of the conversation, with its context, to a more specialised agent: typically a triage agent routing to billing, technical support or sales. Each agent gets focused instructions and tools, which is more accurate than one agent with everything. Handoffs are usually implemented as special tool calls; decide what context is passed (the full history or a summary) and whether control can come back.",
      code: {
        lang: "python",
        source:
          "from agents import Agent, Runner\n\nbilling = Agent(name=\"Billing\", instructions=\"Handle refunds and invoices. Follow the refund policy.\")\ntech = Agent(name=\"Tech support\", instructions=\"Troubleshoot app problems step by step.\")\n\ntriage = Agent(\n    name=\"Front desk\",\n    instructions=\"Find out what the user needs, then hand off to the right specialist.\",\n    handoffs=[billing, tech],            # offered to the model as transfer tools\n)\n\nresult = Runner.run_sync(triage, \"I was charged twice for my subscription\")\nprint(result.last_agent.name)            # Billing\nprint(result.final_output)",
      },
      pitfalls: [
        "Passing the full history can confuse the specialist; consider passing a summary.",
        "Agents bouncing a user back and forth is a common failure; limit handoffs per conversation.",
        "Each agent needs its own evals: one wrong route fails the whole conversation.",
      ],
      docsUrl: "https://openai.github.io/openai-agents-python/handoffs/",
    },
    demo: "HandoffDemo",
    related: ["agents-12", "agents-14", "agents-20"],
    projects: ["build-agents"],
    keywords: ["handoff", "multi-agent", "triage", "routing", "specialist agent", "transfer"],
  },
  {
    id: "agents-12",
    area: "agents",
    number: 12,
    slug: "orchestrator-worker-pattern",
    name: "Orchestrator-Worker Pattern",
    tier: "production",
    official:
      "A lead agent splits the work, workers do the parts in parallel, the lead merges the results.",
    kid: "For a big school project, the team captain splits the work, everyone does their part at the same time, and the captain puts it together. Big jobs get done faster that way.",
    realWorld: {
      title: "One planner, many runners",
      text: "The robot is asked to compare the three best bakeries in town. The lead robot splits the job: runner A visits bakery A, runner B bakery B, runner C bakery C, all at the same time. Each runner comes back with prices, opening hours and a taste note. The lead robot merges the three reports into one recommendation.",
    },
    engineering: {
      text: "In the orchestrator-worker pattern a lead agent breaks a task into subtasks at runtime, starts worker agents (often in parallel) with focused instructions and fresh context, and combines their results. It suits broad research, multi-file code changes and comparisons, where subtasks are independent and can't be predicted upfront. It multiplies token usage, so use it for valuable, parallelisable work, and give workers clear boundaries and output formats.",
      code: {
        lang: "python",
        source:
          "import asyncio, json\n\nasync def orchestrate(task: str) -> str:\n    subtasks = json.loads(await llm_async(\n        f\"Split into 2-5 independent research subtasks. JSON list of strings.\\nTask: {task}\"))\n\n    async def worker(sub: str) -> str:\n        return await run_agent_async(f\"{sub}\\nReturn at most 200 words with sources.\")\n\n    reports = await asyncio.gather(*(worker(s) for s in subtasks))   # in parallel\n    return await llm_async(f\"Task: {task}\\nWorker reports:\\n\" + \"\\n---\\n\".join(reports)\n                           + \"\\nWrite the final answer.\")",
      },
      pitfalls: [
        "Token cost multiplies with the number of workers.",
        "Vague subtasks lead to duplicated or missing work; specify scope and output format.",
        "Workers that need each other's results are not parallel; use a plan instead.",
      ],
      docsUrl: "https://www.anthropic.com/engineering/multi-agent-research-system",
    },
    demo: "OrchestratorDemo",
    related: ["agents-11", "agents-04", "system-design-15"],
    projects: ["build-agents"],
    keywords: ["orchestrator worker", "multi-agent", "parallel", "subagents", "delegation", "fan-out"],
  },
  {
    id: "agents-13",
    area: "agents",
    number: 13,
    slug: "langgraph",
    name: "LangGraph",
    tier: "production",
    official:
      "A framework for building agents as graphs of steps with shared state, branches and loops.",
    kid: "Imagine a board game where each square is a job and arrows show where to go next, even back to an earlier square. LangGraph builds helpers that move around a map like that.",
    realWorld: {
      title: "The town map with arrows",
      text: "The robot gets a laminated town map with squares for 'write the letter', 'check the letter' and 'post the letter', joined by arrows. One arrow from 'check' says: if there are mistakes, go back to 'write'. A clipboard (the shared state) travels with the robot and every square adds notes to it. The map makes the robot's route predictable and easy to inspect.",
    },
    engineering: {
      text: "LangGraph, from the LangChain team, builds agents and workflows as graphs: nodes are functions or LLM calls, edges define the control flow, and conditional edges allow branches and loops. A typed state object is passed between nodes and updated by each one. It adds checkpointing (persistence, resume, time travel), human-in-the-loop interrupts and streaming, which makes it a common choice for production agents that need more control than a plain loop.",
      code: {
        lang: "python",
        source:
          "from typing import TypedDict\nfrom langgraph.graph import END, START, StateGraph\n\nclass State(TypedDict):\n    request: str\n    draft: str\n    approved: bool\n\ndef write(state: State):\n    return {\"draft\": llm(f\"Write a polite reminder: {state['request']}\")}\n\ndef review(state: State):\n    return {\"approved\": judge(state[\"draft\"], rubric=\"polite, includes the due date\")}\n\ngraph = StateGraph(State)\ngraph.add_node(\"write\", write)\ngraph.add_node(\"review\", review)\ngraph.add_edge(START, \"write\")\ngraph.add_edge(\"write\", \"review\")\ngraph.add_conditional_edges(\"review\", lambda s: END if s[\"approved\"] else \"write\")\n\napp = graph.compile()\nprint(app.invoke({\"request\": \"Sam's library book is overdue\"})[\"draft\"])",
      },
      pitfalls: [
        "Graphs add structure and boilerplate; a plain loop is enough for simple agents.",
        "Loops in the graph still need a recursion limit or another stop condition.",
        "Keep the state small and typed; huge state objects make checkpoints slow.",
      ],
      docsUrl: "https://langchain-ai.github.io/langgraph/",
    },
    demo: "LangGraphDemo",
    related: ["agents-15", "agents-16", "agents-02"],
    projects: ["build-agents"],
    keywords: ["langgraph", "graph", "state machine", "nodes", "edges", "workflow", "langchain"],
  },
  {
    id: "agents-14",
    area: "agents",
    number: 14,
    slug: "openai-agents-sdk",
    name: "OpenAI Agents SDK",
    tier: "production",
    official:
      "A light framework for agents with tools, handoffs, guardrails and tracing built in.",
    kid: "It is a starter kit for building robot helpers: the parts for using tools, passing jobs along, safety checks and a diary of what happened are already in the box.",
    realWorld: {
      title: "A robot starter kit",
      text: "Instead of building every robot part from scratch, the town workshop sells a starter kit. Inside: arms for using tools, a button to pass a visitor to another robot, a guard that checks every request before work starts, and a logbook that records each step. Assemble the parts with a few lines of instructions and the robot is ready for errands.",
    },
    engineering: {
      text: "The OpenAI Agents SDK is a lightweight Python and TypeScript framework built on a few primitives: Agents (instructions, model, tools), handoffs between agents, guardrails that validate inputs and outputs, sessions for memory, and built-in tracing of every run. Function tools are plain functions whose schemas are generated from type hints and docstrings. It targets OpenAI models and can use other providers through adapters.",
      code: {
        lang: "python",
        source:
          "from agents import Agent, Runner, function_tool\n\n@function_tool\ndef bakery_hours(day: str) -> str:\n    \"\"\"Opening hours of the town bakery for a given weekday.\"\"\"\n    return \"closed\" if day.lower() == \"sunday\" else \"07:00-18:00\"\n\nhelper = Agent(\n    name=\"Errand helper\",\n    instructions=\"Help plan errands in town. Use tools for facts and keep answers short.\",\n    tools=[bakery_hours],                  # schema generated from type hints + docstring\n)\n\nresult = Runner.run_sync(helper, \"Can I buy bread on Sunday morning?\")\nprint(result.final_output)                  # every step is also recorded as a trace",
      },
      pitfalls: [
        "Framework abstractions hide what is sent to the model; read the traces.",
        "Design guardrails for risky actions to fail closed: block when unsure.",
        "Pin the SDK version; agent frameworks change quickly.",
      ],
      docsUrl: "https://openai.github.io/openai-agents-python/",
    },
    demo: "AgentsSdkDemo",
    related: ["agents-11", "security-05", "evals-15", "agents-13"],
    projects: ["build-agents"],
    keywords: ["openai agents sdk", "agents framework", "guardrails", "tracing", "handoffs", "function tools"],
  },
  {
    id: "agents-15",
    area: "agents",
    number: 15,
    slug: "state-and-checkpoints",
    name: "State and Checkpoints",
    tier: "production",
    official:
      "Save the agent's state at every step so a run can pause, resume or be replayed.",
    kid: "In a video game you save your progress, so if you fall you start from the last save, not the very beginning. Checkpoints let a robot helper do the same.",
    realWorld: {
      title: "Saving the game after every shop",
      text: "After each shop the robot writes a save point into its logbook: what is in the bag and what is left on the list. When its battery dies at the post office, a fresh robot reads the last save and continues from there instead of going back to the bakery. The town can even rewind to any save to see exactly what happened.",
    },
    engineering: {
      text: "Checkpointing persists the agent's full state (messages, variables, pending steps) after every step, keyed by a thread or run id. This enables resuming after crashes or deploys, long-running and human-paused workflows, multi-turn conversations, debugging by inspecting past states, and time travel: replaying or forking from an earlier step. Use a durable store such as Postgres or Redis in production, not memory.",
      code: {
        lang: "python",
        source:
          "from langgraph.checkpoint.memory import InMemorySaver   # use a Postgres saver in production\n\napp = graph.compile(checkpointer=InMemorySaver())\nconfig = {\"configurable\": {\"thread_id\": \"errand-42\"}}\n\napp.invoke({\"task\": \"Buy everything for Sunday breakfast\"}, config)   # crashes at step 4?\n\nprint(app.get_state(config).values)                 # the last saved state\nfor snapshot in app.get_state_history(config):      # every checkpoint, newest first\n    print(snapshot.config[\"configurable\"][\"checkpoint_id\"], snapshot.next)\n\napp.invoke(None, config)                             # resume from the last checkpoint",
      },
      pitfalls: [
        "Side effects such as payments or emails may run twice on resume; make tools idempotent.",
        "In-memory checkpointers lose everything on restart.",
        "State can contain personal data; apply retention and access rules.",
      ],
      docsUrl: "https://langchain-ai.github.io/langgraph/concepts/persistence/",
    },
    demo: "CheckpointsDemo",
    related: ["agents-13", "agents-16", "backend-15"],
    projects: ["build-agents"],
    keywords: ["checkpoints", "state", "persistence", "resume", "time travel", "thread id"],
  },
  {
    id: "agents-16",
    area: "agents",
    number: 16,
    slug: "human-in-the-loop",
    name: "Human in the Loop",
    tier: "production",
    official:
      "The agent stops and waits for a person to approve or edit before a risky step.",
    kid: "Before the robot spends your pocket money, it stops and asks: is it okay to buy this? It only goes ahead when you say yes.",
    realWorld: {
      title: "The robot asks before paying",
      text: "The robot can do most errands alone, but the town rule says: before paying more than 20 euros, or posting a letter in your name, it must call you. It shows you the basket or the letter and waits. You can say yes, change the letter, or say no. Small things run on their own; risky things wait for a person.",
    },
    engineering: {
      text: "Human-in-the-loop pauses an agent at defined points so a person can approve, edit or reject an action before it runs, typically for irreversible or high-impact steps: payments, deletions, sending messages, production changes. Implement it as an interrupt that saves state, notifies a person and resumes with their decision. Show the exact action and arguments, not a vague summary, and log who approved what.",
      code: {
        lang: "python",
        source:
          "from langgraph.types import Command, interrupt\n\ndef send_refund(state):\n    decision = interrupt({                    # pauses the graph and saves the state\n        \"action\": \"refund\",\n        \"amount_eur\": state[\"amount\"],\n        \"customer\": state[\"customer_id\"],\n    })\n    if decision[\"approved\"]:\n        payments.refund(state[\"customer_id\"], decision.get(\"amount\", state[\"amount\"]))\n        return {\"status\": \"refunded\"}\n    return {\"status\": \"rejected by a human\"}\n\n# Later, after a person clicks \"Approve\" in your app:\napp.invoke(Command(resume={\"approved\": True}), config)",
      },
      pitfalls: [
        "Too many approval requests train people to click yes without reading.",
        "Show the exact arguments (amount, recipient), not the model's summary of them.",
        "A pause can last days; save state durably and handle timeouts.",
      ],
      docsUrl: "https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/",
    },
    demo: "HumanInLoopDemo",
    related: ["security-14", "agents-15", "agents-13"],
    projects: ["build-agents"],
    keywords: ["human in the loop", "approval", "interrupt", "review", "confirm", "oversight"],
  },
  {
    id: "agents-17",
    area: "agents",
    number: 17,
    slug: "context-engineering",
    name: "Context Engineering",
    tier: "production",
    official:
      "Choosing exactly what goes into the context at each step: instructions, tools, data, history.",
    kid: "Before a test you pack your school bag with just the right books, not every book you own. Context engineering packs just the right things for the robot at every step.",
    realWorld: {
      title: "Packing the backpack for each errand",
      text: "Before every errand the robot packs a small backpack: today's instructions, the tools for the shops it will visit, the notes that matter and the part of the conversation it needs. Packing the whole house would make the backpack too heavy, and things would get lost inside. Leaving out the shopping list would be worse. Choosing what goes in is a skill of its own.",
    },
    engineering: {
      text: "Context engineering is deciding exactly what goes into the model's context at each step: system instructions, tool definitions, retrieved knowledge, memory, conversation history and tool results, plus their order and format. Context is finite and attention degrades with length, so the goal is the smallest set of high-signal tokens that lets the model succeed. Techniques include just-in-time retrieval, trimming tool results, structured notes, sub-agents with clean contexts, and compaction.",
      code: {
        lang: "python",
        source:
          "def build_context(task, user, step) -> str:\n    parts = [SYSTEM_PROMPT]                                      # stable, cacheable prefix\n    parts.append(tool_definitions(only=step.needed_tools))       # not all 40 tools\n    parts.append(memory.recall(user.id, task, k=5))              # a few relevant facts\n    parts.append(retrieve(task, limit=4))                        # just-in-time knowledge\n    parts.append(summarise_if_long(step.history, max_tokens=4_000))\n    context = \"\\n\\n\".join(p for p in parts if p)\n    assert count_tokens(context) < 40_000, \"context budget exceeded\"\n    return context",
      },
      pitfalls: [
        "More context is not better: irrelevant tokens dilute attention and cost money.",
        "Put stable content first so prompt caching works, and changing content last.",
        "Log the exact context of failed runs; most agent bugs are context bugs.",
      ],
      docsUrl: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
    },
    demo: "ContextEngineeringDemo",
    related: ["agents-18", "llm-04", "system-design-19", "llm-12"],
    projects: ["build-agents"],
    keywords: ["context engineering", "context window", "relevant information", "token budget", "prompt"],
  },
  {
    id: "agents-18",
    area: "agents",
    number: 18,
    slug: "context-compaction",
    name: "Context Compaction",
    tier: "production",
    official:
      "Summarise or drop old history when the context gets long, and keep what still matters.",
    kid: "When your notepad is almost full, you write a short summary of the old pages and tear them out. The robot does that with an old chat, keeping only what still matters.",
    realWorld: {
      title: "Summarising yesterday's notes",
      text: "After a long day of errands the robot's notepad is nearly full. Instead of stopping, it reads the oldest pages and writes a short summary on a fresh page: 'Bread bought. Eggs sold out at the market, ordered for Tuesday. 12 euros left.' Then it tears out the old pages. It keeps decisions and open tasks and drops the chit-chat.",
    },
    engineering: {
      text: "Compaction keeps long-running agents within the context window by summarising or pruning old content when usage crosses a threshold: replacing old turns with a summary, clearing old tool results that were already used, or saving notes to external memory. A good summary preserves decisions, constraints, open tasks and key facts, including ids, file paths and numbers. Some agent runtimes and APIs now offer automatic compaction and tool-result clearing.",
      code: {
        lang: "python",
        source:
          "LIMIT, KEEP_RECENT = 100_000, 10\n\ndef maybe_compact(messages: list[dict]) -> list[dict]:\n    if count_tokens(messages) < 0.8 * LIMIT:\n        return messages\n    old, recent = split_at_clean_turn(messages, keep=KEEP_RECENT)   # never split a tool call\n    summary = llm(\n        \"Summarise this conversation for yourself. Keep decisions, user constraints, \"\n        \"open tasks, names, ids, numbers and file paths. Drop chit-chat.\\n\\n\" + render(old))\n    return [{\"role\": \"user\", \"content\": f\"Summary of earlier work:\\n{summary}\"}] + recent",
      },
      pitfalls: [
        "A bad summary silently loses facts; test compaction on long, real sessions.",
        "Never split between a tool call and its result; cut at clean turn boundaries.",
        "Compaction itself costs a model call and adds a delay when it triggers.",
      ],
      docsUrl: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
    },
    demo: "CompactionDemo",
    related: ["agents-17", "agents-06", "system-design-19"],
    projects: ["build-agents"],
    keywords: ["compaction", "summarisation", "context window", "long conversations", "pruning"],
  },
  {
    id: "agents-19",
    area: "agents",
    number: 19,
    slug: "stop-conditions",
    name: "Stop Conditions",
    tier: "production",
    official:
      "Step limits, budgets, timeouts and 'done' checks, so the agent can't loop forever.",
    kid: "A robot told to find the perfect apple might search forever. So we give it rules: stop after ten shops, stop when the money is spent, or stop when the bag is full.",
    realWorld: {
      title: "Rules for when to come home",
      text: "The robot once spent a whole night walking between two shops, each time sure the other one had better apples. Now the town gives every robot four rules: visit at most ten shops, spend at most 20 euros, be home by six, and come home as soon as the list is complete. Whichever rule triggers first ends the trip, and the robot reports why it stopped.",
    },
    engineering: {
      text: "Stop conditions bound an agent run: a maximum number of steps or tool calls, token and cost budgets, wall-clock timeouts, explicit completion signals (the model calls a 'done' tool or answers without tool calls), and loop detection (the same tool with the same arguments repeated). Always return a useful partial result with the reason for stopping, and alert on runs that hit limits, because they reveal failing tasks.",
      code: {
        lang: "python",
        source:
          "import time\n\ndef run_with_limits(task, max_steps=15, max_cost_usd=0.50, timeout_s=120):\n    start, cost, seen = time.time(), 0.0, set()\n    for step in range(max_steps):\n        reply = llm_step(task)\n        cost += reply.cost_usd\n        if reply.is_final:\n            return reply.text, \"done\"\n        call = (reply.tool_name, str(reply.tool_input))\n        if call in seen:\n            return partial_result(), \"loop detected\"       # the same call twice\n        seen.add(call)\n        if cost > max_cost_usd:\n            return partial_result(), \"budget exceeded\"\n        if time.time() - start > timeout_s:\n            return partial_result(), \"timeout\"\n    return partial_result(), \"step limit\"",
      },
      pitfalls: [
        "A run that hit a limit can look like a success; always report the stop reason.",
        "Limits that are too tight cut off legitimate long tasks; tune them on real traces.",
        "Loops often hide in retries: identical tool calls with identical arguments.",
      ],
      docsUrl: "https://www.anthropic.com/engineering/building-effective-agents",
    },
    demo: "StopConditionsDemo",
    related: ["agents-02", "system-design-05", "evals-19"],
    projects: ["build-agents"],
    keywords: ["stop conditions", "max steps", "budget", "timeout", "infinite loop", "limits"],
  },
  {
    id: "agents-20",
    area: "agents",
    number: 20,
    slug: "a2a-protocol",
    name: "A2A Protocol",
    tier: "production",
    official:
      "Agent2Agent: an open protocol that lets agents from different teams find and talk to each other.",
    kid: "Robots from different towns were built by different people, so they agree on one way to say hello, show what they can do and pass jobs to each other. That shared way of talking is A2A.",
    realWorld: {
      title: "Robots from different towns working together",
      text: "Our town's travel robot needs a hotel room in another city. It cannot just call that city's hotel robot, because they were built by different companies. With A2A, the hotel robot hangs out a public business card saying who it is and what it can do. The travel robot reads the card, sends a booking task in the agreed format and receives updates until the room is booked.",
    },
    engineering: {
      text: "Agent2Agent (A2A), launched by Google in 2025 and now hosted by the Linux Foundation, is an open protocol that lets agents built on different frameworks and by different vendors discover each other and work together. An agent publishes an Agent Card (JSON metadata: name, skills, endpoint, authentication) at a well-known URL; agents then exchange messages and long-running tasks over HTTP using JSON-RPC, with streaming and push notifications. MCP connects an agent to tools and data; A2A connects agents to other agents.",
      code: {
        lang: "jsonc",
        source:
          "// Agent Card, published at a well-known URL on the hotel agent's domain\n{\n  \"name\": \"Hotel booking agent\",\n  \"description\": \"Finds and books hotel rooms in Vienna.\",\n  \"url\": \"https://hotel.example.com/a2a\",\n  \"version\": \"1.0.0\",\n  \"capabilities\": { \"streaming\": true },\n  \"skills\": [\n    { \"id\": \"book_room\", \"name\": \"Book a room\",\n      \"description\": \"Book a room for given dates, guests and budget.\" }\n  ]\n}\n\n// A client request: JSON-RPC over HTTP (simplified; check the current spec)\n{ \"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"message/send\",\n  \"params\": { \"message\": { \"role\": \"user\", \"messageId\": \"m-1\",\n    \"parts\": [{ \"kind\": \"text\", \"text\": \"2 nights from 12 March, 1 guest, under 150 EUR\" }] } } }",
      },
      pitfalls: [
        "Authenticate and authorise remote agents like any external API; never trust them by default.",
        "A remote agent's output is untrusted input for your agent.",
        "The protocol is young and evolving; pin versions and check the current spec.",
      ],
      docsUrl: "https://a2a-protocol.org/",
    },
    demo: "A2ADemo",
    related: ["agents-08", "agents-11", "security-13"],
    projects: ["build-agents"],
    keywords: ["a2a", "agent2agent", "agent card", "interoperability", "multi-agent", "protocol"],
  },
];

export default concepts;

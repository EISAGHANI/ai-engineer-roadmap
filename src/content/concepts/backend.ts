import type { ConceptInput } from "../schema";

/** Area: backend. Official one-liners are verbatim from the AI Engineer Roadmap (LearnVora, Nov 2026). */
const concepts: ConceptInput[] = [
  {
    id: "backend-01",
    area: "backend",
    number: 1,
    slug: "rest-apis",
    name: "REST APIs",
    tier: "base",
    official:
      "URLs for resources + HTTP methods (GET, POST, PUT, DELETE) to expose your app.",
    kid: "A post office has a separate window for each kind of job: send a letter, pick up a parcel, change your address. REST APIs give an app clear windows like that, so other programs know where to ask for what.",
    realWorld: {
      title: "Windows with clear signs",
      text: "At our post office every window has a sign. 'Parcels' is where parcels live. You can look at one (show me parcel 42), hand in a new one, change its address or cancel it. Because every window follows the same rules, a new visitor knows what to do without asking. REST works the same way: nouns in the address, and a handful of standard verbs for what you want done.",
    },
    engineering: {
      text: "REST APIs expose resources at URLs (/documents, /documents/42) and use HTTP methods for actions: GET reads, POST creates, PUT or PATCH updates, DELETE removes. Requests and responses are usually JSON, each request carries everything needed (stateless), and status codes report the outcome. Good REST design uses plural nouns, consistent naming, versioning (/v1), pagination for lists and a published OpenAPI schema. FastAPI generates that schema and validation from type hints.",
      code: {
        lang: "python",
        source:
          "from fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\n\napp = FastAPI()\nDOCS: dict[int, dict] = {}\n\nclass DocumentIn(BaseModel):\n    title: str\n    text: str\n\n@app.get(\"/v1/documents/{doc_id}\")              # read one\ndef get_document(doc_id: int):\n    if doc_id not in DOCS:\n        raise HTTPException(404, \"Document not found\")\n    return DOCS[doc_id]\n\n@app.post(\"/v1/documents\", status_code=201)     # create\ndef create_document(doc: DocumentIn):\n    doc_id = len(DOCS) + 1\n    DOCS[doc_id] = {\"id\": doc_id, **doc.model_dump()}\n    return DOCS[doc_id]\n\n@app.delete(\"/v1/documents/{doc_id}\", status_code=204)   # delete\ndef delete_document(doc_id: int):\n    DOCS.pop(doc_id, None)",
      },
      pitfalls: [
        "Verbs in URLs (/getDocument, /deleteDoc) mix up the resource and the action; use methods instead.",
        "GET must never change data; crawlers, caches and prefetching call it freely.",
        "Changing a response shape without versioning breaks every client that depends on it.",
      ],
      docsUrl: "https://fastapi.tiangolo.com/tutorial/first-steps/",
    },
    demo: "RestDemo",
    related: ["backend-02", "backend-18", "backend-19"],
    projects: ["build-backend"],
    keywords: ["rest", "api", "get post put delete", "resources", "fastapi", "openapi", "crud"],
  },
  {
    id: "backend-02",
    area: "backend",
    number: 2,
    slug: "http-and-status-codes",
    name: "HTTP and Status Codes",
    tier: "base",
    official:
      "How requests and responses work, and what 200, 201, 400, 401, 404, 429 and 500 mean.",
    kid: "When you send a letter, the post office stamps a short note on the reply: delivered, wrong address or come back later. HTTP status codes are those short notes for apps, written as numbers.",
    realWorld: {
      title: "The stamp on every reply",
      text: "Every reply from our post office gets a stamp. 'Delivered' and 'Accepted, new parcel registered' are good news. 'Your form is filled in wrong', 'Show your ID first', 'You may not open this box' and 'No such address' mean the sender must fix something. 'We're overloaded, come back later' and 'Our sorting machine broke' mean the post office has a problem. One glance at the stamp tells you who has to act.",
    },
    engineering: {
      text: "Every HTTP response has a status code. 2xx means success (200 OK, 201 Created, 204 No Content), 3xx means redirection, 4xx means the client made a mistake (400 Bad Request, 401 Unauthorized meaning not logged in, 403 Forbidden meaning not allowed, 404 Not Found, 409 Conflict, 422 validation error, 429 Too Many Requests) and 5xx means the server failed (500, 502, 503, 504). Correct codes let clients, retries, caches and monitoring react properly. Retry 429 and 503 with backoff; don't retry most 4xx.",
      code: {
        lang: "python",
        source:
          "from fastapi import FastAPI, HTTPException, Request\nfrom fastapi.responses import JSONResponse\n\napp = FastAPI()\n\n@app.post(\"/v1/ask\")\nasync def ask(request: Request):\n    user = await current_user(request)\n    if user is None:\n        raise HTTPException(401, \"Log in first\")                 # who are you?\n    if not user.can_ask:\n        raise HTTPException(403, \"Your plan does not include this\")   # not allowed\n    if await over_limit(user):\n        return JSONResponse({\"error\": \"slow down\"}, status_code=429,\n                            headers={\"Retry-After\": \"30\"})\n    try:\n        return {\"answer\": await answer(user, await request.json())}   # 200\n    except ProviderUnavailable:\n        raise HTTPException(503, \"Model provider is busy, try again\")",
      },
      pitfalls: [
        "Returning 200 with {\"error\": ...} hides failures from monitoring, retries and clients.",
        "401 means not authenticated and 403 means not allowed; mixing them confuses clients.",
        "Retrying 4xx errors repeats the same mistake; only retry 429, 503 and network failures.",
      ],
      docsUrl: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status",
    },
    demo: "StatusCodesDemo",
    related: ["backend-01", "backend-16", "deployment-18"],
    projects: ["build-backend"],
    keywords: ["http", "status codes", "200", "404", "500", "429", "errors", "response"],
  },
  {
    id: "backend-03",
    area: "backend",
    number: 3,
    slug: "async-and-await",
    name: "Async and Await",
    tier: "base",
    official:
      "Handle many slow calls (like LLM requests) at the same time without blocking.",
    kid: "A clever post office worker doesn't stand still while a letter is on the train; she helps the next person in the queue. Async and await let a program do other work while it waits.",
    realWorld: {
      title: "Never stand at the window waiting",
      text: "A slow clerk asks the head office a question by phone, then stands there for ten minutes waiting for the call back while the queue grows. A smart clerk asks, writes a note 'waiting for head office', serves the next five people, and picks the first case up again when the phone rings. Same single clerk, far more people served, because most of the time is spent waiting, not working.",
    },
    engineering: {
      text: "Async programming lets one process handle many I/O-bound tasks at once: while one coroutine awaits a network response (an LLM call, a database query, a vector search), the event loop runs others. In Python, async def defines a coroutine, await pauses it until the result is ready, and asyncio.gather runs several awaits concurrently. AI backends are dominated by waiting on model APIs, so async servers such as FastAPI on uvicorn handle many more concurrent users per process. Blocking calls inside async code freeze everything.",
      code: {
        lang: "python",
        source:
          "import asyncio, time\nfrom anthropic import AsyncAnthropic\n\nclient = AsyncAnthropic()\n\nasync def summarize(text: str) -> str:\n    msg = await client.messages.create(          # waits here, other tasks run meanwhile\n        model=\"claude-haiku-5-5\", max_tokens=200,\n        messages=[{\"role\": \"user\", \"content\": f\"Summarize: {text}\"}],\n    )\n    return msg.content[0].text\n\nasync def main(chapters: list[str]):\n    start = time.perf_counter()\n    summaries = await asyncio.gather(*(summarize(c) for c in chapters))   # all at once\n    print(f\"{len(summaries)} summaries in {time.perf_counter() - start:.1f}s\")\n\nasyncio.run(main([\"chapter one…\", \"chapter two…\", \"chapter three…\"]))",
      },
      pitfalls: [
        "A blocking call (requests.get, time.sleep, a sync database driver) inside async code stalls every request.",
        "Unlimited gather calls can hit provider rate limits; cap concurrency with a semaphore.",
        "Async helps with waiting (I/O), not with heavy computation; use worker processes for that.",
      ],
      docsUrl: "https://docs.python.org/3/library/asyncio-task.html",
    },
    demo: "AsyncDemo",
    related: ["backend-04", "backend-13", "agents-12"],
    projects: ["build-backend"],
    keywords: ["async", "await", "asyncio", "concurrency", "event loop", "gather", "non-blocking"],
  },
  {
    id: "backend-04",
    area: "backend",
    number: 4,
    slug: "streaming-with-sse",
    name: "Streaming with SSE",
    tier: "base",
    official:
      "Server-Sent Events push tokens to the browser over one HTTP connection.",
    kid: "Instead of waiting for a whole book to be printed, imagine getting each page by mail as soon as it is written. Streaming sends an answer word by word, so you can start reading right away.",
    realWorld: {
      title: "Pages by mail, as they are written",
      text: "A reader orders a long story from a writer. Option one: wait two weeks, then receive the whole book. Option two: the writer posts each page the moment it is finished, and the reader starts reading on day one. The book takes just as long to write, but it feels much faster. SSE is option two for apps, and it only flows one way: from the writer to the reader.",
    },
    engineering: {
      text: "Server-Sent Events (SSE) stream a response over one long-lived HTTP connection as text/event-stream: each event is a 'data:' line followed by a blank line. LLM APIs and chat UIs use it to show tokens as they are generated, cutting perceived latency from many seconds to the time to first token. It is one-way (server to client), works through most proxies, and the browser's EventSource reconnects automatically. Turn off proxy buffering and send keep-alive comments on long pauses.",
      code: {
        lang: "python",
        source:
          "from fastapi import FastAPI\nfrom fastapi.responses import StreamingResponse\nfrom anthropic import AsyncAnthropic\n\napp = FastAPI()\nclient = AsyncAnthropic()\n\n@app.get(\"/v1/ask/stream\")\nasync def ask_stream(q: str):\n    async def events():\n        async with client.messages.stream(\n            model=\"claude-haiku-5-5\", max_tokens=500,\n            messages=[{\"role\": \"user\", \"content\": q}],\n        ) as stream:\n            async for text in stream.text_stream:\n                yield f\"data: {text}\\n\\n\"          # one SSE event per chunk\n        yield \"data: [DONE]\\n\\n\"\n    return StreamingResponse(events(), media_type=\"text/event-stream\")\n\n# Browser: new EventSource(\"/v1/ask/stream?q=...\").onmessage = (e) => show(e.data)",
      },
      pitfalls: [
        "Proxies that buffer responses (nginx by default) hold back the stream; disable buffering for these routes.",
        "Newlines inside a chunk break the event format; escape them or send JSON per event.",
        "If the user leaves, stop generating; otherwise you keep paying for tokens nobody reads.",
      ],
      docsUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events",
    },
    demo: "SseDemo",
    related: ["backend-05", "backend-03", "system-design-06", "deployment-13"],
    projects: ["build-backend"],
    keywords: ["sse", "server-sent events", "streaming", "event-stream", "tokens", "time to first token"],
  },
  {
    id: "backend-05",
    area: "backend",
    number: 5,
    slug: "websockets",
    name: "WebSockets",
    tier: "base",
    official:
      "A two-way live connection, for voice, real-time chat and collaboration.",
    kid: "Sending letters back and forth is slow, so two friends set up a walkie-talkie instead. WebSockets keep a line open so both sides can talk at any moment.",
    realWorld: {
      title: "A direct line instead of letters",
      text: "Most customers write a letter and wait for a reply. But the shop owner who calls the post office forty times a day gets a direct phone line instead. Either side can speak at any moment: the post office can say 'your parcel just arrived', and the owner can interrupt with 'stop, wrong address!' halfway through a sentence. Keeping the line open costs something, so only frequent talkers get one.",
    },
    engineering: {
      text: "WebSockets upgrade an HTTP connection into a persistent, full-duplex channel where client and server send messages at any time. They suit voice and realtime assistants, collaborative editing, live agent progress with user interruptions, and multiplayer features. Compared with SSE they are two-way but more complex: you handle reconnection, heartbeats, authentication on connect, backpressure and scaling of stateful connections (sticky routing or a pub/sub layer). If you only stream server to client, SSE is simpler.",
      code: {
        lang: "python",
        source:
          "from fastapi import FastAPI, WebSocket, WebSocketDisconnect\nimport asyncio\n\napp = FastAPI()\n\n@app.websocket(\"/v1/chat\")\nasync def chat(ws: WebSocket):\n    await ws.accept()                       # authenticate here (token in query or first message)\n    task: asyncio.Task | None = None\n    try:\n        while True:\n            msg = await ws.receive_json()\n            if msg[\"type\"] == \"ask\":\n                task = asyncio.create_task(stream_answer(ws, msg[\"text\"]))\n            elif msg[\"type\"] == \"stop\" and task:    # the user interrupts mid-answer\n                task.cancel()\n                await ws.send_json({\"type\": \"stopped\"})\n    except WebSocketDisconnect:\n        if task:\n            task.cancel()                   # stop paying for tokens nobody will read",
      },
      pitfalls: [
        "Connections drop (mobile networks, deploys); clients must reconnect and resume.",
        "Load balancers need WebSocket support and long idle timeouts, plus heartbeats to keep connections alive.",
        "Messages arrive outside the normal request flow; authenticate on connect and check permissions per message.",
      ],
      docsUrl: "https://fastapi.tiangolo.com/advanced/websockets/",
    },
    demo: "WebSocketDemo",
    related: ["backend-04", "system-design-06", "deployment-13"],
    projects: ["build-backend"],
    keywords: ["websockets", "realtime", "full duplex", "bidirectional", "voice", "live updates"],
  },
  {
    id: "backend-06",
    area: "backend",
    number: 6,
    slug: "authentication-with-jwt",
    name: "Authentication with JWT",
    tier: "base",
    official:
      "Signed tokens that prove who the user is on every request.",
    kid: "A JWT is like a stamped ticket from the post office that says who you are and when it runs out. You show the ticket each time you come back, and the stamp proves nobody changed it.",
    realWorld: {
      title: "The stamped visitor pass",
      text: "After checking your passport once, the post office hands you a pass: your name, which counters you may use and 'valid until 6 pm', sealed with the post office's own stamp. At every counter the clerk just checks the stamp and the time, without phoning the front desk. If someone scribbles 'manager' on their pass, the seal no longer matches and the clerk refuses it.",
    },
    engineering: {
      text: "A JSON Web Token (JWT) is a signed, base64url-encoded string with three parts: header, payload (claims such as sub, exp, iat, roles or tenant) and signature. After login the server issues a short-lived access token; on each request it verifies the signature and expiry without a database lookup, which makes it stateless and easy to scale. The payload is readable by anyone, so never put secrets in it. Use short expiry plus refresh tokens, pin the algorithm, and verify audience and issuer.",
      code: {
        lang: "python",
        source:
          "import datetime as dt\nimport jwt                                    # PyJWT\n\nSECRET = settings.jwt_secret.get_secret_value()\n\ndef issue_token(user_id: str, tenant: str) -> str:\n    now = dt.datetime.now(dt.timezone.utc)\n    claims = {\"sub\": user_id, \"tenant\": tenant, \"iat\": now, \"exp\": now + dt.timedelta(minutes=15)}\n    return jwt.encode(claims, SECRET, algorithm=\"HS256\")\n\ndef verify_token(token: str) -> dict:\n    # Raises if the signature is wrong, the token expired, or the algorithm differs\n    return jwt.decode(token, SECRET, algorithms=[\"HS256\"])\n\nclaims = verify_token(request.headers[\"Authorization\"].removeprefix(\"Bearer \"))\ndocs = search(question, tenant=claims[\"tenant\"])   # tenant comes from the signed token",
      },
      pitfalls: [
        "The payload is only encoded, not encrypted; anyone can read it, so never store secrets there.",
        "Long-lived tokens can't easily be revoked; keep them short and use refresh tokens.",
        "Always pass the allowed algorithms when verifying; accepting 'none' or switched algorithms is a classic attack.",
      ],
      docsUrl: "https://jwt.io/introduction",
    },
    demo: "JwtDemo",
    related: ["backend-07", "security-11", "security-13", "backend-02"],
    projects: ["build-backend"],
    keywords: ["jwt", "json web token", "authentication", "bearer token", "claims", "signature", "stateless auth"],
  },
  {
    id: "backend-07",
    area: "backend",
    number: 7,
    slug: "oauth-2-0",
    name: "OAuth 2.0",
    tier: "base",
    official:
      "'Login with Google', and letting your app act on a user's account with their permission.",
    kid: "Instead of giving your house key to the delivery person, you ask the building manager for a guest card that opens only the mail room, for one day. OAuth 2.0 gives apps such limited guest cards.",
    realWorld: {
      title: "A guest card, not your house key",
      text: "A new parcel service wants to pick up letters from your building's mail room. You don't hand them your house key. Instead, you go to the building manager yourself and say: 'give this company a card that opens only the mail room, for a month'. The company never sees your key, and you can cancel the card at any time without changing your locks.",
    },
    engineering: {
      text: "OAuth 2.0 is an authorization framework that lets an app access a user's resources on another service (Google Drive, GitHub, Slack) without seeing their password. In the authorization code flow with PKCE, the app redirects the user to the provider, the user logs in there and approves specific scopes, the provider redirects back with a one-time code, and the app exchanges it for an access token (and often a refresh token). OpenID Connect adds a standard ID token for login. AI apps use it for 'Sign in with Google' and for connectors and MCP servers acting on the user's data.",
      code: {
        lang: "python",
        source:
          "# Authorization code flow with PKCE, using Authlib + FastAPI (simplified)\nfrom authlib.integrations.starlette_client import OAuth\n\noauth = OAuth()\noauth.register(\n    \"google\",\n    server_metadata_url=\"https://accounts.google.com/.well-known/openid-configuration\",\n    client_id=settings.google_client_id,\n    client_secret=settings.google_client_secret.get_secret_value(),\n    client_kwargs={\"scope\": \"openid email https://www.googleapis.com/auth/drive.readonly\",\n                   \"code_challenge_method\": \"S256\"},          # PKCE\n)\n\n@app.get(\"/login/google\")\nasync def login(request: Request):\n    return await oauth.google.authorize_redirect(request, \"https://app.example.com/auth/callback\")\n\n@app.get(\"/auth/callback\")\nasync def callback(request: Request):\n    token = await oauth.google.authorize_access_token(request)   # code -> tokens\n    save_tokens(user_id=token[\"userinfo\"][\"sub\"], token=token)   # encrypted at rest",
      },
      pitfalls: [
        "Ask only for the scopes you need; broad scopes scare users and widen the damage of a leak.",
        "Validate the state parameter and use PKCE, or attackers can inject their own authorization codes.",
        "Store refresh tokens encrypted, and handle revoked or expired tokens gracefully.",
      ],
      docsUrl: "https://oauth.net/2/",
    },
    demo: "OAuthDemo",
    related: ["backend-06", "agents-08", "security-13"],
    projects: ["build-backend"],
    keywords: ["oauth", "oauth 2.0", "authorization", "pkce", "openid connect", "sign in with google", "scopes"],
  },
  {
    id: "backend-08",
    area: "backend",
    number: 8,
    slug: "sql-vs-nosql",
    name: "SQL vs NoSQL",
    tier: "base",
    official:
      "Tables with relations and joins vs flexible documents or key-value. Choose by the shape of your data.",
    kid: "Some post offices keep addresses in a neat book with columns, others keep each customer's papers in their own folder. SQL is the neat book with columns; NoSQL is the folders.",
    realWorld: {
      title: "The ledger and the folders",
      text: "The main post office keeps a ledger with fixed columns: name, street, postcode, every row filled the same way, and it can answer 'how many parcels went to Berlin last month?' in seconds. A small branch keeps one folder per customer with whatever papers they have: some have photos, some forms, some notes. Folders are flexible and quick to grab whole; the ledger is better for questions across everyone.",
    },
    engineering: {
      text: "SQL databases (PostgreSQL, MySQL, SQLite) store data in tables with a fixed schema, relations between tables via joins, strong consistency and ACID transactions, and a powerful query language. NoSQL covers document stores (MongoDB), key-value stores (Redis, DynamoDB), wide-column and graph databases, trading joins and strict schemas for flexibility or massive horizontal scale. For most AI apps Postgres is the default: users, chats, documents and metadata as tables, JSONB for flexible fields and pgvector for embeddings.",
      code: {
        lang: "sql",
        source:
          "-- SQL: structured tables with relations\nCREATE TABLE documents (\n  id         BIGSERIAL PRIMARY KEY,\n  tenant_id  BIGINT NOT NULL REFERENCES tenants(id),\n  title      TEXT NOT NULL,\n  metadata   JSONB DEFAULT '{}',             -- flexible fields, document-style\n  created_at TIMESTAMPTZ DEFAULT now()\n);\n\n-- A question across all rows, with a join\nSELECT t.name, count(*) AS docs\nFROM documents d JOIN tenants t ON t.id = d.tenant_id\nWHERE d.created_at > now() - interval '30 days'\nGROUP BY t.name ORDER BY docs DESC;\n\n-- The same document in a NoSQL document store would be one nested JSON object:\n-- { \"_id\": 42, \"tenant\": { \"name\": \"Acme\" }, \"title\": \"...\", \"chunks\": [ ... ] }",
      },
      pitfalls: [
        "Choosing NoSQL to avoid designing a schema just moves the schema into your application code.",
        "Duplicated data in document stores drifts out of sync; decide which copy is the truth.",
        "Picking a database for imagined scale; Postgres handles far more than most products ever need.",
      ],
      docsUrl: "https://www.postgresql.org/docs/current/tutorial.html",
    },
    demo: "SqlNosqlDemo",
    related: ["backend-09", "backend-10", "rag-04"],
    projects: ["build-backend"],
    keywords: ["sql", "nosql", "postgres", "mongodb", "relational", "document database", "schema"],
  },
  {
    id: "backend-09",
    area: "backend",
    number: 9,
    slug: "database-indexing",
    name: "Database Indexing",
    tier: "base",
    official:
      "Indexes make lookups fast. Know which columns your queries need indexed.",
    kid: "To find one letter among a million, the post office sorts them into shelves by postcode instead of checking every letter. A database index is that sorting, so finding things is fast.",
    realWorld: {
      title: "Shelves sorted by postcode",
      text: "A new clerk is asked to find every letter for postcode 10115 in a mountain of a million letters. Without sorting he checks them one by one, all day. The experienced clerk walks to the shelf labelled 10115 and is done in a minute. The shelves took effort to set up and every new letter must be put in the right place, but searching becomes almost instant.",
    },
    engineering: {
      text: "A database index is an extra data structure, usually a B-tree, that lets the database find rows matching a condition without scanning the whole table, turning seconds into milliseconds. Index the columns used in WHERE, JOIN and ORDER BY clauses; composite indexes follow the leftmost-prefix rule. Indexes cost storage and slow down writes, so add them based on real query plans (EXPLAIN ANALYZE). Vector search uses its own index types such as HNSW and IVFFlat in pgvector.",
      code: {
        lang: "sql",
        source:
          "-- Slow: scans every row to find one tenant's recent documents\nEXPLAIN ANALYZE\nSELECT id, title FROM documents\nWHERE tenant_id = 42 ORDER BY created_at DESC LIMIT 20;\n--  Seq Scan on documents ... rows=2,000,000 ... Execution Time: 812 ms\n\n-- Composite index matching the WHERE and the ORDER BY\nCREATE INDEX CONCURRENTLY idx_documents_tenant_created\n  ON documents (tenant_id, created_at DESC);\n--  Index Scan using idx_documents_tenant_created ... Execution Time: 0.4 ms\n\n-- Vector similarity search has its own index type (pgvector)\nCREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);",
      },
      pitfalls: [
        "Indexing every column slows writes and wastes memory; index what your queries actually filter on.",
        "Wrapping a column in a function (lower(email)) skips a plain index; index the expression instead.",
        "Creating an index on a large live table locks writes; use CREATE INDEX CONCURRENTLY in Postgres.",
      ],
      docsUrl: "https://use-the-index-luke.com/",
    },
    demo: "IndexDemo",
    related: ["rag-05", "rag-06", "backend-08"],
    projects: ["build-backend"],
    keywords: ["index", "database index", "b-tree", "explain analyze", "query performance", "hnsw"],
  },
  {
    id: "backend-10",
    area: "backend",
    number: 10,
    slug: "transactions-and-acid",
    name: "Transactions and ACID",
    tier: "base",
    official:
      "Group writes so they all succeed or all fail, and your data stays consistent.",
    kid: "Moving money is two steps: take it from one card and add it to another. A transaction makes sure both steps happen, or neither does, even if the computer crashes in the middle.",
    realWorld: {
      title: "Both steps, or neither",
      text: "A customer sends a parcel with prepaid credit. The clerk must subtract the credit and register the parcel. If the power cuts out after the first step, the customer has paid for nothing. So the post office uses a rule: both entries go in the ledger in one go, in ink, or neither does. If anything fails halfway, the half-written entry is wiped as if it never happened.",
    },
    engineering: {
      text: "A transaction groups several database operations into one unit with ACID guarantees: Atomicity (all or nothing), Consistency (constraints always hold), Isolation (concurrent transactions don't see each other's half-finished work) and Durability (committed data survives crashes). In AI apps, use transactions for credits and billing, for saving a message together with its usage record, and for ingestion that writes a document and its chunks. Keep transactions short, and never wait on an LLM call while holding one open.",
      code: {
        lang: "python",
        source:
          "# SQLAlchemy: charge credits and record usage in one transaction\nfrom sqlalchemy import update, insert\n\nasync def charge_and_record(session, user_id: int, tokens: int, cost_cents: int):\n    async with session.begin():                     # BEGIN ... COMMIT, or ROLLBACK on error\n        result = await session.execute(\n            update(Account)\n            .where(Account.user_id == user_id, Account.credits_cents >= cost_cents)\n            .values(credits_cents=Account.credits_cents - cost_cents)\n        )\n        if result.rowcount == 0:\n            raise InsufficientCredits()             # rolls back: nothing was written\n        await session.execute(\n            insert(Usage).values(user_id=user_id, tokens=tokens, cost_cents=cost_cents)\n        )\n# Call the LLM before or after, never while the transaction is open.",
      },
      pitfalls: [
        "Holding a transaction open during a slow LLM call blocks rows and exhausts connections.",
        "Read-then-write without locking or a conditional update causes race conditions, such as double-spending credits.",
        "A transaction can't undo external side effects such as emails or API calls; use an outbox pattern.",
      ],
      docsUrl: "https://www.postgresql.org/docs/current/tutorial-transactions.html",
    },
    demo: "TransactionDemo",
    related: ["backend-08", "backend-15", "backend-12"],
    projects: ["build-backend"],
    keywords: ["transactions", "acid", "atomicity", "isolation", "rollback", "commit", "consistency"],
  },
  {
    id: "backend-11",
    area: "backend",
    number: 11,
    slug: "caching-with-redis",
    name: "Caching with Redis",
    tier: "production",
    official:
      "Keep hot data in memory for fast reads and fewer database or LLM calls.",
    kid: "If many people ask the post office the same question, the clerk writes the answer on a note by the window instead of phoning head office each time. Redis is that quick note board.",
    realWorld: {
      title: "The answer board by the window",
      text: "Fifty people a day ask 'what does a parcel to Spain cost?'. Phoning head office takes five minutes each time. So the clerk writes the answer on a little board by the window, with a note: 'valid until Friday', because prices change. Most people now get their answer in a second. When the price changes early, the clerk wipes that line so nobody gets an old answer.",
    },
    engineering: {
      text: "Caching keeps the results of expensive or slow work (LLM responses, embeddings, database queries, external API calls) in fast storage so repeated requests skip the work. Redis is an in-memory key-value store used for caches, sessions, rate limiting and queues. Common patterns: cache-aside with a TTL, keys that include everything that affects the result (model, prompt version, normalized input, tenant), and explicit invalidation. For LLMs, exact-match caching is safe; semantic caching by embedding similarity saves more but can return wrong answers.",
      code: {
        lang: "python",
        source:
          "import hashlib, json\nimport redis.asyncio as redis\n\nr = redis.from_url(settings.redis_url)\n\nasync def cached_answer(question: str, tenant: str) -> str:\n    # The key includes everything that changes the answer\n    raw = json.dumps({\"q\": question.strip().lower(), \"tenant\": tenant,\n                      \"model\": \"claude-haiku-5-5\", \"prompt\": \"library_bot@v14\"})\n    key = \"answer:\" + hashlib.sha256(raw.encode()).hexdigest()\n\n    if (hit := await r.get(key)) is not None:\n        return hit.decode()                         # ~1 ms, no tokens spent\n    answer = await ask_llm(question, tenant)        # ~2 s and costs money\n    await r.set(key, answer, ex=3600)               # expires after one hour\n    return answer",
      },
      pitfalls: [
        "Keys that ignore the tenant or user leak one customer's answers to another.",
        "Without a TTL or invalidation, cached answers go stale when documents or prompts change.",
        "Redis is memory; set maxmemory with an eviction policy, and treat the cache as disposable.",
      ],
      docsUrl: "https://redis.io/docs/latest/develop/",
    },
    demo: "CacheDemo",
    related: ["system-design-03", "backend-12", "backend-14"],
    projects: ["build-backend"],
    keywords: ["caching", "redis", "ttl", "cache hit", "invalidation", "semantic cache", "key-value"],
  },
  {
    id: "backend-12",
    area: "backend",
    number: 12,
    slug: "message-queues",
    name: "Message Queues",
    tier: "production",
    official:
      "Pass work between services reliably (RabbitMQ, SQS, Kafka).",
    kid: "When a thousand letters arrive at once, they go into a big sorting bag and workers take them out one by one. A message queue is that bag, so nothing is lost when work comes in faster than it can be done.",
    realWorld: {
      title: "The sorting bag that never overflows",
      text: "Before Christmas, letters arrive faster than the sorters can handle. Instead of turning people away at the door, every letter goes into a big sorting bag. Sorters pull letters out at their own speed, and on busy days more sorters join in. If a sorter drops a letter, it goes back in the bag for someone else. The front desk stays fast, and no letter is lost.",
    },
    engineering: {
      text: "A message queue (RabbitMQ, Amazon SQS, Redis Streams, Kafka for event streams) decouples producers from consumers: the API enqueues a message and returns immediately, and workers consume at their own pace. Queues absorb traffic spikes, allow independent scaling of workers, and provide retries and dead-letter queues for failed messages. Delivery is usually at least once, so consumers must be idempotent. AI uses include document ingestion, batch embedding, long agent runs and evaluation jobs.",
      code: {
        lang: "python",
        source:
          "# Producer (API) and consumer (worker) with Amazon SQS via boto3\nimport json, boto3\n\nsqs = boto3.client(\"sqs\")\nQUEUE = settings.ingest_queue_url\n\ndef enqueue_ingest(doc_id: int, tenant: str):\n    sqs.send_message(QueueUrl=QUEUE, MessageBody=json.dumps({\"doc_id\": doc_id, \"tenant\": tenant}))\n\ndef worker_loop():\n    while True:\n        resp = sqs.receive_message(QueueUrl=QUEUE, MaxNumberOfMessages=10, WaitTimeSeconds=20)\n        for m in resp.get(\"Messages\", []):\n            job = json.loads(m[\"Body\"])\n            ingest(job[\"doc_id\"], job[\"tenant\"])           # must be safe to run twice\n            sqs.delete_message(QueueUrl=QUEUE, ReceiptHandle=m[\"ReceiptHandle\"])\n        # Not deleted -> visible again after the timeout -> retried; after N tries -> dead-letter queue",
      },
      pitfalls: [
        "At-least-once delivery means duplicates; make every consumer idempotent.",
        "A message that always fails blocks or loops forever without a dead-letter queue.",
        "Watch queue length and the age of the oldest message; a growing queue is an incident in progress.",
      ],
      docsUrl: "https://aws.amazon.com/message-queue/",
    },
    demo: "QueueDemo",
    related: ["system-design-15", "backend-13", "backend-15", "backend-11"],
    projects: ["build-backend"],
    keywords: ["message queue", "rabbitmq", "sqs", "kafka", "producer consumer", "dead letter queue", "decoupling"],
  },
  {
    id: "backend-13",
    area: "backend",
    number: 13,
    slug: "background-jobs",
    name: "Background Jobs",
    tier: "production",
    official:
      "Run slow tasks (embeddings, reports, emails) in workers, outside the request.",
    kid: "When you post a big parcel, the clerk gives you a ticket and says 'we'll send it, you can go home'. Background jobs do slow work later, so the app can answer you right away.",
    realWorld: {
      title: "Here's your ticket, you can go",
      text: "Someone brings 500 wedding invitations to post. The clerk doesn't make them wait while every envelope is stamped and sorted. She hands over a ticket number and says: 'check the board, it'll say done when they're out'. The work happens in the back room while the queue at the window keeps moving. If the stamping machine jams, the back room tries again without bothering the customer.",
    },
    engineering: {
      text: "Background jobs move slow or heavy work (ingesting and embedding a 300-page PDF, generating reports, long agent runs, batch evals, sending emails) out of the request-response cycle. The API creates a job, enqueues it, and returns 202 Accepted with a job id; workers (Celery, RQ, Dramatiq, arq, Temporal for durable workflows) process it with retries, and the client polls a status endpoint or gets a webhook, SSE event or WebSocket message when it's done. This keeps requests fast and inside timeouts.",
      code: {
        lang: "python",
        source:
          "# FastAPI + Celery: accept the upload now, process it in the background\nfrom celery import Celery\nfrom fastapi import FastAPI, UploadFile\n\ncelery = Celery(\"rag\", broker=settings.redis_url, backend=settings.redis_url)\napp = FastAPI()\n\n@celery.task(bind=True, max_retries=3, retry_backoff=True)\ndef ingest_pdf(self, doc_id: int):\n    pages = extract_pages(doc_id)                # slow: minutes for big files\n    chunks = chunk(pages)\n    store(embed(chunks), doc_id)\n\n@app.post(\"/v1/documents\", status_code=202)\nasync def upload(file: UploadFile):\n    doc_id = await save_upload(file)\n    job = ingest_pdf.delay(doc_id)\n    return {\"doc_id\": doc_id, \"job_id\": job.id, \"status_url\": f\"/v1/jobs/{job.id}\"}\n\n@app.get(\"/v1/jobs/{job_id}\")\ndef job_status(job_id: str):\n    return {\"state\": celery.AsyncResult(job_id).state}   # PENDING / STARTED / SUCCESS / FAILURE",
      },
      pitfalls: [
        "Doing heavy work inside the request hits timeouts and ties up the server for everyone.",
        "Jobs get retried; design them to be idempotent so a retry doesn't duplicate chunks or emails.",
        "Users need progress and failure feedback; a job that silently fails looks like a bug.",
      ],
      docsUrl: "https://docs.celeryq.dev/en/stable/getting-started/introduction.html",
    },
    demo: "BackgroundJobsDemo",
    related: ["backend-12", "system-design-15", "backend-03"],
    projects: ["build-backend"],
    keywords: ["background jobs", "celery", "workers", "task queue", "202 accepted", "job status", "temporal"],
  },
  {
    id: "backend-14",
    area: "backend",
    number: 14,
    slug: "rate-limiting",
    name: "Rate Limiting",
    tier: "production",
    official:
      "Cap requests per user or key to protect your app and your LLM bill.",
    kid: "Each customer gets a card with ten stamps per hour for posting letters, so one person can't fill the whole truck. Rate limiting sets a fair limit on how often anyone can ask an app for something.",
    realWorld: {
      title: "Ten parcels per hour each",
      text: "One company started dumping thousands of parcels at the counter every morning, and nobody else could get served. Now every customer gets ten stamps per hour on a card; each parcel uses one stamp, and the card slowly refills. Busy customers can send a quick burst, but nobody can block the counter for everyone else. When your card is empty, the clerk says 'come back in a few minutes'.",
    },
    engineering: {
      text: "Rate limiting caps how many requests (or tokens, or dollars) a client may use per time window, protecting the service from abuse, runaway scripts and cost explosions, and keeping usage fair. Common algorithms are token bucket (allows bursts), sliding window and fixed window, usually stored in Redis so all instances share counts. Limit per user, API key, tenant or IP; for LLM apps also limit tokens per minute and spend per day. Respond with 429 and a Retry-After header.",
      code: {
        lang: "python",
        source:
          "# Token bucket in Redis: 10 requests of burst, refilling at 1 per 6 seconds\nimport time\nimport redis.asyncio as redis\n\nr = redis.from_url(settings.redis_url)\nCAPACITY, REFILL_PER_S = 10, 1 / 6\n\nasync def allow(user_id: str) -> tuple[bool, int]:\n    key, now = f\"bucket:{user_id}\", time.time()\n    tokens, last = await r.hmget(key, \"tokens\", \"ts\")\n    tokens = float(tokens or CAPACITY)\n    tokens = min(CAPACITY, tokens + (now - float(last or now)) * REFILL_PER_S)\n    allowed = tokens >= 1\n    if allowed:\n        tokens -= 1\n    await r.hset(key, mapping={\"tokens\": tokens, \"ts\": now})\n    await r.expire(key, 3600)\n    retry_after = 0 if allowed else int((1 - tokens) / REFILL_PER_S) + 1\n    return allowed, retry_after\n# Production: do the read-and-update atomically (a Lua script) to avoid races.",
      },
      pitfalls: [
        "Counting per instance instead of in a shared store lets clients multiply their limit by the number of instances.",
        "Request-count limits miss LLM costs; one huge prompt can cost more than a thousand small ones.",
        "Without Retry-After and clear error messages, well-behaved clients can't back off correctly.",
      ],
      docsUrl: "https://redis.io/glossary/rate-limiting/",
    },
    demo: "RateLimitDemo",
    related: ["system-design-16", "backend-15", "backend-16"],
    projects: ["build-backend"],
    keywords: ["rate limiting", "token bucket", "429", "throttling", "quota", "abuse protection", "retry-after"],
  },
  {
    id: "backend-15",
    area: "backend",
    number: 15,
    slug: "idempotency-keys",
    name: "Idempotency Keys",
    tier: "production",
    official:
      "A retried request with the same key is processed only once. No double charges.",
    kid: "If you post the same letter twice by accident, a careful clerk sees it has the same ticket number and sends it only once. An idempotency key is that ticket number, so repeating a request does no harm.",
    realWorld: {
      title: "Same ticket, same parcel",
      text: "A nervous customer hands over a parcel, doesn't hear a reply over the noise, and hands it over again. Without care, the post office ships two parcels and charges twice. So every customer now writes a ticket number on their form. If the clerk sees ticket 7731 again, she doesn't ship anything new; she just says 'already done, here is your receipt'.",
    },
    engineering: {
      text: "An idempotency key is a unique value (often a UUID) that the client sends with a request that changes something, such as a payment, an order or starting an agent run. The server stores the key with the result; if the same key arrives again (a retry after a timeout, a double click, a redelivered queue message) it returns the stored result instead of acting twice. Stripe popularised the Idempotency-Key header. Keys need a uniqueness constraint, an expiry, and a check that the request body matches the original.",
      code: {
        lang: "python",
        source:
          "from fastapi import FastAPI, Header\n\napp = FastAPI()\n\n@app.post(\"/v1/payments\")\nasync def pay(body: PaymentIn, idempotency_key: str = Header(...)):\n    # 1. Seen this key before? Return the stored result, do nothing new\n    if (saved := await db.idempotency.get(idempotency_key)) is not None:\n        if saved.request_hash != hash_body(body):\n            raise HTTPException(422, \"Key reused with a different request\")\n        return saved.response\n\n    # 2. Claim the key first (unique constraint), so two parallel retries can't both pass\n    await db.idempotency.insert(idempotency_key, request_hash=hash_body(body), status=\"processing\")\n    result = await charge_card(body)                 # happens once\n    await db.idempotency.complete(idempotency_key, response=result)\n    return result",
      },
      pitfalls: [
        "Checking then inserting without a unique constraint lets two parallel retries both go through.",
        "Generate the key once per user action on the client; a new key on every retry defeats the point.",
        "Store keys long enough to cover all retry windows, then expire them.",
      ],
      docsUrl: "https://docs.stripe.com/api/idempotent_requests",
    },
    demo: "IdempotencyDemo",
    related: ["backend-16", "backend-12", "agents-15", "backend-10"],
    projects: ["build-backend"],
    keywords: ["idempotency", "idempotency key", "duplicate requests", "retries", "exactly once", "stripe"],
  },
  {
    id: "backend-16",
    area: "backend",
    number: 16,
    slug: "retries-with-backoff",
    name: "Retries with Backoff",
    tier: "production",
    official:
      "Retry failed calls with growing waits (plus a little randomness) instead of hammering.",
    kid: "If the post office door is jammed, you don't bang on it every second; you wait, then wait longer, then longer again. Retries with backoff try again politely, waiting more each time.",
    realWorld: {
      title: "Knock, wait, knock, wait longer",
      text: "The head office phone line is overloaded. If every clerk in the city redials instantly and nonstop, the line will never recover. The rule: if it's busy, wait one minute, then two, then four, and add a few random seconds so not everyone calls at the same moment. After five tries, give up and tell the customer. The line recovers, and most calls eventually get through.",
    },
    engineering: {
      text: "Transient failures (timeouts, connection resets, 429 rate limits, 502, 503 and 529 overloaded errors from model providers) often succeed when retried. Exponential backoff waits longer after each failure (1 s, 2 s, 4 s and so on) up to a cap, and jitter randomises the wait so many clients don't retry in sync and cause a thundering herd. Respect Retry-After headers, cap the number of attempts and total time, retry only safe or idempotent operations, and add a circuit breaker or fallback model for longer outages.",
      code: {
        lang: "python",
        source:
          "from tenacity import retry, stop_after_attempt, wait_random_exponential, retry_if_exception_type\nfrom anthropic import APIConnectionError, RateLimitError, InternalServerError\n\n@retry(\n    retry=retry_if_exception_type((APIConnectionError, RateLimitError, InternalServerError)),\n    wait=wait_random_exponential(multiplier=1, max=30),   # ~1, 2, 4, 8 s… with jitter, capped\n    stop=stop_after_attempt(5),\n    reraise=True,\n)\nasync def ask(prompt: str) -> str:\n    msg = await client.messages.create(\n        model=\"claude-haiku-5-5\", max_tokens=300,\n        messages=[{\"role\": \"user\", \"content\": prompt}],\n    )\n    return msg.content[0].text\n# Note: the official SDKs already retry some errors; configure max_retries instead of stacking retries.",
      },
      pitfalls: [
        "Retrying without jitter makes all clients hit the service at the same instant again.",
        "Retries stacked at several layers (SDK, your code, the gateway) multiply into dozens of attempts.",
        "Retrying non-idempotent actions such as payments or sending email without idempotency keys duplicates them.",
      ],
      docsUrl: "https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/",
    },
    demo: "RetryDemo",
    related: ["backend-15", "backend-14", "system-design-16", "backend-02"],
    projects: ["build-backend"],
    keywords: ["retries", "exponential backoff", "jitter", "transient errors", "thundering herd", "tenacity"],
  },
  {
    id: "backend-17",
    area: "backend",
    number: 17,
    slug: "file-uploads-to-s3",
    name: "File Uploads to S3",
    tier: "production",
    official:
      "Store user files in object storage, usually through presigned URLs.",
    kid: "Instead of carrying a heavy box through the post office counter, the clerk gives you a one-time key to drop it straight into the big storage room. That is how apps send big files to S3.",
    realWorld: {
      title: "Straight to the storage room",
      text: "Big boxes used to go over the counter: the customer lifted it to the clerk, the clerk carried it to the back, and the queue stopped. Now the clerk just hands over a key card that opens one shelf in the storage room, only for the next fifteen minutes. The customer wheels the box in directly, and the clerk is free for the next person. The card is useless after that.",
    },
    engineering: {
      text: "Object storage such as Amazon S3, Google Cloud Storage or Azure Blob stores files (PDFs, images, audio, model artifacts) cheaply and durably. Instead of streaming uploads through your API servers, the backend issues a short-lived presigned URL that lets the client upload directly to the bucket; the backend then records the object key, and an event or job triggers processing such as parsing and embedding. Validate type and size, scan for malware, keep buckets private, and namespace keys by tenant.",
      code: {
        lang: "python",
        source:
          "import uuid, boto3\n\ns3 = boto3.client(\"s3\")\nBUCKET = settings.upload_bucket\n\n@app.post(\"/v1/uploads\")\ndef create_upload(filename: str, content_type: str, user=Depends(current_user)):\n    if content_type not in {\"application/pdf\", \"text/plain\"}:\n        raise HTTPException(415, \"Only PDF and text files\")\n    key = f\"{user.tenant_id}/{uuid.uuid4()}/{filename}\"          # namespaced per tenant\n    post = s3.generate_presigned_post(\n        BUCKET, key,\n        Conditions=[[\"content-length-range\", 1, 50 * 1024 * 1024],  # max 50 MB\n                    {\"Content-Type\": content_type}],\n        Fields={\"Content-Type\": content_type},\n        ExpiresIn=900,                                             # 15 minutes\n    )\n    return {\"key\": key, \"upload\": post}   # the browser POSTs the file directly to S3\n\n# An S3 event or a \"done\" call then enqueues the ingestion job for this key.",
      },
      pitfalls: [
        "Public buckets are a classic data leak; keep buckets private and share through signed URLs.",
        "Trusting the client's file type and size invites abuse; enforce them in the presigned conditions and re-check later.",
        "Keys without a tenant prefix make cross-tenant access mistakes easy.",
      ],
      docsUrl: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html",
    },
    demo: "UploadDemo",
    related: ["backend-13", "rag-15", "security-17"],
    projects: ["build-backend"],
    keywords: ["file upload", "s3", "presigned url", "object storage", "blob storage", "bucket"],
  },
  {
    id: "backend-18",
    area: "backend",
    number: 18,
    slug: "pagination",
    name: "Pagination",
    tier: "production",
    official:
      "Return long lists in pages (limit/offset or cursor).",
    kid: "Nobody hands you all ten thousand letters at once; you get a bag of fifty and a note saying where the next bag starts. Pagination gives long lists in small pages like that.",
    realWorld: {
      title: "One bag at a time",
      text: "A company asks for every letter it received this year: ten thousand. The post office hands over one bag of fifty and a slip saying 'next bag starts after letter 50213'. Counting positions ('give me letters 51 to 100') goes wrong when new letters keep arriving and shift everything, so the slip names the last letter instead. Nobody gets duplicates and nobody misses one.",
    },
    engineering: {
      text: "Pagination returns large collections in pages to keep responses fast and memory bounded. Offset pagination (LIMIT 20 OFFSET 40) is simple and allows jumping to page N, but gets slow on deep pages and shows duplicates or gaps when rows are inserted or deleted. Cursor (keyset) pagination returns an opaque cursor encoding the last item's sort key, and the next request continues after it: fast at any depth and stable under writes. Always sort by a unique, indexed key and cap the page size.",
      code: {
        lang: "python",
        source:
          "import base64, json\n\ndef encode(cursor: dict) -> str:\n    return base64.urlsafe_b64encode(json.dumps(cursor).encode()).decode()\n\n@app.get(\"/v1/documents\")\nasync def list_documents(limit: int = 20, cursor: str | None = None):\n    limit = min(limit, 100)                                   # cap the page size\n    after = json.loads(base64.urlsafe_b64decode(cursor)) if cursor else None\n    rows = await db.fetch(\n        \"\"\"SELECT id, title, created_at FROM documents\n           WHERE ($1::timestamptz IS NULL OR (created_at, id) < ($1, $2))\n           ORDER BY created_at DESC, id DESC LIMIT $3\"\"\",\n        after and after[\"created_at\"], after and after[\"id\"], limit + 1,\n    )\n    page, more = rows[:limit], len(rows) > limit\n    next_cursor = encode({\"created_at\": str(page[-1][\"created_at\"]), \"id\": page[-1][\"id\"]}) if more else None\n    return {\"items\": page, \"next_cursor\": next_cursor}",
      },
      pitfalls: [
        "Deep OFFSET queries scan and throw away every skipped row; page 5,000 gets very slow.",
        "Sorting by a non-unique column (created_at alone) makes items with equal values repeat or vanish between pages.",
        "Unbounded page sizes let one request pull the whole table.",
      ],
      docsUrl: "https://use-the-index-luke.com/no-offset",
    },
    demo: "PaginationDemo",
    related: ["backend-01", "backend-09"],
    projects: ["build-backend"],
    keywords: ["pagination", "cursor", "offset", "keyset pagination", "limit", "next page"],
  },
  {
    id: "backend-19",
    area: "backend",
    number: 19,
    slug: "input-validation-with-pydantic",
    name: "Input Validation with Pydantic",
    tier: "production",
    official:
      "Define request and response shapes in Python. Bad data is rejected automatically.",
    kid: "Before taking a letter, the post office checks the form: is the address filled in, is the postcode five numbers? Pydantic checks the information an app receives in the same way.",
    realWorld: {
      title: "Checking the form at the counter",
      text: "Half the problems at the sorting center came from bad forms: a postcode with letters in it, a missing street, a weight of 'heavy'. Now the clerk checks every form at the counter, against a clear list of rules, and hands it back with a note on exactly which box is wrong. Bad forms never get past the counter, so the people in the back can trust everything they receive.",
    },
    engineering: {
      text: "Input validation checks that incoming data has the right shape, types and values before your code uses it. Pydantic models declare fields with types and constraints (lengths, ranges, enums, patterns, custom validators); FastAPI validates request bodies, query parameters and headers automatically and returns 422 with precise errors. In AI apps, the same models validate LLM structured outputs and tool-call arguments. Validation is also a security layer: limit lengths and sizes, forbid unknown fields and never trust the client.",
      code: {
        lang: "python",
        source:
          "from typing import Literal\nfrom pydantic import BaseModel, ConfigDict, Field, field_validator\n\nclass AskRequest(BaseModel):\n    model_config = ConfigDict(extra=\"forbid\")          # unknown fields -> error\n\n    question: str = Field(min_length=1, max_length=2_000)\n    top_k: int = Field(default=5, ge=1, le=20)\n    language: Literal[\"en\", \"de\", \"ur\"] = \"en\"\n    collection_ids: list[int] = Field(default_factory=list, max_length=10)\n\n    @field_validator(\"question\")\n    @classmethod\n    def not_blank(cls, v: str) -> str:\n        if not v.strip():\n            raise ValueError(\"question must not be blank\")\n        return v.strip()\n\n@app.post(\"/v1/ask\")\nasync def ask(req: AskRequest):     # invalid input never reaches this line: FastAPI returns 422\n    return await answer(req.question, top_k=req.top_k)",
      },
      pitfalls: [
        "Validating only in the frontend; anyone can call your backend directly.",
        "No length limits on text fields lets one request send a novel-sized prompt and a huge bill.",
        "Silently coercing bad values hides bugs; use strict types where it matters.",
      ],
      docsUrl: "https://docs.pydantic.dev/latest/concepts/models/",
    },
    demo: "ValidationDemo",
    related: ["llm-11", "security-06", "agents-01", "backend-20"],
    projects: ["build-backend"],
    keywords: ["validation", "pydantic", "422", "request body", "schema", "fastapi", "data validation"],
  },
  {
    id: "backend-20",
    area: "backend",
    number: 20,
    slug: "logging-and-monitoring",
    name: "Logging and Monitoring",
    tier: "production",
    official:
      "Structured logs, metrics and error tracking, so you see problems before users report them.",
    kid: "The post office writes a short note in a log book for every parcel: when it came, where it went and if anything went wrong. Logging and monitoring help you find out what happened when something breaks.",
    realWorld: {
      title: "The log book and the wall chart",
      text: "When a customer complains that a parcel never arrived, the manager opens the log book: every parcel has a ticket number, and every step writes a line with that number: accepted, sorted, loaded, delivered. In seconds she sees it got stuck at sorting. On the wall, a chart shows parcels per hour and how many go missing, so problems are visible before anyone complains.",
    },
    engineering: {
      text: "Logging records discrete events with context; monitoring aggregates metrics over time and alerts on them. Use structured JSON logs with consistent fields (timestamp, level, request_id or trace_id, user or tenant, route, latency, model, tokens, cost, error) so logs are searchable and joinable. Propagate a trace id through every service and LLM call (OpenTelemetry), and emit metrics such as request rate, errors, latency percentiles and tokens. Never log secrets or raw personal data, and sample verbose logs.",
      code: {
        lang: "python",
        source:
          "import time, uuid, structlog\nfrom fastapi import FastAPI, Request\n\nlog = structlog.get_logger()\napp = FastAPI()\n\n@app.middleware(\"http\")\nasync def access_log(request: Request, call_next):\n    request_id = request.headers.get(\"x-request-id\", str(uuid.uuid4()))\n    structlog.contextvars.bind_contextvars(request_id=request_id, route=request.url.path)\n    start = time.perf_counter()\n    try:\n        response = await call_next(request)\n        log.info(\"request\", status=response.status_code,\n                 latency_ms=round((time.perf_counter() - start) * 1000))\n        response.headers[\"x-request-id\"] = request_id\n        return response\n    except Exception:\n        log.exception(\"request_failed\")       # same request_id ties every line together\n        raise\n    finally:\n        structlog.contextvars.clear_contextvars()\n\n# Inside handlers: log.info(\"llm_call\", model=\"claude-haiku-5-5\", tokens_in=812, tokens_out=164, cost_usd=0.0016)",
      },
      pitfalls: [
        "Unstructured print statements can't be searched or aggregated across instances.",
        "Logging prompts, tokens or personal data verbatim creates a privacy and security liability.",
        "Without a shared request or trace id, one user's problem is scattered across unrelated lines.",
      ],
      docsUrl: "https://opentelemetry.io/docs/concepts/signals/logs/",
    },
    demo: "LoggingDemo",
    related: ["deployment-19", "evals-18", "security-19", "backend-19"],
    projects: ["build-backend"],
    keywords: ["logging", "monitoring", "structured logs", "observability", "trace id", "opentelemetry", "metrics"],
  },
];

export default concepts;

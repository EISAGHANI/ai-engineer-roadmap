import type { QuizQuestion } from "./schema";

export type QuizRetakes = {
  conceptId: string;
  retakes: QuizQuestion[][];
};

const quizRetakes: QuizRetakes[] = [
  {
    conceptId: "backend-01",
    retakes: [
      [
        { prompt: "When should POST be used on a REST resource?", options: ["To create a new resource", "To delete every resource", "To cache a response", "To authenticate a user"], correctAnswer: 0, explanation: "POST commonly creates a new resource at a collection endpoint." },
        { prompt: "What do PUT and PATCH usually change?", options: ["Server logs", "An existing resource", "The HTTP protocol", "DNS settings"], correctAnswer: 1, explanation: "PUT or PATCH updates an existing resource, depending on the API semantics." },
        { prompt: "Why are plural resource names helpful?", options: ["They disable caching", "They consistently identify collections", "They encrypt the request", "They replace status codes"], correctAnswer: 1, explanation: "A path such as /documents clearly represents a collection of documents." },
        { prompt: "What makes a request stateless?", options: ["It contains no URL", "It carries the needed context without a server-held conversation", "It uses DELETE", "It stores everything in cookies"], correctAnswer: 1, explanation: "Each REST request carries enough information for the server to handle it independently." },
        { prompt: "Which response status commonly follows resource creation?", options: ["204", "201", "301", "401"], correctAnswer: 1, explanation: "201 Created indicates that a new resource was successfully created." },
      ],
      [
        { prompt: "What is an API resource?", options: ["A named thing or collection exposed by the API", "A test database", "A front-end component", "A network cable"], correctAnswer: 0, explanation: "A resource is a thing or collection that the API exposes." },
        { prompt: "Why should a DELETE operation target a resource URL?", options: ["It keeps actions separate from resource identity", "It makes the response anonymous", "It avoids authentication", "It disables validation"], correctAnswer: 0, explanation: "HTTP methods express actions, while URLs identify resources." },
        { prompt: "What is CRUD an abbreviation for?", options: ["Create, Read, Update, Delete", "Cache, Retry, Upload, Decode", "Connect, Route, Upload, Deliver", "Check, Render, Use, Deploy"], correctAnswer: 0, explanation: "REST operations commonly map to create, read, update, and delete." },
        { prompt: "Which method should not change server state?", options: ["GET", "POST", "PATCH", "DELETE"], correctAnswer: 0, explanation: "GET is a safe method and should not modify data." },
        { prompt: "What is API versioning used for?", options: ["Changing interfaces without immediately breaking clients", "Increasing test speed", "Encrypting responses", "Reducing database size"], correctAnswer: 0, explanation: "Versioning allows API contracts to evolve while existing clients continue working." },
      ],
    ],
  },
  {
    conceptId: "backend-02",
    retakes: [
      [
        { prompt: "Which status code marks a successfully created resource?", options: ["201", "404", "429", "500"], correctAnswer: 0, explanation: "201 means the server created the requested resource." },
        { prompt: "Which status indicates a malformed request body?", options: ["400", "200", "302", "503"], correctAnswer: 0, explanation: "400 means the server cannot process the request as sent." },
        { prompt: "What should a client do with a 429 response?", options: ["Retry after waiting", "Delete the account", "Ignore authentication", "Send a POST without data"], correctAnswer: 0, explanation: "429 means the client is being rate limited and should slow down." },
        { prompt: "Which status family represents redirects?", options: ["3xx", "1xx", "4xx", "5xx"], correctAnswer: 0, explanation: "3xx responses tell the client to take another route or use another URL." },
        { prompt: "What does a 5xx status tell a caller?", options: ["The server failed or could not complete the work", "The URL is always invalid", "The client is authenticated", "The cache contains stale data"], correctAnswer: 0, explanation: "5xx codes indicate server-side failures or unavailable service." },
      ],
      [
        { prompt: "Which status means a resource is available and unchanged?", options: ["200", "401", "404", "503"], correctAnswer: 0, explanation: "200 OK indicates successful processing and a normal response." },
        { prompt: "When does 422 commonly apply?", options: ["Semantic validation failure", "No redirect", "Successful deletion", "Cache hit"], correctAnswer: 0, explanation: "422 means the request is well formed but fails validation rules." },
        { prompt: "What is 401 used to communicate?", options: ["Missing or invalid authentication", "Resource deleted", "Request conflict", "Server overload"], correctAnswer: 0, explanation: "401 means the caller has not established an acceptable identity." },
        { prompt: "Which status is suitable for permission denial?", options: ["403", "201", "204", "429"], correctAnswer: 0, explanation: "403 means the authenticated caller lacks permission." },
        { prompt: "What status should a proxy use when it times out upstream?", options: ["504", "400", "201", "401"], correctAnswer: 0, explanation: "504 is a gateway timeout after an upstream response is too slow." },
      ],
    ],
  },
  {
    conceptId: "backend-03",
    retakes: [
      [
        { prompt: "What is an event loop waiting to run?", options: ["Ready asynchronous tasks", "Database tables", "CSS styles", "HTTP status codes"], correctAnswer: 0, explanation: "The event loop schedules and resumes ready coroutines." },
        { prompt: "How does an async function start work?", options: ["It becomes a coroutine when called", "It always runs immediately", "It creates a process", "It opens a database connection"], correctAnswer: 0, explanation: "Calling an async function creates a coroutine that executes when awaited or scheduled." },
        { prompt: "What is a semaphore useful for in async code?", options: ["Limiting concurrent operations", "Sorting JSON", "Creating JWTs", "Caching responses"], correctAnswer: 0, explanation: "A semaphore caps how many tasks run concurrently." },
        { prompt: "Which call can stall an event loop?", options: ["time.sleep", "await asyncio.sleep", "asyncio.gather", "an async HTTP client"], correctAnswer: 0, explanation: "Blocking sleep pauses the whole event loop instead of yielding control." },
        { prompt: "Which pattern handles independent I/O calls together?", options: ["asyncio.gather", "A nested for loop", "A blocking read", "A synchronous print"], correctAnswer: 0, explanation: "Gather schedules several independent coroutines at the same time." },
      ],
      [
        { prompt: "What is a coroutine?", options: ["An async function that can pause and resume", "A database index", "A deployment process", "A REST resource"], correctAnswer: 0, explanation: "A coroutine is an asynchronous routine that yields control at await points." },
        { prompt: "What happens at an await expression?", options: ["The coroutine yields until the awaited work completes", "The server shuts down", "Every other request is blocked", "The token is deleted"], correctAnswer: 0, explanation: "Await yields control while preserving the coroutine's place for later resumption." },
        { prompt: "Why is async useful for LLM APIs?", options: ["Their calls spend most time waiting for I/O", "They require no network", "They always use CPU only", "They remove rate limits"], correctAnswer: 0, explanation: "Async lets the server handle more work while model calls wait." },
        { prompt: "Which result should heavy image processing return to?", options: ["A worker process or thread pool", "The event loop directly", "A GET request", "The browser cookie"], correctAnswer: 0, explanation: "CPU-heavy work should not run directly on the async event loop." },
        { prompt: "What is backpressure in async concurrency?", options: ["Controlling work so producers do not overwhelm consumers", "Increasing every timeout", "Removing retries", "Logging only errors"], correctAnswer: 0, explanation: "Backpressure limits queues or concurrency before downstream resources are overwhelmed." },
      ],
    ],
  },
  {
    conceptId: "backend-04",
    retakes: [
      [
        { prompt: "How are SSE events separated?", options: ["By a blank line after data fields", "By commas", "By HTTP cookies", "By database rows"], correctAnswer: 0, explanation: "SSE uses blank lines to mark event boundaries." },
        { prompt: "What is the browser EventSource designed for?", options: ["Receiving SSE events", "Opening WebSockets", "Uploading files", "Running SQL"], correctAnswer: 0, explanation: "EventSource provides an SSE client API in browsers." },
        { prompt: "What should proxy configuration do for SSE?", options: ["Disable response buffering", "Always compress to one byte", "Block keep-alive traffic", "Convert every event to 404"], correctAnswer: 0, explanation: "Buffered proxies delay events instead of forwarding them promptly." },
        { prompt: "What is time to first token?", options: ["The delay until output begins", "Total database size", "The number of users", "The longest token"], correctAnswer: 0, explanation: "Time to first token measures perceived startup latency for streaming output." },
        { prompt: "Which direction does SSE support?", options: ["Server to browser", "Browser to server only", "Peer to peer", "Database to database only"], correctAnswer: 0, explanation: "SSE is a one-way server-to-client stream." },
      ],
      [
        { prompt: "What does an SSE data line represent?", options: ["Part of an event payload", "A database index", "A JWT claim", "An OAuth scope"], correctAnswer: 0, explanation: "SSE data fields carry the event payload." },
        { prompt: "What should a server send during a long quiet period?", options: ["A comment or keep-alive", "A 404", "A duplicate final answer", "A new JWT"], correctAnswer: 0, explanation: "Keep-alives prevent intermediaries from timing out a live stream." },
        { prompt: "Which is a benefit of token streaming?", options: ["Users see partial output sooner", "Users receive no response", "Database writes are removed", "Authentication is disabled"], correctAnswer: 0, explanation: "Streaming starts showing useful output before generation finishes." },
        { prompt: "What should happen after the stream is complete?", options: ["Send a completion or done event", "Keep sending forever", "Open another database transaction", "Delete the browser"], correctAnswer: 0, explanation: "A completion event lets the client finish the interaction cleanly." },
        { prompt: "How should text containing newlines be encoded in JSON events?", options: ["As escaped JSON content", "As a raw database command", "As a blank HTTP header", "As a different status code"], correctAnswer: 0, explanation: "Escaping or JSON encoding keeps each SSE event structurally valid." },
      ],
    ],
  },
  {
    conceptId: "backend-05",
    retakes: [
      [
        { prompt: "What does full-duplex communication allow?", options: ["Both sides send at any time", "Only server writes", "Only browser writes", "No reconnects"], correctAnswer: 0, explanation: "Full-duplex means both peers can send independently." },
        { prompt: "What protects a WebSocket connection across deploys?", options: ["Client reconnection logic", "A larger HTML font", "Removing authentication", "A GET-only route"], correctAnswer: 0, explanation: "Clients must reconnect and restore state after connection loss." },
        { prompt: "What is a heartbeat used for?", options: ["Detecting dead connections", "Encrypting files", "Creating REST resources", "Sorting database rows"], correctAnswer: 0, explanation: "Heartbeats detect peers that have disconnected or stopped responding." },
        { prompt: "Where can WebSocket state be shared at scale?", options: ["A pub/sub or shared state layer", "Only the browser URL", "Inside one CSS file", "In status code text"], correctAnswer: 0, explanation: "Shared infrastructure lets messages reach connections on other server instances." },
        { prompt: "What is backpressure important for?", options: ["Preventing fast senders from overwhelming slow receivers", "Removing all network traffic", "Making REST cacheable", "Encrypting JWT payloads"], correctAnswer: 0, explanation: "Backpressure controls message flow when a receiver cannot keep up." },
      ],
      [
        { prompt: "When should authentication run for a WebSocket?", options: ["Before or during connection setup", "Only after disconnect", "Never", "From CSS"], correctAnswer: 0, explanation: "Identity should be established while opening or initializing the connection." },
        { prompt: "What can a user interruption cancel?", options: ["An in-progress answer task", "A database schema", "A DNS record", "A static asset"], correctAnswer: 0, explanation: "WebSockets can carry stop messages that cancel generation work." },
        { prompt: "Why might sticky routing help WebSockets?", options: ["It keeps a connection on one server", "It removes every heartbeat", "It converts SSE to REST", "It deletes session state"], correctAnswer: 0, explanation: "Sticky routing is useful for state that remains local to one server." },
        { prompt: "What happens to WebSocket messages after a disconnect?", options: ["The app must recover or retransmit needed state", "They are automatically stored forever", "They become HTTP 404s", "They are signed by SQL"], correctAnswer: 0, explanation: "Disconnected clients need explicit recovery and replay strategies." },
        { prompt: "Which protocol is usually simpler for live server-only updates?", options: ["SSE", "WebSocket", "Raw TCP", "GraphQL subscriptions only"], correctAnswer: 0, explanation: "SSE has fewer protocol requirements when messages only flow server to client." },
      ],
    ],
  },
  {
    conceptId: "backend-06",
    retakes: [
      [
        { prompt: "What are JWT header and payload separated by?", options: ["Dots", "Colons", "Commas", "Slashes"], correctAnswer: 0, explanation: "A JWT has three base64url sections separated by dots." },
        { prompt: "Which JWT claim identifies the subject?", options: ["sub", "exp", "iat", "aud"], correctAnswer: 0, explanation: "The sub claim identifies the token subject." },
        { prompt: "What algorithm setting is important during verification?", options: ["Use an allowlist", "Accept any algorithm", "Skip signature checks", "Use base64 decoding alone"], correctAnswer: 0, explanation: "Pinning allowed algorithms prevents algorithm-confusion attacks." },
        { prompt: "What should a refresh token do?", options: ["Obtain a short-lived access token", "Remove the signature", "Become the JWT payload", "Disable expiry"], correctAnswer: 0, explanation: "Refresh tokens are used to obtain new access tokens without another login." },
        { prompt: "Where should secrets never appear?", options: ["Inside a readable JWT payload", "In a server secret store", "In environment configuration", "In a server-side key vault"], correctAnswer: 0, explanation: "JWT payloads are encoded and readable, not encrypted." },
      ],
      [
        { prompt: "What makes a JWT stateless to the server?", options: ["Claims are self-contained and signed", "Every request has a new password", "No expiry exists", "The payload is encrypted"], correctAnswer: 0, explanation: "A server can verify a signed JWT without a session lookup." },
        { prompt: "Which claim identifies intended audience?", options: ["aud", "sub", "iat", "kid"], correctAnswer: 0, explanation: "The audience claim limits which service may accept the token." },
        { prompt: "What does iat commonly represent?", options: ["Issued-at time", "Identity admin tier", "Internal API type", "Invite approval token"], correctAnswer: 0, explanation: "iat records when the token was issued." },
        { prompt: "How should access tokens be scoped?", options: ["To the minimum required permissions", "To every system", "Without expiry", "To the raw password"], correctAnswer: 0, explanation: "Least-privilege scopes limit the damage of a leaked token." },
        { prompt: "Why should login verification check issuer and audience?", options: ["To accept only expected token sources and services", "To change database indexes", "To increase token size", "To enable CORS"], correctAnswer: 0, explanation: "Issuer and audience validation prevents tokens from unrelated systems being accepted." },
      ],
    ],
  },
  {
    conceptId: "backend-07",
    retakes: [
      [
        { prompt: "Where does a user enter their password in OAuth login?", options: ["At the provider", "In the third-party app", "In the redirect URL", "In the browser cache"], correctAnswer: 0, explanation: "The provider authenticates the user; the app does not receive their password." },
        { prompt: "What does the state parameter help prevent?", options: ["Cross-site request forgery", "Database indexing", "SQL joins", "Token rotation"], correctAnswer: 0, explanation: "State ties a callback to the authorization request that started it." },
        { prompt: "What is PKCE mainly protecting?", options: ["The authorization code exchange", "A CSS file", "A static database table", "A local cache key"], correctAnswer: 0, explanation: "PKCE prevents intercepted authorization codes from being exchanged by an attacker." },
        { prompt: "What does an access token authorize?", options: ["A limited provider operation", "Every provider account", "Password creation", "Database backups"], correctAnswer: 0, explanation: "An access token grants scoped provider operations." },
        { prompt: "What should happen when a refresh token is revoked?", options: ["The app should stop refreshing and ask for consent again", "The app should reuse it forever", "The app should delete the provider", "The app should ignore the provider"], correctAnswer: 0, explanation: "Revoked refresh tokens require reauthorization or login." },
      ],
      [
        { prompt: "What is delegated consent?", options: ["A user grants limited app permissions", "A provider shares every password", "A database joins users", "A cache expires tokens"], correctAnswer: 0, explanation: "Delegated consent allows an app to act within approved permissions." },
        { prompt: "What does a redirect URI identify?", options: ["Where the provider sends OAuth responses", "The database host", "The user's password", "The app stylesheet"], correctAnswer: 0, explanation: "The redirect URI is a registered callback destination." },
        { prompt: "Why validate redirect URIs exactly?", options: ["To prevent tokens or codes from going to attackers", "To speed SQL queries", "To enlarge the cache", "To hide HTTP status"], correctAnswer: 0, explanation: "Exact callback matching prevents authorization responses from leaking to malicious destinations." },
        { prompt: "What can a refresh token risk if stolen?", options: ["Renewing access without a new login", "Changing the database schema", "Deleting OAuth state", "Encrypting the app"], correctAnswer: 0, explanation: "Refresh tokens are powerful and must be stored securely." },
        { prompt: "What does least-privilege OAuth request mean?", options: ["Request only needed scopes", "Request account-admin scope", "Request every scope by default", "Request no consent"], correctAnswer: 0, explanation: "Requesting minimal scopes reduces user risk and application exposure." },
      ],
    ],
  },
  {
    conceptId: "backend-08",
    retakes: [
      [
        { prompt: "What is schema-on-write?", options: ["Data is validated when stored", "Data is never stored", "Schema is only in CSS", "Indexes write the schema"], correctAnswer: 0, explanation: "Schema-on-write databases enforce structure before storing records." },
        { prompt: "What is JSONB commonly used for in PostgreSQL?", options: ["Flexible structured fields", "Replacing HTTP methods", "Creating JWT signatures", "Streaming SSE"], correctAnswer: 0, explanation: "JSONB stores flexible JSON with indexing and query support." },
        { prompt: "Which database shape suits many relationships?", options: ["Relational tables", "A single random key-value row", "A static JSON file", "An in-memory queue"], correctAnswer: 0, explanation: "Relational databases model and join related entities effectively." },
        { prompt: "What may document databases duplicate?", options: ["Related data for fast reads", "SQL status codes", "OAuth secrets", "HTTP headers"], correctAnswer: 0, explanation: "Document models often embed or duplicate values to reduce joins." },
        { prompt: "What should precede selecting a data store?", options: ["Understanding query and consistency needs", "Choosing a logo", "Writing no schema", "Adding only caches"], correctAnswer: 0, explanation: "Workload, relationships, and consistency requirements should drive database choice." },
      ],
      [
        { prompt: "What is a key-value database optimized for?", options: ["Fast lookup by key", "Complex cross-table joins", "SQL reports", "File compilation"], correctAnswer: 0, explanation: "Key-value stores are efficient when access begins with a known key." },
        { prompt: "What is a graph database strongest at?", options: ["Traversing relationships", "Serving static images", "Rate limiting", "JWT encoding"], correctAnswer: 0, explanation: "Graph databases model entities and relationships for traversal queries." },
        { prompt: "What can strict schemas improve?", options: ["Data consistency and validation", "Network latency only", "Prompt generation", "Browser rendering"], correctAnswer: 0, explanation: "Schemas define accepted structures and make invalid state harder to store." },
        { prompt: "What is a major tradeoff of wide denormalization?", options: ["Updates may need to change several copies", "Queries become relational", "Transactions disappear", "Indexes are prohibited"], correctAnswer: 0, explanation: "Duplicated data can improve reads but makes updates harder to keep consistent." },
        { prompt: "Which store is a sensible default for most AI SaaS data?", options: ["PostgreSQL", "A flat text file", "An unindexed browser store", "A public object bucket"], correctAnswer: 0, explanation: "PostgreSQL provides relational data, JSON, vectors, transactions, and mature tooling." },
      ],
    ],
  },
  {
    conceptId: "backend-09",
    retakes: [
      [
        { prompt: "What is a covering index?", options: ["An index that contains all columns a query needs", "A full database backup", "An HTTP cache", "A vector embedding"], correctAnswer: 0, explanation: "A covering index lets the database answer a query without reading table rows." },
        { prompt: "What does a composite index order affect?", options: ["Which leftmost query prefixes can use it", "The HTTP status", "JWT claims", "SSE event names"], correctAnswer: 0, explanation: "Composite index columns follow a left-to-right prefix rule." },
        { prompt: "What can function wrapping do to a column index?", options: ["Prevent ordinary index use", "Increase index accuracy", "Encrypt the table", "Create a transaction"], correctAnswer: 0, explanation: "Queries that transform a column may need an expression index." },
        { prompt: "What does CREATE INDEX CONCURRENTLY avoid?", options: ["Blocking writes on a live table", "Creating a real index", "Using disk", "Running EXPLAIN"], correctAnswer: 0, explanation: "Concurrent index creation supports live tables without an exclusive write block." },
        { prompt: "What should follow adding a suspected index?", options: ["Measure the query plan", "Delete all cache", "Restart the network", "Remove every WHERE clause"], correctAnswer: 0, explanation: "EXPLAIN ANALYZE verifies whether the database actually uses the index." },
      ],
      [
        { prompt: "What is an unselective index likely to do?", options: ["Provide little benefit", "Guarantee a faster table scan", "Delete duplicate rows", "Improve every update"], correctAnswer: 0, explanation: "A column with few distinct values may not reduce work enough to justify an index." },
        { prompt: "What can too many indexes hurt?", options: ["Write and storage performance", "Read-only DNS", "CSS rendering", "JWT signing"], correctAnswer: 0, explanation: "Indexes consume space and require maintenance for every write." },
        { prompt: "What is an index scan?", options: ["Following an index to locate matching rows", "Restarting the database", "Scanning CSS classes", "Encoding a JSON response"], correctAnswer: 0, explanation: "An index scan uses index entries to find table rows efficiently." },
        { prompt: "Which structure commonly backs a standard database index?", options: ["A B-tree", "A linked list with no order", "A neural network", "A flat video"], correctAnswer: 0, explanation: "B-trees support ordered range and equality lookups." },
        { prompt: "Why use a vector index for embeddings?", options: ["Approximate similarity search scales better", "It stores only strings", "It disables queries", "It replaces cosine math"], correctAnswer: 0, explanation: "Vector indexes provide faster approximate nearest-neighbor search." },
      ],
    ],
  },
  {
    conceptId: "backend-10",
    retakes: [
      [
        { prompt: "What does consistency guarantee in ACID?", options: ["Valid constraints and rules remain true", "Every request is asynchronous", "No server can fail", "All rows are replicated"], correctAnswer: 0, explanation: "Consistency ensures committed operations preserve database constraints." },
        { prompt: "What does isolation prevent between concurrent transactions?", options: ["Seeing another transaction's partial state", "All database reads", "All database writes", "Using indexes"], correctAnswer: 0, explanation: "Isolation controls how concurrent transactions observe each other's work." },
        { prompt: "What does durability mean after commit?", options: ["Committed data survives a crash", "The data can be deleted freely", "Reads remain untracked", "No rollback is possible"], correctAnswer: 0, explanation: "Durability ensures committed changes persist after failures." },
        { prompt: "Why keep transactions short?", options: ["To reduce lock duration and resource pressure", "To remove constraints", "To make SQL invalid", "To avoid commits forever"], correctAnswer: 0, explanation: "Short transactions release locks and connections sooner." },
        { prompt: "What can an external API call need after a database commit?", options: ["An outbox or retry workflow", "A second transaction to undo it", "No observability", "An always-successing response"], correctAnswer: 0, explanation: "External effects need separate reliable delivery patterns." },
      ],
      [
        { prompt: "What SQL actions begin and finish a transaction?", options: ["BEGIN and COMMIT", "GET and POST", "SELECT and JOIN", "CREATE and DROP"], correctAnswer: 0, explanation: "A transaction starts explicitly and finishes with commit or rollback." },
        { prompt: "What happens to uncommitted changes after rollback?", options: ["They are discarded", "They become durable", "They are sent to the client", "They are cached forever"], correctAnswer: 0, explanation: "Rollback removes partial transaction changes." },
        { prompt: "What database pattern prevents double charging?", options: ["A conditional update or lock", "A larger JWT", "A POST with no body", "A longer timeout"], correctAnswer: 0, explanation: "Conditional updates or locks make state changes safe under concurrency." },
        { prompt: "What consistency issue can race between read and write?", options: ["Lost updates", "Index compression", "SSE buffering", "JWT encoding"], correctAnswer: 0, explanation: "Concurrent read-modify-write sequences can overwrite each other's changes." },
        { prompt: "What belongs inside the transaction for a usage charge?", options: ["The credit deduction and usage record", "The LLM network call", "A customer email", "A provider retry loop"], correctAnswer: 0, explanation: "Database-related changes can be atomic; slow external calls should remain outside." },
      ],
    ],
  },
];

export default quizRetakes;

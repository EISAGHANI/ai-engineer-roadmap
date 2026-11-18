import type { Quiz } from "./schema";

const quizzes: Quiz[] = [
  {
    conceptId: "backend-01",
    questions: [
      { prompt: "What does REST primarily organize?", options: ["Resources and HTTP actions", "Database transactions", "Machine learning models", "CSS components"], correctAnswer: 0, explanation: "REST exposes resources at URLs and uses HTTP methods for actions." },
      { prompt: "Which HTTP method usually reads a resource?", options: ["POST", "DELETE", "GET", "PUT"], correctAnswer: 2, explanation: "GET reads resource data without changing it." },
      { prompt: "Which URL is the most REST-style?", options: ["/getDocument/42", "/documents/42", "/delete-document", "/action42"], correctAnswer: 1, explanation: "The resource is the noun in the URL; the HTTP method expresses the action." },
      { prompt: "What format do REST APIs commonly exchange?", options: ["Only XML", "JSON or other representations", "SQL files", "Executable code"], correctAnswer: 1, explanation: "JSON is common, though REST can use other representations." },
      { prompt: "What is useful for documenting a REST API?", options: ["A GET-only cache", "An OpenAPI schema", "A private key", "A database index"], correctAnswer: 1, explanation: "An OpenAPI schema publishes the endpoints, inputs, responses, and validation rules." },
    ],
  },
  {
    conceptId: "backend-02",
    questions: [
      { prompt: "What does HTTP 404 mean?", options: ["The resource was not found", "The request is valid", "The server is overloaded", "Authentication succeeded"], correctAnswer: 0, explanation: "404 means the requested resource does not exist." },
      { prompt: "Which status group means client-side problems?", options: ["2xx", "3xx", "4xx", "5xx"], correctAnswer: 2, explanation: "The 4xx range reports client errors such as bad input or missing authorization." },
      { prompt: "What is the difference between 401 and 403?", options: ["401 means success; 403 means success", "401 means not authenticated; 403 means not allowed", "401 means not found; 403 means overload", "They always mean the same thing"], correctAnswer: 1, explanation: "401 is for missing or invalid authentication, while 403 is for insufficient permission." },
      { prompt: "Which status is appropriate when a server is temporarily unavailable?", options: ["400", "503", "201", "401"], correctAnswer: 1, explanation: "503 indicates that the service is temporarily unavailable." },
      { prompt: "Why should API failures not return 200 with an error field?", options: ["It makes the response too short", "It hides failures from clients and monitoring", "It automatically retries all requests", "It changes the HTTP method"], correctAnswer: 1, explanation: "Real HTTP status codes let clients and monitoring distinguish success from failure." },
    ],
  },
  {
    conceptId: "backend-03",
    questions: [
      { prompt: "What is async programming especially useful for?", options: ["CPU-heavy graphics", "Waiting on I/O while serving other work", "Compiling binaries", "Creating database schemas"], correctAnswer: 1, explanation: "Async code overlaps waiting on network or database I/O with other tasks." },
      { prompt: "What does await pause?", options: ["The entire operating system", "The current coroutine until its result is ready", "Every Python process", "The database server"], correctAnswer: 1, explanation: "Await pauses only the current coroutine, allowing the event loop to run other work." },
      { prompt: "Which Python tool commonly runs multiple coroutines concurrently?", options: ["asyncio.gather", "time.sleep", "requests.get", "pip install"], correctAnswer: 0, explanation: "asyncio.gather starts and awaits several coroutines concurrently." },
      { prompt: "What can block all work in an async server?", options: ["An async database driver", "A blocking requests call", "A short network timeout", "An await expression"], correctAnswer: 1, explanation: "A synchronous or blocking call stalls the event loop." },
      { prompt: "What is async not mainly intended to optimize?", options: ["Network waits", "Database waits", "Heavy CPU computation", "Concurrent I/O"], correctAnswer: 2, explanation: "Heavy CPU work usually belongs in worker processes or threads." },
    ],
  },
  {
    conceptId: "backend-04",
    questions: [
      { prompt: "What is Server-Sent Events mainly used for?", options: ["Two-way binary files", "Server-to-client streaming", "Database sharding", "Password storage"], correctAnswer: 1, explanation: "SSE streams events from a server to a browser over HTTP." },
      { prompt: "How does streaming improve an LLM chat?", options: ["It removes every API call", "It shows output while the model generates it", "It encrypts the response", "It replaces the model"], correctAnswer: 1, explanation: "Streaming reduces perceived latency by returning tokens as they are generated." },
      { prompt: "What media type is typical for SSE?", options: ["application/json", "text/event-stream", "image/png", "multipart/form-data"], correctAnswer: 1, explanation: "SSE responses use text/event-stream." },
      { prompt: "What prefix starts an SSE data event?", options: ["data:", "GET:", "token=", "http://"], correctAnswer: 0, explanation: "SSE events contain data lines beginning with data:." },
      { prompt: "What should an implementation do when a streaming user leaves?", options: ["Keep generating forever", "Stop generation to avoid wasted tokens", "Send every response twice", "Open a WebSocket"], correctAnswer: 1, explanation: "Stopping generation avoids paying for output nobody will read." },
    ],
  },
  {
    conceptId: "backend-05",
    questions: [
      { prompt: "What makes WebSockets different from SSE?", options: ["They support two-way messaging", "They cannot reconnect", "They only use UDP", "They require no HTTP"], correctAnswer: 0, explanation: "WebSockets keep a full-duplex channel open for client and server messages." },
      { prompt: "Which use case fits WebSockets well?", options: ["A live collaborative editor", "A static sitemap", "A monthly report archive", "One-way image download"], correctAnswer: 0, explanation: "Collaboration needs realtime messages in both directions." },
      { prompt: "What happens if a WebSocket network connection drops?", options: ["Nothing ever changes", "The client should reconnect and recover state", "It becomes a REST endpoint", "The server deletes the client"], correctAnswer: 1, explanation: "Network and deploy interruptions require reconnection and state recovery." },
      { prompt: "Which is simpler when only the server sends updates?", options: ["SSE", "WebSockets", "A database poll every millisecond", "A full-duplex binary protocol"], correctAnswer: 0, explanation: "SSE is simpler for server-to-client-only streams." },
      { prompt: "What must be handled at scale with stateful WebSocket connections?", options: ["Sticky routing or a pub/sub layer", "A larger font", "Only GET requests", "Removing reconnection"], correctAnswer: 0, explanation: "Stateful connections need routing or shared message infrastructure." },
    ],
  },
  {
    conceptId: "backend-06",
    questions: [
      { prompt: "What does a JWT signature prove?", options: ["The token has not been changed", "The payload is encrypted", "The user has a password", "The token never expires"], correctAnswer: 0, explanation: "The signature verifies integrity and authenticity of the token." },
      { prompt: "What are the three JWT parts?", options: ["User, role, password", "Header, payload, signature", "Cookie, session, database", "Issuer, audience, secret"], correctAnswer: 1, explanation: "A JWT contains a header, payload, and signature." },
      { prompt: "Is a JWT payload encrypted?", options: ["Yes, always", "No, it is only encoded", "Only in browsers", "Only for refresh tokens"], correctAnswer: 1, explanation: "JWT payload contents can be read by anyone who gets the token." },
      { prompt: "What claim usually defines token expiry?", options: ["sub", "exp", "iat", "iss"], correctAnswer: 1, explanation: "exp is the standard expiration claim." },
      { prompt: "Which is safer for access tokens?", options: ["Very long lifetime", "Short lifetime with refresh tokens", "No signature verification", "Secrets in the payload"], correctAnswer: 1, explanation: "Short-lived access tokens limit damage if a token is leaked." },
    ],
  },
  {
    conceptId: "backend-07",
    questions: [
      { prompt: "What does OAuth 2.0 primarily provide?", options: ["A database format", "Delegated authorization", "A password hash", "An HTTP status code"], correctAnswer: 1, explanation: "OAuth lets a user authorize one app to act with limited permissions." },
      { prompt: "What are OAuth scopes?", options: ["Requested permissions", "Database rows", "Token sizes", "Redirect colors"], correctAnswer: 0, explanation: "Scopes describe the permissions an app requests." },
      { prompt: "Why should an app use the authorization code flow with PKCE?", options: ["It avoids all user login", "It protects the code exchange", "It stores passwords in JWTs", "It removes HTTPS"], correctAnswer: 1, explanation: "PKCE helps prevent authorization code interception and misuse." },
      { prompt: "What does OpenID Connect add to OAuth?", options: ["Standard identity information", "Database indexing", "SSE streaming", "A faster cache"], correctAnswer: 0, explanation: "OpenID Connect adds standard login and identity claims." },
      { prompt: "What should an OAuth app store for provider access?", options: ["The user's provider password", "Encrypted refresh and access tokens", "Every chat message", "The authorization state forever"], correctAnswer: 1, explanation: "Tokens should be stored securely and refreshed or revoked when needed." },
    ],
  },
  {
    conceptId: "backend-08",
    questions: [
      { prompt: "What is a key characteristic of SQL databases?", options: ["Fixed tables and relationships", "No schemas ever", "Only key-value storage", "No transactions"], correctAnswer: 0, explanation: "SQL databases use structured tables and relationships." },
      { prompt: "What can NoSQL databases offer?", options: ["Flexible or specialized data models", "Only SQL joins", "No replication", "Exactly one schema"], correctAnswer: 0, explanation: "NoSQL includes document, key-value, graph, and other specialized models." },
      { prompt: "When is PostgreSQL a strong default for an AI app?", options: ["Always for every workload", "When users, documents, metadata, and vectors belong together", "When no data is needed", "Only for static pages"], correctAnswer: 1, explanation: "PostgreSQL can handle relational data and pgvector for embeddings." },
      { prompt: "What is a risk of choosing NoSQL just to avoid a schema?", options: ["It makes SQL faster", "Schema rules move into application code and become inconsistent", "It automatically creates indexes", "It guarantees ACID"], correctAnswer: 1, explanation: "Flexible storage can push validation and consistency responsibilities into the app." },
      { prompt: "What do SQL JOINs connect?", options: ["Related tables", "CSS files", "HTTP headers", "Prompt templates"], correctAnswer: 0, explanation: "JOINs combine rows across tables using relationships." },
    ],
  },
  {
    conceptId: "backend-09",
    questions: [
      { prompt: "Why does a database use an index?", options: ["To speed up matching lookups", "To slow down writes", "To encrypt every row", "To replace the table"], correctAnswer: 0, explanation: "Indexes provide fast lookup paths without scanning every row." },
      { prompt: "What SQL command inspects query execution?", options: ["EXPLAIN ANALYZE", "DROP DATABASE", "SHOW TABLES ONLY", "CREATE USER"], correctAnswer: 0, explanation: "EXPLAIN ANALYZE shows how PostgreSQL executes a query." },
      { prompt: "What extra cost do indexes add?", options: ["Storage and slower writes", "No cost", "Automatic data loss", "A new HTTP route"], correctAnswer: 0, explanation: "Indexes consume storage and must be maintained during writes." },
      { prompt: "Which columns should usually guide an index?", options: ["Columns used in real WHERE, JOIN, and ORDER BY queries", "Every column", "Only foreign keys in comments", "Only return columns"], correctAnswer: 0, explanation: "Indexes are most useful when they match measured query patterns." },
      { prompt: "What index type is used for pgvector similarity search?", options: ["HNSW or IVFFlat", "A CSS index", "A REST index", "A token index"], correctAnswer: 0, explanation: "pgvector supports approximate vector indexes such as HNSW and IVFFlat." },
    ],
  },
  {
    conceptId: "backend-10",
    questions: [
      { prompt: "What does transaction atomicity mean?", options: ["All operations commit or none do", "All operations run on separate servers", "Only reads are allowed", "Rows are never deleted"], correctAnswer: 0, explanation: "Atomicity ensures a transaction is all-or-nothing." },
      { prompt: "What does ACID stand for?", options: ["API, Cache, Index, Durable", "Atomicity, Consistency, Isolation, Durability", "Async, Cache, Isolation, Delivery", "Authentication, Consistency, Input, Data"], correctAnswer: 1, explanation: "ACID names the core database transaction guarantees." },
      { prompt: "What should happen after a transaction error?", options: ["Roll back changes", "Commit half the changes", "Ignore the error", "Call an external API"], correctAnswer: 0, explanation: "A rollback removes partial changes when the transaction fails." },
      { prompt: "Should an app hold a database transaction open during an LLM call?", options: ["Yes, always", "No, keep transactions short", "Only for GET requests", "It has no effect"], correctAnswer: 1, explanation: "A slow external call while holding a transaction can block rows and connections." },
      { prompt: "What can transactions not undo?", options: ["Database writes", "Constraints", "External side effects such as sent emails", "Rollback operations"], correctAnswer: 2, explanation: "Transactions are database-local; external actions need patterns such as an outbox." },
    ],
  },
];

export default quizzes;

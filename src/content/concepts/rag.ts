import type { ConceptInput } from "../schema";

/** Area: rag. Official one-liners are verbatim from the AI Engineer Roadmap (LearnVora, Nov 2026). */
const concepts: ConceptInput[] = [
  {
    id: "rag-01",
    area: "rag",
    number: 1,
    slug: "embeddings",
    name: "Embeddings",
    tier: "base",
    official:
      "Turn text into a list of numbers (a vector) so similar meanings end up close together.",
    kid: "A computer can't feel what words mean, so it gives each one a spot on a giant map. Words that mean similar things, like puppy and dog, end up living close together.",
    realWorld: {
      title: "Every book on the librarian's map",
      text: "The librarian pins every book onto a huge wall map of ideas. Books about dogs sit together in one corner, cooking books in another, space books far away from both. When a pupil asks 'how do I look after my puppy?', she finds that spot on the map and grabs the books nearby, even if none of them uses the word 'puppy'.",
    },
    engineering: {
      text: "An embedding model maps text to a fixed-length vector (often 384 to 3,072 numbers) so that texts with similar meaning get nearby vectors. Retrieval embeds the query with the same model and finds the closest document vectors. Use the same model for indexing and querying, re-embed everything when you change models, and choose a model by testing on your own data; public leaderboards such as MTEB are a starting point, not the answer.",
      code: {
        lang: "python",
        source:
          "from sentence_transformers import SentenceTransformer\n\nmodel = SentenceTransformer(\"all-MiniLM-L6-v2\")     # small and fast, 384 numbers per text\ntexts = [\"How do I look after my puppy?\",\n         \"Caring for a young dog: food, sleep and walks\",\n         \"Best pizza dough recipe\"]\nvectors = model.encode(texts, normalize_embeddings=True)\nprint(vectors.shape)                                # (3, 384)\n\nscores = vectors[0] @ vectors[1:].T                 # cosine similarity (vectors are normalized)\nprint(scores)                                       # the dog text scores far higher than pizza",
      },
      pitfalls: [
        "Vectors from different models, or model versions, are not comparable; re-embed everything when you switch.",
        "Embeddings capture topic well but often miss exact codes, names and numbers; add keyword search.",
        "A long text squeezed into one vector loses detail; chunk it first.",
      ],
      docsUrl: "https://sbert.net/",
    },
    demo: "EmbeddingMapDemo",
    related: ["rag-02", "rag-04", "rag-03", "llm-01"],
    projects: ["build-rag"],
    keywords: ["embeddings", "vectors", "semantic", "meaning", "sentence transformers", "similarity"],
  },
  {
    id: "rag-02",
    area: "rag",
    number: 2,
    slug: "cosine-similarity",
    name: "Cosine Similarity",
    tier: "base",
    official:
      "Scores how closely two vectors point the same way (1 = same). The usual way to compare embeddings.",
    kid: "Two friends pointing at the same tree point the same way, even if one arm is longer. Cosine similarity checks how much two arrows point the same way: 1 means exactly the same way.",
    realWorld: {
      title: "Pointing at shelves",
      text: "Imagine every book as an arrow from the library door pointing towards its topic. Two books about horses point almost the same way, so their score is close to 1. A horse book and a book about taxes point at right angles and score about 0. Only the direction matters, not the length of the arrow, so a thin pamphlet and a fat encyclopedia about horses still match.",
    },
    engineering: {
      text: "Cosine similarity is the dot product of two vectors divided by the product of their lengths: cos θ = a·b / (|a| |b|). It ranges from -1 (opposite) through 0 (unrelated) to 1 (same direction) and ignores magnitude. For vectors normalised to unit length it equals the dot product, which is why many systems normalise once at indexing time and then use the faster inner product. Cosine distance is 1 minus cosine similarity.",
      code: {
        lang: "python",
        source:
          "import numpy as np\n\ndef cosine(a, b):\n    return float(a @ b / (np.linalg.norm(a) * np.linalg.norm(b)))\n\nhorse_1 = np.array([0.9, 0.1, 0.0])\nhorse_2 = np.array([1.8, 0.3, 0.1])    # longer arrow, almost the same direction\ntaxes   = np.array([0.0, 0.1, 0.95])\n\nprint(round(cosine(horse_1, horse_2), 3))   # 0.997  same topic\nprint(round(cosine(horse_1, taxes), 3))     # 0.012  unrelated",
      },
      pitfalls: [
        "Scores are only comparable within one embedding model: 0.8 can be great for one model and mediocre for another.",
        "Don't hard-code a similarity threshold without testing it on real queries.",
        "If vectors are not normalised, dot product and cosine can rank results differently.",
      ],
      docsUrl: "https://en.wikipedia.org/wiki/Cosine_similarity",
    },
    demo: "CosineDemo",
    related: ["rag-01", "rag-06", "rag-05"],
    projects: ["build-rag"],
    keywords: ["cosine similarity", "angle", "dot product", "distance", "compare vectors", "score"],
  },
  {
    id: "rag-03",
    area: "rag",
    number: 3,
    slug: "chunking-strategies",
    name: "Chunking Strategies",
    tier: "base",
    official:
      "Split documents into pieces (by size, sentence or heading) small enough to retrieve precisely.",
    kid: "A whole book is too big to hand to someone who asked one question. So we cut it into small pieces, like chapters or pages, and hand over only the piece with the answer.",
    realWorld: {
      title: "Cutting the encyclopedia into cards",
      text: "A pupil asks how long elephants live. Handing over the whole 900-page encyclopedia is useless, and a card cut in the middle of a sentence is confusing. So the librarian copies the encyclopedia onto cards one section at a time, each card holding one complete idea with its heading. Now she can hand over exactly the card about elephant lifespans.",
    },
    engineering: {
      text: "Chunking splits documents into retrievable units before embedding. Common strategies: fixed size in tokens with overlap, recursive splitting on paragraphs then sentences, and structure-aware splitting on headings, sections or code blocks. Chunks that are too large blur the embedding and waste context; chunks that are too small lose meaning. Start around 200-800 tokens with 10-20% overlap, keep headings and metadata with each chunk, and tune the size against Recall@k on your own questions.",
      code: {
        lang: "python",
        source:
          "from langchain_text_splitters import RecursiveCharacterTextSplitter\n\nsplitter = RecursiveCharacterTextSplitter(\n    chunk_size=800,          # characters per chunk (measure tokens in production)\n    chunk_overlap=120,       # repeat a little so ideas are not cut in half\n    separators=[\"\\n## \", \"\\n\\n\", \"\\n\", \". \", \" \"],   # try headings first, then smaller\n)\nchunks = splitter.split_text(open(\"handbook.md\").read())\nfor i, chunk in enumerate(chunks[:3]):\n    print(i, len(chunk), chunk[:60].replace(\"\\n\", \" \"), \"...\")",
      },
      pitfalls: [
        "Chunks cut mid-sentence or mid-table produce answers that miss half the facts.",
        "A chunk without its heading or document title is often impossible to match: 'It grew by 3%' says nothing about what grew.",
        "There is no universal best size; measure retrieval quality for a few sizes on your own data.",
      ],
      docsUrl: "https://python.langchain.com/docs/concepts/text_splitters/",
    },
    demo: "ChunkingDemo",
    related: ["rag-14", "rag-15", "rag-13"],
    projects: ["build-rag"],
    keywords: ["chunking", "chunk size", "overlap", "split", "sections", "text splitter"],
  },
  {
    id: "rag-04",
    area: "rag",
    number: 4,
    slug: "vector-databases",
    name: "Vector Databases",
    tier: "base",
    official:
      "Databases built to store vectors and find the nearest ones fast (Qdrant, Pinecone, Weaviate, Chroma).",
    kid: "A normal list finds a book by its exact name. A vector database finds books by meaning, so asking for sad stories about dogs finds the right shelf even with different words.",
    realWorld: {
      title: "The magic card cabinet",
      text: "The library's new card cabinet does not sort cards by alphabet. Each card is filed by where its book sits on the wall map of ideas, and the cabinet can instantly pull out the ten cards nearest to any spot, even with a million cards inside. It also remembers each card's shelf, year and owner, so the librarian can ask for 'the nearest ten, but only from this year'.",
    },
    engineering: {
      text: "A vector database stores embeddings together with ids, text and metadata, and answers nearest-neighbour queries quickly using approximate indexes such as HNSW or IVF. Dedicated engines (Qdrant, Pinecone, Weaviate, Milvus, Chroma) add filtering, hybrid search, replication and multi-tenancy; Postgres with pgvector covers many apps without adding a new system. Choose by scale, filtering needs, operational effort and cost rather than by benchmark headlines.",
      code: {
        lang: "python",
        source:
          "from qdrant_client import QdrantClient\nfrom qdrant_client.models import Distance, PointStruct, VectorParams\n\nclient = QdrantClient(\":memory:\")                    # or url=\"http://localhost:6333\"\nclient.create_collection(\n    \"books\", vectors_config=VectorParams(size=384, distance=Distance.COSINE))\n\nclient.upsert(\"books\", points=[\n    PointStruct(id=1, vector=embed(\"Caring for a young dog\"), payload={\"year\": 2024}),\n    PointStruct(id=2, vector=embed(\"Best pizza dough recipe\"), payload={\"year\": 2021}),\n])\nhits = client.query_points(\"books\", query=embed(\"puppy care tips\"), limit=3).points\nprint([(hit.id, round(hit.score, 2)) for hit in hits])",
      },
      pitfalls: [
        "Approximate search can miss true neighbours; check recall whenever you tune index settings.",
        "Another database is another system to back up, secure and keep in sync with your source data.",
        "Store the original text and metadata next to each vector, or you cannot show or filter results.",
      ],
      docsUrl: "https://qdrant.tech/documentation/",
    },
    demo: "VectorDbDemo",
    related: ["rag-05", "rag-06", "rag-07"],
    projects: ["build-rag"],
    keywords: ["vector database", "qdrant", "pinecone", "weaviate", "chroma", "nearest neighbour"],
  },
  {
    id: "rag-05",
    area: "rag",
    number: 5,
    slug: "pgvector",
    name: "pgvector",
    tier: "base",
    official:
      "A Postgres extension that adds vector columns and similarity search to the database you already use.",
    kid: "Instead of buying a brand new cabinet, you add a special drawer to the cabinet you already own. pgvector adds a search-by-meaning drawer to Postgres, the box where many apps already keep their data.",
    realWorld: {
      title: "A new drawer in the old cabinet",
      text: "The library already keeps all its records (members, loans, book titles) in one trusty cabinet called Postgres. Rather than buying a separate magic cabinet, the librarian fits a new drawer into the old one that stores each book's spot on the idea map. Now one question can say 'books near this idea, borrowed by this pupil, published after 2020' and get its answer from one place.",
    },
    engineering: {
      text: "pgvector is a Postgres extension that adds a vector column type, distance operators (<-> for L2, <=> for cosine distance, <#> for negative inner product) and approximate indexes (HNSW and IVFFlat). Embeddings live next to your relational data, so filters, joins, transactions, backups and access control work as usual. It handles millions of vectors on one server; dedicated vector databases become attractive at much larger scale or for specialised features.",
      code: {
        lang: "sql",
        source:
          "CREATE EXTENSION IF NOT EXISTS vector;\n\nCREATE TABLE chunks (\n  id        bigserial PRIMARY KEY,\n  tenant_id int  NOT NULL,\n  content   text NOT NULL,\n  embedding vector(1536)\n);\n\nCREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);\n\n-- 5 nearest chunks for one tenant (cosine distance: smaller = closer)\nSELECT id, content, embedding <=> $1 AS distance\nFROM chunks\nWHERE tenant_id = $2\nORDER BY embedding <=> $1\nLIMIT 5;",
      },
      pitfalls: [
        "Use the operator that matches the index operator class (vector_cosine_ops goes with <=>), or the index is not used.",
        "A WHERE filter on an approximate index can return fewer rows than LIMIT; raise hnsw.ef_search or enable iterative index scans.",
        "Building an HNSW index on millions of rows needs a lot of memory; raise maintenance_work_mem.",
      ],
      docsUrl: "https://github.com/pgvector/pgvector",
    },
    demo: "PgvectorDemo",
    related: ["rag-04", "rag-06", "backend-09", "system-design-17"],
    projects: ["build-rag"],
    keywords: ["pgvector", "postgres", "sql", "vector column", "hnsw", "cosine distance"],
  },
  {
    id: "rag-06",
    area: "rag",
    number: 6,
    slug: "hnsw-indexes",
    name: "HNSW Indexes",
    tier: "base",
    official:
      "A graph-based index for approximate nearest-neighbour search. Fast even over millions of vectors.",
    kid: "To find a friend in a huge city, you take the fast train first, then a bus, then walk the last few steps. HNSW finds close matches the same way: big jumps first, then small steps.",
    realWorld: {
      title: "Express routes across the map",
      text: "Checking every one of a million cards would take the librarian all day. So she draws express routes across the map: from any card she can jump to far-away cards first, then to closer ones, then walk to the exact neighbours. Within a dozen hops she reaches the right corner while checking only a tiny fraction of the cards. Now and then she misses the very best card, but she is almost always close.",
    },
    engineering: {
      text: "HNSW (Hierarchical Navigable Small World) is a layered proximity graph. Upper layers hold few nodes with long-range links; lower layers are denser. A search enters at the top, greedily moves to the neighbour closest to the query, and descends layer by layer, giving roughly logarithmic search time. Key parameters are m (links per node), ef_construction (build quality) and ef_search (search breadth, trading speed for recall). It uses more memory than IVF indexes but gives excellent recall and latency.",
      code: {
        lang: "sql",
        source:
          "-- pgvector: build the graph (defaults: m = 16, ef_construction = 64)\nCREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops)\n  WITH (m = 16, ef_construction = 64);     -- higher = better graph, slower build\n\n-- Search breadth per query (default 40): higher = better recall, slower\nSET hnsw.ef_search = 100;\n\n-- The same idea in Python with hnswlib:\n--   index = hnswlib.Index(space=\"cosine\", dim=384)\n--   index.init_index(max_elements=1_000_000, M=16, ef_construction=200)\n--   index.add_items(vectors, ids); index.set_ef(100)\n--   labels, distances = index.knn_query(query_vector, k=5)",
      },
      pitfalls: [
        "It is approximate: measure recall against exact search on a sample when you change m or ef_search.",
        "The graph should fit in memory for good performance.",
        "Many deletes and updates slowly degrade the graph; plan periodic re-indexing.",
      ],
      docsUrl: "https://arxiv.org/abs/1603.09320",
    },
    demo: "HnswDemo",
    related: ["rag-04", "rag-05", "rag-19"],
    projects: ["build-rag"],
    keywords: ["hnsw", "index", "approximate nearest neighbour", "ann", "graph", "ef_search"],
  },
  {
    id: "rag-07",
    area: "rag",
    number: 7,
    slug: "metadata-filtering",
    name: "Metadata Filtering",
    tier: "base",
    official:
      "Narrow the search by fields like date, user or document type.",
    kid: "If you only want this year's comics, you first walk to the shelf with this year's comics, then pick the best one. Filters shrink the pile before searching by meaning.",
    realWorld: {
      title: "Only this year's books, please",
      text: "A teacher asks for the best books about volcanoes, but only ones published after 2020 and suitable for ten-year-olds. The librarian does not search the whole map and then throw most of it away. She first takes only the cards stamped 'after 2020' and 'age 10', then looks for the volcano corner among those.",
    },
    engineering: {
      text: "Store structured fields (date, source, document type, tenant, language, access level) as metadata with each chunk and apply them as filters in the vector query. Filters enforce hard constraints that similarity cannot, such as recency or permissions, and improve precision. Pre-filtering applies conditions before or during the approximate search; post-filtering applies them afterwards and can leave you with too few results. Index the fields you filter on.",
      code: {
        lang: "python",
        source:
          "from qdrant_client.models import FieldCondition, Filter, MatchValue, Range\n\nhits = client.query_points(\n    \"books\",\n    query=embed(\"volcano books for kids\"),\n    query_filter=Filter(must=[\n        FieldCondition(key=\"year\", range=Range(gte=2021)),\n        FieldCondition(key=\"reading_age\", match=MatchValue(value=10)),\n    ]),\n    limit=5,\n).points",
      },
      pitfalls: [
        "Post-filtering after taking the top k can return zero results; prefer engines that filter during the search.",
        "An LLM can extract filters from the question ('since 2022', 'only PDFs'), but validate the values.",
        "Permission filters belong in code, never in the prompt.",
      ],
      docsUrl: "https://qdrant.tech/documentation/concepts/filtering/",
    },
    demo: "MetadataFilterDemo",
    related: ["security-17", "rag-04", "system-design-17"],
    projects: ["build-rag"],
    keywords: ["metadata", "filter", "where", "date", "tenant", "permissions"],
  },
  {
    id: "rag-08",
    area: "rag",
    number: 8,
    slug: "bm25-keyword-search",
    name: "BM25 Keyword Search",
    tier: "base",
    official:
      "Classic keyword ranking. Catches exact names, codes and terms that embeddings miss.",
    kid: "Sometimes you need the exact word, like the model number printed on a toy's box. Keyword search counts the exact words and gives extra points to rare ones.",
    realWorld: {
      title: "The old card catalogue",
      text: "A pupil asks for the manual of the 'XR-200 microscope'. The idea map is no help: XR-200 and XR-300 mean almost the same thing. So the librarian uses the old card catalogue that lists every exact word. Rare words like 'XR-200' count for a lot, common words like 'the' count for almost nothing, and long books don't win just because they are long.",
    },
    engineering: {
      text: "BM25 is a classic ranking function over an inverted index. For each query term it adds the term's inverse document frequency (rare terms weigh more) times a saturating function of how often the term appears in the document, normalised by document length (usually k1 ≈ 1.2, b ≈ 0.75). It excels at identifiers, names, codes and rare jargon that dense embeddings blur, needs no model and is cheap. It does not understand synonyms, which is why it is paired with vector search.",
      code: {
        lang: "python",
        source:
          "from rank_bm25 import BM25Okapi\n\ndocs = [\"XR-200 microscope manual: focus and lighting\",\n        \"XR-300 microscope quick start\",\n        \"How microscopes work for kids\"]\nbm25 = BM25Okapi([d.lower().split() for d in docs])     # use a proper tokenizer in production\n\nscores = bm25.get_scores(\"xr-200 manual\".split())\nprint(max(zip(scores, docs)))                            # the XR-200 manual wins",
      },
      pitfalls: [
        "It needs exact word overlap: 'car' will not match 'automobile'.",
        "Tokenisation matters: codes like 'XR-200' must not be split into meaningless pieces.",
        "BM25 scores are not comparable to vector similarities; combine the two by rank, not by raw score.",
      ],
      docsUrl: "https://en.wikipedia.org/wiki/Okapi_BM25",
    },
    demo: "Bm25Demo",
    related: ["rag-09", "rag-01"],
    projects: ["build-rag"],
    keywords: ["bm25", "keyword search", "full-text search", "exact match", "tf-idf", "lexical"],
  },
  {
    id: "rag-09",
    area: "rag",
    number: 9,
    slug: "hybrid-search",
    name: "Hybrid Search",
    tier: "base",
    official:
      "Merge keyword and vector results (for example with reciprocal rank fusion) to find more of the right chunks.",
    kid: "Two librarians help you: one knows every exact word, the other understands meaning. You take the books that both of them put near the top of their lists.",
    realWorld: {
      title: "Two librarians, one pile",
      text: "Ms Words knows the card catalogue by heart and is unbeatable on exact titles and codes. Mr Meaning knows the idea map and finds books even when the pupil uses different words. For every question both write a ranked list, and the books near the top of both lists go to the front of the final pile. Neither librarian alone is as good as the two together.",
    },
    engineering: {
      text: "Hybrid search runs keyword (BM25) and vector retrieval in parallel and merges the results. Reciprocal Rank Fusion is the usual merge: each document scores the sum over lists of 1 / (k + rank), with k around 60, which needs no score calibration. Alternatives are weighted fusion of normalised scores, or a reranker over the union. Hybrid search usually improves recall over either method alone, especially for queries that mix concepts with exact terms.",
      code: {
        lang: "python",
        source:
          "def rrf(rankings: list[list[str]], k: int = 60) -> list[tuple[str, float]]:\n    scores: dict[str, float] = {}\n    for ranking in rankings:                         # e.g. [bm25_ids, vector_ids]\n        for rank, doc_id in enumerate(ranking, start=1):\n            scores[doc_id] = scores.get(doc_id, 0.0) + 1.0 / (k + rank)\n    return sorted(scores.items(), key=lambda item: item[1], reverse=True)\n\nkeyword = [\"d7\", \"d2\", \"d9\", \"d4\"]\nvector  = [\"d2\", \"d5\", \"d7\", \"d1\"]\nprint(rrf([keyword, vector])[:2])   # d2 then d7: both lists liked them",
      },
      pitfalls: [
        "Adding raw BM25 and cosine scores is meaningless because their scales differ; fuse by rank or normalise first.",
        "Retrieve more candidates from each method (for example 20-50) than you finally need.",
        "Measure it: on some data one method dominates and the other mostly adds noise.",
      ],
      docsUrl: "https://www.anthropic.com/news/contextual-retrieval",
    },
    demo: "HybridSearchDemo",
    related: ["rag-08", "rag-10", "rag-01"],
    projects: ["build-rag"],
    keywords: ["hybrid search", "rrf", "reciprocal rank fusion", "bm25", "vector search", "fusion"],
  },
  {
    id: "rag-10",
    area: "rag",
    number: 10,
    slug: "reranking",
    name: "Reranking",
    tier: "base",
    official:
      "A second model re-scores the top results so the best chunks go into the prompt.",
    kid: "First you quickly grab twenty books that might help. Then a careful helper reads each one next to your question and puts the best three on top.",
    realWorld: {
      title: "The careful second look",
      text: "The librarian's quick search brings back twenty possible cards in a second, but only roughly in the right order. Her assistant then reads each card side by side with the pupil's exact question and gives it a mark out of ten. Only the three best-marked cards go to the pupil. The assistant is slow per card, which is why she checks twenty cards, not the whole library.",
    },
    engineering: {
      text: "A reranker is usually a cross-encoder that reads the query and one candidate passage together and outputs a relevance score, which is far more accurate than comparing two independently computed embeddings. The usual pattern: retrieve 20-100 candidates with fast hybrid search, rerank them, and keep the top 3-10 for the prompt. Options include open cross-encoders and hosted rerank APIs. It adds latency that grows with the number of candidates.",
      code: {
        lang: "python",
        source:
          "from sentence_transformers import CrossEncoder\n\nreranker = CrossEncoder(\"cross-encoder/ms-marco-MiniLM-L-6-v2\")\nquestion = \"How long do elephants live?\"\ncandidates = hybrid_search(question, limit=30)             # fast, rough order\n\nscores = reranker.predict([(question, c.text) for c in candidates])\nranked = sorted(zip(scores, candidates), key=lambda pair: pair[0], reverse=True)\ncontext = [c for _, c in ranked[:5]]                       # only the best go to the LLM",
      },
      pitfalls: [
        "Reranking cannot recover documents the first stage never retrieved; recall comes first.",
        "Cost and latency grow with the number of candidates; 20-50 is a common sweet spot.",
        "Check the reranker's maximum input length; long chunks are silently truncated.",
      ],
      docsUrl: "https://sbert.net/docs/cross_encoder/usage/usage.html",
    },
    demo: "RerankDemo",
    related: ["rag-09", "rag-19", "rag-20"],
    projects: ["build-rag"],
    keywords: ["reranking", "cross-encoder", "rerank", "relevance", "second stage", "top-k"],
  },
  {
    id: "rag-11",
    area: "rag",
    number: 11,
    slug: "query-rewriting",
    name: "Query Rewriting",
    tier: "production",
    official:
      "Let the LLM rephrase or expand the user's question before you search.",
    kid: "When a friend asks 'what about the other one?', you first work out what they really mean. The computer rewrites unclear questions into clear ones before it goes looking.",
    realWorld: {
      title: "What do you mean by 'it'?",
      text: "A pupil who has been chatting about the Titanic asks: 'how many survived it?' Looking up 'survived it' finds nothing useful. The librarian quietly turns the question into 'How many passengers survived the sinking of the Titanic in 1912?' and searches with that. For broad questions she sometimes writes three versions and searches all of them.",
    },
    engineering: {
      text: "Query rewriting uses an LLM (or rules) to turn the raw user input into better search queries before retrieval: resolving pronouns from the conversation, fixing spelling, expanding abbreviations, splitting multi-part questions, or generating several paraphrases (multi-query) and merging their results. It is cheap with a small model and often gives large gains in conversational RAG, where follow-up questions are rarely self-contained.",
      code: {
        lang: "python",
        source:
          "REWRITE = \"\"\"Rewrite the user's last message as standalone search queries.\nResolve pronouns using the chat history. Return 1 to 3 queries, one per line.\"\"\"\n\ndef search_queries(history: list[str], message: str) -> list[str]:\n    prompt = f\"{REWRITE}\\n\\nHistory:\\n\" + \"\\n\".join(history[-6:]) + f\"\\n\\nMessage: {message}\"\n    return [q.strip() for q in small_llm(prompt).splitlines() if q.strip()]\n\nqueries = search_queries([\"Tell me about the Titanic.\"], \"how many survived it?\")\n# ['How many passengers survived the sinking of the Titanic in 1912?']\nresults = rrf([vector_search(q) for q in queries])",
      },
      pitfalls: [
        "A rewrite can change the meaning; log both versions and evaluate them.",
        "It adds an LLM call to every request; use a small, fast model.",
        "Keep the original query as well, especially for exact terms the rewriter might paraphrase away.",
      ],
      docsUrl: "https://python.langchain.com/docs/how_to/MultiQueryRetriever/",
    },
    demo: "QueryRewriteDemo",
    related: ["rag-12", "rag-18"],
    projects: ["build-rag"],
    keywords: ["query rewriting", "multi-query", "standalone question", "conversation", "reformulate"],
  },
  {
    id: "rag-12",
    area: "rag",
    number: 12,
    slug: "hyde",
    name: "HyDE",
    tier: "production",
    official:
      "Have the LLM write a hypothetical answer, embed that answer, and search with it.",
    kid: "To find a lost toy, it helps to picture what it looks like first. HyDE asks the computer to imagine an answer, then looks for real pages that look like that imagined answer.",
    realWorld: {
      title: "Imagine the answer, then find its twin",
      text: "A pupil asks 'why is the sky blue?'. A short question and a long textbook page look very different, so they sit far apart on the idea map. The librarian quickly writes a pretend answer paragraph, 'sunlight scatters off the tiny bits of air...', which looks just like a textbook page. She searches with her paragraph and lands right next to the real pages. Her pretend answer is never shown to the pupil.",
    },
    engineering: {
      text: "HyDE (Hypothetical Document Embeddings) has an LLM write a hypothetical answer to the query, embeds that answer instead of the query, and searches with it. Because the generated text resembles the target documents in style and vocabulary, it often lands closer to relevant passages than a short question does. It helps most for short or vague queries and new domains, costs one extra generation per query, and can mislead retrieval when the model's guess is confidently wrong. The hypothetical text is only used for searching, never as the answer.",
      code: {
        lang: "python",
        source:
          "def hyde_search(question: str, k: int = 5):\n    pretend = small_llm(f\"Write a short paragraph that answers: {question}\")\n    # e.g. \"Sunlight scatters off the tiny gas molecules in the air. Blue light...\"\n    return vector_search(embed(pretend), limit=k)   # search with the answer, not the question\n\ndocs = hyde_search(\"why is the sky blue?\")\nanswer = llm(question=\"why is the sky blue?\", context=docs)  # the real answer uses real docs",
      },
      pitfalls: [
        "If the model's guess is wrong, the search goes looking for the wrong thing.",
        "It adds the time of a full generation before retrieval even starts.",
        "Combine it with the original query or hybrid search rather than replacing them.",
      ],
      docsUrl: "https://arxiv.org/abs/2212.10496",
    },
    demo: "HydeDemo",
    related: ["rag-11", "rag-01"],
    projects: ["build-rag"],
    keywords: ["hyde", "hypothetical document", "generated answer", "query expansion", "zero-shot"],
  },
  {
    id: "rag-13",
    area: "rag",
    number: 13,
    slug: "contextual-retrieval",
    name: "Contextual Retrieval",
    tier: "production",
    official:
      "Use an LLM to add a short note to each chunk saying where it sits in the document, then index it.",
    kid: "A page that only says 'it grew by 3%' makes no sense on its own. So before filing each page, we write a tiny note on top saying which book and which chapter it came from.",
    realWorld: {
      title: "Labelling every card before filing it",
      text: "The card 'Sales grew 3% compared to last quarter' is useless on its own: whose sales, which quarter? Before filing, the librarian reads the whole report and writes one line at the top of each card: 'From the ACME Corp report for Q2 2023, about revenue.' Now a pupil asking about ACME's second-quarter results finds the card straight away.",
    },
    engineering: {
      text: "Contextual retrieval, described by Anthropic in 2024, uses an LLM to prepend a short chunk-specific context (typically 50-100 tokens that situate the chunk within the whole document) before embedding and BM25-indexing the chunk. This repairs chunks that lose their meaning when cut out of the document. Anthropic reported large reductions in failed retrievals, improved further by adding reranking. Prompt caching of the full document keeps the per-chunk LLM calls affordable.",
      code: {
        lang: "python",
        source:
          "CONTEXT_PROMPT = \"\"\"<document>{doc}</document>\nHere is a chunk from that document:\n<chunk>{chunk}</chunk>\nWrite 1-2 sentences that situate this chunk within the document, to improve search.\nAnswer only with those sentences.\"\"\"\n\nfor chunk in chunks:\n    context = small_llm(CONTEXT_PROMPT.format(doc=full_doc, chunk=chunk.text))  # cache full_doc\n    enriched = f\"{context}\\n\\n{chunk.text}\"\n    store(chunk.id, embedding=embed(enriched), bm25_text=enriched, text=chunk.text)",
      },
      pitfalls: [
        "One LLM call per chunk: without prompt caching of the document this gets expensive.",
        "Re-run it when documents change, not only when you add new ones.",
        "Keep the original chunk text for display; the added context is only for search.",
      ],
      docsUrl: "https://www.anthropic.com/news/contextual-retrieval",
    },
    demo: "ContextualRetrievalDemo",
    related: ["rag-03", "llm-12", "rag-09"],
    projects: ["build-rag"],
    keywords: ["contextual retrieval", "chunk context", "anthropic", "situate", "enrich chunks"],
  },
  {
    id: "rag-14",
    area: "rag",
    number: 14,
    slug: "parent-child-chunking",
    name: "Parent-Child Chunking",
    tier: "production",
    official:
      "Search small chunks for precision, then send their bigger parent section for context.",
    kid: "You find the exact sentence you need in a book, then read the whole page around it to understand it. Small pieces help us find things; bigger pieces help us understand them.",
    realWorld: {
      title: "Find the sentence, hand over the page",
      text: "Small cards are easy to match: the card 'Elephants can live 60 to 70 years' fits the question about elephant lifespans perfectly. But that one sentence lacks the details around it, such as wild versus zoo. So each small card carries a note saying which full page it came from, and the librarian hands the pupil the whole page instead of the single sentence.",
    },
    engineering: {
      text: "Parent-child (small-to-big) retrieval indexes small child chunks for precise matching but returns their larger parent (a section or page) to the LLM. Each child stores its parent id; after retrieval you de-duplicate the parents and send them as context. This separates the best unit for matching from the best unit for answering. Variants include sentence-window retrieval (return the neighbouring sentences) and auto-merging (return the parent when several of its children match).",
      code: {
        lang: "python",
        source:
          "# Indexing: small children point to their big parent\nfor section in split_by_heading(doc):\n    store_parent(section.id, section.text)                        # ~1,500 tokens\n    for child in split_sentences(section.text, size=200):         # ~200 tokens\n        index_child(text=child, embedding=embed(child), parent_id=section.id)\n\n# Retrieval: match on children, answer with parents\nchildren = vector_search(embed(question), limit=10)\nparent_ids = list(dict.fromkeys(c.parent_id for c in children))   # keep order, de-duplicate\ncontext = [load_parent(pid) for pid in parent_ids[:3]]",
      },
      pitfalls: [
        "Parents can be large: cap how many you send or you blow the context budget.",
        "Several children of one parent can crowd out other relevant sections; de-duplicate.",
        "Keep parent and child ids in sync when documents are re-chunked.",
      ],
      docsUrl: "https://python.langchain.com/docs/how_to/parent_document_retriever/",
    },
    demo: "ParentChildDemo",
    related: ["rag-03", "system-design-19"],
    projects: ["build-rag"],
    keywords: ["parent-child", "small-to-big", "parent document retriever", "sentence window", "context"],
  },
  {
    id: "rag-15",
    area: "rag",
    number: 15,
    slug: "document-parsing",
    name: "Document Parsing",
    tier: "production",
    official:
      "Getting clean text, tables and structure out of PDFs, web pages and scans.",
    kid: "If you read a page with two columns straight across, the sentences get mixed up. Parsing means reading pages, tables and pictures the right way before using them.",
    realWorld: {
      title: "Reading the newspaper the right way",
      text: "The library receives scanned newspapers with two columns, tables of football results and photos with captions. A careless helper reads every line straight across both columns, so stories get mixed and tables turn into a jumble of numbers. A careful helper follows each column down, keeps tables as tables and notes which caption belongs to which photo. Only the careful version is worth filing.",
    },
    engineering: {
      text: "Document parsing turns PDFs, HTML, Office files and scans into clean text with structure: reading order, headings, lists, tables and image captions, using OCR where needed. Most RAG quality problems start here. Tools range from fast text extractors (pypdf, PyMuPDF) to layout-aware parsers (Docling, Unstructured, Marker) and vision-model parsing for complex layouts. Convert to Markdown, keep tables intact, keep page numbers for citations, and inspect samples by eye.",
      code: {
        lang: "python",
        source:
          "from docling.document_converter import DocumentConverter\n\nconverter = DocumentConverter()                    # layout-aware: columns, tables, OCR\nresult = converter.convert(\"annual_report.pdf\")\nmarkdown = result.document.export_to_markdown()    # headings and tables kept as Markdown\nprint(markdown[:500])\n\n# Compare with a naive extractor, where columns and tables are often scrambled:\n# from pypdf import PdfReader\n# print(PdfReader(\"annual_report.pdf\").pages[0].extract_text())",
      },
      pitfalls: [
        "Multi-column layouts and tables are where naive extractors fail; check those first.",
        "Scanned PDFs have no text layer; you need OCR or a vision model.",
        "Keep page numbers and section titles as metadata for citations and filtering.",
      ],
      docsUrl: "https://docling-project.github.io/docling/",
    },
    demo: "ParsingDemo",
    related: ["rag-03", "llm-15", "rag-16"],
    projects: ["build-rag"],
    keywords: ["document parsing", "pdf", "ocr", "tables", "layout", "docling", "unstructured"],
  },
  {
    id: "rag-16",
    area: "rag",
    number: 16,
    slug: "citations",
    name: "Citations",
    tier: "production",
    official:
      "Answers point to the exact source chunks, so users can check them.",
    kid: "When you write a school report, you say which book each fact came from. A good answer from the computer does the same, so anyone can check it.",
    realWorld: {
      title: "Bookmarks in every answer",
      text: "When the librarian answers a pupil, she slips a numbered bookmark into each book she used and writes the numbers next to her sentences: 'Elephants can live about 70 years [1] and eat for up to 18 hours a day [2].' The pupil, or the teacher, can open book 1 at the bookmark and check. An answer without bookmarks is just her opinion.",
    },
    engineering: {
      text: "Citations link each claim in a generated answer to the exact source chunks that support it, so users can verify answers and you can detect unsupported claims. Give every chunk a stable id with document, page and position, instruct the model to cite ids inline, check that cited ids exist in the context, and render them as links. Some APIs offer native citation features that return the exact quoted spans. Evaluate citation accuracy, not just whether citations are present.",
      code: {
        lang: "python",
        source:
          "import re\n\ndef build_context(chunks):\n    return \"\\n\".join(\n        f'<source id=\"{i}\" doc=\"{c.doc}\" page=\"{c.page}\">{c.text}</source>'\n        for i, c in enumerate(chunks, start=1))\n\nPROMPT = \"\"\"Answer using only the sources. After each sentence cite source ids like [1] or [2][3].\nIf no source supports a claim, leave the claim out.\"\"\"\n\nanswer = llm(system=PROMPT, user=build_context(chunks) + \"\\n\\nQuestion: \" + question)\ncited = {int(n) for n in re.findall(r\"\\[(\\d+)\\]\", answer)}\nassert cited <= set(range(1, len(chunks) + 1)), \"the model cited a source that does not exist\"",
      },
      pitfalls: [
        "A citation can point to a real source that does not say what the sentence claims; check faithfulness too.",
        "Users need clickable citations, which requires stable chunk ids with page numbers.",
        "Many citations per sentence usually means the model is hedging; ask for the single best source.",
      ],
      docsUrl: "https://docs.claude.com/en/docs/build-with-claude/citations",
    },
    demo: "CitationsDemo",
    related: ["llm-14", "evals-06", "rag-15"],
    projects: ["build-rag"],
    keywords: ["citations", "sources", "references", "grounding", "verify", "attribution"],
  },
  {
    id: "rag-17",
    area: "rag",
    number: 17,
    slug: "graphrag",
    name: "GraphRAG",
    tier: "production",
    official:
      "Build a graph of entities and their relations, and retrieve over it for connect-the-dots questions.",
    kid: "Some questions need you to follow a chain of friends, like your friend's brother's football coach. GraphRAG draws who is connected to who like a map, then follows the lines to answer.",
    realWorld: {
      title: "String between the cards",
      text: "A pupil asks: 'What does the company Ana works for make now?' No single card says that. One card says Ana works at Acme, another says Acme bought Beta, a third says Beta makes solar lamps. The librarian has pinned strings between related cards, so she follows Ana to Acme, Acme to Beta and Beta to solar lamps, and answers using all three cards.",
    },
    engineering: {
      text: "GraphRAG uses an LLM to extract entities and relationships from documents, stores them as a knowledge graph, and retrieves by traversing relationships. Microsoft's GraphRAG also summarises detected communities of entities to answer global questions about a whole corpus. It handles multi-hop 'connect the dots' questions and corpus-wide summaries that chunk similarity misses. The costs are a heavy indexing pipeline, extraction errors and graph maintenance, so use it when questions really are about relationships.",
      code: {
        lang: "python",
        source:
          "# 1. Extract (entity, relation, entity) triples with an LLM\ntriples = extract_triples(chunks)\n# [(\"Ana\", \"works_at\", \"Acme\"), (\"Acme\", \"acquired\", \"Beta\"), (\"Beta\", \"makes\", \"solar lamps\")]\n\n# 2. Store them in a graph database such as Neo4j\nfor subj, rel, obj in triples:\n    graph.run(\"MERGE (a:Entity {name: $s}) MERGE (b:Entity {name: $o}) \"\n              \"MERGE (a)-[:REL {type: $rel}]->(b)\", s=subj, o=obj, rel=rel)\n\n# 3. Answer multi-hop questions by walking the graph\npaths = graph.run(\"MATCH p = (:Entity {name: 'Ana'})-[*1..3]->(x) RETURN p\").data()",
      },
      pitfalls: [
        "Indexing is expensive: one or more LLM calls per chunk to extract entities.",
        "Extraction mistakes and duplicate entities ('Acme' and 'ACME Corp') corrupt the graph; resolve entities.",
        "It is overkill for simple fact lookups; combine it with normal vector retrieval.",
      ],
      docsUrl: "https://microsoft.github.io/graphrag/",
    },
    demo: "GraphRagDemo",
    related: ["rag-18", "agents-07"],
    projects: ["build-rag"],
    keywords: ["graphrag", "knowledge graph", "entities", "relations", "multi-hop", "neo4j"],
  },
  {
    id: "rag-18",
    area: "rag",
    number: 18,
    slug: "agentic-rag",
    name: "Agentic RAG",
    tier: "production",
    official:
      "An agent decides when to search, where, and how many times, instead of one fixed lookup.",
    kid: "A clever helper doesn't look in one book and stop. They decide where to look, read, and look again somewhere else until they really have the answer.",
    realWorld: {
      title: "The librarian who keeps digging",
      text: "A pupil asks: 'Was the author of our class reader born before the first moon landing?' A simple helper does one search and gives up. The digging librarian thinks: first find who wrote the class reader, then look up that author's birth year, then check the moon landing date, then compare. She chooses where to search each time and stops when she is sure.",
    },
    engineering: {
      text: "Agentic RAG gives retrieval to an agent as tools (vector search, keyword search, SQL, web search, document fetch) and lets the model decide whether to search, which tool and query to use, and when the evidence is sufficient, looping until done. It handles multi-hop, ambiguous and comparison questions that one fixed retrieval misses. The costs are more LLM calls, higher latency and less predictable behaviour, so add step limits, tracing and evals on the whole trajectory.",
      code: {
        lang: "python",
        source:
          "tools = [{\n    \"name\": \"search_docs\",\n    \"description\": \"Hybrid search over the library documents\",\n    \"input_schema\": {\"type\": \"object\", \"properties\": {\"query\": {\"type\": \"string\"}},\n                     \"required\": [\"query\"]},\n}]\n\nmessages = [{\"role\": \"user\", \"content\": question}]\nfor step in range(6):                                  # stop condition: at most 6 steps\n    reply = llm(messages=messages, tools=tools)\n    if reply.stop_reason != \"tool_use\":\n        break                                          # the agent decided it knows enough\n    call = next(b for b in reply.content if b.type == \"tool_use\")\n    found = hybrid_search(call.input[\"query\"])\n    messages += [{\"role\": \"assistant\", \"content\": reply.content},\n                 {\"role\": \"user\", \"content\": [{\"type\": \"tool_result\",\n                  \"tool_use_id\": call.id, \"content\": format_chunks(found)}]}]",
      },
      pitfalls: [
        "Without a step limit an agent can search in circles; cap the steps and the tokens.",
        "It is harder to evaluate: judge the whole sequence of searches, not only the final answer.",
        "Slower and more expensive than a single retrieval; route only hard questions to it.",
      ],
      docsUrl: "https://www.anthropic.com/engineering/building-effective-agents",
    },
    demo: "AgenticRagDemo",
    related: ["agents-02", "rag-11", "agents-01"],
    projects: ["build-rag"],
    keywords: ["agentic rag", "agent", "tools", "multi-hop", "iterative retrieval", "search loop"],
  },
  {
    id: "rag-19",
    area: "rag",
    number: 19,
    slug: "recall-at-k",
    name: "Recall@k",
    tier: "production",
    official:
      "Out of all the relevant chunks, how many showed up in the top k results.",
    kid: "If five good books exist and your top ten pile has four of them, you found four out of five. Recall at k counts how many of the good books made it into your top pile.",
    realWorld: {
      title: "How many of the right books did she bring?",
      text: "For a test question, the teacher knows the five library books that contain the answer. The librarian brings back her top ten. If four of the five right books are in her pile, her recall at ten is four out of five, 80%. Bringing back more books raises recall but makes the pile harder to read, which is why recall is always measured at a chosen k.",
    },
    engineering: {
      text: "Recall@k is the fraction of all relevant chunks for a query that appear in the top k results, averaged over a test set of queries with labelled relevant chunks. It measures whether retrieval finds the evidence at all, which caps answer quality: the LLM cannot use what was never retrieved. Match k to how many chunks you send to the LLM, track it on every change to chunking, embeddings or search settings, and pair it with a ranking metric such as MRR or nDCG.",
      code: {
        lang: "python",
        source:
          "def recall_at_k(retrieved: list[str], relevant: set[str], k: int) -> float:\n    return len(set(retrieved[:k]) & relevant) / len(relevant)\n\ntest_set = [  # question -> ids of the chunks that really contain the answer\n    {\"q\": \"How long do elephants live?\", \"relevant\": {\"c12\", \"c40\"}},\n    {\"q\": \"What do pandas eat?\", \"relevant\": {\"c7\"}},\n]\nscores = [recall_at_k(search(t[\"q\"], limit=5), t[\"relevant\"], k=5) for t in test_set]\nprint(f\"Recall@5 = {sum(scores) / len(scores):.2f}\")   # the roadmap asks for this on 30 questions",
      },
      pitfalls: [
        "It needs labelled relevant chunks per question; build a small golden set of 30 or more questions by hand.",
        "Recall ignores order: a hit at rank 5 counts the same as a hit at rank 1.",
        "Re-chunking changes chunk ids; label relevance at document or passage level, or relabel.",
      ],
      docsUrl: "https://en.wikipedia.org/wiki/Precision_and_recall",
    },
    demo: "RecallDemo",
    related: ["rag-20", "evals-08", "evals-01"],
    projects: ["build-rag"],
    keywords: ["recall@k", "recall", "retrieval evaluation", "top k", "metrics", "golden set"],
  },
  {
    id: "rag-20",
    area: "rag",
    number: 20,
    slug: "mrr-and-ndcg",
    name: "MRR and nDCG",
    tier: "production",
    official:
      "Ranking metrics that reward putting the right chunk near the top of the list.",
    kid: "Finding the right book is good, but finding it on top of the pile is even better. These scores give more points when the right books are near the top.",
    realWorld: {
      title: "Points for putting it on top",
      text: "The teacher marks the librarian's pile. With MRR she only looks at where the first right book is: on top earns a full point, second place half a point, third place a third. With nDCG she gives points for every right book, more for very helpful ones, and fewer the lower they sit. A pile with the best book buried at the bottom scores badly, even though the book is in there.",
    },
    engineering: {
      text: "MRR (Mean Reciprocal Rank) averages 1 / rank of the first relevant result across queries and suits tasks where one good hit is enough. nDCG@k (normalised Discounted Cumulative Gain) sums graded relevance discounted by log2(rank + 1) and divides by the score of the ideal ordering, so it rewards putting the most relevant results first and supports several relevance levels. Use them with Recall@k to tune rerankers and fusion, where order matters because only the top few chunks reach the LLM.",
      code: {
        lang: "python",
        source:
          "import math\n\ndef mrr(runs: list[list[bool]]) -> float:\n    def reciprocal_rank(hits):\n        return next((1 / (i + 1) for i, hit in enumerate(hits) if hit), 0.0)\n    return sum(reciprocal_rank(h) for h in runs) / len(runs)\n\ndef ndcg_at_k(gains: list[float], k: int) -> float:\n    dcg = sum(g / math.log2(i + 2) for i, g in enumerate(gains[:k]))\n    ideal = sorted(gains, reverse=True)\n    idcg = sum(g / math.log2(i + 2) for i, g in enumerate(ideal[:k]))\n    return dcg / idcg if idcg else 0.0\n\nprint(mrr([[False, True, False], [True, False]]))   # (1/2 + 1) / 2 = 0.75\nprint(round(ndcg_at_k([0, 3, 1, 0, 2], k=5), 2))    # 0.66: the best result sits at rank 2",
      },
      pitfalls: [
        "MRR ignores everything after the first hit; use nDCG when several results matter.",
        "nDCG needs graded relevance labels, which take more effort to create.",
        "Always report the k you used: nDCG@5 and nDCG@10 are different numbers.",
      ],
      docsUrl: "https://en.wikipedia.org/wiki/Discounted_cumulative_gain",
    },
    demo: "RankMetricsDemo",
    related: ["rag-19", "rag-10", "evals-01"],
    projects: ["build-rag"],
    keywords: ["mrr", "ndcg", "ranking metrics", "reciprocal rank", "discounted cumulative gain", "evaluation"],
  },
];

export default concepts;

import type { DemoLoaders } from "../types";

/** Demos for the rag area. Keys must match `demo` in src/content/concepts/rag.ts. */
export const loaders: DemoLoaders = {
  EmbeddingMapDemo: () => import("./EmbeddingMapDemo"),
  CosineDemo: () => import("./CosineDemo"),
  ChunkingDemo: () => import("./ChunkingDemo"),
  VectorDbDemo: () => import("./VectorDbDemo"),
  PgvectorDemo: () => import("./PgvectorDemo"),
  HnswDemo: () => import("./HnswDemo"),
  MetadataFilterDemo: () => import("./MetadataFilterDemo"),
  Bm25Demo: () => import("./Bm25Demo"),
  HybridSearchDemo: () => import("./HybridSearchDemo"),
  RerankDemo: () => import("./RerankDemo"),
  QueryRewriteDemo: () => import("./QueryRewriteDemo"),
  HydeDemo: () => import("./HydeDemo"),
  ContextualRetrievalDemo: () => import("./ContextualRetrievalDemo"),
  ParentChildDemo: () => import("./ParentChildDemo"),
  ParsingDemo: () => import("./ParsingDemo"),
  CitationsDemo: () => import("./CitationsDemo"),
  GraphRagDemo: () => import("./GraphRagDemo"),
  AgenticRagDemo: () => import("./AgenticRagDemo"),
  RecallDemo: () => import("./RecallDemo"),
  RankMetricsDemo: () => import("./RankMetricsDemo"),
};

import type { DemoLoaders } from "../types";

/** Demos for the backend area. Keys must match `demo` in src/content/concepts/backend.ts. */
export const loaders: DemoLoaders = {
  RestDemo: () => import("./RestDemo"),
  StatusCodesDemo: () => import("./StatusCodesDemo"),
  AsyncDemo: () => import("./AsyncDemo"),
  SseDemo: () => import("./SseDemo"),
  WebSocketDemo: () => import("./WebSocketDemo"),
  JwtDemo: () => import("./JwtDemo"),
  OAuthDemo: () => import("./OAuthDemo"),
  SqlNosqlDemo: () => import("./SqlNosqlDemo"),
  IndexDemo: () => import("./IndexDemo"),
  TransactionDemo: () => import("./TransactionDemo"),
  CacheDemo: () => import("./CacheDemo"),
  QueueDemo: () => import("./QueueDemo"),
  BackgroundJobsDemo: () => import("./BackgroundJobsDemo"),
  RateLimitDemo: () => import("./RateLimitDemo"),
  IdempotencyDemo: () => import("./IdempotencyDemo"),
  RetryDemo: () => import("./RetryDemo"),
  UploadDemo: () => import("./UploadDemo"),
  PaginationDemo: () => import("./PaginationDemo"),
  ValidationDemo: () => import("./ValidationDemo"),
  LoggingDemo: () => import("./LoggingDemo"),
};

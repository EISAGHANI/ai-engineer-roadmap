import type { DemoLoaders } from "../types";

/** Demos for the security area. Keys must match `demo` in src/content/concepts/security.ts. */
export const loaders: DemoLoaders = {
  PromptInjectionDemo: () => import("./PromptInjectionDemo"),
  IndirectInjectionDemo: () => import("./IndirectInjectionDemo"),
  JailbreakDemo: () => import("./JailbreakDemo"),
  OwaspDemo: () => import("./OwaspDemo"),
  InputGuardrailsDemo: () => import("./InputGuardrailsDemo"),
  OutputValidationDemo: () => import("./OutputValidationDemo"),
  PiiRedactionDemo: () => import("./PiiRedactionDemo"),
  DataLeakageDemo: () => import("./DataLeakageDemo"),
  LeastPrivilegeDemo: () => import("./LeastPrivilegeDemo"),
  SandboxDemo: () => import("./SandboxDemo"),
  SecretsDemo: () => import("./SecretsDemo"),
  KeyRotationDemo: () => import("./KeyRotationDemo"),
  AgentAuthzDemo: () => import("./AgentAuthzDemo"),
  HumanApprovalDemo: () => import("./HumanApprovalDemo"),
  ModerationDemo: () => import("./ModerationDemo"),
  PoisoningDemo: () => import("./PoisoningDemo"),
  RagAccessDemo: () => import("./RagAccessDemo"),
  McpTrustDemo: () => import("./McpTrustDemo"),
  AuditLogDemo: () => import("./AuditLogDemo"),
  RedTeamDemo: () => import("./RedTeamDemo"),
};

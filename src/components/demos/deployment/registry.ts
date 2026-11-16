import type { DemoLoaders } from "../types";

/** Demos for the deployment area. Keys must match `demo` in src/content/concepts/deployment.ts. */
export const loaders: DemoLoaders = {
  DockerDemo: () => import("./DockerDemo"),
  ComposeDemo: () => import("./ComposeDemo"),
  KubernetesDemo: () => import("./KubernetesDemo"),
  CicdDemo: () => import("./CicdDemo"),
  GithubActionsDemo: () => import("./GithubActionsDemo"),
  EvalGateDemo: () => import("./EvalGateDemo"),
  EnvConfigDemo: () => import("./EnvConfigDemo"),
  IacDemo: () => import("./IacDemo"),
  ServerlessDemo: () => import("./ServerlessDemo"),
  GpuDemo: () => import("./GpuDemo"),
  OllamaDemo: () => import("./OllamaDemo"),
  AutoscalingDemo: () => import("./AutoscalingDemo"),
  LoadBalancingDemo: () => import("./LoadBalancingDemo"),
  CanaryDemo: () => import("./CanaryDemo"),
  FeatureFlagsDemo: () => import("./FeatureFlagsDemo"),
  PromptVersioningDemo: () => import("./PromptVersioningDemo"),
  ModelVersioningDemo: () => import("./ModelVersioningDemo"),
  HealthCheckDemo: () => import("./HealthCheckDemo"),
  AlertsDemo: () => import("./AlertsDemo"),
  RollbackDemo: () => import("./RollbackDemo"),
};

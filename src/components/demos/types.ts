import type { ComponentType } from "react";

export type DemoLoader = () => Promise<{ default: ComponentType }>;
export type DemoLoaders = Record<string, DemoLoader>;

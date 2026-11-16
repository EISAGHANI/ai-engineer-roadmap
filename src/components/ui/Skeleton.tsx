import { cn } from "@/lib/utils";

export function Skeleton({ className, color }: { className?: string; color?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded-lg", className)}
      style={{
        backgroundColor: color ? `color-mix(in srgb, ${color} 12%, transparent)` : "var(--surface-2)",
      }}
      aria-hidden="true"
    />
  );
}

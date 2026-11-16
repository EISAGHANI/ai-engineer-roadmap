import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** CSS colour (usually an area variable) used for the tint */
  color?: string;
  mono?: boolean;
}

export function Badge({ className, color, mono, style, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        mono && "font-mono tracking-wide",
        className,
      )}
      style={
        color
          ? { borderColor: color, color, backgroundColor: "color-mix(in srgb, " + color + " 12%, transparent)", ...style }
          : { borderColor: "var(--border)", color: "var(--muted)", ...style }
      }
      {...props}
    />
  );
}

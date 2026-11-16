"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { transitions, useMotionSafe } from "@/lib/motion";

interface CheckboxProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  color?: string;
  className?: string;
  size?: "sm" | "md";
}

/** The "I used it in code" checkbox. The only element on the site allowed a spring. */
export function Checkbox({ checked, onChange, label, color = "var(--accent)", className, size = "md" }: CheckboxProps) {
  const motionSafe = useMotionSafe();
  const dim = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md border-2 transition-colors",
        dim,
        className,
      )}
      style={{ borderColor: checked ? color : "var(--border)", backgroundColor: checked ? color : "transparent" }}
    >
      {checked && (
        <motion.span
          initial={motionSafe ? { scale: 0.4, opacity: 0 } : false}
          animate={{ scale: 1, opacity: 1 }}
          transition={motionSafe ? transitions.spring : { duration: 0 }}
          className="text-accent-ink"
        >
          <Check className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} strokeWidth={3} aria-hidden="true" />
        </motion.span>
      )}
    </button>
  );
}

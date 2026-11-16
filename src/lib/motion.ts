"use client";

import { useReducedMotion, type Transition, type Variants } from "motion/react";
import { useSettings } from "./settings";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const transitions = {
  micro: { duration: 0.15, ease: EASE_OUT } satisfies Transition,
  card: { duration: 0.28, ease: EASE_OUT } satisfies Transition,
  page: { duration: 0.4, ease: EASE_OUT } satisfies Transition,
  spring: { type: "spring", stiffness: 400, damping: 20 } satisfies Transition,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: transitions.card },
};

export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transitions.micro },
};

/** Stagger children by 60 ms. Lists longer than ~10 items should render the rest without variants. */
export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

/** How many items in a list get the staggered entrance; the rest appear instantly. */
export const STAGGER_LIMIT = 10;

/** True when either the OS or the in-app toggle asks for less motion. */
export function useMotionSafe() {
  const os = useReducedMotion();
  const reduce = useSettings((s) => s.reduceMotion);
  return !(os || reduce);
}

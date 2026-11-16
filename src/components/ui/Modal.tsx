"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { transitions, useMotionSafe } from "@/lib/motion";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  labelledBy?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/** Accessible modal: focus trap, Esc to close, scroll lock, click on backdrop closes. */
export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const lastActive = React.useRef<Element | null>(null);
  const motionSafe = useMotionSafe();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    lastActive.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? panelRef.current)?.focus();
    }, 10);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      (lastActive.current as HTMLElement | null)?.focus?.();
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transitions.micro}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === "string" ? title : undefined}
            tabIndex={-1}
            className={cn(
              "max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border border-border bg-surface p-6 shadow-2xl outline-none sm:rounded-2xl",
              className,
            )}
            initial={motionSafe ? { opacity: 0, y: 24, scale: 0.98 } : { opacity: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={motionSafe ? { opacity: 0, y: 16, scale: 0.98 } : { opacity: 0 }}
            transition={transitions.card}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="text-xl font-semibold">{title}</div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-2 text-muted hover:bg-surface-2 hover:text-text"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

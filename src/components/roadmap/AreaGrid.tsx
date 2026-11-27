"use client";

import { motion } from "motion/react";
import { useSettings } from "@/lib/settings";
import { stagger } from "@/lib/motion";
import { AreaCard, type AreaCardData } from "./AreaCard";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/client";

interface AreaGridProps {
  learningOrder: AreaCardData[];
  pdfOrder: AreaCardData[];
}

export function AreaGrid({ learningOrder, pdfOrder }: AreaGridProps) {
  const t = useT();
  const order = useSettings((s) => s.areaOrder);
  const setOrder = useSettings((s) => s.setAreaOrder);
  const list = order === "learning" ? learningOrder : pdfOrder;

  return (
    <section aria-labelledby="areas-heading">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="areas-heading" className="text-2xl font-semibold">
          {t.areaGrid.title}
        </h2>
        <div role="group" aria-label={t.areaGrid.orderAria} className="flex rounded-full bg-surface-2 p-1 text-sm">
          {(
            [
              ["learning", t.areaGrid.learning],
              ["pdf", t.areaGrid.pdf],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              aria-pressed={order === key}
              onClick={() => setOrder(key)}
              className={cn(
                "rounded-full px-3 py-1.5",
                order === key ? "bg-surface text-text shadow-sm" : "text-muted hover:text-text",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <motion.div
        key={order}
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {list.map((a, i) => (
          <AreaCard key={a.id} area={a} index={i} />
        ))}
      </motion.div>
    </section>
  );
}

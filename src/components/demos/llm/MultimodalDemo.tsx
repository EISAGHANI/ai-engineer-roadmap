"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { Switch } from "@/components/ui/Switch";
import { cn } from "@/lib/utils";

const ITEMS = [
  { name: "Apples", price: 2.4, fruit: true },
  { name: "Bread", price: 3.2, fruit: false },
  { name: "Bananas", price: 1.8, fruit: true },
  { name: "Milk", price: 1.1, fruit: false },
];
const QUESTION_TOKENS = 15;
/** Illustrative token counts for the same receipt photo at two sizes. */
const IMAGE_TOKENS = { small: 400, large: 1_600 } as const;

export default function MultimodalDemo() {
  const [attached, setAttached] = React.useState(false);
  const [size, setSize] = React.useState<keyof typeof IMAGE_TOKENS>("small");
  const tokens = QUESTION_TOKENS + (attached ? IMAGE_TOKENS[size] : 0);
  const fruitTotal = ITEMS.filter((i) => i.fruit).reduce((a, i) => a + i.price, 0);

  return (
    <DemoFrame
      title="Show it, don't type it"
      hint="Ask about a receipt with and without the photo attached."
      onReset={() => {
        setAttached(false);
        setSize("small");
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <Switch checked={attached} onChange={setAttached} label="Attach receipt photo" />
        {attached && (
          <div role="radiogroup" aria-label="Image size" className="flex rounded-full bg-surface p-1 text-xs">
            {(["small", "large"] as const).map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                onClick={() => setSize(s)}
                className={cn("rounded-full px-3 py-1", size === s ? "bg-accent text-accent-ink" : "text-muted")}
              >
                {s === "small" ? "Resized" : "Full size"}
              </button>
            ))}
          </div>
        )}
        <span className="ml-auto font-mono text-xs text-muted">{tokens.toLocaleString("en-US")} input tokens</span>
      </div>

      <div className="mt-3 flex gap-3">
        <div
          className={cn(
            "w-32 shrink-0 rotate-[-2deg] rounded-sm bg-white p-2 font-mono text-[10px] text-neutral-800 shadow transition-opacity",
            attached ? "opacity-100" : "opacity-25",
          )}
          aria-hidden={!attached}
        >
          <div className="text-center font-bold">CORNER SHOP</div>
          <div className="my-1 border-t border-dashed border-neutral-400" />
          {ITEMS.map((i) => (
            <div key={i.name} className="flex justify-between">
              <span>{i.name}</span>
              <span>{i.price.toFixed(2)}</span>
            </div>
          ))}
          <div className="my-1 border-t border-dashed border-neutral-400" />
          <div className="flex justify-between font-bold">
            <span>TOTAL</span>
            <span>{ITEMS.reduce((a, i) => a + i.price, 0).toFixed(2)}</span>
          </div>
        </div>
        <div className="flex-1 space-y-2 text-sm">
          <div className="ml-auto w-fit rounded-lg bg-surface px-3 py-2">How much did I spend on fruit?</div>
          <div
            className="rounded-lg px-3 py-2"
            style={{ backgroundColor: "color-mix(in srgb, var(--area-llm) 14%, transparent)" }}
            aria-live="polite"
          >
            {attached
              ? `Apples 2.40 + Bananas 1.80 = ${fruitTotal.toFixed(2)} euros on fruit.`
              : "I can't see your receipt. Could you attach a photo or type the items?"}
          </div>
          {attached && (
            <p className="text-xs text-muted">
              {size === "small"
                ? "Resized is enough here: the text is big and clear, and it costs a quarter of the tokens."
                : "Full size reads the same receipt for 4× the tokens. Only worth it for tiny text."}
            </p>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}

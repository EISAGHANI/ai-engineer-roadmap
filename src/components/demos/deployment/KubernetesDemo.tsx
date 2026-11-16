"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { DemoFrame } from "../DemoFrame";
import { ActionButton } from "../ui";
import { useMotionSafe } from "@/lib/motion";

type Pod = { id: number; status: "running" | "starting" };

export default function KubernetesDemo() {
  const motionSafe = useMotionSafe();
  const [desired, setDesired] = React.useState(3);
  const [pods, setPods] = React.useState<Pod[]>([1, 2, 3].map((id) => ({ id, status: "running" })));
  const [nextId, setNextId] = React.useState(4);
  const [log, setLog] = React.useState("Desired state: 3 pods. Actual: 3. Nothing to do.");

  // The controller loop: compare desired with actual and fix the difference
  React.useEffect(() => {
    const starting = pods.find((p) => p.status === "starting");
    if (pods.length === desired && !starting) return; // actual matches desired: nothing to do
    const t = window.setTimeout(() => {
      if (pods.length < desired) {
        setLog(`Actual ${pods.length} < desired ${desired}: starting a new pod.`);
        setPods([...pods, { id: nextId, status: "starting" }]);
        setNextId(nextId + 1);
      } else if (pods.length > desired) {
        setLog(`Actual ${pods.length} > desired ${desired}: stopping a pod.`);
        setPods(pods.slice(0, -1));
      } else if (starting) {
        setLog(`Pod ${starting.id} passed its readiness probe and now gets traffic.`);
        setPods(pods.map((p): Pod => (p.id === starting.id ? { ...p, status: "running" } : p)));
      }
    }, motionSafe ? 700 : 50);
    return () => window.clearTimeout(t);
  }, [pods, desired, nextId, motionSafe]);

  function killOne() {
    if (!pods.length) return;
    const victim = pods[Math.floor(pods.length / 2)];
    setLog(`Pod ${victim.id} crashed!`);
    setPods(pods.filter((p) => p.id !== victim.id));
  }

  return (
    <DemoFrame
      title="The fleet manager keeps the promise"
      hint="Change the desired number of pods, or crash one, and watch Kubernetes fix it."
      onReset={() => {
        setDesired(3);
        setPods([1, 2, 3].map((id) => ({ id, status: "running" })));
        setNextId(4);
        setLog("Desired state: 3 pods. Actual: 3. Nothing to do.");
      }}
    >
      <div className="flex flex-wrap items-end gap-4">
        <label className="text-xs text-muted">
          replicas (desired): <span className="font-mono text-text">{desired}</span>
          <input type="range" min={1} max={6} value={desired} onChange={(e) => setDesired(+e.target.value)} className="mt-1 block w-40 accent-[var(--accent)]" />
        </label>
        <ActionButton variant="secondary" onClick={killOne}>
          💥 Crash a pod
        </ActionButton>
      </div>
      <div className="mt-3 rounded-lg border border-dashed border-border p-3">
        <div className="mb-2 text-[10px] text-muted uppercase">Service rag-api → routes to running pods only</div>
        <ul className="flex min-h-14 flex-wrap gap-2">
          <AnimatePresence>
            {pods.map((p) => (
              <motion.li
                key={p.id}
                layout={motionSafe}
                initial={motionSafe ? { scale: 0.5, opacity: 0 } : false}
                animate={{ scale: 1, opacity: 1 }}
                exit={motionSafe ? { scale: 0.3, opacity: 0 } : { opacity: 0 }}
                className="rounded-md px-3 py-2 text-center font-mono text-[11px]"
                style={{
                  backgroundColor: p.status === "running" ? "color-mix(in srgb, var(--good) 22%, transparent)" : "color-mix(in srgb, var(--warn) 22%, transparent)",
                }}
              >
                pod-{p.id}
                <span className="block text-[9px] text-muted">{p.status}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <p className="mt-2 text-xs" aria-live="polite">
        {log}
      </p>
    </DemoFrame>
  );
}

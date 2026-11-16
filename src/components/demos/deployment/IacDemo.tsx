"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";
import { Switch } from "@/components/ui/Switch";

type Size = "db.m7g.large" | "db.m7g.xlarge";

export default function IacDemo() {
  const [size, setSize] = React.useState<Size>("db.m7g.large");
  const [rename, setRename] = React.useState(false);
  const [replica, setReplica] = React.useState(false);

  const changes: Array<{ sym: string; color: string; text: string }> = [];
  if (rename) {
    changes.push({ sym: "-/+", color: "var(--bad)", text: 'aws_db_instance.rag must be replaced: identifier "rag-production" → "rag-prod" forces replacement' });
  } else if (size !== "db.m7g.large") {
    changes.push({ sym: "~", color: "var(--warn)", text: `aws_db_instance.rag updated in place: instance_class "db.m7g.large" → "${size}"` });
  }
  if (replica) changes.push({ sym: "+", color: "var(--good)", text: "aws_db_instance.rag_replica will be created (read replica)" });

  const add = changes.filter((c) => c.sym === "+").length + (rename ? 1 : 0);
  const change = changes.filter((c) => c.sym === "~").length;
  const destroy = rename ? 1 : 0;

  return (
    <DemoFrame
      title="Change the blueprint, read the plan"
      hint="Edit the Terraform code, then read terraform plan before applying."
      onReset={() => {
        setSize("db.m7g.large");
        setRename(false);
        setReplica(false);
      }}
    >
      <div className="flex flex-wrap items-center gap-3">
        <ChoiceChips
          label="instance_class"
          options={[
            { id: "db.m7g.large", label: "db.m7g.large (current)" },
            { id: "db.m7g.xlarge", label: "db.m7g.xlarge" },
          ]}
          value={size}
          onChange={setSize}
        />
        <Switch checked={rename} onChange={setRename} label="Rename identifier" />
        <Switch checked={replica} onChange={setReplica} label="Add a read replica" />
      </div>
      <pre className="mt-3 min-h-24 rounded-lg bg-neutral-950 p-2 font-mono text-[10px] leading-relaxed text-neutral-200" aria-live="polite">
        <div className="text-neutral-400">$ terraform plan</div>
        {changes.length === 0 && <div>No changes. Your infrastructure matches the configuration.</div>}
        {changes.map((c) => (
          <div key={c.text}>
            <span style={{ color: c.color }}>{c.sym.padEnd(4)}</span>
            {c.text}
          </div>
        ))}
        {changes.length > 0 && (
          <div className="mt-1">
            Plan: {add} to add, {change} to change, {destroy} to destroy.
          </div>
        )}
      </pre>
      {rename && (
        <p className="mt-2 rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: "color-mix(in srgb, var(--bad) 18%, transparent)" }}>
          ⚠ Renaming looks harmless in the code, but the plan says the production database would be destroyed and recreated. This is why you always read the plan.
        </p>
      )}
    </DemoFrame>
  );
}

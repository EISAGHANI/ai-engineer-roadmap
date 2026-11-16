"use client";

import * as React from "react";
import { GraduationCap } from "lucide-react";
import { DemoFrame } from "../DemoFrame";

/** Correct answers out of 8 after each training round (illustrative). */
const EVERYDAY = [1, 3, 5, 7, 7, 8];
const UNUSUAL = [1, 2, 2, 3, 3, 3];
const TEACHER = { everyday: 8, unusual: 7 };
const MAX_ROUND = EVERYDAY.length - 1;

export default function DistillationDemo() {
  const [round, setRound] = React.useState(0);

  return (
    <DemoFrame title="The owl teaches a young parrot" hint="Train the student round by round on the owl's answers." onReset={() => setRound(0)}>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={round >= MAX_ROUND}
          onClick={() => setRound((r) => Math.min(MAX_ROUND, r + 1))}
          className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-ink disabled:opacity-40"
        >
          <GraduationCap className="h-3.5 w-3.5" aria-hidden="true" /> Train one round
        </button>
        <span className="font-mono text-xs text-muted">
          round {round}/{MAX_ROUND}
        </span>
      </div>

      <table className="mt-3 w-full text-xs">
        <thead>
          <tr className="text-left text-muted">
            <th className="font-normal" />
            <th className="font-normal">Everyday questions</th>
            <th className="font-normal">Unusual questions</th>
            <th className="font-normal">Speed</th>
            <th className="font-normal">Cost</th>
          </tr>
        </thead>
        <tbody>
          <Row name="Owl (teacher, big)" everyday={TEACHER.everyday} unusual={TEACHER.unusual} speed="2.0 s" cost="$$$$$" color="var(--area-agents)" />
          <Row
            name="Parrot (student, small)"
            everyday={EVERYDAY[round]}
            unusual={UNUSUAL[round]}
            speed="0.2 s"
            cost="$"
            color="var(--area-llm)"
          />
        </tbody>
      </table>
      <p className="mt-3 text-xs text-muted" aria-live="polite">
        {round === 0 && "Untrained, the small parrot gets almost everything wrong."}
        {round > 0 && round < MAX_ROUND && "Each round it copies more of the owl's answers on the questions it was trained on."}
        {round === MAX_ROUND &&
          "Now it matches the owl on everyday questions at a tenth of the time and far less cost, but stays weak on questions it never saw."}
      </p>
    </DemoFrame>
  );
}

function Row({
  name,
  everyday,
  unusual,
  speed,
  cost,
  color,
}: {
  name: string;
  everyday: number;
  unusual: number;
  speed: string;
  cost: string;
  color: string;
}) {
  return (
    <tr className="border-t border-border">
      <td className="py-2 pr-2 font-medium">{name}</td>
      <td className="py-2">
        <Dots n={everyday} color={color} />
      </td>
      <td className="py-2">
        <Dots n={unusual} color={color} />
      </td>
      <td className="py-2 font-mono">{speed}</td>
      <td className="py-2 font-mono">{cost}</td>
    </tr>
  );
}

function Dots({ n, color }: { n: number; color: string }) {
  return (
    <span className="flex gap-0.5" aria-label={`${n} of 8 correct`}>
      {Array.from({ length: 8 }, (_, i) => (
        <span
          key={i}
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: i < n ? color : "var(--surface-2)", transition: "background-color 250ms" }}
        />
      ))}
    </span>
  );
}

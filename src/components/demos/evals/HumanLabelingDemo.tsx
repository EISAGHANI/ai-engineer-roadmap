"use client";

import * as React from "react";
import { DemoFrame } from "../DemoFrame";
import { ChoiceChips } from "../ui";

/** 10 answers: the teacher's label (ground truth) and two versions of the LLM judge. */
const ROWS = [
  { answer: "3 weeks, renewable twice online.", human: true, v1: true, v2: true },
  { answer: "You can borrow books.", human: false, v1: true, v2: false },
  { answer: "Closed on Sundays, 9-14 on Saturdays.", human: true, v1: true, v2: true },
  { answer: "Fines exist for late books.", human: false, v1: true, v2: false },
  { answer: "Guide dogs only; other pets stay outside.", human: true, v1: true, v2: true },
  { answer: "Ask at the desk for the Wi-Fi password.", human: true, v1: true, v2: true },
  { answer: "It depends.", human: false, v1: true, v2: false },
  { answer: "Lost cards cost 2 € to replace.", human: true, v1: true, v2: true },
  { answer: "Printing is 10 cents a page, colour 50.", human: true, v1: false, v2: true },
  { answer: "Group rooms can be booked a week ahead.", human: true, v1: true, v2: false },
];
type Judge = "v1" | "v2";

export default function HumanLabelingDemo() {
  const [judge, setJudge] = React.useState<Judge>("v1");
  const agree = ROWS.filter((r) => r[judge] === r.human).length;

  return (
    <DemoFrame title="The teacher marks a sample herself" hint="Compare the LLM judge with human labels before trusting it." onReset={() => setJudge("v1")}>
      <ChoiceChips
        label="Judge"
        options={[
          { id: "v1", label: "Judge v1: 'Is this answer OK?'" },
          { id: "v2", label: "Judge v2: rubric (correct + complete)" },
        ]}
        value={judge}
        onChange={setJudge}
      />
      <table className="mt-3 w-full text-left text-[11px]">
        <thead className="text-muted">
          <tr>
            <th className="font-normal">Answer</th>
            <th className="text-center font-normal">Human</th>
            <th className="text-center font-normal">Judge</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => {
            const mismatch = r[judge] !== r.human;
            return (
              <tr key={r.answer} className="border-t border-border" style={mismatch ? { backgroundColor: "color-mix(in srgb, var(--bad) 14%, transparent)" } : undefined}>
                <td className="py-0.5">{r.answer}</td>
                <td className="py-0.5 text-center">{r.human ? "pass" : "fail"}</td>
                <td className="py-0.5 text-center">{r[judge] ? "pass" : "fail"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-2 text-sm" aria-live="polite">
        Agreement with humans: <span className="font-mono" style={{ color: "var(--accent)" }}>{agree * 10}%</span>{" "}
        <span className="text-xs text-muted">
          {judge === "v1" ? "· v1 passes vague answers. Rewrite the judge prompt where it disagrees." : "· much closer. Read the remaining disagreement and refine again."}
        </span>
      </p>
    </DemoFrame>
  );
}

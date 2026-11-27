"use client";

import * as React from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressRing";
import { cn } from "@/lib/utils";
import type { Quiz } from "@/content/schema";
import { useT } from "@/i18n/client";

interface TopicQuizProps {
  quiz: Quiz;
  color: string;
}

const LETTERS = ["A", "B", "C", "D"];

export function TopicQuiz({ quiz, color }: TopicQuizProps) {
  const t = useT();
  const questionSets = React.useMemo(() => [quiz.questions, ...(quiz.retakes ?? [])], [quiz]);
  const [setIndex, setSetIndex] = React.useState(0);
  const questions = questionSets[setIndex] ?? quiz.questions;
  const [answers, setAnswers] = React.useState<Array<number | null>>(() => questions.map(() => null));
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    setSetIndex(0);
    setAnswers(quiz.questions.map(() => null));
    setSubmitted(false);
  }, [quiz]);

  const answeredCount = answers.filter((a) => a !== null).length;
  const allAnswered = answeredCount === questions.length;
  const score = submitted ? questions.filter((q, i) => answers[i] === q.correctAnswer).length : 0;

  function choose(questionIndex: number, optionIndex: number) {
    if (submitted) return;
    setAnswers((current) => current.map((a, i) => (i === questionIndex ? optionIndex : a)));
  }

  function nextSet() {
    const next = (setIndex + 1) % questionSets.length;
    setSetIndex(next);
    setAnswers(questionSets[next].map(() => null));
    setSubmitted(false);
  }

  const headingId = `quiz-${quiz.conceptId}`;

  return (
    <section className="mt-8 rounded-card border border-border bg-surface-2/60 p-4 sm:p-6" aria-labelledby={headingId}>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 id={headingId} className="font-mono text-xs font-semibold tracking-widest uppercase" style={{ color }}>
            {t.quiz.title}
          </h3>
          <p className="mt-1 text-sm text-muted">
            {t.quiz.intro}
            {questionSets.length > 1 && (
              <span className="ml-2 font-mono text-xs">· {t.quiz.setOf(setIndex + 1, questionSets.length)}</span>
            )}
          </p>
          {t.quiz.languageNote && <p className="mt-1 text-xs text-muted">{t.quiz.languageNote}</p>}
        </div>
        {submitted ? (
          <span
            className="rounded-full px-3 py-1 font-mono text-sm font-semibold"
            style={{ backgroundColor: color, color: "var(--accent-ink)" }}
            role="status"
          >
            {score}/{questions.length}
          </span>
        ) : (
          <div className="flex w-40 items-center gap-2">
            <ProgressBar value={answeredCount / questions.length} color={color} label={t.quiz.answered(answeredCount, questions.length)} />
            <span className="shrink-0 font-mono text-xs text-muted">
              {answeredCount}/{questions.length}
            </span>
          </div>
        )}
      </header>

      <ol className="mt-5 space-y-6" lang="en">
        {questions.map((question, qi) => {
          const selected = answers[qi];
          const name = `quiz-${quiz.conceptId}-${setIndex}-${qi}`;
          const wasRight = submitted && selected === question.correctAnswer;
          return (
            <li key={`${setIndex}-${qi}`}>
              <fieldset>
                <legend className="flex w-full gap-3 text-[15px] leading-snug font-medium">
                  <span
                    className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-xs"
                    style={{ backgroundColor: `color-mix(in srgb, ${color} 18%, transparent)`, color }}
                    aria-hidden="true"
                  >
                    {qi + 1}
                  </span>
                  <span>{question.prompt}</span>
                </legend>

                <div className="mt-3 grid gap-2 pl-9">
                  {question.options.map((option, oi) => {
                    const isSelected = selected === oi;
                    const isCorrect = submitted && oi === question.correctAnswer;
                    const isWrong = submitted && isSelected && oi !== question.correctAnswer;
                    return (
                      <label
                        key={oi}
                        className={cn(
                          "group relative flex items-start gap-3 rounded-lg border px-3 py-2.5 text-sm leading-snug transition-colors",
                          "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent",
                          submitted ? "cursor-default" : "cursor-pointer hover:border-accent/50 hover:bg-surface",
                          isCorrect
                            ? "border-good bg-good/10"
                            : isWrong
                              ? "border-bad bg-bad/10"
                              : isSelected
                                ? "border-accent bg-accent/10"
                                : "border-border bg-surface/60",
                          submitted && !isCorrect && !isWrong && "opacity-60",
                        )}
                      >
                        <input
                          type="radio"
                          name={name}
                          value={oi}
                          checked={isSelected}
                          disabled={submitted}
                          onChange={() => choose(qi, oi)}
                          className="sr-only"
                        />
                        <span
                          className={cn(
                            "grid h-6 w-6 shrink-0 place-items-center rounded-md border font-mono text-xs font-semibold",
                            isCorrect
                              ? "border-good bg-good text-bg"
                              : isWrong
                                ? "border-bad bg-bad text-bg"
                                : isSelected
                                  ? "border-accent bg-accent text-accent-ink"
                                  : "border-border text-muted group-hover:text-text",
                          )}
                          aria-hidden="true"
                        >
                          {isCorrect ? <Check className="h-3.5 w-3.5" /> : isWrong ? <X className="h-3.5 w-3.5" /> : LETTERS[oi]}
                        </span>
                        <span className="flex-1 pt-0.5">{option}</span>
                        {isCorrect && <span className="sr-only">{t.quiz.correct}</span>}
                        {isWrong && <span className="sr-only">{t.quiz.incorrect}</span>}
                      </label>
                    );
                  })}
                </div>

                {submitted && (
                  <p
                    className={cn(
                      "mt-2 ml-9 rounded-lg border-l-2 bg-surface/60 px-3 py-2 text-sm text-muted",
                      wasRight ? "border-good" : "border-bad",
                    )}
                  >
                    {!wasRight && (
                      <strong className="text-text">
                        {t.quiz.correctAnswer} {LETTERS[question.correctAnswer]}.{" "}
                      </strong>
                    )}
                    {question.explanation}
                  </p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>

      <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <p className="text-sm text-muted" role="status">
          {submitted
            ? score === questions.length
              ? t.quiz.perfect
              : t.quiz.keepGoing(score, questions.length)
            : allAnswered
              ? t.quiz.ready
              : t.quiz.answered(answeredCount, questions.length)}
        </p>
        {!submitted ? (
          <Button onClick={() => allAnswered && setSubmitted(true)} disabled={!allAnswered}>
            {t.quiz.submit}
          </Button>
        ) : (
          <Button variant="secondary" onClick={nextSet}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {questionSets.length > 1 ? t.quiz.nextSet : t.quiz.again}
          </Button>
        )}
      </footer>
    </section>
  );
}

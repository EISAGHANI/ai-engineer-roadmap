"use client";

import * as React from "react";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { Quiz } from "@/content/schema";
import { useT } from "@/i18n/client";

interface TopicQuizProps {
  quiz: Quiz;
  color: string;
}

export function TopicQuiz({ quiz, color }: TopicQuizProps) {
  const t = useT();
  const [setIndex, setSetIndex] = React.useState(0);
  const questionSets = [quiz.questions, ...(quiz.retakes ?? [])];
  const questions = questionSets[setIndex] ?? quiz.questions;
  const [answers, setAnswers] = React.useState<Array<number | null>>(
    () => questions.map(() => null),
  );
  const [submitted, setSubmitted] = React.useState(false);

  React.useEffect(() => {
    setSetIndex(0);
    setAnswers(quiz.questions.map(() => null));
    setSubmitted(false);
  }, [quiz]);

  const answered = answers.every((answer) => answer !== null);
  let score = 0;
  if (submitted) {
    for (let index = 0; index < questions.length; index += 1) {
      if (answers[index] === questions[index].correctAnswer) score += 1;
    }
  }

  function submit() {
    if (answered) setSubmitted(true);
  }

  function reset() {
    const nextSetIndex = (setIndex + 1) % questionSets.length;
    const nextQuestions = questionSets[nextSetIndex];
    setSetIndex(nextSetIndex);
    setAnswers(nextQuestions.map(() => null));
    setSubmitted(false);
  }

  return (
    <section className="mt-6 rounded-card border border-border bg-surface-2 p-4 sm:p-5" aria-labelledby={`quiz-${quiz.conceptId}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 id={`quiz-${quiz.conceptId}`} className="font-mono text-sm tracking-wide uppercase" style={{ color }}>
            {t.quiz.title}
          </h3>
          <p className="mt-1 text-sm text-muted">{t.quiz.intro}</p>
          {t.quiz.languageNote && <p className="mt-1 text-xs text-muted">{t.quiz.languageNote}</p>}
        </div>
        {submitted && (
          <span className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-sm">
            {t.quiz.score} <strong>{score}/5</strong>
          </span>
        )}
      </div>

      <div className="mt-4 space-y-5" lang="en">
        {questions.map((question, questionIndex) => {
          const selected = answers[questionIndex];
          return (
            <fieldset key={question.prompt} className="rounded-lg border border-border bg-surface p-3 sm:p-4">
              <legend className="px-1 text-sm font-medium">
                <span className="mr-2 font-mono text-xs text-muted">{questionIndex + 1}.</span>
                {question.prompt}
              </legend>
              <div className="mt-2 grid gap-2">
                {question.options.map((option, optionIndex) => {
                  const isCorrect = submitted && optionIndex === question.correctAnswer;
                  const isWrongSelection =
                    submitted &&
                    selected === optionIndex &&
                    optionIndex !== question.correctAnswer;
                  return (
                    <label
                      key={option}
                      className={[
                        "flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                        isCorrect
                          ? "border-good bg-good/10"
                          : isWrongSelection
                            ? "border-bad bg-bad/10"
                            : selected === optionIndex
                              ? "border-accent/70 bg-surface-2"
                              : "border-border hover:border-accent/50",
                        submitted ? "cursor-default" : "",
                      ].join(" ")}
                    >
                      <input
                        type="radio"
                        name={`quiz-${quiz.conceptId}-set-${setIndex}-${questionIndex}`}
                        value={optionIndex}
                        checked={selected === optionIndex}
                        disabled={submitted}
                        onChange={() =>
                          setAnswers((current) =>
                            current.map((answer, index) =>
                              index === questionIndex ? optionIndex : answer,
                            ),
                          )
                        }
                        className="mt-1 accent-[var(--accent)]"
                      />
                      <span className="flex-1">{option}</span>
                      {isCorrect && <CheckCircle2 className="mt-0.5 h-4 w-4 text-good" aria-label={t.quiz.correct} />}
                      {isWrongSelection && <XCircle className="mt-0.5 h-4 w-4 text-bad" aria-label={t.quiz.incorrect} />}
                    </label>
                  );
                })}
              </div>
              {submitted && (
                <p className="mt-3 text-sm text-muted">
                  <strong className="text-good">{t.quiz.correctAnswer}</strong>{" "}
                  {question.options[question.correctAnswer]}. {question.explanation}
                </p>
              )}
            </fieldset>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {!submitted ? (
          <Button onClick={submit} disabled={!answered}>
            {t.quiz.submit}
          </Button>
        ) : (
          <Button variant="secondary" onClick={reset}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            {t.quiz.again}
          </Button>
        )}
      </div>
    </section>
  );
}

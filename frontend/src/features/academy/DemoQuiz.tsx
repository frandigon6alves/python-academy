"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { CodeSnippet } from "@/components/CodeSnippet";
import { Button, buttonClass } from "@/components/ui/Button";
import { ErrorState, Loading } from "@/components/ui/QueryState";
import { Link } from "@/i18n/navigation";
import { ChoiceOption } from "@/features/quiz/ChoiceOption";
import { optionOutcome } from "@/features/quiz/outcome";
import { useCheckDemoAnswer, useDemoQuiz } from "@/lib/api/hooks/content";
import type { QuestionResult } from "@/lib/api/types";
import styles from "./DemoQuiz.module.css";

/** A five-question "predict the output" game that works without an account. */
export function DemoQuiz() {
  const t = useTranslations("demo");
  const tNav = useTranslations("nav");
  const quiz = useDemoQuiz();
  const check = useCheckDemoAnswer();
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [result, setResult] = useState<QuestionResult | null>(null);
  const [score, setScore] = useState(0);
  const liveRef = useRef<HTMLDivElement>(null);
  const fieldsetRef = useRef<HTMLFieldSetElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const wasGraded = useRef(false);

  // Checking an answer disables the button that had focus, and moving on swaps the
  // question, which would drop keyboard focus on <body>. Keep it on the next step:
  // the "Next" button after grading, then the first answer (or the final score).
  useEffect(() => {
    const graded = result !== null;
    if (graded === wasGraded.current) return;
    wasGraded.current = graded;
    if (graded) nextButtonRef.current?.focus();
    else (fieldsetRef.current?.querySelector("input") ?? liveRef.current)?.focus();
  }, [result]);

  if (quiz.isPending) return <Loading />;
  if (quiz.isError) return <ErrorState error={quiz.error} onRetry={() => quiz.refetch()} />;

  const questions = quiz.data;
  const question = questions[index];
  const isFinished = index >= questions.length;

  function submit() {
    if (!question || choice === null) return;
    check.mutate(
      { questionId: question.id, choice },
      {
        onSuccess: (graded) => {
          setResult(graded);
          if (graded.is_correct) setScore((value) => value + 1);
        },
      },
    );
  }

  function advance() {
    setIndex((value) => value + 1);
    setChoice(null);
    setResult(null);
  }

  function restart() {
    setIndex(0);
    setScore(0);
    setChoice(null);
    setResult(null);
  }

  return (
    <div className={styles.card}>
      <div ref={liveRef} tabIndex={-1} aria-live="polite" className={styles.live}>
        {isFinished && (
          <>
            <p className={styles.score}>{t("score", { score, total: questions.length })}</p>
            <p>{t("nudge")}</p>
          </>
        )}
        {result && (
          <p className={result.is_correct ? styles.correct : styles.incorrect}>
            <span aria-hidden="true">{result.is_correct ? "✓ " : "✕ "}</span>
            {result.is_correct
              ? t("correct")
              : t("incorrect", { answer: question?.options[result.correct_index] ?? "" })}{" "}
            {result.explanation}
          </p>
        )}
      </div>

      {check.isError && <ErrorState error={check.error} />}

      {isFinished ? (
        <div className={styles.actions}>
          <Link href="/signup" className={buttonClass("primary")}>
            {tNav("signup")}
          </Link>
          <Button variant="secondary" onClick={restart}>
            {t("restart")}
          </Button>
        </div>
      ) : (
        question && (
          <fieldset
            ref={fieldsetRef}
            className={styles.question}
            disabled={Boolean(result) || check.isPending}
          >
            <legend>
              <span className={styles.progress}>
                {t("progress", { current: index + 1, total: questions.length })}
              </span>
              {question.prompt}
            </legend>
            {question.code && <CodeSnippet code={question.code} />}
            <div className={styles.options}>
              {question.options.map((option, optionIndex) => (
                <ChoiceOption
                  key={optionIndex}
                  name="demo-choice"
                  checked={choice === optionIndex}
                  onChange={() => setChoice(optionIndex)}
                  outcome={optionOutcome(optionIndex, result)}
                >
                  <code>{option}</code>
                </ChoiceOption>
              ))}
            </div>
          </fieldset>
        )
      )}

      {!isFinished && (
        <div className={styles.actions}>
          {result ? (
            <Button ref={nextButtonRef} onClick={advance}>
              {index + 1 < questions.length ? t("next") : t("finish")}
            </Button>
          ) : (
            <Button onClick={submit} disabled={choice === null || check.isPending}>
              {t("check")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

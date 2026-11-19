"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { CodeSnippet } from "@/components/CodeSnippet";
import { Button } from "@/components/ui/Button";
import type { Answer, Question, QuestionResult } from "@/lib/api/types";
import { ChoiceOption } from "./ChoiceOption";
import { optionOutcome } from "./outcome";
import styles from "./QuizForm.module.css";

interface QuizFormProps {
  questions: Question[];
  /** Grading results from the server, once submitted. */
  results?: QuestionResult[];
  isSubmitting: boolean;
  onSubmit: (answers: Answer[]) => void;
  onRetry: () => void;
  /** Extra content shown in the live region after grading (score, rewards). */
  summary?: React.ReactNode;
}

/** Multiple-choice quiz used by lesson quizzes and course exams. */
export function QuizForm({ questions, results, isSubmitting, onSubmit, onRetry, summary }: QuizFormProps) {
  const t = useTranslations("quiz");
  const [choices, setChoices] = useState<Record<number, number>>({});
  const isGraded = Boolean(results);
  const allAnswered = questions.every((question) => choices[question.id] !== undefined);
  const resultFor = (id: number) => results?.find((result) => result.question_id === id);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!allAnswered) return;
    onSubmit(questions.map((question) => ({ question_id: question.id, choice: choices[question.id]! })));
  }

  function handleRetry() {
    setChoices({});
    onRetry();
  }

  return (
    <form onSubmit={handleSubmit} className={styles.quiz} noValidate>
      {questions.map((question, index) => (
        <QuestionFieldset
          key={question.id}
          number={index + 1}
          question={question}
          choice={choices[question.id]}
          result={resultFor(question.id)}
          disabled={isGraded || isSubmitting}
          onChoose={(choice) => setChoices((current) => ({ ...current, [question.id]: choice }))}
        />
      ))}

      <div aria-live="polite" className={styles.summary}>
        {summary}
      </div>

      {isGraded ? (
        <Button variant="secondary" onClick={handleRetry}>
          {t("retry")}
        </Button>
      ) : (
        <div className={styles.submitRow}>
          <Button type="submit" disabled={!allAnswered || isSubmitting}>
            {isSubmitting ? t("submitting") : t("submit")}
          </Button>
          {!allAnswered && <span className={styles.hint}>{t("answerAll")}</span>}
        </div>
      )}
    </form>
  );
}

interface QuestionFieldsetProps {
  number: number;
  question: Question;
  choice: number | undefined;
  result: QuestionResult | undefined;
  disabled: boolean;
  onChoose: (choice: number) => void;
}

function QuestionFieldset({ number, question, choice, result, disabled, onChoose }: QuestionFieldsetProps) {
  const t = useTranslations("quiz");
  const state = result ? (result.is_correct ? styles.correct : styles.incorrect) : "";
  return (
    <fieldset className={`${styles.question} ${state}`} disabled={disabled}>
      <legend className={styles.legend}>
        <span className={styles.number}>{t("question", { number })}</span>
        {question.prompt}
      </legend>
      {question.code && <CodeSnippet code={question.code} />}
      <div className={styles.options}>
        {question.options.map((option, index) => (
          <ChoiceOption
            key={index}
            name={`question-${question.id}`}
            checked={choice === index}
            onChange={() => onChoose(index)}
            outcome={optionOutcome(index, result)}
          >
            {option}
          </ChoiceOption>
        ))}
      </div>
      {result && (
        <div className={styles.feedback}>
          <p className={result.is_correct ? styles.verdictCorrect : styles.verdictIncorrect}>
            <span aria-hidden="true">{result.is_correct ? "✓ " : "✕ "}</span>
            <strong>{result.is_correct ? t("correct") : t("incorrect")}</strong>
            {!result.is_correct && (
              <> · {t("correctAnswer", { answer: question.options[result.correct_index] ?? "" })}</>
            )}
          </p>
          <p>{result.explanation}</p>
        </div>
      )}
    </fieldset>
  );
}

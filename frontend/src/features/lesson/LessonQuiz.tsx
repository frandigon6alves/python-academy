"use client";

import { useTranslations } from "next-intl";
import { QuizForm } from "@/features/quiz/QuizForm";
import { RewardsPanel } from "@/features/quiz/RewardsPanel";
import { ErrorState } from "@/components/ui/QueryState";
import { useSubmitQuiz } from "@/lib/api/hooks/learning";
import type { LessonDetail } from "@/lib/api/types";

export function LessonQuiz({ lesson }: { lesson: LessonDetail }) {
  const t = useTranslations("quiz");
  const submit = useSubmitQuiz(lesson.id);
  const result = submit.data;

  return (
    <>
      {submit.isError && <ErrorState error={submit.error} />}
      <QuizForm
        questions={lesson.quiz}
        results={result?.results}
        isSubmitting={submit.isPending}
        onSubmit={(answers) => submit.mutate(answers)}
        onRetry={() => submit.reset()}
        summary={
          result && (
            <>
              <p>
                <strong>{t("score", { correct: result.correct, total: result.total })}</strong>
              </p>
              <RewardsPanel rewards={result.rewards} />
            </>
          )
        }
      />
    </>
  );
}

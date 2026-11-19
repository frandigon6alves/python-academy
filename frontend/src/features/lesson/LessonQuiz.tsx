"use client";

import { QuizForm } from "@/features/quiz/QuizForm";
import { RewardsPanel } from "@/features/quiz/RewardsPanel";
import { ScoreSummary } from "@/features/quiz/ScoreSummary";
import { scoreTone } from "@/features/quiz/outcome";
import { ErrorState } from "@/components/ui/QueryState";
import { useSubmitQuiz } from "@/lib/api/hooks/learning";
import type { LessonDetail } from "@/lib/api/types";

export function LessonQuiz({ lesson }: { lesson: LessonDetail }) {
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
              <ScoreSummary correct={result.correct} total={result.total} />
              <RewardsPanel
                rewards={result.rewards}
                celebrate={scoreTone(result.correct, result.total) !== "low"}
              />
            </>
          )
        }
      />
    </>
  );
}

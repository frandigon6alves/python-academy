"use client";

import { useTranslations } from "next-intl";
import { Alert } from "@/components/ui/Alert";
import { buttonClass } from "@/components/ui/Button";
import { ErrorState, Loading } from "@/components/ui/QueryState";
import { QuizForm } from "@/features/quiz/QuizForm";
import { RewardsPanel } from "@/features/quiz/RewardsPanel";
import { Link } from "@/i18n/navigation";
import { ApiError } from "@/lib/api/client";
import { useMe } from "@/lib/api/hooks/auth";
import { useExam, useSubmitExam } from "@/lib/api/hooks/learning";
import type { ExamResult } from "@/lib/api/types";
import { usePageTitle } from "@/lib/use-page-title";
import { SkeletonRows } from "@/components/ui/Skeleton";

export function ExamPage({ courseSlug }: { courseSlug: string }) {
  const t = useTranslations("exam");
  const tLesson = useTranslations("lesson");
  const { data: me } = useMe();
  const exam = useExam(courseSlug, Boolean(me));
  const submit = useSubmitExam(courseSlug);
  usePageTitle(exam.data && t("title", { course: exam.data.course_title }));

  if (exam.isPending) {
    return (
      <div className="reading-column">
        <Loading>
          <SkeletonRows count={4} height="12rem" />
        </Loading>
      </div>
    );
  }
  if (exam.error instanceof ApiError && exam.error.code === "exam-locked") {
    return (
      <Alert tone="info">
        <p>{t("locked")}</p>
        <Link href={`/courses/${courseSlug}`}>← {tLesson("backToCourse")}</Link>
      </Alert>
    );
  }
  if (exam.isError) return <ErrorState error={exam.error} onRetry={() => exam.refetch()} />;

  return (
    <div className="reading-column">
      <h1 className="page-title">{t("title", { course: exam.data.course_title })}</h1>
      <p className="lead">{t("lead", { percent: exam.data.pass_percent })}</p>
      {submit.isError && <ErrorState error={submit.error} />}
      <QuizForm
        questions={exam.data.questions}
        results={submit.data?.results}
        isSubmitting={submit.isPending}
        onSubmit={(answers) => submit.mutate(answers)}
        onRetry={() => submit.reset()}
        summary={submit.data && <ExamSummary result={submit.data} />}
      />
    </div>
  );
}

function ExamSummary({ result }: { result: ExamResult }) {
  const t = useTranslations("exam");
  return (
    <>
      <Alert tone={result.passed ? "success" : "info"}>
        <p>
          <strong>
            {result.passed
              ? t("passed", { percent: result.percent })
              : t("failed", { percent: result.percent })}
          </strong>
        </p>
        {result.certificate_id && (
          <Link href={`/certificates/${result.certificate_id}`} className={buttonClass("primary")}>
            {t("viewCertificate")}
          </Link>
        )}
      </Alert>
      <RewardsPanel rewards={result.rewards} celebrate={result.passed} />
    </>
  );
}

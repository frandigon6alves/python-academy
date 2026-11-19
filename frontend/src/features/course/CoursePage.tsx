"use client";

import { useTranslations } from "next-intl";
import { buttonClass } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ErrorState, Loading } from "@/components/ui/QueryState";
import { Skeleton, SkeletonRows } from "@/components/ui/Skeleton";
import { SignInPrompt } from "@/features/auth/SignInPrompt";
import { Link } from "@/i18n/navigation";
import { useMe } from "@/lib/api/hooks/auth";
import { useCourse } from "@/lib/api/hooks/content";
import { useProgress } from "@/lib/api/hooks/learning";
import { usePageTitle } from "@/lib/use-page-title";
import type { CourseDetail, CourseProgress } from "@/lib/api/types";
import styles from "./CoursePage.module.css";

const PASS_PERCENT = 70;

export function CoursePage({ slug }: { slug: string }) {
  const t = useTranslations();
  const course = useCourse(slug);
  const progress = useProgress();
  usePageTitle(course.data?.title);

  if (course.isPending) return <CourseSkeleton />;
  if (course.isError) return <ErrorState error={course.error} onRetry={() => course.refetch()} />;

  const courseProgress = progress.data?.courses.find((item) => item.course_slug === slug);
  const done = new Set(courseProgress?.completed_lessons ?? []);

  return (
    <article className={styles.page}>
      <p className={styles.level}>{t(`common.${course.data.level}`)}</p>
      <h1 className="page-title">{course.data.title}</h1>
      <p className="lead">{course.data.summary}</p>
      <ul className={styles.facts}>
        <li>{t("common.lessons", { count: course.data.lessons.length })}</li>
        <li>{t("common.minutes", { count: course.data.minutes })}</li>
      </ul>
      {courseProgress && (
        <div className={styles.progress}>
          <ProgressBar
            value={courseProgress.percent}
            label={t("catalogue.progressLabel")}
            valueText={t("catalogue.progress", { percent: courseProgress.percent })}
          />
          <span>{t("catalogue.progress", { percent: courseProgress.percent })}</span>
        </div>
      )}

      <h2 className={styles.heading}>{t("course.lessonsTitle")}</h2>
      <ol className={styles.lessons}>
        {course.data.lessons.map((lesson, index) => {
          const isDone = done.has(lesson.slug);
          return (
            <li key={lesson.slug}>
              {/* The whole row is the link; its name reads "2. Types, Completed, 9 min". */}
              <Link href={`/courses/${slug}/lessons/${lesson.slug}`} className={styles.lesson}>
                <span className={isDone ? styles.done : styles.todo} aria-hidden="true">
                  {isDone ? "✓" : index + 1}
                </span>
                <span className={styles.lessonTitle}>
                  <span className="visually-hidden">{index + 1}. </span>
                  {lesson.title}
                  <span className="visually-hidden">
                    , {isDone ? t("course.lessonDone") : t("course.lessonTodo")},
                  </span>
                </span>
                <span className={styles.minutes}>{t("common.minutes", { count: lesson.minutes })}</span>
                <span className={styles.chevron} aria-hidden="true">
                  →
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <ExamCard course={course.data} progress={courseProgress} />
    </article>
  );
}

function CourseSkeleton() {
  return (
    <Loading>
      <div className={styles.page}>
        <Skeleton width="6rem" />
        <div style={{ height: "var(--space-3)" }} />
        <Skeleton width="60%" height="2.75rem" />
        <div style={{ height: "var(--space-4)" }} />
        <Skeleton width="90%" height="1.25rem" />
        <div style={{ height: "var(--space-7)" }} />
        <SkeletonRows count={4} height="3.75rem" />
      </div>
    </Loading>
  );
}

function ExamCard({ course, progress }: { course: CourseDetail; progress: CourseProgress | undefined }) {
  const t = useTranslations("course");
  const { data: me } = useMe();
  const unlocked = progress !== undefined && progress.completed_lessons.length === progress.lesson_count;

  return (
    <section className={styles.exam} aria-labelledby="exam-title">
      <h2 id="exam-title">
        <span aria-hidden="true">🎓 </span>
        {t("examTitle")}
      </h2>
      <p>{t("examLead", { count: course.exam_question_count, percent: PASS_PERCENT })}</p>
      {me === null && <SignInPrompt next={`/courses/${course.slug}`}>{t("examSignIn")}</SignInPrompt>}
      {me && !unlocked && (
        <p className={styles.locked}>
          <span aria-hidden="true">🔒 </span>
          {t("examLocked")}
        </p>
      )}
      <div className={styles.examActions}>
        {unlocked && (
          <Link href={`/courses/${course.slug}/exam`} className={buttonClass("primary")}>
            {progress?.exam_passed ? t("retakeExam") : t("takeExam")}
          </Link>
        )}
        {progress?.certificate_id && (
          <Link href={`/certificates/${progress.certificate_id}`} className={buttonClass("secondary")}>
            {t("viewCertificate")}
          </Link>
        )}
      </div>
    </section>
  );
}

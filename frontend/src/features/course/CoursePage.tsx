"use client";

import { useTranslations } from "next-intl";
import { buttonClass } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ErrorState, Loading } from "@/components/ui/QueryState";
import { Link } from "@/i18n/navigation";
import { useMe } from "@/lib/api/hooks/auth";
import { useCourse } from "@/lib/api/hooks/content";
import { useProgress } from "@/lib/api/hooks/learning";
import type { CourseDetail, CourseProgress } from "@/lib/api/types";
import styles from "./CoursePage.module.css";

const PASS_PERCENT = 70;

export function CoursePage({ slug }: { slug: string }) {
  const t = useTranslations();
  const course = useCourse(slug);
  const progress = useProgress();

  if (course.isPending) return <Loading />;
  if (course.isError) return <ErrorState error={course.error} onRetry={() => course.refetch()} />;

  const courseProgress = progress.data?.courses.find((item) => item.course_slug === slug);
  const done = new Set(courseProgress?.completed_lessons ?? []);

  return (
    <article>
      <p className={styles.level}>{t(`common.${course.data.level}`)}</p>
      <h1 className="page-title">{course.data.title}</h1>
      <p className="lead">{course.data.summary}</p>
      {courseProgress && (
        <ProgressBar
          value={courseProgress.percent}
          label={t("catalogue.progressLabel")}
          valueText={t("catalogue.progress", { percent: courseProgress.percent })}
        />
      )}

      <h2 className={styles.heading}>{t("course.lessonsTitle")}</h2>
      <ol className={styles.lessons}>
        {course.data.lessons.map((lesson) => (
          <li key={lesson.slug} className={styles.lesson}>
            <span className={done.has(lesson.slug) ? styles.done : styles.todo}>
              <span aria-hidden="true">{done.has(lesson.slug) ? "✓" : "○"}</span>
              <span className="visually-hidden">
                {done.has(lesson.slug) ? t("course.lessonDone") : t("course.lessonTodo")}
              </span>
            </span>
            <Link href={`/courses/${slug}/lessons/${lesson.slug}`}>{lesson.title}</Link>
            <span className={styles.minutes}>{t("common.minutes", { count: lesson.minutes })}</span>
          </li>
        ))}
      </ol>

      <ExamCard course={course.data} progress={courseProgress} />
    </article>
  );
}

function ExamCard({ course, progress }: { course: CourseDetail; progress?: CourseProgress }) {
  const t = useTranslations("course");
  const { data: me } = useMe();
  const unlocked = progress !== undefined && progress.completed_lessons.length === progress.lesson_count;

  return (
    <section className={styles.exam} aria-labelledby="exam-title">
      <h2 id="exam-title">{t("examTitle")}</h2>
      <p>{t("examLead", { count: course.exam_question_count, percent: PASS_PERCENT })}</p>
      {!me && <p>{t("examSignIn")}</p>}
      {me && !unlocked && <p>{t("examLocked")}</p>}
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

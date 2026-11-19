"use client";

import { useTranslations } from "next-intl";
import { Markdown } from "@/components/Markdown";
import { Alert } from "@/components/ui/Alert";
import { ErrorState, Loading } from "@/components/ui/QueryState";
import { Link } from "@/i18n/navigation";
import { useMe } from "@/lib/api/hooks/auth";
import { useLesson } from "@/lib/api/hooks/content";
import type { LessonDetail } from "@/lib/api/types";
import { LessonQuiz } from "./LessonQuiz";
import styles from "./LessonPage.module.css";

export function LessonPage({ courseSlug, lessonSlug }: { courseSlug: string; lessonSlug: string }) {
  const t = useTranslations("lesson");
  const lesson = useLesson(courseSlug, lessonSlug);
  const { data: me } = useMe();

  if (lesson.isPending) return <Loading />;
  if (lesson.isError) return <ErrorState error={lesson.error} onRetry={() => lesson.refetch()} />;
  const data = lesson.data;

  return (
    <article className={styles.article}>
      <nav aria-label={t("breadcrumb")} className={styles.breadcrumb}>
        <Link href={`/courses/${courseSlug}`}>{data.course_title}</Link>
      </nav>
      <h1 className="page-title">{data.title}</h1>
      <p className={styles.meta}>{t("readingTime", { count: data.minutes })}</p>

      <div className={styles.body}>
        <Markdown>{data.body_markdown}</Markdown>
      </div>

      <aside className={styles.takeaways} aria-labelledby="takeaways-title">
        <h2 id="takeaways-title">{t("takeaways")}</h2>
        <ul>
          {data.takeaways.map((takeaway) => (
            <li key={takeaway}>
              <Markdown>{takeaway}</Markdown>
            </li>
          ))}
        </ul>
      </aside>

      <section aria-labelledby="quiz-title" className={styles.quiz}>
        <h2 id="quiz-title">{t("quizTitle")}</h2>
        {me ? (
          // Keyed by lesson so navigating to the next lesson resets the quiz state.
          <LessonQuiz key={data.id} lesson={data} />
        ) : (
          <Alert tone="info">
            <Link href="/login">{t("signInToSave")}</Link>
          </Alert>
        )}
      </section>

      <LessonPager lesson={data} />
    </article>
  );
}

function LessonPager({ lesson }: { lesson: LessonDetail }) {
  const t = useTranslations("lesson");
  const base = `/courses/${lesson.course_slug}`;
  return (
    <nav className={styles.pager} aria-label={t("backToCourse")}>
      {lesson.previous ? (
        <Link href={`${base}/lessons/${lesson.previous.slug}`} rel="prev">
          ← {t("previous")}: {lesson.previous.title}
        </Link>
      ) : (
        <Link href={base}>← {t("backToCourse")}</Link>
      )}
      {lesson.next ? (
        <Link href={`${base}/lessons/${lesson.next.slug}`} rel="next">
          {t("next")}: {lesson.next.title} →
        </Link>
      ) : (
        <Link href={base}>{t("backToCourse")} →</Link>
      )}
    </nav>
  );
}

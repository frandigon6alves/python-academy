"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Markdown } from "@/components/Markdown";
import { ErrorState, Loading } from "@/components/ui/QueryState";
import { Skeleton } from "@/components/ui/Skeleton";
import { SignInPrompt } from "@/features/auth/SignInPrompt";
import { Link } from "@/i18n/navigation";
import { useMe } from "@/lib/api/hooks/auth";
import { useLesson } from "@/lib/api/hooks/content";
import type { LessonDetail } from "@/lib/api/types";
import { headingsOf } from "@/lib/headings";
import { usePageTitle } from "@/lib/use-page-title";
import { LessonQuiz } from "./LessonQuiz";
import styles from "./LessonPage.module.css";

export function LessonPage({ courseSlug, lessonSlug }: { courseSlug: string; lessonSlug: string }) {
  const t = useTranslations("lesson");
  const lesson = useLesson(courseSlug, lessonSlug);
  const { data: me } = useMe();
  usePageTitle(lesson.data?.title);

  if (lesson.isPending) return <LessonSkeleton />;
  if (lesson.isError) return <ErrorState error={lesson.error} onRetry={() => lesson.refetch()} />;
  const data = lesson.data;
  const path = `/courses/${courseSlug}/lessons/${lessonSlug}`;

  return (
    <div className={styles.layout}>
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
            me === null && (
              <div className={styles.signIn}>
                <SignInPrompt next={path}>{t("signInToSave")}</SignInPrompt>
              </div>
            )
          )}
        </section>

        <LessonPager lesson={data} />
      </article>
      <TableOfContents markdown={data.body_markdown} />
    </div>
  );
}

/** "On this page" links, shown in a sticky side column on wide screens only. */
function TableOfContents({ markdown }: { markdown: string }) {
  const t = useTranslations("lesson");
  const headings = headingsOf(markdown);
  return (
    <nav aria-labelledby="toc-title" className={styles.toc}>
      <h2 id="toc-title" className={styles.tocTitle}>
        {t("onThisPage")}
      </h2>
      <ol>
        {headings.map((heading) => (
          <li key={heading.id}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
        <li>
          <a href="#takeaways-title">{t("takeaways")}</a>
        </li>
        <li>
          <a href="#quiz-title">{t("quizTitle")}</a>
        </li>
      </ol>
    </nav>
  );
}

function LessonSkeleton() {
  return (
    <Loading>
      <div className={styles.layout}>
        <div className={styles.article}>
          <Skeleton width="8rem" />
          <div style={{ height: "var(--space-3)" }} />
          <Skeleton width="55%" height="2.75rem" />
          <div style={{ height: "var(--space-5)" }} />
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} style={{ marginBottom: "var(--space-3)" }}>
              <Skeleton width={index % 3 === 2 ? "70%" : "100%"} height="1.1rem" />
            </div>
          ))}
          <Skeleton height="8rem" radius="var(--radius-md)" />
        </div>
      </div>
    </Loading>
  );
}

function LessonPager({ lesson }: { lesson: LessonDetail }) {
  const t = useTranslations("lesson");
  const base = `/courses/${lesson.course_slug}`;
  return (
    <nav className={styles.pager} aria-label={t("pagerLabel")}>
      {lesson.previous ? (
        <Link href={`${base}/lessons/${lesson.previous.slug}`} rel="prev" className={styles.pagerLink}>
          <PagerHint arrow="previous">{t("previous")}</PagerHint>
          {lesson.previous.title}
        </Link>
      ) : (
        <Link href={base} className={styles.pagerLink}>
          <PagerHint arrow="previous">{t("backToCourse")}</PagerHint>
          {lesson.course_title}
        </Link>
      )}
      {lesson.next ? (
        <Link
          href={`${base}/lessons/${lesson.next.slug}`}
          rel="next"
          className={`${styles.pagerLink} ${styles.pagerNext}`}
        >
          <PagerHint arrow="next">{t("next")}</PagerHint>
          {lesson.next.title}
        </Link>
      ) : (
        <Link href={base} className={`${styles.pagerLink} ${styles.pagerNext}`}>
          <PagerHint arrow="next">{t("backToCourse")}</PagerHint>
          {lesson.course_title}
        </Link>
      )}
    </nav>
  );
}

/** "← Previous" / "Next →": the arrow is decoration, the link text says where it goes. */
function PagerHint({ arrow, children }: { arrow: "previous" | "next"; children: ReactNode }) {
  return (
    <span className={styles.pagerHint}>
      {arrow === "previous" && <span aria-hidden="true">← </span>}
      {children}
      {arrow === "next" && <span aria-hidden="true"> →</span>}
    </span>
  );
}

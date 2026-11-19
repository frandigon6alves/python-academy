"use client";

import { useTranslations } from "next-intl";
import { buttonClass } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ErrorState, Loading } from "@/components/ui/QueryState";
import { Link } from "@/i18n/navigation";
import { useMe } from "@/lib/api/hooks/auth";
import { useCourses } from "@/lib/api/hooks/content";
import { useGamification, useProgress } from "@/lib/api/hooks/learning";
import type { ProgressOverview } from "@/lib/api/types";
import { BadgeGrid } from "./BadgeGrid";
import { LevelCard } from "./LevelCard";
import { QuestList } from "./QuestList";
import styles from "./HubPage.module.css";

export function HubPage() {
  const t = useTranslations("hub");
  const { data: me } = useMe();
  const gamification = useGamification();
  const progress = useProgress();

  if (gamification.isPending || progress.isPending) return <Loading />;
  if (gamification.isError)
    return <ErrorState error={gamification.error} onRetry={() => gamification.refetch()} />;
  if (progress.isError) return <ErrorState error={progress.error} onRetry={() => progress.refetch()} />;

  return (
    <div className={styles.hub}>
      <header>
        <h1 className="page-title">{t("greeting", { name: me?.display_name ?? "" })}</h1>
        <p className="lead">{t("lead")}</p>
      </header>
      <LevelCard level={gamification.data.level} streakDays={gamification.data.streak_days} />
      <div className={styles.columns}>
        <ContinueCard progress={progress.data} />
        <QuestList quests={gamification.data.quests} />
      </div>
      <BadgeGrid badges={gamification.data.badges} />
      <CourseProgressList progress={progress.data} />
    </div>
  );
}

function ContinueCard({ progress }: { progress: ProgressOverview }) {
  const t = useTranslations("hub");
  const next = progress.continue_learning;
  return (
    <section className={styles.card} aria-labelledby="continue-title">
      <h2 id="continue-title">{t("continueTitle")}</h2>
      {next ? (
        <>
          <p className={styles.muted}>{next.course_title}</p>
          <p className={styles.nextLesson}>{next.lesson_title}</p>
          <Link
            href={`/courses/${next.course_slug}/lessons/${next.lesson_slug}`}
            className={buttonClass("primary")}
          >
            {t("continueCta")}
          </Link>
        </>
      ) : (
        <p>{t("allDone")}</p>
      )}
    </section>
  );
}

function CourseProgressList({ progress }: { progress: ProgressOverview }) {
  const t = useTranslations();
  const courses = useCourses();
  const titleOf = (slug: string) => courses.data?.find((course) => course.slug === slug)?.title ?? slug;

  return (
    <section className={styles.card} aria-labelledby="course-progress-title">
      <h2 id="course-progress-title">{t("hub.progressTitle")}</h2>
      <ul className={styles.courseList}>
        {progress.courses.map((course) => (
          <li key={course.course_slug} className={styles.courseRow}>
            <Link href={`/courses/${course.course_slug}`} className={styles.courseName}>
              {titleOf(course.course_slug)}
            </Link>
            <ProgressBar
              value={course.percent}
              label={titleOf(course.course_slug)}
              valueText={t("catalogue.progress", { percent: course.percent })}
            />
            <span className={styles.muted}>
              {t("catalogue.progress", { percent: course.percent })}
              {course.certificate_id && (
                <>
                  {" · "}
                  <Link href={`/certificates/${course.certificate_id}`}>{t("hub.certificate")}</Link>
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

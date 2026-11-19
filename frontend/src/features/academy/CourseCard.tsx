import { useTranslations } from "next-intl";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Link } from "@/i18n/navigation";
import type { CourseProgress, CourseSummary } from "@/lib/api/types";
import styles from "./CourseCatalogue.module.css";

interface CourseCardProps {
  course: CourseSummary;
  position: number;
  progress?: CourseProgress | undefined;
}

export function CourseCard({ course, position, progress }: CourseCardProps) {
  const t = useTranslations();
  const percent = progress?.percent ?? 0;
  const action =
    percent === 100 ? t("catalogue.review") : percent > 0 ? t("catalogue.continue") : t("catalogue.start");

  return (
    <article className={progress ? `${styles.card} ${styles.withProgress}` : styles.card}>
      <div className={styles.top}>
        <span className={styles.position} aria-hidden="true">
          {String(position).padStart(2, "0")}
        </span>
        <span className={styles.level}>{t(`common.${course.level}`)}</span>
      </div>
      <h3 className={styles.title}>
        <Link href={`/courses/${course.slug}`} className={styles.link}>
          {course.title}
        </Link>
      </h3>
      <ul className={styles.meta}>
        <li>{t("common.lessons", { count: course.lesson_count })}</li>
        <li>{t("common.minutes", { count: course.minutes })}</li>
      </ul>
      <p className={styles.summary}>{course.summary}</p>
      {progress && (
        <div className={styles.progress}>
          <ProgressBar
            value={percent}
            label={`${t("catalogue.progressLabel")}: ${course.title}`}
            valueText={t("catalogue.progress", { percent })}
          />
          <span>{percent === 100 ? t("catalogue.completed") : t("catalogue.progress", { percent })}</span>
        </div>
      )}
      <span className={styles.cta} aria-hidden="true">
        {action} →
      </span>
    </article>
  );
}

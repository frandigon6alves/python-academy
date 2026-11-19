import { useTranslations } from "next-intl";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Level } from "@/lib/api/types";
import styles from "./HubPage.module.css";

export function LevelCard({ level, streakDays }: { level: Level; streakDays: number }) {
  const t = useTranslations();
  const toNext = level.next_level_xp - level.xp;
  return (
    <section
      className={`${styles.card} ${styles.levelCard}`}
      aria-label={t("common.level", { level: level.level })}
    >
      <div className={styles.levelBadge} aria-hidden="true">
        {level.level}
      </div>
      <div className={styles.levelInfo}>
        <p className={styles.levelTitle}>
          {t("common.level", { level: level.level })} · {t("common.xp", { xp: level.xp })}
        </p>
        <ProgressBar
          value={level.percent}
          label={t("hub.xpLabel")}
          valueText={t("hub.toNextLevel", { xp: toNext, level: level.level + 1 })}
        />
        <p className={styles.muted}>{t("hub.toNextLevel", { xp: toNext, level: level.level + 1 })}</p>
      </div>
      <div className={styles.streak}>
        <span aria-hidden="true" className={styles.flame}>
          🔥
        </span>
        <div>
          <p className={styles.streakCount}>{t("hub.streak", { count: streakDays })}</p>
          <p className={styles.muted}>{t("hub.streakHint")}</p>
        </div>
      </div>
    </section>
  );
}

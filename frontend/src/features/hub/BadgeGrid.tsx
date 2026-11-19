import { useTranslations } from "next-intl";
import type { Badge } from "@/lib/api/types";
import styles from "./HubPage.module.css";

export function BadgeGrid({ badges }: { badges: Badge[] }) {
  const t = useTranslations("hub");
  return (
    <section className={styles.card} aria-labelledby="badges-title">
      <div className={styles.cardHeader}>
        <h2 id="badges-title">{t("badgesTitle")}</h2>
        <span className={styles.muted}>
          {t("badgesCount", { earned: badges.filter((badge) => badge.earned).length, total: badges.length })}
        </span>
      </div>
      <ul className={styles.badges}>
        {badges.map((badge) => (
          <li key={badge.code} className={styles.badge} data-earned={badge.earned}>
            <span aria-hidden="true" className={styles.badgeIcon}>
              {badge.icon}
            </span>
            <span className={styles.badgeName}>{badge.name}</span>
            <span className={styles.badgeDescription}>{badge.description}</span>
            <span className={styles.badgeState}>
              <span aria-hidden="true">{badge.earned ? "✓ " : "🔒 "}</span>
              {badge.earned ? t("badgeEarned") : t("badgeLocked")}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

import { useTranslations } from "next-intl";
import type { Rewards } from "@/lib/api/types";
import styles from "./RewardsPanel.module.css";

interface RewardsPanelProps {
  rewards: Rewards;
  /** Celebrate the XP after a good result; keep it low-key after a low score. */
  celebrate?: boolean;
}

export function RewardsPanel({ rewards, celebrate = true }: RewardsPanelProps) {
  const t = useTranslations("rewards");
  return (
    <section className={celebrate ? styles.panel : `${styles.panel} ${styles.quiet}`} aria-label={t("title")}>
      {rewards.xp_gained === 0 ? (
        <p>{t("noXp")}</p>
      ) : celebrate ? (
        <p className={styles.xp}>{t("xp", { xp: rewards.xp_gained })}</p>
      ) : (
        <p>{t("xpQuiet", { xp: rewards.xp_gained })}</p>
      )}
      <ul className={styles.list}>
        {rewards.leveled_up && <li>🆙 {t("levelUp", { level: rewards.level.level })}</li>}
        {rewards.new_badges.map((badge) => (
          <li key={badge.code}>
            <span aria-hidden="true">{badge.icon}</span> {t("badge", { name: badge.name })}
          </li>
        ))}
        {rewards.completed_quests.map((quest) => (
          <li key={quest.code}>
            <span aria-hidden="true">✅</span> {t("quest", { name: quest.name, xp: quest.xp_reward })}
          </li>
        ))}
      </ul>
    </section>
  );
}

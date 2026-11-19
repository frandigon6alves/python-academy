import { useTranslations } from "next-intl";
import type { Rewards } from "@/lib/api/types";
import styles from "./RewardsPanel.module.css";

export function RewardsPanel({ rewards }: { rewards: Rewards }) {
  const t = useTranslations("rewards");
  return (
    <section className={styles.panel} aria-label={t("title")}>
      {rewards.xp_gained > 0 ? (
        <p className={styles.xp}>{t("xp", { xp: rewards.xp_gained })}</p>
      ) : (
        <p>{t("noXp")}</p>
      )}
      <ul className={styles.list}>
        {rewards.leveled_up && <li>🆙 {t("levelUp", { level: rewards.level.level })}</li>}
        {rewards.new_badges.map((badge) => (
          <li key={badge.code}>
            <span aria-hidden="true">{badge.icon}</span> {t("badge", { name: badge.name })}
          </li>
        ))}
        {rewards.completed_quests.map((quest) => (
          <li key={quest.code}>✅ {t("quest", { name: quest.name, xp: quest.xp_reward })}</li>
        ))}
      </ul>
    </section>
  );
}

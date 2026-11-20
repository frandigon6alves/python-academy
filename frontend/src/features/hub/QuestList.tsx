import { useTranslations } from "next-intl";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Quest } from "@/lib/api/types";
import styles from "./HubPage.module.css";

export function QuestList({ quests }: { quests: Quest[] }) {
  const t = useTranslations("hub");
  return (
    <section className={styles.card} aria-labelledby="quests-title">
      <h2 id="quests-title">{t("questsTitle")}</h2>
      <ul className={styles.quests}>
        {quests.map((quest) => (
          <li key={quest.code} className={styles.quest}>
            <div className={styles.questHeader}>
              <span className={styles.tag}>{t(quest.period)}</span>
              <span className={styles.questName}>{quest.name}</span>
              <span className={styles.muted}>{t("questReward", { xp: quest.xp_reward })}</span>
            </div>
            <ProgressBar
              value={(100 * quest.progress) / quest.target}
              label={quest.name}
              valueText={t("questProgress", { progress: quest.progress, target: quest.target })}
            />
            <span className={styles.muted}>
              {quest.completed ? (
                <>
                  <span aria-hidden="true">✓ </span>
                  {t("questDone")}
                </>
              ) : (
                t("questProgress", { progress: quest.progress, target: quest.target })
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

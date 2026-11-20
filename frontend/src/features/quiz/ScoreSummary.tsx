import { useTranslations } from "next-intl";
import { scoreTone } from "./outcome";
import styles from "./ScoreSummary.module.css";

const ICONS = { perfect: "🎉", good: "👍", low: "💪" } as const;

/** The score of a graded lesson quiz, with copy that matches how it went. */
export function ScoreSummary({ correct, total }: { correct: number; total: number }) {
  const t = useTranslations("quiz");
  const tone = scoreTone(correct, total);
  return (
    <div className={styles.score} data-tone={tone}>
      <p className={styles.scoreTitle}>
        <span aria-hidden="true">{ICONS[tone]} </span>
        {t(`result.${tone}Title`)}
      </p>
      <p>
        {t("score", { correct, total })} {t(`result.${tone}`)}
      </p>
    </div>
  );
}

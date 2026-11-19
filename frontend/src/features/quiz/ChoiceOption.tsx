import { useTranslations } from "next-intl";
import { useId, type ReactNode } from "react";
import type { OptionOutcome } from "./outcome";
import styles from "./ChoiceOption.module.css";

interface ChoiceOptionProps {
  name: string;
  checked: boolean;
  onChange: () => void;
  outcome: OptionOutcome;
  children: ReactNode;
}

const ICONS = { "chosen-correct": "✓", missed: "✓", "chosen-wrong": "✕" } as const;

/**
 * One answer of a multiple-choice question: a styled radio whose whole row is clickable.
 * After grading, the outcome is shown with colour, an icon and a text tag, and the tag is
 * linked to the radio with aria-describedby so screen readers announce it too.
 */
export function ChoiceOption({ name, checked, onChange, outcome, children }: ChoiceOptionProps) {
  const t = useTranslations("quiz");
  const tagId = useId();
  return (
    <label className={styles.option} data-outcome={outcome}>
      <input
        type="radio"
        name={name}
        className={styles.radio}
        checked={checked}
        onChange={onChange}
        aria-describedby={outcome ? tagId : undefined}
      />
      <span className={styles.text}>{children}</span>
      {outcome && (
        // Hidden from the label's name (which stays the option text) but used as its description.
        <span className={styles.tag} aria-hidden="true">
          <span className={styles.icon}>{ICONS[outcome]}</span>
          <span id={tagId}>{t(`outcome.${outcome}`)}</span>
        </span>
      )}
    </label>
  );
}

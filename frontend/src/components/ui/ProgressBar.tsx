import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  value: number;
  label: string;
  valueText?: string;
}

export function ProgressBar({ value, label, valueText }: ProgressBarProps) {
  const percent = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      aria-valuetext={valueText}
    >
      <div className={styles.fill} style={{ width: `${percent}%` }} />
    </div>
  );
}

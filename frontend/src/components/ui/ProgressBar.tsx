import styles from "./ProgressBar.module.css";

interface ProgressBarProps {
  value: number;
  label: string;
  valueText?: string;
}

export function ProgressBar({ value, label, valueText }: ProgressBarProps) {
  // NaN (e.g. a share of zero) would render "width: NaN%" and an invalid aria-valuenow.
  const percent = Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : 0;
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

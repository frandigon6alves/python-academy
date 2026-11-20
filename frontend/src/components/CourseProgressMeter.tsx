import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import styles from "./CourseProgressMeter.module.css";

interface CourseProgressMeterProps {
  percent: number;
  /** Accessible name of the bar, e.g. "Course progress: Python Basics". */
  label: string;
  className?: string | undefined;
  /** Shown after the percentage, e.g. a certificate link. */
  children?: ReactNode;
}

/** A course's completion: a bar plus "{percent}% complete", or "Completed" at 100%. */
export function CourseProgressMeter({ percent, label, className, children }: CourseProgressMeterProps) {
  const t = useTranslations("catalogue");
  const text = t("progress", { percent });
  return (
    <div className={className ? `${styles.meter} ${className}` : styles.meter}>
      <ProgressBar value={percent} label={label} valueText={text} />
      <span>
        {percent === 100 ? t("completed") : text}
        {children}
      </span>
    </div>
  );
}

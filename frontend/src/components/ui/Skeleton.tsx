import type { CSSProperties } from "react";
import styles from "./Skeleton.module.css";

interface SkeletonProps {
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  radius?: CSSProperties["borderRadius"];
}

/** One grey placeholder shape. Purely decorative: the surrounding <Loading> announces the state. */
export function Skeleton({ width = "100%", height = "1rem", radius }: SkeletonProps) {
  return <span className={styles.block} style={{ width, height, borderRadius: radius }} />;
}

/** A card-shaped placeholder with a few text lines. */
export function SkeletonCard({ lines = 3, height }: { lines?: number; height?: CSSProperties["height"] }) {
  return (
    <div className={styles.card} style={{ minHeight: height }}>
      <Skeleton width="40%" height="1.5rem" />
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton key={index} width={index === lines - 1 ? "70%" : "100%"} />
      ))}
    </div>
  );
}

/** A vertical list of placeholder rows. */
export function SkeletonRows({
  count,
  height = "3rem",
}: {
  count: number;
  height?: CSSProperties["height"];
}) {
  return (
    <div className={styles.stack}>
      {Array.from({ length: count }, (_, index) => (
        <Skeleton key={index} height={height} radius="var(--radius-md)" />
      ))}
    </div>
  );
}

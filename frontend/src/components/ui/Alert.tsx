import type { ReactNode } from "react";
import styles from "./Alert.module.css";

interface AlertProps {
  tone: "success" | "error" | "info";
  children: ReactNode;
}

/** Errors interrupt screen readers (role=alert); other messages are announced politely. */
export function Alert({ tone, children }: AlertProps) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`${styles.alert} ${styles[tone]}`}>
      {children}
    </div>
  );
}

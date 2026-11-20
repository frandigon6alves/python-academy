import type { ComponentProps } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

/** Class names for anything that should look like a button (e.g. links). */
export function buttonClass(variant: ButtonVariant = "primary", extra?: string): string {
  return [styles.button, styles[variant], extra].filter(Boolean).join(" ");
}

interface ButtonProps extends ComponentProps<"button"> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClass(variant, className)} {...props} />;
}

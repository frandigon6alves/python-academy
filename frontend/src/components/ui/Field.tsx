"use client";

import { useTranslations } from "next-intl";
import {
  useId,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import styles from "./Field.module.css";

interface FieldShellProps {
  label: string;
  hint?: string;
  error?: string;
  children: (ids: { inputId: string; describedBy?: string }) => ReactNode;
}

/** Label, hint and error wiring shared by inputs and selects. */
function FieldShell({ label, hint, error, children }: FieldShellProps) {
  const inputId = useId();
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={styles.field}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
      </label>
      {children({ inputId, describedBy })}
      {hint && (
        <span id={hintId} className={styles.hint}>
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} className={styles.error}>
          <span aria-hidden="true">⚠ </span>
          {error}
        </span>
      )}
    </div>
  );
}

/**
 * Checks a form with the browser's constraint validation (required, type, minLength...).
 * Every invalid TextField shows its message, and the first one gets focus.
 * Forms use noValidate so these inline messages replace the browser's bubbles.
 */
export function validateForm(form: HTMLFormElement): boolean {
  if (form.checkValidity()) return true;
  form.querySelector<HTMLElement>(":invalid")?.focus();
  return false;
}

type Translate = ReturnType<typeof useTranslations<"validation">>;

function messageFor(input: HTMLInputElement, t: Translate): string | undefined {
  const { validity } = input;
  if (validity.valid) return undefined;
  if (validity.valueMissing) return t("required");
  if (validity.typeMismatch && input.type === "email") return t("email");
  if (validity.tooShort) return t("tooShort", { min: input.minLength });
  if (validity.tooLong) return t("tooLong", { max: input.maxLength });
  return input.validationMessage;
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  /** An error from the server; it wins over the field's own validation message. */
  error?: string;
}

/**
 * Text input with inline validation: a message appears when a filled-in field is left
 * invalid or when the form is submitted, and it updates as the learner fixes the value.
 * Password inputs get a show/hide toggle.
 */
export function TextField({
  label,
  hint,
  error,
  type = "text",
  onBlur,
  onChange,
  ...inputProps
}: TextFieldProps) {
  const t = useTranslations("validation");
  const [ownError, setOwnError] = useState<string>();
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === "password";

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    if (event.target.value) setOwnError(messageFor(event.target, t));
    onBlur?.(event);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (ownError) setOwnError(messageFor(event.target, t));
    onChange?.(event);
  }

  return (
    <FieldShell label={label} hint={hint} error={error ?? ownError}>
      {({ inputId, describedBy }) => (
        <div className={styles.inputWrap}>
          <input
            id={inputId}
            type={isPassword && revealed ? "text" : type}
            className={isPassword ? `${styles.input} ${styles.withToggle}` : styles.input}
            aria-invalid={error || ownError ? true : undefined}
            aria-describedby={describedBy}
            onBlur={handleBlur}
            onChange={handleChange}
            onInvalid={(event) => setOwnError(messageFor(event.currentTarget, t))}
            {...inputProps}
          />
          {isPassword && (
            <button
              type="button"
              className={styles.toggle}
              aria-pressed={revealed}
              aria-controls={inputId}
              onClick={() => setRevealed((value) => !value)}
            >
              <EyeIcon crossed={revealed} />
              <span className="visually-hidden">{t("showPassword")}</span>
            </button>
          )}
        </div>
      )}
    </FieldShell>
  );
}

function EyeIcon({ crossed }: { crossed: boolean }) {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" className={styles.eye}>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {crossed && <path d="M4 4l16 16" />}
    </svg>
  );
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
}

export function SelectField({ label, options, ...selectProps }: SelectFieldProps) {
  return (
    <FieldShell label={label}>
      {({ inputId }) => (
        <select id={inputId} className={`${styles.input} ${styles.select}`} {...selectProps}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </FieldShell>
  );
}

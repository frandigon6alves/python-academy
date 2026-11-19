import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";
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
          {error}
        </span>
      )}
    </div>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string;
}

export function TextField({ label, hint, error, ...inputProps }: TextFieldProps) {
  return (
    <FieldShell label={label} hint={hint} error={error}>
      {({ inputId, describedBy }) => (
        <input
          id={inputId}
          className={styles.input}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...inputProps}
        />
      )}
    </FieldShell>
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
        <select id={inputId} className={styles.input} {...selectProps}>
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

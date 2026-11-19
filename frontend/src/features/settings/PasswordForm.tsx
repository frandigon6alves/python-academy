"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextField, validateForm } from "@/components/ui/Field";
import { authErrorKey } from "@/features/auth/error-message";
import { useChangePassword } from "@/lib/api/hooks/settings";
import styles from "./SettingsPage.module.css";

export function PasswordForm() {
  const t = useTranslations();
  const change = useChangePassword();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateForm(event.currentTarget)) return;
    change.mutate(
      { current_password: current, new_password: next },
      {
        onSuccess: () => {
          setCurrent("");
          setNext("");
        },
      },
    );
  }

  return (
    <form className={styles.section} onSubmit={handleSubmit} noValidate aria-labelledby="password-title">
      <h2 id="password-title">{t("settings.passwordTitle")}</h2>
      {change.isSuccess && <Alert tone="success">{t("settings.passwordChanged")}</Alert>}
      {change.isError && <Alert tone="error">{t(authErrorKey(change.error))}</Alert>}
      <TextField
        label={t("settings.currentPassword")}
        type="password"
        autoComplete="current-password"
        required
        value={current}
        onChange={(event) => setCurrent(event.target.value)}
      />
      <TextField
        label={t("settings.newPassword")}
        hint={t("auth.passwordHint")}
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        maxLength={128}
        value={next}
        onChange={(event) => setNext(event.target.value)}
      />
      <Button type="submit" disabled={change.isPending}>
        {change.isPending ? t("settings.updatingPassword") : t("settings.changePassword")}
      </Button>
    </form>
  );
}

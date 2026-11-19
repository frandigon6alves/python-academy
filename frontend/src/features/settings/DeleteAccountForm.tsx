"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextField, validateForm } from "@/components/ui/Field";
import { authErrorKey } from "@/features/auth/error-message";
import { reloadSignedOut } from "@/features/auth/sign-out";
import { useDeleteAccount } from "@/lib/api/hooks/settings";
import styles from "./SettingsPage.module.css";

const CONFIRMATION_WORD = "DELETE";

export function DeleteAccountForm() {
  const t = useTranslations();
  const locale = useLocale();
  const remove = useDeleteAccount();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateForm(event.currentTarget)) return;
    remove.mutate({ password, confirmation }, { onSuccess: () => reloadSignedOut(locale) });
  }

  return (
    <form
      className={`${styles.section} ${styles.danger}`}
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="delete-title"
    >
      <h2 id="delete-title">{t("settings.dangerTitle")}</h2>
      <p>{t("settings.dangerLead")}</p>
      {remove.isError && <Alert tone="error">{t(authErrorKey(remove.error))}</Alert>}
      <TextField
        label={t("settings.deletePassword")}
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <TextField
        label={t("settings.confirm")}
        required
        autoComplete="off"
        autoCapitalize="characters"
        spellCheck={false}
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
      />
      <Button
        type="submit"
        variant="danger"
        disabled={confirmation !== CONFIRMATION_WORD || !password || remove.isPending}
      >
        {remove.isPending ? t("settings.deleting") : t("settings.deleteAccount")}
      </Button>
    </form>
  );
}

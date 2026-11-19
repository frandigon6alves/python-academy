"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { authErrorMessage } from "@/features/auth/error-message";
import { useRouter } from "@/i18n/navigation";
import { useDeleteAccount } from "@/lib/api/hooks/settings";
import styles from "./SettingsPage.module.css";

const CONFIRMATION_WORD = "DELETE";

export function DeleteAccountForm() {
  const t = useTranslations();
  const router = useRouter();
  const remove = useDeleteAccount();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    remove.mutate({ password, confirmation }, { onSuccess: () => router.replace("/") });
  }

  return (
    <form
      className={`${styles.section} ${styles.danger}`}
      onSubmit={handleSubmit}
      aria-labelledby="delete-title"
    >
      <h2 id="delete-title">{t("settings.dangerTitle")}</h2>
      <p>{t("settings.dangerLead")}</p>
      {remove.isError && <Alert tone="error">{authErrorMessage(remove.error, t)}</Alert>}
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
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
      />
      <Button
        type="submit"
        variant="danger"
        disabled={confirmation !== CONFIRMATION_WORD || !password || remove.isPending}
      >
        {t("settings.deleteAccount")}
      </Button>
    </form>
  );
}

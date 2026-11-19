"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { Link, useRouter } from "@/i18n/navigation";
import { useLogin } from "@/lib/api/hooks/auth";
import { authErrorMessage } from "./error-message";
import styles from "./AuthCard.module.css";

export function LoginForm() {
  const t = useTranslations();
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    login.mutate(
      { email, password },
      // Open the hub in the learner's saved language.
      { onSuccess: (user) => router.replace("/hub", { locale: user.language }) },
    );
  }

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <h1 className="page-title">{t("auth.loginTitle")}</h1>
      {login.isError && <Alert tone="error">{authErrorMessage(login.error, t)}</Alert>}
      <TextField
        label={t("auth.email")}
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <TextField
        label={t("auth.password")}
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button type="submit" className={styles.submit} disabled={login.isPending}>
        {t("auth.submitLogin")}
      </Button>
      <p className={styles.switch}>
        <Link href="/signup">{t("auth.noAccount")}</Link>
      </p>
    </form>
  );
}

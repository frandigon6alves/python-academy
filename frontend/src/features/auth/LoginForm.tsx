"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextField, validateForm } from "@/components/ui/Field";
import { Link, useRouter } from "@/i18n/navigation";
import { useLogin } from "@/lib/api/hooks/auth";
import { authErrorMessage } from "./error-message";
import { authHref } from "./next-path";
import styles from "./AuthCard.module.css";

/** `next` is an already validated same-site path to return to (see next-path.ts). */
export function LoginForm({ next }: { next: string | null }) {
  const t = useTranslations();
  const router = useRouter();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateForm(event.currentTarget)) return;
    login.mutate(
      { email, password },
      // Continue in the learner's saved language.
      { onSuccess: (user) => router.replace(next ?? "/hub", { locale: user.language }) },
    );
  }

  return (
    <form className={styles.card} onSubmit={handleSubmit} noValidate>
      <h1 className="page-title">{t("auth.loginTitle")}</h1>
      <p className={styles.lead}>{t("auth.loginLead")}</p>
      {login.isError && <Alert tone="error">{authErrorMessage(login.error, t)}</Alert>}
      <TextField
        label={t("auth.email")}
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
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
        {login.isPending ? t("auth.submittingLogin") : t("auth.submitLogin")}
      </Button>
      <p className={styles.switch}>
        <Link href={authHref("/signup", next)}>{t("auth.noAccount")}</Link>
      </p>
    </form>
  );
}

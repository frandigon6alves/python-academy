"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { Link, useRouter } from "@/i18n/navigation";
import { useSignup } from "@/lib/api/hooks/auth";
import type { Locale } from "@/lib/api/types";
import { authErrorMessage } from "./error-message";
import styles from "./AuthCard.module.css";

export function SignupForm() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const signup = useSignup();
  const [form, setForm] = useState({ email: "", display_name: "", password: "" });

  function update(field: keyof typeof form) {
    return (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    // New accounts start in the language the visitor is browsing in.
    signup.mutate({ ...form, language: locale }, { onSuccess: () => router.replace("/hub") });
  }

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <h1 className="page-title">{t("auth.signupTitle")}</h1>
      {signup.isError && <Alert tone="error">{authErrorMessage(signup.error, t)}</Alert>}
      <TextField
        label={t("auth.email")}
        type="email"
        autoComplete="email"
        required
        value={form.email}
        onChange={update("email")}
      />
      <TextField
        label={t("auth.displayName")}
        hint={t("auth.displayNameHint")}
        autoComplete="nickname"
        required
        minLength={2}
        maxLength={40}
        value={form.display_name}
        onChange={update("display_name")}
      />
      <TextField
        label={t("auth.password")}
        hint={t("auth.passwordHint")}
        type="password"
        autoComplete="new-password"
        required
        minLength={8}
        maxLength={128}
        value={form.password}
        onChange={update("password")}
      />
      <Button type="submit" className={styles.submit} disabled={signup.isPending}>
        {t("auth.submitSignup")}
      </Button>
      <p className={styles.switch}>
        <Link href="/login">{t("auth.haveAccount")}</Link>
      </p>
    </form>
  );
}

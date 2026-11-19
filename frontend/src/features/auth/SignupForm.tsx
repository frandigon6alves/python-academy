"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TextField, validateForm } from "@/components/ui/Field";
import { Link, useRouter } from "@/i18n/navigation";
import { useSignup } from "@/lib/api/hooks/auth";
import type { Locale } from "@/lib/api/types";
import { useTheme } from "@/theme/ThemeProvider";
import { authErrorMessage } from "./error-message";
import { authHref } from "./next-path";
import styles from "./AuthCard.module.css";

/** `next` is an already validated same-site path to return to (see next-path.ts). */
export function SignupForm({ next }: { next: string | null }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const signup = useSignup();
  const { preference: theme } = useTheme();
  const [form, setForm] = useState({ email: "", display_name: "", password: "" });

  function update(field: keyof typeof form) {
    return (event: ChangeEvent<HTMLInputElement>) =>
      setForm((current) => ({ ...current, [field]: event.target.value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateForm(event.currentTarget)) return;
    // New accounts keep the language and theme the visitor is already using.
    signup.mutate({ ...form, language: locale, theme }, { onSuccess: () => router.replace(next ?? "/hub") });
  }

  return (
    <form className={styles.card} onSubmit={handleSubmit} noValidate>
      <h1 className="page-title">{t("auth.signupTitle")}</h1>
      <p className={styles.lead}>{t("auth.signupLead")}</p>
      {signup.isError && <Alert tone="error">{authErrorMessage(signup.error, t)}</Alert>}
      <TextField
        label={t("auth.email")}
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
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
        {signup.isPending ? t("auth.submittingSignup") : t("auth.submitSignup")}
      </Button>
      <p className={styles.switch}>
        <Link href={authHref("/login", next)}>{t("auth.haveAccount")}</Link>
      </p>
    </form>
  );
}

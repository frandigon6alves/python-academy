"use client";

import { hasLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField, validateForm } from "@/components/ui/Field";
import { authErrorKey } from "@/features/auth/error-message";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useUpdateSettings } from "@/lib/api/hooks/settings";
import { locales } from "@/i18n/routing";
import type { User } from "@/lib/api/types";
import { isTheme, THEMES } from "@/theme/theme";
import { useTheme } from "@/theme/ThemeProvider";
import styles from "./SettingsPage.module.css";

export function ProfileForm({ user }: { user: User }) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const { setPreference } = useTheme();
  const update = useUpdateSettings();
  const [form, setForm] = useState({
    display_name: user.display_name,
    language: user.language,
    theme: user.theme,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateForm(event.currentTarget)) return;
    update.mutate(form, {
      onSuccess: (saved) => {
        setPreference(saved.theme);
        if (saved.language !== user.language) router.replace(pathname, { locale: saved.language });
      },
    });
  }

  return (
    <form className={styles.section} onSubmit={handleSubmit} noValidate aria-labelledby="profile-title">
      <h2 id="profile-title">{t("settings.profileTitle")}</h2>
      {update.isSuccess && <Alert tone="success">{t("settings.saved")}</Alert>}
      {update.isError && <Alert tone="error">{t(authErrorKey(update.error))}</Alert>}
      <TextField
        label={t("settings.displayName")}
        hint={t("auth.displayNameHint")}
        autoComplete="nickname"
        required
        minLength={2}
        maxLength={40}
        value={form.display_name}
        onChange={(event) => {
          const displayName = event.target.value;
          setForm((current) => ({ ...current, display_name: displayName }));
        }}
      />
      <SelectField
        label={t("settings.language")}
        value={form.language}
        onChange={(event) => {
          const language = event.target.value;
          if (hasLocale(locales, language)) setForm((current) => ({ ...current, language }));
        }}
        options={locales.map((code) => ({ value: code, label: t(`locale.${code}`) }))}
      />
      <SelectField
        label={t("settings.theme")}
        value={form.theme}
        onChange={(event) => {
          const theme = event.target.value;
          if (isTheme(theme)) setForm((current) => ({ ...current, theme }));
        }}
        options={THEMES.map((theme) => ({ value: theme, label: t(`theme.${theme}`) }))}
      />
      <Button type="submit" disabled={update.isPending}>
        {update.isPending ? t("settings.saving") : t("settings.save")}
      </Button>
    </form>
  );
}

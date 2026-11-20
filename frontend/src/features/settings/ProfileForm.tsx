"use client";

import { hasLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField, validateForm } from "@/components/ui/Field";
import { authErrorKey } from "@/features/auth/error-message";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/i18n/routing";
import { useUpdateSettings, type SettingsChanges } from "@/lib/api/hooks/settings";
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
  // Only what was typed or picked here; everything else shows `user` as it is now. So a
  // preference changed elsewhere (the theme switcher in the header, another tab) is never
  // overwritten with a stale copy when this form is saved, and only the changes are sent.
  const [edits, setEdits] = useState<SettingsChanges>({});
  const displayName = edits.display_name ?? user.display_name;
  const language = edits.language ?? user.language;
  const theme = edits.theme ?? user.theme;
  const changes: SettingsChanges = {
    ...(displayName !== user.display_name && { display_name: displayName }),
    ...(language !== user.language && { language }),
    ...(theme !== user.theme && { theme }),
  };
  const hasChanges = Object.keys(changes).length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!hasChanges || !validateForm(event.currentTarget)) return;
    update.mutate(changes, {
      onSuccess: (saved) => {
        setEdits({});
        if (changes.theme) setPreference(saved.theme);
        if (changes.language) router.replace(pathname, { locale: saved.language });
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
        value={displayName}
        onChange={(event) => {
          const display_name = event.target.value;
          setEdits((current) => ({ ...current, display_name }));
        }}
      />
      <SelectField
        label={t("settings.language")}
        value={language}
        onChange={(event) => {
          const value = event.target.value;
          if (hasLocale(locales, value)) setEdits((current) => ({ ...current, language: value }));
        }}
        options={locales.map((code) => ({ value: code, label: t(`locale.${code}`) }))}
      />
      <SelectField
        label={t("settings.theme")}
        value={theme}
        onChange={(event) => {
          const value = event.target.value;
          if (isTheme(value)) setEdits((current) => ({ ...current, theme: value }));
        }}
        options={THEMES.map((option) => ({ value: option, label: t(`theme.${option}`) }))}
      />
      <Button type="submit" disabled={!hasChanges || update.isPending}>
        {update.isPending ? t("settings.saving") : t("settings.save")}
      </Button>
    </form>
  );
}

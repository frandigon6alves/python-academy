"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/Field";
import { authErrorMessage } from "@/features/auth/error-message";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useUpdateSettings } from "@/lib/api/hooks/settings";
import type { Locale, Theme, User } from "@/lib/api/types";
import { THEMES } from "@/theme/theme";
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

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    update.mutate(form, {
      onSuccess: (saved) => {
        setPreference(saved.theme);
        if (saved.language !== user.language) router.replace(pathname, { locale: saved.language });
      },
    });
  }

  return (
    <form className={styles.section} onSubmit={handleSubmit} aria-labelledby="profile-title">
      <h2 id="profile-title">{t("settings.profileTitle")}</h2>
      {update.isSuccess && <Alert tone="success">{t("settings.saved")}</Alert>}
      {update.isError && <Alert tone="error">{authErrorMessage(update.error, t)}</Alert>}
      <TextField
        label={t("settings.displayName")}
        hint={t("auth.displayNameHint")}
        required
        minLength={2}
        maxLength={40}
        value={form.display_name}
        onChange={(event) => setForm({ ...form, display_name: event.target.value })}
      />
      <SelectField
        label={t("settings.language")}
        value={form.language}
        onChange={(event) => setForm({ ...form, language: event.target.value as Locale })}
        options={[
          { value: "en", label: t("locale.en") },
          { value: "es", label: t("locale.es") },
        ]}
      />
      <SelectField
        label={t("settings.theme")}
        value={form.theme}
        onChange={(event) => setForm({ ...form, theme: event.target.value as Theme })}
        options={THEMES.map((theme) => ({ value: theme, label: t(`theme.${theme}`) }))}
      />
      <Button type="submit" disabled={update.isPending}>
        {t("settings.save")}
      </Button>
    </form>
  );
}

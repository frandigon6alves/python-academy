"use client";

import { useTranslations } from "next-intl";
import { useMe } from "@/lib/api/hooks/auth";
import { useUpdateSettings } from "@/lib/api/hooks/settings";
import type { Theme } from "@/lib/api/types";
import { isTheme, THEMES } from "@/theme/theme";
import { useTheme } from "@/theme/ThemeProvider";
import styles from "./Header.module.css";

export function ThemeSelect() {
  const t = useTranslations("theme");
  const { preference, setPreference } = useTheme();
  const { data: me } = useMe();
  const updateSettings = useUpdateSettings();

  function choose(theme: Theme) {
    setPreference(theme);
    if (me && me.theme !== theme) updateSettings.mutate({ theme });
  }

  return (
    <label className={styles.control}>
      <span className={styles.controlLabel}>{t("label")}</span>
      <select
        className={styles.select}
        value={preference}
        onChange={(event) => {
          if (isTheme(event.target.value)) choose(event.target.value);
        }}
      >
        {THEMES.map((theme) => (
          <option key={theme} value={theme}>
            {t(theme)}
          </option>
        ))}
      </select>
    </label>
  );
}

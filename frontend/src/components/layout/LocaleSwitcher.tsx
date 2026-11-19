"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import { useMe } from "@/lib/api/hooks/auth";
import { useUpdateSettings } from "@/lib/api/hooks/settings";
import styles from "./Header.module.css";

export function LocaleSwitcher() {
  const t = useTranslations("locale");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { data: me } = useMe();
  const updateSettings = useUpdateSettings();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    // Signed-in learners keep their language across devices.
    if (me && me.language !== next) updateSettings.mutate({ language: next });
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <label className={styles.control}>
      <span className={styles.controlLabel}>{t("label")}</span>
      <select
        className={styles.select}
        value={locale}
        disabled={isPending}
        onChange={(event) => switchTo(event.target.value as Locale)}
      >
        {locales.map((code) => (
          <option key={code} value={code} lang={code}>
            {t(code)}
          </option>
        ))}
      </select>
    </label>
  );
}

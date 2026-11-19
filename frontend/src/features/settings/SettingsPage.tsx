"use client";

import { useTranslations } from "next-intl";
import { useMe } from "@/lib/api/hooks/auth";
import { DeleteAccountForm } from "./DeleteAccountForm";
import { PasswordForm } from "./PasswordForm";
import { ProfileForm } from "./ProfileForm";
import styles from "./SettingsPage.module.css";

export function SettingsPage() {
  const t = useTranslations("settings");
  const { data: me } = useMe();
  if (!me) return null;
  return (
    <div className={styles.page}>
      <h1 className="page-title">{t("title")}</h1>
      <ProfileForm user={me} />
      <PasswordForm />
      <DeleteAccountForm />
    </div>
  );
}

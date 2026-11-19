import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RequireAuth } from "@/features/auth/RequireAuth";
import { SettingsPage } from "@/features/settings/SettingsPage";
import { localeOf, pageLocale } from "@/i18n/locale-param";

export async function generateMetadata({ params }: PageProps<"/[locale]/settings">): Promise<Metadata> {
  const t = await getTranslations({ locale: await localeOf(params), namespace: "settings" });
  return { title: t("title") };
}

export default async function Page({ params }: PageProps<"/[locale]/settings">) {
  await pageLocale(params);
  return (
    <div className="container page">
      <RequireAuth>
        <SettingsPage />
      </RequireAuth>
    </div>
  );
}

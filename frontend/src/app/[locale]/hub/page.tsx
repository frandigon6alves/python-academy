import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RequireAuth } from "@/features/auth/RequireAuth";
import { HubPage } from "@/features/hub/HubPage";
import { localeOf, pageLocale } from "@/i18n/locale-param";

export async function generateMetadata({ params }: PageProps<"/[locale]/hub">): Promise<Metadata> {
  const t = await getTranslations({ locale: await localeOf(params), namespace: "nav" });
  return { title: t("hub") };
}

export default async function Page({ params }: PageProps<"/[locale]/hub">) {
  await pageLocale(params);
  return (
    <div className="container page">
      <RequireAuth>
        <HubPage />
      </RequireAuth>
    </div>
  );
}

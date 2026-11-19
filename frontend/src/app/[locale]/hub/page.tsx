import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { RequireAuth } from "@/features/auth/RequireAuth";
import { HubPage } from "@/features/hub/HubPage";

export async function generateMetadata({ params }: PageProps<"/[locale]/hub">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("hub") };
}

export default async function Page({ params }: PageProps<"/[locale]/hub">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="container page">
      <RequireAuth>
        <HubPage />
      </RequireAuth>
    </div>
  );
}

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { GlossaryPage } from "@/features/glossary/GlossaryPage";
import { localeOf, pageLocale } from "@/i18n/locale-param";

export async function generateMetadata({ params }: PageProps<"/[locale]/glossary">): Promise<Metadata> {
  const t = await getTranslations({ locale: await localeOf(params), namespace: "home" });
  return { title: t("glossaryTitle") };
}

export default async function Page({ params, searchParams }: PageProps<"/[locale]/glossary">) {
  const { q } = await searchParams;
  await pageLocale(params);
  return (
    <div className="container page">
      <GlossaryPage initialQuery={typeof q === "string" ? q : ""} />
    </div>
  );
}

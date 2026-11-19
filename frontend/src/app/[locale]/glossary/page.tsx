import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GlossaryPage } from "@/features/glossary/GlossaryPage";

export async function generateMetadata({ params }: PageProps<"/[locale]/glossary">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return { title: t("glossaryTitle") };
}

export default async function Page({ params, searchParams }: PageProps<"/[locale]/glossary">) {
  const { locale } = await params;
  const { q } = await searchParams;
  setRequestLocale(locale);
  return (
    <div className="container page">
      <GlossaryPage initialQuery={typeof q === "string" ? q : ""} />
    </div>
  );
}

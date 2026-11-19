import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SignupForm } from "@/features/auth/SignupForm";
import { safeNextPath } from "@/features/auth/next-path";
import { localeOf, pageLocale } from "@/i18n/locale-param";

export async function generateMetadata({ params }: PageProps<"/[locale]/signup">): Promise<Metadata> {
  const t = await getTranslations({ locale: await localeOf(params), namespace: "nav" });
  return { title: t("signup") };
}

export default async function Page({ params, searchParams }: PageProps<"/[locale]/signup">) {
  const { next } = await searchParams;
  await pageLocale(params);
  return (
    <div className="container page">
      <SignupForm next={safeNextPath(next)} />
    </div>
  );
}

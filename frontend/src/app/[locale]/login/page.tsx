import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/features/auth/LoginForm";
import { safeNextPath } from "@/features/auth/next-path";
import { localeOf, pageLocale } from "@/i18n/locale-param";

export async function generateMetadata({ params }: PageProps<"/[locale]/login">): Promise<Metadata> {
  const t = await getTranslations({ locale: await localeOf(params), namespace: "nav" });
  return { title: t("login") };
}

export default async function Page({ params, searchParams }: PageProps<"/[locale]/login">) {
  const { next } = await searchParams;
  await pageLocale(params);
  return (
    <div className="container page">
      <LoginForm next={safeNextPath(next)} />
    </div>
  );
}

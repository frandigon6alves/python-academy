import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LoginForm } from "@/features/auth/LoginForm";

export async function generateMetadata({ params }: PageProps<"/[locale]/login">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("login") };
}

export default async function Page({ params }: PageProps<"/[locale]/login">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="container page">
      <LoginForm />
    </div>
  );
}

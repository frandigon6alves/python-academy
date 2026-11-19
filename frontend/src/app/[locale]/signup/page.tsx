import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SignupForm } from "@/features/auth/SignupForm";
import { safeNextPath } from "@/features/auth/next-path";

export async function generateMetadata({ params }: PageProps<"/[locale]/signup">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("signup") };
}

export default async function Page({ params, searchParams }: PageProps<"/[locale]/signup">) {
  const { locale } = await params;
  const { next } = await searchParams;
  setRequestLocale(locale);
  return (
    <div className="container page">
      <SignupForm next={safeNextPath(next)} />
    </div>
  );
}

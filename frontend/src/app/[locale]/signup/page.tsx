import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SignupForm } from "@/features/auth/SignupForm";

export async function generateMetadata({ params }: PageProps<"/[locale]/signup">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("signup") };
}

export default async function Page({ params }: PageProps<"/[locale]/signup">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="container page">
      <SignupForm />
    </div>
  );
}

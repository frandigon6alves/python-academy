import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { LeaderboardPage } from "@/features/leaderboard/LeaderboardPage";

export async function generateMetadata({ params }: PageProps<"/[locale]/leaderboard">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "leaderboard" });
  return { title: t("title") };
}

export default async function Page({ params }: PageProps<"/[locale]/leaderboard">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="container page">
      <LeaderboardPage />
    </div>
  );
}

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LeaderboardPage } from "@/features/leaderboard/LeaderboardPage";
import { localeOf, pageLocale } from "@/i18n/locale-param";

export async function generateMetadata({ params }: PageProps<"/[locale]/leaderboard">): Promise<Metadata> {
  const t = await getTranslations({ locale: await localeOf(params), namespace: "leaderboard" });
  return { title: t("title") };
}

export default async function Page({ params }: PageProps<"/[locale]/leaderboard">) {
  await pageLocale(params);
  return (
    <div className="container page">
      <LeaderboardPage />
    </div>
  );
}

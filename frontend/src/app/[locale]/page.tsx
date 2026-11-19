import { setRequestLocale } from "next-intl/server";
import { AcademyPage } from "@/features/academy/AcademyPage";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AcademyPage />;
}

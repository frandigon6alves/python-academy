import { AcademyPage } from "@/features/academy/AcademyPage";
import { pageLocale } from "@/i18n/locale-param";

export default async function Home({ params }: PageProps<"/[locale]">) {
  await pageLocale(params);
  return <AcademyPage />;
}

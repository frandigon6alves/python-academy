import { useTranslations } from "next-intl";
import { Glossary } from "./Glossary";

export function GlossaryPage({ initialQuery }: { initialQuery: string }) {
  const t = useTranslations("home");
  return (
    <>
      <h1 className="page-title">{t("glossaryTitle")}</h1>
      <p className="lead">{t("glossaryLead")}</p>
      <Glossary initialQuery={initialQuery} />
    </>
  );
}

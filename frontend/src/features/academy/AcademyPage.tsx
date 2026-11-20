import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { GlossaryTeaser } from "@/features/glossary/GlossaryTeaser";
import { CourseCatalogue } from "./CourseCatalogue";
import { DemoQuiz } from "./DemoQuiz";
import { Hero } from "./Hero";
import styles from "./AcademyPage.module.css";

function Section({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`container ${styles.section}`}>
      <h2 id={`${id}-title`} className={styles.heading}>
        {title}
      </h2>
      <p className="lead">{lead}</p>
      {children}
    </section>
  );
}

export function AcademyPage() {
  const t = useTranslations("home");
  return (
    <>
      <Hero />
      <Section id="courses" title={t("catalogueTitle")} lead={t("catalogueLead")}>
        <CourseCatalogue />
      </Section>
      <Section id="demo" title={t("demoTitle")} lead={t("demoLead")}>
        <div className={styles.narrow}>
          <DemoQuiz />
        </div>
      </Section>
      <Section id="glossary" title={t("glossaryTitle")} lead={t("glossaryLead")}>
        <GlossaryTeaser />
      </Section>
    </>
  );
}

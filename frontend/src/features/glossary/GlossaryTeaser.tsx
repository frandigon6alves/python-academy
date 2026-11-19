"use client";

import { useLocale, useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/Skeleton";
import { ErrorState, Loading } from "@/components/ui/QueryState";
import { Link } from "@/i18n/navigation";
import { useGlossary } from "@/lib/api/hooks/content";
import { sampleTerms } from "./glossary-utils";
import styles from "./GlossaryTeaser.module.css";

const PREVIEW_COUNT = 6;

/** Home page preview: a search box that opens the glossary page, and a few sample terms. */
export function GlossaryTeaser() {
  const t = useTranslations("glossary");
  const locale = useLocale();
  const glossary = useGlossary();

  return (
    <div className={styles.teaser}>
      {/* A plain GET form: works before hydration and lands on /glossary?q=... */}
      <form action={`/${locale}/glossary`} method="get" role="search" className={styles.form}>
        <label className={styles.search}>
          <span className={styles.label}>{t("search")}</span>
          <input
            type="search"
            name="q"
            placeholder={t("placeholder")}
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <button type="submit" className={styles.submit}>
          {t("searchButton")}
        </button>
      </form>

      {glossary.isPending && (
        <Loading>
          <div className={styles.grid}>
            {Array.from({ length: PREVIEW_COUNT }, (_, index) => (
              <Skeleton key={index} height="6.5rem" radius="var(--radius-md)" />
            ))}
          </div>
        </Loading>
      )}
      {glossary.isError && <ErrorState error={glossary.error} onRetry={() => glossary.refetch()} />}
      {glossary.data && (
        <>
          <dl className={styles.grid}>
            {sampleTerms(glossary.data, PREVIEW_COUNT).map((entry) => (
              <div key={entry.term} className={styles.entry}>
                <dt>{entry.term}</dt>
                <dd>{entry.definition}</dd>
              </div>
            ))}
          </dl>
          <Link href="/glossary" className={styles.more}>
            {t("seeAll", { count: glossary.data.length })} <span aria-hidden="true">→</span>
          </Link>
        </>
      )}
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ErrorState, Loading } from "@/components/ui/QueryState";
import { useGlossary } from "@/lib/api/hooks/content";
import { filterTerms, groupByLetter } from "./glossary-utils";
import styles from "./Glossary.module.css";

export function Glossary() {
  const t = useTranslations("glossary");
  const glossary = useGlossary();
  const [query, setQuery] = useState("");

  if (glossary.isPending) return <Loading />;
  if (glossary.isError) return <ErrorState error={glossary.error} onRetry={() => glossary.refetch()} />;

  const matches = filterTerms(glossary.data, query);
  const groups = groupByLetter(matches);

  return (
    <div>
      <div className={styles.toolbar}>
        <label className={styles.search}>
          <span className={styles.searchLabel}>{t("search")}</span>
          <input
            type="search"
            value={query}
            placeholder={t("placeholder")}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <p className={styles.count} aria-live="polite">
          {t("count", { count: matches.length })}
        </p>
      </div>

      {groups.length > 0 && (
        <nav aria-label={t("letters")} className={styles.letters}>
          {groups.map(([letter]) => (
            <a key={letter} href={`#glossary-${letter}`}>
              {letter}
            </a>
          ))}
        </nav>
      )}

      {matches.length === 0 && <p>{t("empty", { query })}</p>}

      {groups.map(([letter, entries]) => (
        <section key={letter} aria-labelledby={`glossary-${letter}`} className={styles.group}>
          <h3 id={`glossary-${letter}`} className={styles.letter}>
            {letter}
          </h3>
          <dl className={styles.list}>
            {entries.map((entry) => (
              <div key={entry.term} className={styles.entry}>
                <dt>{entry.term}</dt>
                <dd>{entry.definition}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

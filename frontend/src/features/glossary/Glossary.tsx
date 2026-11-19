"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Skeleton, SkeletonRows } from "@/components/ui/Skeleton";
import { ErrorState, Loading } from "@/components/ui/QueryState";
import { useGlossary } from "@/lib/api/hooks/content";
import { ALPHABET, filterTerms, groupByLetter } from "./glossary-utils";
import styles from "./Glossary.module.css";

/** Keeps the search in the address bar, so a filtered glossary can be shared or reloaded. */
function rememberQuery(query: string) {
  const url = new URL(window.location.href);
  if (query) url.searchParams.set("q", query);
  else url.searchParams.delete("q");
  window.history.replaceState(window.history.state, "", url);
}

export function Glossary({ initialQuery = "" }: { initialQuery?: string }) {
  const t = useTranslations("glossary");
  const glossary = useGlossary();
  const [query, setQuery] = useState(initialQuery);

  if (glossary.isPending) {
    return (
      <Loading>
        <Skeleton height="44px" width="min(28rem, 100%)" radius="var(--radius-pill)" />
        <div style={{ height: "var(--space-5)" }} />
        <SkeletonRows count={6} height="4.5rem" />
      </Loading>
    );
  }
  if (glossary.isError) return <ErrorState error={glossary.error} onRetry={() => glossary.refetch()} />;

  const matches = filterTerms(glossary.data, query);
  const groups = groupByLetter(matches);
  const present = new Set(groups.map(([letter]) => letter));

  function search(value: string) {
    setQuery(value);
    rememberQuery(value.trim());
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.searchRow}>
          <label className={styles.search}>
            <span className={styles.searchLabel}>{t("search")}</span>
            <input
              type="search"
              value={query}
              placeholder={t("placeholder")}
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => search(event.target.value)}
            />
          </label>
          <p className={styles.count} aria-live="polite">
            {t("count", { count: matches.length })}
          </p>
        </div>

        <nav aria-label={t("letters")} className={styles.letters}>
          {ALPHABET.map((letter) =>
            present.has(letter) ? (
              <a key={letter} href={`#glossary-${letter}`}>
                {letter}
              </a>
            ) : (
              // Letters without terms stay visible for orientation but are not links.
              <span key={letter} aria-hidden="true">
                {letter}
              </span>
            ),
          )}
          {present.has("#") && <a href="#glossary-#">#</a>}
        </nav>
      </div>

      {matches.length === 0 && (
        <div className={styles.empty}>
          <p>{t("empty", { query })}</p>
          <button type="button" className={styles.clear} onClick={() => search("")}>
            {t("clear")}
          </button>
        </div>
      )}

      {groups.map(([letter, entries]) => (
        <section key={letter} aria-labelledby={`glossary-${letter}`} className={styles.group}>
          <h2 id={`glossary-${letter}`} className={styles.letter}>
            {letter}
          </h2>
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

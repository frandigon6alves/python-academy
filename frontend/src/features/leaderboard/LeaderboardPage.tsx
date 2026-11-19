"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ErrorState, Loading } from "@/components/ui/QueryState";
import { useLeaderboard } from "@/lib/api/hooks/learning";
import styles from "./LeaderboardPage.module.css";

type Period = "weekly" | "all_time";
const PERIODS: Period[] = ["weekly", "all_time"];
const MEDALS = ["🥇", "🥈", "🥉"];

export function LeaderboardPage() {
  const t = useTranslations("leaderboard");
  const [period, setPeriod] = useState<Period>("weekly");
  const board = useLeaderboard(period);

  return (
    <div className={styles.page}>
      <h1 className="page-title">{t("title")}</h1>
      <p className="lead">{t("lead")}</p>

      {/* A toggle group rather than ARIA tabs: it simply filters the same table. */}
      <div className={styles.toggle} role="group" aria-label={t("title")}>
        {PERIODS.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={period === value}
            className={styles.toggleButton}
            onClick={() => setPeriod(value)}
          >
            {value === "weekly" ? t("weekly") : t("allTime")}
          </button>
        ))}
      </div>

      {board.isPending && <Loading />}
      {board.isError && <ErrorState error={board.error} onRetry={() => board.refetch()} />}
      {board.data && board.data.entries.length === 0 && <p>{t("empty")}</p>}
      {board.data && board.data.entries.length > 0 && (
        <table className={styles.table}>
          <caption className="visually-hidden">
            {t("title")}: {period === "weekly" ? t("weekly") : t("allTime")}
          </caption>
          <thead>
            <tr>
              <th scope="col">{t("rank")}</th>
              <th scope="col">{t("name")}</th>
              <th scope="col">{t("level")}</th>
              <th scope="col">{t("xp")}</th>
            </tr>
          </thead>
          <tbody>
            {board.data.entries.map((entry) => (
              <tr key={entry.rank} className={entry.is_you ? styles.you : undefined}>
                <td>
                  {MEDALS[entry.rank - 1] ? (
                    <span role="img" aria-label={String(entry.rank)}>
                      {MEDALS[entry.rank - 1]}
                    </span>
                  ) : (
                    entry.rank
                  )}
                </td>
                <th scope="row">
                  {entry.display_name}
                  {entry.is_you && <span className={styles.youTag}> ({t("you")})</span>}
                </th>
                <td>{entry.level}</td>
                <td>{entry.xp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

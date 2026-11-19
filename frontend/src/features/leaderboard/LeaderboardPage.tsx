"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { ErrorState, Loading } from "@/components/ui/QueryState";
import { SkeletonRows } from "@/components/ui/Skeleton";
import { SignInPrompt } from "@/features/auth/SignInPrompt";
import { useMe } from "@/lib/api/hooks/auth";
import { useLeaderboard } from "@/lib/api/hooks/learning";
import styles from "./LeaderboardPage.module.css";

type Period = "weekly" | "all_time";
const PERIODS: Period[] = ["weekly", "all_time"];
const MEDALS = ["🥇", "🥈", "🥉"];

export function LeaderboardPage() {
  const t = useTranslations("leaderboard");
  const { data: me } = useMe();
  const [period, setPeriod] = useState<Period>("weekly");
  const board = useLeaderboard(period);
  const periodName = period === "weekly" ? t("weekly") : t("allTime");

  return (
    <div className={styles.page}>
      <h1 className="page-title">{t("title")}</h1>
      <p className="lead">{t("lead")}</p>

      {/* A toggle group rather than ARIA tabs: it simply filters the same table. */}
      <div className={styles.toggle} role="group" aria-label={t("period")}>
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

      {board.isPending && (
        <Loading>
          <SkeletonRows count={5} height="3.25rem" />
        </Loading>
      )}
      {board.isError && <ErrorState error={board.error} onRetry={() => board.refetch()} />}
      {board.data && board.data.entries.length === 0 && (
        <p className={styles.empty}>
          <span aria-hidden="true">🏁 </span>
          {t("empty")}
        </p>
      )}
      {board.data && board.data.entries.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption className="visually-hidden">
              {t("title")}: {periodName}
            </caption>
            <thead>
              <tr>
                <th scope="col" className={styles.rank}>
                  {t("rank")}
                </th>
                <th scope="col">{t("name")}</th>
                <th scope="col" className={styles.number}>
                  {t("level")}
                </th>
                <th scope="col" className={styles.number}>
                  {t("xp")}
                </th>
              </tr>
            </thead>
            <tbody>
              {board.data.entries.map((entry) => (
                <tr
                  key={entry.rank}
                  className={entry.is_you ? styles.you : undefined}
                  aria-current={entry.is_you ? "true" : undefined}
                >
                  <td className={styles.rank}>
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
                    {entry.is_you && <span className={styles.youTag}>{t("you")}</span>}
                  </th>
                  <td className={styles.number}>{entry.level}</td>
                  <td className={styles.number}>{entry.xp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {me === null && (
        <div className={styles.join}>
          <SignInPrompt next="/leaderboard">{t("join")}</SignInPrompt>
        </div>
      )}
    </div>
  );
}

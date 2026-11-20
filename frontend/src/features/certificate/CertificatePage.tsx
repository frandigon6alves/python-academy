"use client";

import { useFormatter, useTranslations } from "next-intl";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { ErrorState, Loading } from "@/components/ui/QueryState";
import { Skeleton } from "@/components/ui/Skeleton";
import { ApiError } from "@/lib/api/client";
import { useCertificate } from "@/lib/api/hooks/learning";
import { usePageTitle } from "@/lib/use-page-title";
import styles from "./CertificatePage.module.css";

export function CertificatePage({ verificationId }: { verificationId: string }) {
  const t = useTranslations("certificate");
  const format = useFormatter();
  const certificate = useCertificate(verificationId);
  usePageTitle(certificate.data && `${t("heading")}: ${certificate.data.course_title}`);

  if (certificate.isPending) {
    return (
      <Loading>
        <div className={styles.wrapper}>
          <Skeleton width="min(52rem, 100%)" height="28rem" radius="var(--radius-lg)" />
        </div>
      </Loading>
    );
  }
  if (certificate.isError) {
    // Only a 404 means the ID is unknown; an outage or a lost connection can be retried.
    if (certificate.error instanceof ApiError && certificate.error.status === 404) {
      return <Alert tone="error">{t("notFound")}</Alert>;
    }
    return <ErrorState error={certificate.error} onRetry={() => certificate.refetch()} />;
  }
  const data = certificate.data;

  return (
    <div className={styles.wrapper}>
      <div className={styles.certificate}>
        <p className={styles.brand}>
          <span aria-hidden="true" className={styles.mark}>
            Py
          </span>
          Python Academy
        </p>
        <h1 className={styles.heading}>{t("heading")}</h1>
        <p>{t("presentedTo")}</p>
        <p className={styles.name}>{data.recipient_name}</p>
        <p>{t("completed")}</p>
        <p className={styles.course}>{data.course_title}</p>
        <p>{t("score", { percent: data.score_percent })}</p>
        <div className={styles.footer}>
          <span>
            {t("issuedOn", { date: format.dateTime(new Date(data.issued_at), { dateStyle: "long" }) })}
          </span>
          <span className={styles.id}>{t("verification", { id: data.verification_id })}</span>
        </div>
      </div>
      <p className={`${styles.note} no-print`}>{t("verifyNote")}</p>
      <Button className="no-print" onClick={() => window.print()}>
        {t("print")}
      </Button>
    </div>
  );
}

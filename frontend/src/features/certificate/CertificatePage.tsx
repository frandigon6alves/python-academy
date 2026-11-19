"use client";

import { useFormatter, useTranslations } from "next-intl";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/QueryState";
import { useCertificate } from "@/lib/api/hooks/learning";
import styles from "./CertificatePage.module.css";

export function CertificatePage({ verificationId }: { verificationId: string }) {
  const t = useTranslations("certificate");
  const format = useFormatter();
  const certificate = useCertificate(verificationId);

  if (certificate.isPending) return <Loading />;
  if (certificate.isError) return <Alert tone="error">{t("notFound")}</Alert>;
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
            {t("issuedOn", { date: format.dateTime(new Date(data.issued_at + "Z"), { dateStyle: "long" }) })}
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

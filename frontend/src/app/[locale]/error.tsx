"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

/** Shown instead of a page that failed to render; the header and footer stay usable. */
export default function PageError({ retry }: { error: unknown; retry: () => void }) {
  const t = useTranslations();
  return (
    <div className="container page">
      <h1 className="page-title">{t("errors.title")}</h1>
      <p className="lead">{t("errors.generic")}</p>
      <Button onClick={retry}>{t("common.retry")}</Button>
    </div>
  );
}

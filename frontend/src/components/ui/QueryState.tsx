"use client";

import { useTranslations } from "next-intl";
import { ApiError } from "@/lib/api/client";
import { Alert } from "./Alert";
import { Button } from "./Button";

export function Loading() {
  const t = useTranslations("common");
  return (
    <p role="status" aria-live="polite">
      {t("loading")}
    </p>
  );
}

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const t = useTranslations();
  const message =
    error instanceof ApiError
      ? error.status === 404
        ? t("common.notFound")
        : t("errors.generic")
      : t("errors.network");
  return (
    <Alert tone="error">
      <p>{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          {t("common.retry")}
        </Button>
      )}
    </Alert>
  );
}

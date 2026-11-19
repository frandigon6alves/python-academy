"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { ApiError } from "@/lib/api/client";
import { Alert } from "./Alert";
import { Button } from "./Button";

/**
 * Loading state. Pass skeleton shapes as children to reserve the space of the real content;
 * screen readers hear "Loading…" either way.
 */
export function Loading({ children }: { children?: ReactNode }) {
  const t = useTranslations("common");
  if (!children) {
    return (
      <p role="status" aria-live="polite">
        {t("loading")}
      </p>
    );
  }
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="visually-hidden">{t("loading")}</span>
      <div aria-hidden="true">{children}</div>
    </div>
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

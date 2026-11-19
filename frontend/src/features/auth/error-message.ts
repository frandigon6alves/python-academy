import { ApiError } from "@/lib/api/client";

type Translate = (key: string) => string;

/** Maps backend problem codes to friendly, translated messages. */
export function authErrorMessage(error: unknown, t: Translate): string {
  if (!(error instanceof ApiError)) return t("errors.network");
  switch (error.code) {
    case "invalid-credentials":
      return t("auth.invalidCredentials");
    case "email-taken":
      return t("auth.emailTaken");
    case "rate-limited":
      return t("auth.rateLimited");
    case "validation-error":
      return t("auth.checkFields");
    case "wrong-password":
      return t("settings.wrongPassword");
    default:
      return t("errors.generic");
  }
}

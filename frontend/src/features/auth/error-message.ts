import { ApiError } from "@/lib/api/client";

const MESSAGE_BY_CODE = {
  "invalid-credentials": "auth.invalidCredentials",
  "email-taken": "auth.emailTaken",
  "rate-limited": "auth.rateLimited",
  "validation-error": "auth.checkFields",
  "wrong-password": "settings.wrongPassword",
} as const;

type ProblemCode = keyof typeof MESSAGE_BY_CODE;
type AuthErrorKey = (typeof MESSAGE_BY_CODE)[ProblemCode] | "errors.generic" | "errors.network";

function isKnownCode(code: string | null): code is ProblemCode {
  return code !== null && Object.hasOwn(MESSAGE_BY_CODE, code);
}

/** The translation key of a friendly message for a failed auth or settings request. */
export function authErrorKey(error: unknown): AuthErrorKey {
  if (!(error instanceof ApiError)) return "errors.network";
  return isKnownCode(error.code) ? MESSAGE_BY_CODE[error.code] : "errors.generic";
}

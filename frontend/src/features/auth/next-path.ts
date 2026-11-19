import { locales } from "@/i18n/routing";

const LOCALE_PREFIX = new RegExp(`^/(${locales.join("|")})(?=/|$)`);

/**
 * Validates the ?next= value used to return after logging in or signing up.
 * Only same-site paths are accepted ("/courses/python-basics"); anything that could
 * leave the site ("//evil.example", "https://…", "/\\evil.example") is rejected.
 * A locale prefix is dropped, since the router adds the learner's own locale.
 */
export function safeNextPath(value: unknown): string | null {
  if (typeof value !== "string" || !/^\/(?![/\\])[^\s\\]*$/.test(value)) return null;
  return value.replace(LOCALE_PREFIX, "") || "/";
}

/** Link to an auth page that returns to `next` afterwards. */
export function authHref(page: "/login" | "/signup", next: string | null | undefined): string {
  return next ? `${page}?next=${encodeURIComponent(next)}` : page;
}

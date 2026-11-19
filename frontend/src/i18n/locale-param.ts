import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing, type Locale } from "./routing";

type LocaleParams = Promise<{ locale: string }>;

/** The [locale] route segment, typed; unknown values render the 404 page. */
export async function localeOf(params: LocaleParams): Promise<Locale> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return locale;
}

/** For pages and layouts: also enables static rendering for the locale (next-intl). */
export async function pageLocale(params: LocaleParams): Promise<Locale> {
  const locale = await localeOf(params);
  setRequestLocale(locale);
  return locale;
}

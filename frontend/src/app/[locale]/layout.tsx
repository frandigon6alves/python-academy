import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { localeOf, pageLocale } from "@/i18n/locale-param";
import { routing } from "@/i18n/routing";
import { themeInitScript } from "@/theme/theme";
import { Providers } from "./providers";
import "@/styles/globals.css";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// viewport-fit=cover lets the header and menu pad themselves with the safe-area insets.
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1823" },
  ],
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const t = await getTranslations({ locale: await localeOf(params), namespace: "meta" });
  return { title: { default: t("title"), template: `%s · ${t("title")}` }, description: t("description") };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const locale = await pageLocale(params);

  return (
    // The theme script sets data-theme before React hydrates, hence suppressHydrationWarning.
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <Providers>
            <Header />
            <main id="main" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

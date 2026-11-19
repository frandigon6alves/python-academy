"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useLogout, useMe } from "@/lib/api/hooks/auth";
import { buttonClass } from "@/components/ui/Button";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeSelect } from "./ThemeSelect";
import styles from "./Header.module.css";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isCurrent = pathname === href;
  return (
    <Link href={href} className={styles.navLink} aria-current={isCurrent ? "page" : undefined}>
      {children}
    </Link>
  );
}

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const { data: me } = useMe();
  const logout = useLogout();

  function handleLogout() {
    // A full page load drops every cached learner query and beats the
    // sign-in redirect that protected pages would otherwise trigger.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- intentional full reload
    logout.mutate(undefined, { onSuccess: () => window.location.assign(`/${locale}`) });
  }

  return (
    <header className={`${styles.header} no-print`}>
      <a href="#main" className={styles.skipLink}>
        {t("skipToContent")}
      </a>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.logo}>
          <span aria-hidden="true" className={styles.logoMark}>
            Py
          </span>
          Python Academy
        </Link>
        <nav aria-label={t("main")} className={styles.nav}>
          <NavLink href="/">{t("home")}</NavLink>
          <NavLink href="/leaderboard">{t("leaderboard")}</NavLink>
          {me && <NavLink href="/hub">{t("hub")}</NavLink>}
          {me && <NavLink href="/settings">{t("settings")}</NavLink>}
        </nav>
        <div className={styles.actions}>
          <LocaleSwitcher />
          <ThemeSelect />
          {me ? (
            <button type="button" className={buttonClass("ghost")} onClick={handleLogout}>
              {t("logout")}
            </button>
          ) : (
            <>
              <Link href="/login" className={buttonClass("ghost")}>
                {t("login")}
              </Link>
              <Link href="/signup" className={buttonClass("primary")}>
                {t("signup")}
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

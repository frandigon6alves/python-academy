"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, type FocusEvent, type ReactNode } from "react";
import { buttonClass } from "@/components/ui/Button";
import { Link, usePathname } from "@/i18n/navigation";
import { useLogout, useMe } from "@/lib/api/hooks/auth";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeSelect } from "./ThemeSelect";
import styles from "./Header.module.css";

const MENU_ID = "site-menu";

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  return (
    <Link href={href} className={styles.navLink} aria-current={pathname === href ? "page" : undefined}>
      {children}
    </Link>
  );
}

/**
 * Site header. On wide screens everything sits in one row. On narrow screens the bar only
 * shows the logo and a "Menu" button that discloses the links, the language and theme
 * switchers and the account actions (one set of elements, rearranged by CSS).
 */
export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const { data: me, isPending } = useMe();
  const logout = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Close the menu after navigating (state adjusted during render, no effect needed).
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  // While open: Escape closes it and returns focus to the button; a tap outside closes it.
  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    }
    function onPointerDown(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  // Tabbing out of the header closes the menu, so it never covers the focused element.
  function handleBlur(event: FocusEvent<HTMLElement>) {
    const next = event.relatedTarget;
    if (next && !event.currentTarget.contains(next)) setMenuOpen(false);
  }

  function handleLogout() {
    // A full page load drops every cached learner query and beats the
    // sign-in redirect that protected pages would otherwise trigger.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- intentional full reload
    logout.mutate(undefined, { onSuccess: () => window.location.assign(`/${locale}`) });
  }

  return (
    <header ref={headerRef} className={`${styles.header} no-print`} onBlur={handleBlur}>
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

        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={menuOpen}
          aria-controls={MENU_ID}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <MenuIcon open={menuOpen} />
          {t("menu")}
        </button>

        <div id={MENU_ID} className={styles.menu} data-open={menuOpen}>
          <nav aria-label={t("main")} className={styles.nav}>
            <NavLink href="/">{t("home")}</NavLink>
            <NavLink href="/glossary">{t("glossary")}</NavLink>
            <NavLink href="/leaderboard">{t("leaderboard")}</NavLink>
            {me && <NavLink href="/hub">{t("hub")}</NavLink>}
            {me && <NavLink href="/settings">{t("settings")}</NavLink>}
          </nav>
          <div className={styles.preferences}>
            <LocaleSwitcher />
            <ThemeSelect />
          </div>
          <div className={styles.account}>
            {isPending ? (
              // Holds the space of the account buttons so the header does not jump.
              <span className={styles.accountPlaceholder} aria-hidden="true" />
            ) : me ? (
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
      </div>
    </header>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" className={styles.menuIcon}>
      {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 5.5h14M3 10h14M3 14.5h14" />}
    </svg>
  );
}

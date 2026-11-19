import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { buttonClass } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { authHref } from "./next-path";
import styles from "./SignInPrompt.module.css";

/** Explains why an account is needed and offers sign-up and log-in, returning to `next` afterwards. */
export function SignInPrompt({ next, children }: { next: string; children: ReactNode }) {
  const t = useTranslations("nav");
  return (
    <div className={styles.prompt}>
      <p>{children}</p>
      <div className={styles.actions}>
        <Link href={authHref("/signup", next)} className={buttonClass("primary")}>
          {t("signup")}
        </Link>
        <Link href={authHref("/login", next)} className={buttonClass("secondary")}>
          {t("login")}
        </Link>
      </div>
    </div>
  );
}

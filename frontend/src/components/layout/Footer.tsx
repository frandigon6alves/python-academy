import { useTranslations } from "next-intl";
import styles from "./Footer.module.css";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className={`${styles.footer} no-print`}>
      <div className="container">
        <p>{t("tagline")}</p>
        <p>{t("license")}</p>
      </div>
    </footer>
  );
}

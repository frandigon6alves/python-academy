import { useTranslations } from "next-intl";
import { buttonClass } from "@/components/ui/Button";
import styles from "./Hero.module.css";

const SAMPLE = `name = "Ada"
level = 3
print(f"{name} reached level {level}!")`;

export function Hero() {
  const t = useTranslations("home");
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <div>
          <p className={styles.eyebrow}>{t("eyebrow")}</p>
          <h1 id="hero-title" className={styles.title}>
            {t("title")}
          </h1>
          <p className={styles.lead}>{t("lead")}</p>
          <div className={styles.actions}>
            <a href="#courses" className={buttonClass("primary")}>
              {t("start")}
            </a>
            <a href="#demo" className={buttonClass("secondary")}>
              {t("tryDemo")}
            </a>
          </div>
          <ul className={styles.features}>
            <li>{t("featureLessons")}</li>
            <li>{t("featureXp")}</li>
            <li>{t("featureCertificates")}</li>
          </ul>
        </div>
        <figure className={styles.terminal} aria-hidden="true">
          <div className={styles.dots}>
            <span />
            <span />
            <span />
          </div>
          <pre>
            <code>{SAMPLE}</code>
          </pre>
          <pre className={styles.output}>
            <code>Ada reached level 3!</code>
          </pre>
        </figure>
      </div>
    </section>
  );
}

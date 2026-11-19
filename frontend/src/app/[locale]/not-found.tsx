import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("common");
  return (
    <div className="container page">
      <h1 className="page-title">404</h1>
      <p className="lead">{t("notFound")}</p>
      <Link href="/">{t("backHome")}</Link>
    </div>
  );
}

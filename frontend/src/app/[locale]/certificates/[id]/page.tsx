import { CertificatePage } from "@/features/certificate/CertificatePage";
import { pageLocale } from "@/i18n/locale-param";

export default async function Certificate({ params }: PageProps<"/[locale]/certificates/[id]">) {
  const { id } = await params;
  await pageLocale(params);
  return (
    <div className="container page">
      <CertificatePage verificationId={id} />
    </div>
  );
}

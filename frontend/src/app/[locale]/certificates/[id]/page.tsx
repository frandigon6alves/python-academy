import { CertificatePage } from "@/features/certificate/CertificatePage";

export default async function Certificate({ params }: PageProps<"/[locale]/certificates/[id]">) {
  const { id } = await params;
  return (
    <div className="container page">
      <CertificatePage verificationId={id} />
    </div>
  );
}

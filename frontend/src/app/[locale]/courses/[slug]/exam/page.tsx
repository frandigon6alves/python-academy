import { RequireAuth } from "@/features/auth/RequireAuth";
import { ExamPage } from "@/features/exam/ExamPage";
import { pageLocale } from "@/i18n/locale-param";

export default async function Exam({ params }: PageProps<"/[locale]/courses/[slug]/exam">) {
  const { slug } = await params;
  await pageLocale(params);
  return (
    <div className="container page">
      <RequireAuth>
        <ExamPage courseSlug={slug} />
      </RequireAuth>
    </div>
  );
}

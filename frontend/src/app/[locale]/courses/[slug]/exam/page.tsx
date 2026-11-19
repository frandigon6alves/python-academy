import { RequireAuth } from "@/features/auth/RequireAuth";
import { ExamPage } from "@/features/exam/ExamPage";

export default async function Exam({ params }: PageProps<"/[locale]/courses/[slug]/exam">) {
  const { slug } = await params;
  return (
    <div className="container page">
      <RequireAuth>
        <ExamPage courseSlug={slug} />
      </RequireAuth>
    </div>
  );
}

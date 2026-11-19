import { LessonPage } from "@/features/lesson/LessonPage";
import { pageLocale } from "@/i18n/locale-param";

export default async function Lesson({ params }: PageProps<"/[locale]/courses/[slug]/lessons/[lesson]">) {
  const { slug, lesson } = await params;
  await pageLocale(params);
  return (
    <div className="container page">
      <LessonPage courseSlug={slug} lessonSlug={lesson} />
    </div>
  );
}

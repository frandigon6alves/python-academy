import { LessonPage } from "@/features/lesson/LessonPage";

export default async function Lesson({ params }: PageProps<"/[locale]/courses/[slug]/lessons/[lesson]">) {
  const { slug, lesson } = await params;
  return (
    <div className="container page">
      <LessonPage courseSlug={slug} lessonSlug={lesson} />
    </div>
  );
}

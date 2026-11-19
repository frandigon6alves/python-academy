import { CoursePage } from "@/features/course/CoursePage";

export default async function Course({ params }: PageProps<"/[locale]/courses/[slug]">) {
  const { slug } = await params;
  return (
    <div className="container page">
      <CoursePage slug={slug} />
    </div>
  );
}

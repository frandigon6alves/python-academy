import { CoursePage } from "@/features/course/CoursePage";
import { pageLocale } from "@/i18n/locale-param";

export default async function Course({ params }: PageProps<"/[locale]/courses/[slug]">) {
  const { slug } = await params;
  await pageLocale(params);
  return (
    <div className="container page">
      <CoursePage slug={slug} />
    </div>
  );
}

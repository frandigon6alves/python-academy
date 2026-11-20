// Public course content. Every query is keyed by locale so switching language refetches.
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { api, apiPath } from "../client";
import { queryKeys } from "../query-keys";
import type {
  CourseDetail,
  CourseSummary,
  GlossaryEntry,
  LessonDetail,
  Question,
  QuestionResult,
} from "../types";

export function useCourses() {
  const lang = useLocale();
  return useQuery({
    queryKey: queryKeys.courses(lang),
    queryFn: ({ signal }) => api<CourseSummary[]>("/courses", { lang, signal }),
  });
}

export function useCourse(slug: string, enabled = true) {
  const lang = useLocale();
  return useQuery({
    queryKey: queryKeys.course(slug, lang),
    queryFn: ({ signal }) => api<CourseDetail>(apiPath`/courses/${slug}`, { lang, signal }),
    enabled,
  });
}

export function useLesson(courseSlug: string, lessonSlug: string) {
  const lang = useLocale();
  return useQuery({
    queryKey: queryKeys.lesson(courseSlug, lessonSlug, lang),
    queryFn: ({ signal }) =>
      api<LessonDetail>(apiPath`/courses/${courseSlug}/lessons/${lessonSlug}`, { lang, signal }),
  });
}

export function useGlossary() {
  const lang = useLocale();
  return useQuery({
    queryKey: queryKeys.glossary(lang),
    queryFn: ({ signal }) => api<GlossaryEntry[]>("/glossary", { lang, signal }),
  });
}

export function useDemoQuiz() {
  const lang = useLocale();
  return useQuery({
    queryKey: queryKeys.demoQuiz(lang),
    queryFn: ({ signal }) => api<Question[]>("/demo-quiz", { lang, signal }),
  });
}

export function useCheckDemoAnswer() {
  const lang = useLocale();
  return useMutation({
    mutationFn: ({ questionId, choice }: { questionId: number; choice: number }) =>
      api<QuestionResult>(apiPath`/demo-quiz/${questionId}/check`, {
        method: "POST",
        body: { choice },
        lang,
      }),
  });
}

// Learner-specific data: progress, quizzes, exams, gamification and certificates.
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { api, apiPath } from "../client";
import { queryKeys } from "../query-keys";
import type {
  Answer,
  Certificate,
  Exam,
  ExamResult,
  GamificationSummary,
  Leaderboard,
  ProgressOverview,
  QuizResult,
} from "../types";
import { useMe } from "./auth";

export function useProgress() {
  const lang = useLocale();
  const { data: me } = useMe();
  return useQuery({
    queryKey: queryKeys.progress(lang),
    queryFn: () => api<ProgressOverview>("/progress/me", { lang }),
    enabled: Boolean(me),
  });
}

export function useGamification() {
  const lang = useLocale();
  const { data: me } = useMe();
  return useQuery({
    queryKey: queryKeys.gamification(lang),
    queryFn: () => api<GamificationSummary>("/gamification/me", { lang }),
    enabled: Boolean(me),
  });
}

export function useLeaderboard(period: "weekly" | "all_time") {
  return useQuery({
    queryKey: queryKeys.leaderboard(period),
    queryFn: () => api<Leaderboard>(`/gamification/leaderboard?period=${period}`),
  });
}

/** After any graded submission, progress, XP and rankings may have changed. */
function useRefreshLearner() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["learner"] });
}

export function useSubmitQuiz(lessonId: number) {
  const lang = useLocale();
  const refresh = useRefreshLearner();
  return useMutation({
    mutationFn: (answers: Answer[]) =>
      api<QuizResult>(apiPath`/lessons/${lessonId}/quiz`, { method: "POST", body: { answers }, lang }),
    onSuccess: refresh,
  });
}

export function useExam(courseSlug: string, enabled: boolean) {
  const lang = useLocale();
  return useQuery({
    queryKey: queryKeys.exam(courseSlug, lang),
    queryFn: () => api<Exam>(apiPath`/exams/${courseSlug}`, { lang }),
    enabled,
    retry: false,
  });
}

export function useSubmitExam(courseSlug: string) {
  const lang = useLocale();
  const refresh = useRefreshLearner();
  return useMutation({
    mutationFn: (answers: Answer[]) =>
      api<ExamResult>(apiPath`/exams/${courseSlug}`, { method: "POST", body: { answers }, lang }),
    onSuccess: refresh,
  });
}

export function useCertificate(verificationId: string) {
  const lang = useLocale();
  return useQuery({
    queryKey: queryKeys.certificate(verificationId, lang),
    queryFn: () => api<Certificate>(apiPath`/certificates/${verificationId}`, { lang }),
    retry: false,
  });
}

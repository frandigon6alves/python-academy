// Central list of TanStack Query keys, so invalidation stays consistent.
export const queryKeys = {
  me: ["me"] as const,
  courses: (lang: string) => ["courses", lang] as const,
  course: (slug: string, lang: string) => ["course", slug, lang] as const,
  lesson: (course: string, lesson: string, lang: string) => ["lesson", course, lesson, lang] as const,
  glossary: (lang: string) => ["glossary", lang] as const,
  demoQuiz: (lang: string) => ["demo-quiz", lang] as const,
  certificate: (id: string, lang: string) => ["certificate", id, lang] as const,
  // Everything below depends on the signed-in learner and is reset on login/logout.
  learner: ["learner"] as const,
  progress: (lang: string) => ["learner", "progress", lang] as const,
  gamification: (lang: string) => ["learner", "gamification", lang] as const,
  // Whether the exam is unlocked depends on the learner's progress.
  exam: (course: string, lang: string) => ["learner", "exam", course, lang] as const,
  leaderboards: ["learner", "leaderboard"] as const,
  leaderboard: (period: string) => ["learner", "leaderboard", period] as const,
};

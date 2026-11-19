// Response shapes of the FastAPI backend (see /docs for the full OpenAPI schema).
import type { Locale } from "@/i18n/routing";

export type { Locale };
export type Theme = "system" | "light" | "dark";

export interface User {
  id: number;
  email: string;
  display_name: string;
  language: Locale;
  theme: Theme;
}

export interface CourseSummary {
  slug: string;
  level: "beginner" | "intermediate";
  title: string;
  summary: string;
  lesson_count: number;
  minutes: number;
}

export interface LessonLink {
  id: number;
  slug: string;
  title: string;
  minutes: number;
}

export interface CourseDetail extends CourseSummary {
  lessons: LessonLink[];
  exam_question_count: number;
}

export interface Question {
  id: number;
  prompt: string;
  code: string | null;
  options: string[];
}

export interface LessonDetail {
  id: number;
  slug: string;
  title: string;
  minutes: number;
  body_markdown: string;
  takeaways: string[];
  quiz: Question[];
  course_slug: string;
  course_title: string;
  previous: LessonLink | null;
  next: LessonLink | null;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export interface QuestionResult {
  question_id: number;
  choice: number | null;
  correct_index: number;
  is_correct: boolean;
  explanation: string;
}

export interface Answer {
  question_id: number;
  choice: number;
}

export interface Level {
  level: number;
  xp: number;
  level_start_xp: number;
  next_level_xp: number;
  percent: number;
}

export interface Badge {
  code: string;
  icon: string;
  name: string;
  description: string;
  earned: boolean;
  awarded_at: string | null;
}

export interface Quest {
  code: string;
  period: "daily" | "weekly";
  name: string;
  progress: number;
  target: number;
  xp_reward: number;
  completed: boolean;
}

export interface Rewards {
  xp_gained: number;
  level: Level;
  leveled_up: boolean;
  new_badges: Badge[];
  completed_quests: Quest[];
}

export interface QuizResult {
  correct: number;
  total: number;
  results: QuestionResult[];
  rewards: Rewards;
}

export interface ExamResult extends QuizResult {
  percent: number;
  passed: boolean;
  certificate_id: string | null;
}

export interface Exam {
  course_slug: string;
  course_title: string;
  pass_percent: number;
  questions: Question[];
}

export interface CourseProgress {
  course_slug: string;
  lesson_count: number;
  completed_lessons: string[];
  percent: number;
  exam_passed: boolean;
  certificate_id: string | null;
}

export interface ProgressOverview {
  courses: CourseProgress[];
  continue_learning: {
    course_slug: string;
    course_title: string;
    lesson_slug: string;
    lesson_title: string;
  } | null;
}

export interface GamificationSummary {
  level: Level;
  streak_days: number;
  badges: Badge[];
  quests: Quest[];
}

export interface LeaderboardEntry {
  rank: number;
  display_name: string;
  xp: number;
  level: number;
  is_you: boolean;
}

export interface Leaderboard {
  period: "weekly" | "all_time";
  entries: LeaderboardEntry[];
}

export interface Certificate {
  verification_id: string;
  recipient_name: string;
  course_slug: string;
  course_title: string;
  score_percent: number;
  issued_at: string;
}

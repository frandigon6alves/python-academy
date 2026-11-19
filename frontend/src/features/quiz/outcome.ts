import type { QuestionResult } from "@/lib/api/types";

/**
 * How one option should look once a question is graded:
 * - "chosen-correct": the learner picked the right answer
 * - "chosen-wrong":   the learner picked this option and it is wrong
 * - "missed":         the right answer, which the learner did not pick
 * - undefined:        not graded yet, or an option that needs no highlight
 */
export type OptionOutcome = "chosen-correct" | "chosen-wrong" | "missed" | undefined;

export function optionOutcome(index: number, result: QuestionResult | null | undefined): OptionOutcome {
  if (!result) return undefined;
  const chosen = result.choice === index;
  const correct = result.correct_index === index;
  if (chosen && correct) return "chosen-correct";
  if (chosen) return "chosen-wrong";
  if (correct) return "missed";
  return undefined;
}

export type ScoreTone = "perfect" | "good" | "low";

/** Picks the tone of a result message: celebrate a perfect score, encourage a low one. */
export function scoreTone(correct: number, total: number): ScoreTone {
  if (total > 0 && correct === total) return "perfect";
  return correct * 2 >= total ? "good" : "low";
}

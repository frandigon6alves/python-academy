import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { QuizForm } from "./QuizForm";

const questions = [
  { id: 1, prompt: "What is 2 + 2?", code: "print(2 + 2)", options: ["3", "4"] },
  { id: 2, prompt: "Is a list mutable?", code: null, options: ["Yes", "No"] },
];

describe("QuizForm", () => {
  it("only submits once every question is answered", async () => {
    const onSubmit = vi.fn();
    renderWithProviders(
      <QuizForm questions={questions} isSubmitting={false} onSubmit={onSubmit} onRetry={vi.fn()} />,
    );
    const submit = screen.getByRole("button", { name: "Submit answers" });
    expect(submit).toBeDisabled();

    await userEvent.click(screen.getByRole("radio", { name: "4" }));
    expect(submit).toBeDisabled();
    await userEvent.click(screen.getByRole("radio", { name: "Yes" }));
    await userEvent.click(submit);

    expect(onSubmit).toHaveBeenCalledWith([
      { question_id: 1, choice: 1 },
      { question_id: 2, choice: 0 },
    ]);
  });

  it("shows server feedback and announces the summary", () => {
    renderWithProviders(
      <QuizForm
        questions={questions}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onRetry={vi.fn()}
        results={[
          {
            question_id: 1,
            choice: 0,
            correct_index: 1,
            is_correct: false,
            explanation: "Two plus two is four.",
          },
          { question_id: 2, choice: 0, correct_index: 0, is_correct: true, explanation: "Lists can change." },
        ]}
        summary={<p>You scored 1 of 2.</p>}
      />,
    );
    expect(screen.getByText(/Correct answer: 4/)).toBeInTheDocument();
    expect(screen.getByText("Two plus two is four.")).toBeInTheDocument();
    expect(screen.getByText("You scored 1 of 2.").parentElement).toHaveAttribute("aria-live", "polite");
    expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "4" })).toBeDisabled();
  });

  it("marks a wrong pick as wrong and the right answer as correct, not by colour alone", () => {
    renderWithProviders(
      <QuizForm
        questions={questions}
        isSubmitting={false}
        onSubmit={vi.fn()}
        onRetry={vi.fn()}
        results={[
          { question_id: 1, choice: 0, correct_index: 1, is_correct: false, explanation: "" },
          { question_id: 2, choice: 0, correct_index: 0, is_correct: true, explanation: "" },
        ]}
      />,
    );
    const wrongPick = screen.getByRole("radio", { name: "3" });
    const missedAnswer = screen.getByRole("radio", { name: "4" });
    const rightPick = screen.getByRole("radio", { name: "Yes" });
    const untouched = screen.getByRole("radio", { name: "No" });

    expect(wrongPick.closest("label")).toHaveAttribute("data-outcome", "chosen-wrong");
    expect(wrongPick).toHaveAccessibleDescription("Your answer");
    expect(missedAnswer.closest("label")).toHaveAttribute("data-outcome", "missed");
    expect(missedAnswer).toHaveAccessibleDescription("Correct answer");
    expect(rightPick.closest("label")).toHaveAttribute("data-outcome", "chosen-correct");
    expect(untouched.closest("label")).not.toHaveAttribute("data-outcome");
    expect(untouched).not.toHaveAccessibleDescription();
  });
});

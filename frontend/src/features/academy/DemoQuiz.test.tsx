import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockFetch, renderWithProviders } from "@/test/render";
import { DemoQuiz } from "./DemoQuiz";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("DemoQuiz", () => {
  beforeEach(() => {
    mockFetch({
      "GET /api/v1/demo-quiz": [
        { id: 7, prompt: "What does this print?", code: 'print("ab" * 2)', options: ["abab", "ab2"] },
      ],
      "POST /api/v1/demo-quiz/7/check": {
        question_id: 7,
        choice: 1,
        correct_index: 0,
        is_correct: false,
        explanation: "Multiplying a string repeats it.",
      },
    });
  });

  it("checks the answer on the server and announces the result", async () => {
    renderWithProviders(<DemoQuiz />);
    await userEvent.click(await screen.findByRole("radio", { name: "ab2" }));
    await userEvent.click(screen.getByRole("button", { name: "Check answer" }));

    const feedback = await screen.findByText(/Not quite/);
    expect(feedback).toHaveTextContent("Not quite. The answer is “abab”. Multiplying a string repeats it.");
    expect(feedback.closest("[aria-live]")).toHaveAttribute("aria-live", "polite");

    await userEvent.click(screen.getByRole("button", { name: "See my score" }));
    expect(screen.getByText("You got 0 of 1 right.")).toBeInTheDocument();
  });

  it("renders in Spanish", async () => {
    renderWithProviders(<DemoQuiz />, "es");
    expect(await screen.findByText("Pregunta 1 de 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Comprobar respuesta" })).toBeDisabled();
  });
});

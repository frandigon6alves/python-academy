import { optionOutcome, scoreTone } from "./outcome";

const result = { question_id: 1, choice: 0, correct_index: 2, is_correct: false, explanation: "" };

describe("optionOutcome", () => {
  it("is undefined before grading", () => {
    expect(optionOutcome(0, undefined)).toBeUndefined();
  });

  it("marks the wrong choice and the missed right answer", () => {
    expect(optionOutcome(0, result)).toBe("chosen-wrong");
    expect(optionOutcome(2, result)).toBe("missed");
    expect(optionOutcome(1, result)).toBeUndefined();
  });

  it("marks a right choice", () => {
    expect(optionOutcome(2, { ...result, choice: 2, is_correct: true })).toBe("chosen-correct");
  });
});

describe("scoreTone", () => {
  it("celebrates only a perfect score", () => {
    expect(scoreTone(3, 3)).toBe("perfect");
    expect(scoreTone(2, 3)).toBe("good");
    expect(scoreTone(1, 3)).toBe("low");
    expect(scoreTone(0, 3)).toBe("low");
    expect(scoreTone(3, 6)).toBe("good");
  });
});

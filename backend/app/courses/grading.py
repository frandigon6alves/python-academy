"""Server-side grading of multiple-choice answers."""

from app.core.i18n import Lang, pick
from app.courses.models import Question
from app.courses.schemas import AnswerIn, GradedAnswers, QuestionOut, QuestionResult


def question_out(question: Question, lang: Lang) -> QuestionOut:
    return QuestionOut(
        id=question.id,
        prompt=pick(question.prompt, lang),
        code=question.code,
        options=question.options.get(lang) or question.options["en"],
    )


def grade_one(question: Question, choice: int | None, lang: Lang) -> QuestionResult:
    return QuestionResult(
        question_id=question.id,
        choice=choice,
        correct_index=question.answer_index,
        is_correct=choice == question.answer_index,
        explanation=pick(question.explanation, lang),
    )


def grade(questions: list[Question], answers: list[AnswerIn], lang: Lang) -> GradedAnswers:
    """Unanswered questions count as wrong; answers to unknown questions are ignored."""
    choices = {answer.question_id: answer.choice for answer in answers}
    results = [grade_one(q, choices.get(q.id), lang) for q in questions]
    return GradedAnswers(
        correct=sum(r.is_correct for r in results), total=len(results), results=results
    )

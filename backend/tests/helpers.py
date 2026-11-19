"""Helpers that build answer payloads using the answer key stored in the database."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.courses.models import Course, Lesson, Question


def lesson_by_slug(db: Session, course_slug: str, lesson_slug: str) -> Lesson:
    course = db.scalar(select(Course).where(Course.slug == course_slug))
    assert course is not None
    return next(lesson for lesson in course.lessons if lesson.slug == lesson_slug)


def answers_for(questions: list[Question], wrong: int = 0) -> list[dict[str, int]]:
    """Correct answers for all questions except the first `wrong` ones."""
    payload = []
    for index, question in enumerate(questions):
        choice = question.answer_index
        if index < wrong:
            choice = (choice + 1) % len(question.options["en"])
        payload.append({"question_id": question.id, "choice": choice})
    return payload


def quiz_questions(db: Session, lesson_id: int) -> list[Question]:
    query = select(Question).filter_by(kind="quiz", lesson_id=lesson_id).order_by(Question.position)
    return list(db.scalars(query))


def exam_questions(db: Session, course_slug: str) -> list[Question]:
    course = db.scalar(select(Course).where(Course.slug == course_slug))
    assert course is not None
    query = select(Question).filter_by(kind="exam", course_id=course.id).order_by(Question.position)
    return list(db.scalars(query))

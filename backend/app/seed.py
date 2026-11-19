"""Loads content files into the database. Safe to run on every start.

Everything is matched by a natural key and updated in place, so running it again
never duplicates rows, keeps row ids stable and never touches learner data:

- courses by slug, lessons by (course, slug);
- questions by (kind, course, lesson, position), so a quiz that is open in a browser
  during a deploy can still be submitted;
- badges and quests by code (learner rows refer to them by code, not id);
- glossary terms are replaced wholesale because nothing references them.

Content that was removed from the files is deleted, except courses and lessons:
deleting those would cascade to learners' completions, attempts and certificates.

On PostgreSQL a transaction-scoped advisory lock serialises concurrent runs, e.g. when
a new instance starts while the previous one is still running.

Usage: python -m app.seed
"""

from pathlib import Path

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import SessionLocal, create_tables, engine, lock_for_startup
from app.courses.content_loader import (
    CourseData,
    QuestionData,
    load_courses,
    load_demo_quiz,
    read_yaml,
)
from app.courses.models import Course, GlossaryTerm, Lesson, Question
from app.gamification.models import Badge, Quest


def sync_questions(
    db: Session,
    kind: str,
    items: list[QuestionData],
    course_id: int | None = None,
    lesson_id: int | None = None,
) -> None:
    """Makes the stored questions of one quiz/exam/demo match `items`, keeping ids."""
    existing = {
        q.position: q
        for q in db.scalars(
            select(Question).where(
                Question.kind == kind,
                Question.course_id.is_(None)
                if course_id is None
                else Question.course_id == course_id,
                Question.lesson_id.is_(None)
                if lesson_id is None
                else Question.lesson_id == lesson_id,
            )
        )
    }
    for position, data in enumerate(items):
        question = existing.pop(position, None) or Question(
            kind=kind, course_id=course_id, lesson_id=lesson_id, position=position
        )
        question.prompt, question.code = data.prompt, data.code
        question.options, question.answer_index = data.options, data.answer
        question.explanation = data.explanation
        db.add(question)
    for leftover in existing.values():
        db.delete(leftover)


def upsert_course(db: Session, data: CourseData) -> None:
    course = db.scalar(select(Course).where(Course.slug == data.slug)) or Course(slug=data.slug)
    course.position, course.level = data.order, data.level
    course.title, course.summary = data.title, data.summary
    db.add(course)
    db.flush()

    for position, lesson_data in enumerate(data.lessons):
        lesson = db.scalar(
            select(Lesson).where(Lesson.course_id == course.id, Lesson.slug == lesson_data.slug)
        ) or Lesson(course_id=course.id, slug=lesson_data.slug)
        lesson.position, lesson.minutes = position, lesson_data.minutes
        lesson.title, lesson.body = lesson_data.title, lesson_data.body
        lesson.takeaways = lesson_data.takeaways
        db.add(lesson)
        db.flush()
        sync_questions(db, "quiz", lesson_data.quiz, course.id, lesson.id)

    sync_questions(db, "exam", data.exam, course.id)


def upsert_by_code[Row: (Badge, Quest)](
    db: Session, model: type[Row], rows: list[dict[str, object]]
) -> None:
    existing = {row.code: row for row in db.scalars(select(model))}
    for values in rows:
        row = existing.pop(str(values["code"]), None) or model()
        for name, value in values.items():
            setattr(row, name, value)
        db.add(row)
    for leftover in existing.values():
        db.delete(leftover)


def seed_content(db: Session, content_dir: Path) -> None:
    lock_for_startup(db.connection())

    for course in load_courses(content_dir):
        upsert_course(db, course)
    sync_questions(db, "demo", load_demo_quiz(content_dir))

    db.execute(delete(GlossaryTerm))
    for term in read_yaml(content_dir / "glossary.yaml"):
        db.add(GlossaryTerm(term=term["term"], definition=term["definition"]))
    upsert_by_code(db, Badge, read_yaml(content_dir / "badges.yaml"))
    upsert_by_code(db, Quest, read_yaml(content_dir / "quests.yaml"))
    db.commit()


def main() -> None:
    settings = get_settings()
    create_tables(engine)
    with SessionLocal() as db:
        seed_content(db, settings.content_dir)
    print("Content seeded.")


if __name__ == "__main__":
    main()

"""Loads content files into the database. Safe to run repeatedly.

Courses and lessons are matched by slug and updated in place, so learner
progress survives a re-seed. Questions, glossary terms, badges and quests are
replaced wholesale because nothing references their ids.

Usage: python -m app.seed
"""

from pathlib import Path

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import SessionLocal, create_tables, engine
from app.courses.content_loader import (
    CourseData,
    QuestionData,
    load_courses,
    load_demo_quiz,
    read_yaml,
)
from app.courses.models import Course, GlossaryTerm, Lesson, Question
from app.gamification.models import Badge, Quest


def make_question(
    data: QuestionData, kind: str, position: int, course_id: int | None, lesson_id: int | None
) -> Question:
    return Question(
        kind=kind,
        course_id=course_id,
        lesson_id=lesson_id,
        position=position,
        prompt=data.prompt,
        code=data.code,
        options=data.options,
        answer_index=data.answer,
        explanation=data.explanation,
    )


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
        for index, question in enumerate(lesson_data.quiz):
            db.add(make_question(question, "quiz", index, course.id, lesson.id))

    for index, question in enumerate(data.exam):
        db.add(make_question(question, "exam", index, course.id, None))


def seed_content(db: Session, content_dir: Path) -> None:
    db.execute(delete(Question))
    for table in (GlossaryTerm, Badge, Quest):
        db.execute(delete(table))

    for course in load_courses(content_dir):
        upsert_course(db, course)
    for index, question in enumerate(load_demo_quiz(content_dir)):
        db.add(make_question(question, "demo", index, None, None))
    for term in read_yaml(content_dir / "glossary.yaml"):
        db.add(GlossaryTerm(term=term["term"], definition=term["definition"]))
    for badge in read_yaml(content_dir / "badges.yaml"):
        db.add(Badge(**badge))
    for quest in read_yaml(content_dir / "quests.yaml"):
        db.add(Quest(**quest))
    db.commit()


def main() -> None:
    settings = get_settings()
    create_tables(engine)
    with SessionLocal() as db:
        seed_content(db, settings.content_dir)
    print("Content seeded.")


if __name__ == "__main__":
    main()

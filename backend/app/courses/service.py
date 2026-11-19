from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.errors import ProblemError
from app.core.i18n import Lang, pick
from app.courses.grading import question_out
from app.courses.models import Course, GlossaryTerm, Lesson, Question
from app.courses.schemas import (
    CourseDetail,
    CourseSummary,
    GlossaryEntry,
    LessonDetail,
    LessonLink,
    QuestionOut,
)


def get_course(db: Session, slug: str) -> Course:
    course = db.scalar(select(Course).where(Course.slug == slug))
    if course is None:
        raise ProblemError(404, f"Course '{slug}' does not exist.")
    return course


def get_lesson(db: Session, course: Course, lesson_slug: str) -> Lesson:
    for lesson in course.lessons:
        if lesson.slug == lesson_slug:
            return lesson
    raise ProblemError(404, f"Lesson '{lesson_slug}' does not exist.")


def questions(db: Session, kind: str, **owner: int) -> list[Question]:
    query = select(Question).filter_by(kind=kind, **owner).order_by(Question.position)
    return list(db.scalars(query))


def lesson_link(lesson: Lesson, lang: Lang) -> LessonLink:
    return LessonLink(
        id=lesson.id, slug=lesson.slug, title=pick(lesson.title, lang), minutes=lesson.minutes
    )


def course_summary(course: Course, lang: Lang) -> CourseSummary:
    return CourseSummary(
        slug=course.slug,
        level=course.level,
        title=pick(course.title, lang),
        summary=pick(course.summary, lang),
        lesson_count=len(course.lessons),
        minutes=sum(lesson.minutes for lesson in course.lessons),
    )


def list_courses(db: Session, lang: Lang) -> list[CourseSummary]:
    courses = db.scalars(select(Course).order_by(Course.position))
    return [course_summary(course, lang) for course in courses]


def course_detail(db: Session, slug: str, lang: Lang) -> CourseDetail:
    course = get_course(db, slug)
    exam_size = db.scalar(
        select(func.count()).select_from(Question).filter_by(kind="exam", course_id=course.id)
    )
    return CourseDetail(
        **course_summary(course, lang).model_dump(),
        lessons=[lesson_link(lesson, lang) for lesson in course.lessons],
        exam_question_count=exam_size or 0,
    )


def lesson_detail(db: Session, course_slug: str, lesson_slug: str, lang: Lang) -> LessonDetail:
    course = get_course(db, course_slug)
    lesson = get_lesson(db, course, lesson_slug)
    siblings = course.lessons
    index = siblings.index(lesson)
    return LessonDetail(
        id=lesson.id,
        slug=lesson.slug,
        title=pick(lesson.title, lang),
        minutes=lesson.minutes,
        body_markdown=pick(lesson.body, lang),
        takeaways=lesson.takeaways.get(lang) or lesson.takeaways["en"],
        quiz=[question_out(q, lang) for q in questions(db, "quiz", lesson_id=lesson.id)],
        course_slug=course.slug,
        course_title=pick(course.title, lang),
        previous=lesson_link(siblings[index - 1], lang) if index > 0 else None,
        next=lesson_link(siblings[index + 1], lang) if index + 1 < len(siblings) else None,
    )


def glossary(db: Session, lang: Lang) -> list[GlossaryEntry]:
    entries = [
        GlossaryEntry(term=pick(t.term, lang), definition=pick(t.definition, lang))
        for t in db.scalars(select(GlossaryTerm))
    ]
    return sorted(entries, key=lambda entry: entry.term.casefold())


def demo_quiz(db: Session, lang: Lang) -> list[QuestionOut]:
    return [question_out(q, lang) for q in questions(db, "demo")]


def demo_question(db: Session, question_id: int) -> Question:
    question = db.get(Question, question_id)
    if question is None or question.kind != "demo":
        raise ProblemError(404, "Demo question not found.")
    return question

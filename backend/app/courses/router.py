"""Public, read-only course content plus the anonymous demo quiz."""

from fastapi import APIRouter

from app.auth.dependencies import DbSession
from app.core.i18n import Lang
from app.courses import service
from app.courses.grading import grade_one
from app.courses.schemas import (
    ChoiceIn,
    CourseDetail,
    CourseSummary,
    GlossaryEntry,
    LessonDetail,
    QuestionOut,
    QuestionResult,
)

router = APIRouter(tags=["courses"])


@router.get("/courses")
def list_courses(db: DbSession, lang: Lang = "en") -> list[CourseSummary]:
    return service.list_courses(db, lang)


@router.get("/courses/{slug}")
def read_course(slug: str, db: DbSession, lang: Lang = "en") -> CourseDetail:
    return service.course_detail(db, slug, lang)


@router.get("/courses/{slug}/lessons/{lesson_slug}")
def read_lesson(slug: str, lesson_slug: str, db: DbSession, lang: Lang = "en") -> LessonDetail:
    return service.lesson_detail(db, slug, lesson_slug, lang)


@router.get("/glossary")
def read_glossary(db: DbSession, lang: Lang = "en") -> list[GlossaryEntry]:
    return service.glossary(db, lang)


@router.get("/demo-quiz")
def read_demo_quiz(db: DbSession, lang: Lang = "en") -> list[QuestionOut]:
    return service.demo_quiz(db, lang)


@router.post("/demo-quiz/{question_id}/check")
def check_demo_answer(
    question_id: int, data: ChoiceIn, db: DbSession, lang: Lang = "en"
) -> QuestionResult:
    return grade_one(service.demo_question(db, question_id), data.choice, lang)

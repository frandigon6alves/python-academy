from fastapi import APIRouter

from app.auth.dependencies import CurrentUser, DbSession
from app.core.clock import utcnow
from app.core.i18n import Lang
from app.courses.schemas import AnswersIn
from app.progress import service
from app.progress.schemas import CertificateOut, ExamOut, ExamResult, ProgressOverview, QuizResult

router = APIRouter(tags=["progress"])


@router.get("/progress/me")
def my_progress(user: CurrentUser, db: DbSession, lang: Lang = "en") -> ProgressOverview:
    return service.overview(db, user, lang)


@router.post("/lessons/{lesson_id}/quiz")
def submit_quiz(
    lesson_id: int, data: AnswersIn, user: CurrentUser, db: DbSession, lang: Lang = "en"
) -> QuizResult:
    return service.submit_quiz(db, user, lesson_id, data.answers, lang, utcnow())


@router.get("/exams/{course_slug}")
def read_exam(course_slug: str, user: CurrentUser, db: DbSession, lang: Lang = "en") -> ExamOut:
    return service.get_exam(db, user, course_slug, lang)


@router.post("/exams/{course_slug}")
def submit_exam(
    course_slug: str, data: AnswersIn, user: CurrentUser, db: DbSession, lang: Lang = "en"
) -> ExamResult:
    return service.submit_exam(db, user, course_slug, data.answers, lang, utcnow())


@router.get("/certificates/{verification_id}")
def verify_certificate(verification_id: str, db: DbSession, lang: Lang = "en") -> CertificateOut:
    return service.get_certificate(db, verification_id, lang)

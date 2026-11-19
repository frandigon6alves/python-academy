from datetime import datetime

from pydantic import BaseModel

from app.courses.schemas import QuestionOut, QuestionResult
from app.gamification.schemas import Rewards


class QuizResult(BaseModel):
    correct: int
    total: int
    results: list[QuestionResult]
    rewards: Rewards


class ExamOut(BaseModel):
    course_slug: str
    course_title: str
    pass_percent: int
    questions: list[QuestionOut]


class ExamResult(QuizResult):
    percent: int
    passed: bool
    certificate_id: str | None


class CourseProgress(BaseModel):
    course_slug: str
    lesson_count: int
    completed_lessons: list[str]
    percent: int
    exam_passed: bool
    certificate_id: str | None


class ContinueLearning(BaseModel):
    course_slug: str
    course_title: str
    lesson_slug: str
    lesson_title: str


class ProgressOverview(BaseModel):
    courses: list[CourseProgress]
    continue_learning: ContinueLearning | None


class CertificateOut(BaseModel):
    verification_id: str
    recipient_name: str
    course_slug: str
    course_title: str
    score_percent: int
    issued_at: datetime

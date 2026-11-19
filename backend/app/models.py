"""Imports every domain's models so SQLAlchemy knows about all tables."""

from app.auth.models import UserSession
from app.courses.models import Course, GlossaryTerm, Lesson, Question
from app.gamification.models import ActivityEvent, Badge, Quest, QuestCompletion, UserBadge
from app.progress.models import Certificate, ExamAttempt, LessonCompletion, QuizAttempt
from app.users.models import User

__all__ = [
    "ActivityEvent",
    "Badge",
    "Certificate",
    "Course",
    "ExamAttempt",
    "GlossaryTerm",
    "Lesson",
    "LessonCompletion",
    "Quest",
    "QuestCompletion",
    "Question",
    "QuizAttempt",
    "User",
    "UserBadge",
    "UserSession",
]

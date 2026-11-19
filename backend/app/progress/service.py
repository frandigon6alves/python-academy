"""Lesson completion, quiz and exam submissions, certificates.

Each submission is graded on the server, recorded, translated into activity
events for gamification, and answered with the rewards it earned.
"""

import secrets
from datetime import datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.errors import ProblemError
from app.core.i18n import Lang, pick
from app.courses import service as courses
from app.courses.grading import grade, question_out
from app.courses.models import Course, Lesson
from app.courses.schemas import AnswerIn
from app.gamification import levels
from app.gamification import service as gamification
from app.progress.models import Certificate, ExamAttempt, LessonCompletion, QuizAttempt
from app.progress.schemas import (
    PASS_PERCENT,
    CertificateOut,
    ContinueLearning,
    CourseProgress,
    ExamOut,
    ExamResult,
    ProgressOverview,
    QuizResult,
)
from app.users.models import User


def completed_lesson_ids(db: Session, user_id: int) -> set[int]:
    query = select(LessonCompletion.lesson_id).where(LessonCompletion.user_id == user_id)
    return set(db.scalars(query))


def best_quiz_score(db: Session, user_id: int, lesson_id: int) -> int:
    query = select(func.max(QuizAttempt.correct)).where(
        QuizAttempt.user_id == user_id, QuizAttempt.lesson_id == lesson_id
    )
    return int(db.scalar(query) or 0)


def find_certificate(db: Session, user_id: int, course_id: int) -> Certificate | None:
    return db.scalar(
        select(Certificate).where(
            Certificate.user_id == user_id, Certificate.course_id == course_id
        )
    )


# --- Quizzes -----------------------------------------------------------------


def submit_quiz(
    db: Session, user: User, lesson_id: int, answers: list[AnswerIn], lang: Lang, now: datetime
) -> QuizResult:
    """Grades a lesson quiz. Submitting it also completes the lesson."""
    lesson = db.get(Lesson, lesson_id)
    if lesson is None:
        raise ProblemError(404, "Lesson not found.")
    xp_before = gamification.total_xp(db, user.id)
    graded = grade(courses.questions(db, "quiz", lesson_id=lesson.id), answers, lang)
    best_before = best_quiz_score(db, user.id, lesson.id)
    db.add(
        QuizAttempt(
            user_id=user.id,
            lesson_id=lesson.id,
            correct=graded.correct,
            total=graded.total,
            created_at=now,
        )
    )

    if lesson.id not in completed_lesson_ids(db, user.id):
        db.add(LessonCompletion(user_id=user.id, lesson_id=lesson.id, completed_at=now))
        gamification.record_activity(
            db, user.id, "lessons_completed", now, xp=levels.XP_LESSON_COMPLETED
        )
    if graded.correct:
        # Only improvements over the best previous score earn XP, so retakes can't be farmed.
        improvement = max(0, graded.correct - best_before)
        gamification.record_activity(
            db,
            user.id,
            "correct_answers",
            now,
            quantity=graded.correct,
            xp=improvement * levels.XP_PER_CORRECT_ANSWER,
        )
    if graded.total and graded.correct == graded.total and best_before < graded.total:
        gamification.record_activity(
            db, user.id, "perfect_quizzes", now, xp=levels.XP_PERFECT_QUIZ_BONUS
        )

    rewards = gamification.collect_rewards(db, user.id, xp_before, lang, now)
    return QuizResult(
        correct=graded.correct, total=graded.total, results=graded.results, rewards=rewards
    )


# --- Exams -------------------------------------------------------------------


def require_all_lessons_done(db: Session, user: User, course: Course) -> None:
    done = completed_lesson_ids(db, user.id)
    if any(lesson.id not in done for lesson in course.lessons):
        raise ProblemError(409, "Complete every lesson before taking the exam.", "exam-locked")


def get_exam(db: Session, user: User, course_slug: str, lang: Lang) -> ExamOut:
    course = courses.get_course(db, course_slug)
    require_all_lessons_done(db, user, course)
    return ExamOut(
        course_slug=course.slug,
        course_title=pick(course.title, lang),
        pass_percent=PASS_PERCENT,
        questions=[
            question_out(q, lang) for q in courses.questions(db, "exam", course_id=course.id)
        ],
    )


def issue_certificate(
    db: Session, user: User, course: Course, percent: int, now: datetime
) -> Certificate:
    certificate = Certificate(
        verification_id=secrets.token_hex(6).upper(),
        user_id=user.id,
        course_id=course.id,
        recipient_name=user.display_name,
        score_percent=percent,
        issued_at=now,
    )
    db.add(certificate)
    return certificate


def submit_exam(
    db: Session, user: User, course_slug: str, answers: list[AnswerIn], lang: Lang, now: datetime
) -> ExamResult:
    course = courses.get_course(db, course_slug)
    require_all_lessons_done(db, user, course)
    xp_before = gamification.total_xp(db, user.id)
    graded = grade(courses.questions(db, "exam", course_id=course.id), answers, lang)
    passed = graded.percent >= PASS_PERCENT
    db.add(
        ExamAttempt(
            user_id=user.id,
            course_id=course.id,
            correct=graded.correct,
            total=graded.total,
            passed=passed,
            created_at=now,
        )
    )

    certificate = find_certificate(db, user.id, course.id)
    if passed and certificate is None:
        certificate = issue_certificate(db, user, course, graded.percent, now)
        gamification.record_activity(db, user.id, "exams_passed", now, xp=levels.XP_EXAM_PASSED)

    rewards = gamification.collect_rewards(db, user.id, xp_before, lang, now)
    return ExamResult(
        correct=graded.correct,
        total=graded.total,
        results=graded.results,
        rewards=rewards,
        percent=graded.percent,
        passed=passed,
        certificate_id=certificate.verification_id if certificate else None,
    )


# --- Read models -------------------------------------------------------------


def course_progress(db: Session, user: User, course: Course, done: set[int]) -> CourseProgress:
    completed = [lesson.slug for lesson in course.lessons if lesson.id in done]
    certificate = find_certificate(db, user.id, course.id)
    # The exam counts as one more step, so a course is 100% only once it is passed.
    steps = len(course.lessons) + 1
    finished_steps = len(completed) + (1 if certificate else 0)
    return CourseProgress(
        course_slug=course.slug,
        lesson_count=len(course.lessons),
        completed_lessons=completed,
        percent=round(100 * finished_steps / steps),
        exam_passed=certificate is not None,
        certificate_id=certificate.verification_id if certificate else None,
    )


def next_lesson(
    courses_in_order: list[Course], done: set[int], lang: Lang
) -> ContinueLearning | None:
    for course in courses_in_order:
        for lesson in course.lessons:
            if lesson.id not in done:
                return ContinueLearning(
                    course_slug=course.slug,
                    course_title=pick(course.title, lang),
                    lesson_slug=lesson.slug,
                    lesson_title=pick(lesson.title, lang),
                )
    return None


def overview(db: Session, user: User, lang: Lang) -> ProgressOverview:
    all_courses = list(db.scalars(select(Course).order_by(Course.position)))
    done = completed_lesson_ids(db, user.id)
    return ProgressOverview(
        courses=[course_progress(db, user, course, done) for course in all_courses],
        continue_learning=next_lesson(all_courses, done, lang),
    )


def get_certificate(db: Session, verification_id: str, lang: Lang) -> CertificateOut:
    certificate = db.scalar(
        select(Certificate).where(Certificate.verification_id == verification_id.upper())
    )
    if certificate is None:
        raise ProblemError(404, "No certificate matches this verification id.")
    course = db.get(Course, certificate.course_id)
    assert course is not None  # guaranteed by the foreign key
    return CertificateOut(
        verification_id=certificate.verification_id,
        recipient_name=certificate.recipient_name,
        course_slug=course.slug,
        course_title=pick(course.title, lang),
        score_percent=certificate.score_percent,
        issued_at=certificate.issued_at,
    )

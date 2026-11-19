from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.courses.models import Course
from app.progress.models import LessonCompletion
from app.users.models import User
from tests.conftest import sign_up
from tests.helpers import answers_for, exam_questions

COURSE = "python-basics"
EXAM = f"/api/v1/exams/{COURSE}"


def complete_all_lessons(db: Session) -> None:
    from sqlalchemy import select

    user = db.scalar(select(User))
    course = db.scalar(select(Course).where(Course.slug == COURSE))
    assert user and course
    db.add_all(LessonCompletion(user_id=user.id, lesson_id=lesson.id) for lesson in course.lessons)
    db.commit()


def test_exam_is_locked_until_every_lesson_is_complete(client: TestClient) -> None:
    sign_up(client)
    response = client.get(EXAM)
    assert response.status_code == 409
    assert response.json()["type"] == "/problems/exam-locked"


def test_exam_questions_hide_answers(client: TestClient, db: Session) -> None:
    sign_up(client)
    complete_all_lessons(db)
    exam = client.get(EXAM).json()
    assert exam["pass_percent"] == 70
    assert all("answer_index" not in q and "correct_index" not in q for q in exam["questions"])


def test_failing_below_70_percent_issues_no_certificate(client: TestClient, db: Session) -> None:
    sign_up(client)
    complete_all_lessons(db)
    questions = exam_questions(db, COURSE)
    result = client.post(EXAM, json={"answers": answers_for(questions, wrong=2)}).json()
    assert result["percent"] < 70
    assert result["passed"] is False and result["certificate_id"] is None


def test_passing_issues_a_verifiable_certificate_once(client: TestClient, db: Session) -> None:
    sign_up(client)
    complete_all_lessons(db)
    questions = exam_questions(db, COURSE)
    result = client.post(EXAM, json={"answers": answers_for(questions, wrong=1)}).json()
    assert result["passed"] is True and result["percent"] >= 70
    assert "first-course" in [b["code"] for b in result["rewards"]["new_badges"]]

    certificate_id = result["certificate_id"]
    retake = client.post(EXAM, json={"answers": answers_for(questions)}).json()
    assert retake["certificate_id"] == certificate_id
    assert retake["rewards"]["xp_gained"] == 0

    client.post("/api/v1/auth/logout")  # verification is public
    certificate = client.get(f"/api/v1/certificates/{certificate_id}?lang=es").json()
    assert certificate["recipient_name"] == "Ada"
    assert certificate["course_title"] == "Fundamentos de Python"
    assert client.get("/api/v1/certificates/NOPE").status_code == 404

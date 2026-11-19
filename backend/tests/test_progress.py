from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.gamification.levels import (
    XP_LESSON_COMPLETED,
    XP_PER_CORRECT_ANSWER,
    XP_PERFECT_QUIZ_BONUS,
)
from tests.conftest import sign_up
from tests.helpers import answers_for, lesson_by_slug, quiz_questions


def submit_quiz(client: TestClient, db: Session, lesson_slug: str, wrong: int = 0) -> dict:  # type: ignore[type-arg]
    lesson = lesson_by_slug(db, "python-basics", lesson_slug)
    answers = answers_for(quiz_questions(db, lesson.id), wrong=wrong)
    response = client.post(f"/api/v1/lessons/{lesson.id}/quiz", json={"answers": answers})
    assert response.status_code == 200, response.text
    return response.json()  # type: ignore[no-any-return]


def test_quiz_requires_sign_in(client: TestClient, db: Session) -> None:
    lesson = lesson_by_slug(db, "python-basics", "variables")
    assert client.post(f"/api/v1/lessons/{lesson.id}/quiz", json={"answers": []}).status_code == 401


def test_first_quiz_completes_lesson_and_awards_xp_badge_and_quest(
    client: TestClient, db: Session
) -> None:
    sign_up(client)
    result = submit_quiz(client, db, "variables", wrong=1)
    assert (result["correct"], result["total"]) == (2, 3)
    assert result["results"][0]["is_correct"] is False

    rewards = result["rewards"]
    daily_lesson_quest = 15
    assert (
        rewards["xp_gained"] == XP_LESSON_COMPLETED + 2 * XP_PER_CORRECT_ANSWER + daily_lesson_quest
    )
    assert [b["code"] for b in rewards["new_badges"]] == ["first-lesson"]
    assert [q["code"] for q in rewards["completed_quests"]] == ["daily-lesson"]

    progress = client.get("/api/v1/progress/me").json()
    assert progress["courses"][0]["completed_lessons"] == ["variables"]
    assert progress["continue_learning"]["lesson_slug"] == "types"


def test_retakes_only_earn_xp_for_improvement(client: TestClient, db: Session) -> None:
    sign_up(client)
    submit_quiz(client, db, "variables", wrong=1)
    same_score = submit_quiz(client, db, "variables", wrong=1)
    assert same_score["rewards"]["xp_gained"] == 0

    perfect = submit_quiz(client, db, "variables")
    daily_answers_quest = 15  # 2 + 2 + 3 correct answers today reaches the target of 5
    assert perfect["rewards"]["xp_gained"] == (
        XP_PER_CORRECT_ANSWER + XP_PERFECT_QUIZ_BONUS + daily_answers_quest
    )
    assert [q["code"] for q in perfect["rewards"]["completed_quests"]] == ["daily-answers"]
    assert [b["code"] for b in perfect["rewards"]["new_badges"]] == ["perfect-quiz"]


def test_hub_summary_reflects_activity(client: TestClient, db: Session) -> None:
    sign_up(client)
    submit_quiz(client, db, "variables")
    summary = client.get("/api/v1/gamification/me").json()
    assert summary["level"]["xp"] > 0
    assert summary["streak_days"] == 1
    earned = {b["code"] for b in summary["badges"] if b["earned"]}
    assert earned == {"first-lesson", "perfect-quiz"}

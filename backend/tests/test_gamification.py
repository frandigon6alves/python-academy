from datetime import timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.gamification import service
from app.users.models import User
from tests.conftest import NOW, sign_up


def test_three_day_streak_awards_the_streak_badge(db: Session, user: User) -> None:
    for days_ago in (2, 1, 0):
        when = NOW - timedelta(days=days_ago)
        service.record_activity(db, user.id, "lessons_completed", when, xp=20)
        rewards = service.collect_rewards(db, user.id, 0, "en", when)
    assert "streak-3" in [b.code for b in rewards.new_badges]
    assert service.streak_days(db, user.id, NOW) == 3


def test_daily_quests_reset_each_day(db: Session, user: User) -> None:
    service.record_activity(db, user.id, "lessons_completed", NOW, xp=20)
    first = service.collect_rewards(db, user.id, 0, "en", NOW)
    assert "daily-lesson" in [q.code for q in first.completed_quests]

    later_today = service.collect_rewards(db, user.id, 0, "en", NOW + timedelta(hours=1))
    assert later_today.completed_quests == []

    tomorrow = NOW + timedelta(days=1)
    quests = {q.code: q for q in service.summary(db, user.id, "en", tomorrow).quests}
    assert quests["daily-lesson"].progress == 0 and not quests["daily-lesson"].completed
    assert quests["weekly-lessons"].progress == 1  # same ISO week


def test_quest_rewards_do_not_count_towards_xp_quests(db: Session, user: User) -> None:
    service.record_activity(db, user.id, "lessons_completed", NOW, xp=190)
    service.collect_rewards(db, user.id, 0, "en", NOW)  # daily quest adds 15 reward XP
    weekly_xp = next(
        q for q in service.summary(db, user.id, "en", NOW).quests if q.code == "weekly-xp"
    )
    assert weekly_xp.progress == 190 and not weekly_xp.completed


def test_leaderboard_weekly_and_all_time(db: Session, user: User) -> None:
    rival = User(email="linus@example.com", display_name="Linus", password_hash="x")
    db.add(rival)
    db.flush()
    service.record_activity(db, user.id, "lessons_completed", NOW - timedelta(days=30), xp=500)
    service.record_activity(db, rival.id, "lessons_completed", NOW, xp=50)
    db.commit()

    weekly = service.leaderboard(db, "weekly", rival.id, NOW)
    assert [(e.display_name, e.xp, e.is_you) for e in weekly.entries] == [("Linus", 50, True)]

    all_time = service.leaderboard(db, "all_time", None, NOW)
    assert [(e.rank, e.display_name) for e in all_time.entries] == [(1, "Grace"), (2, "Linus")]
    assert all_time.entries[0].level == 4


def test_leaderboard_exposes_display_names_only(client: TestClient) -> None:
    sign_up(client)
    board = client.get("/api/v1/gamification/leaderboard?period=all_time").json()
    assert board["entries"] == []  # no XP yet, so nobody is ranked
    assert "email" not in str(board)

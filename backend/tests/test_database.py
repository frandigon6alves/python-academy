"""Database portability (SQLite and PostgreSQL) and idempotent seeding."""

from datetime import UTC, datetime, timedelta, timezone

import pytest
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.auth.models import UserSession
from app.core.config import Settings, get_settings
from app.core.database import normalize_database_url
from app.courses.models import Course, GlossaryTerm, Lesson, Question
from app.gamification.models import Badge, Quest
from app.progress.models import LessonCompletion
from app.seed import seed_content
from app.users.models import User


@pytest.mark.parametrize(
    ("url", "expected"),
    [
        (
            "postgresql://u:p@ep-x-pooler.eu-central-1.aws.neon.tech/db?sslmode=require",
            "postgresql+psycopg://u:p@ep-x-pooler.eu-central-1.aws.neon.tech/db?sslmode=require",
        ),
        ("postgres://u:p@host:5432/db", "postgresql+psycopg://u:p@host:5432/db"),
        ("postgresql+psycopg://u:p@host/db", "postgresql+psycopg://u:p@host/db"),
        ("sqlite:///data/academy.sqlite", "sqlite:///data/academy.sqlite"),
    ],
)
def test_database_urls_use_the_psycopg_driver(url: str, expected: str) -> None:
    assert normalize_database_url(url) == expected


def test_plain_database_url_env_var_is_accepted(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("ACADEMY_DATABASE_URL", raising=False)
    monkeypatch.setenv("DATABASE_URL", "postgresql://u:p@host/db")
    assert Settings().database_url == "postgresql://u:p@host/db"


def test_sqlite_is_the_default_database(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delenv("ACADEMY_DATABASE_URL", raising=False)
    monkeypatch.delenv("DATABASE_URL", raising=False)
    assert Settings(_env_file=None).database_url.startswith("sqlite:///")  # type: ignore[call-arg]


def test_timestamps_round_trip_as_aware_utc(db: Session, user: User) -> None:
    expires = datetime(2026, 11, 19, 14, 30, tzinfo=timezone(timedelta(hours=2)))
    db.add(UserSession(token_hash="a" * 64, user_id=user.id, expires_at=expires))
    db.commit()
    db.expire_all()
    stored = db.scalar(select(UserSession.expires_at))
    assert stored == datetime(2026, 11, 19, 12, 30, tzinfo=UTC)
    assert stored is not None and stored.tzinfo == UTC
    assert user.created_at.tzinfo == UTC


def counts(db: Session) -> dict[str, int]:
    tables = (Course, Lesson, Question, GlossaryTerm, Badge, Quest)
    return {t.__name__: db.scalar(select(func.count()).select_from(t)) or 0 for t in tables}


def test_seeding_again_is_idempotent_and_keeps_learner_data(db: Session, user: User) -> None:
    lesson = db.scalars(select(Lesson).order_by(Lesson.id)).first()
    assert lesson is not None
    db.add(LessonCompletion(user_id=user.id, lesson_id=lesson.id))
    db.commit()
    before = counts(db)
    question_ids = set(db.scalars(select(Question.id)))

    seed_content(db, get_settings().content_dir)
    seed_content(db, get_settings().content_dir)

    assert counts(db) == before
    assert set(db.scalars(select(Question.id))) == question_ids
    assert db.scalar(select(func.count()).select_from(LessonCompletion)) == 1
    assert db.get(User, user.id) is not None

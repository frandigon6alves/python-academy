"""Shared fixtures: an in-memory database seeded from the real content files."""

from collections.abc import Iterator
from datetime import datetime

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session, sessionmaker

from app.auth.router import login_limiter
from app.core.config import get_settings
from app.core.database import create_tables, get_db, make_engine
from app.main import create_app
from app.seed import seed_content
from app.users.models import User

PASSWORD = "correct-horse-battery"


@pytest.fixture
def db() -> Iterator[Session]:
    engine = make_engine("sqlite://")
    create_tables(engine)
    factory = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    with factory() as session:
        seed_content(session, get_settings().content_dir)
        yield session
    engine.dispose()


@pytest.fixture
def client(db: Session) -> Iterator[TestClient]:
    app = create_app(create_db=False)
    app.dependency_overrides[get_db] = lambda: db
    login_limiter._failures.clear()
    with TestClient(app, headers={"X-Requested-With": "test"}) as test_client:
        yield test_client


def sign_up(
    client: TestClient, email: str = "ada@example.com", name: str = "Ada"
) -> dict[str, object]:
    response = client.post(
        "/api/v1/auth/signup", json={"email": email, "display_name": name, "password": PASSWORD}
    )
    assert response.status_code == 201, response.text
    body: dict[str, object] = response.json()
    return body


@pytest.fixture
def user(db: Session) -> User:
    """A user created directly in the database, for service-level tests."""
    learner = User(email="grace@example.com", display_name="Grace", password_hash="x")
    db.add(learner)
    db.commit()
    return learner


NOW = datetime(2026, 11, 19, 12, 0)  # a Thursday

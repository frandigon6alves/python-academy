"""Shared fixtures: a database seeded from the real content files.

Tests run against a fresh in-memory SQLite database by default. Set TEST_DATABASE_URL to
run them against PostgreSQL instead, e.g.
    TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/academy_test pytest
The schema is recreated once per run (the database is wiped), and every test runs inside
a transaction that is rolled back afterwards.
"""

import os
from collections.abc import Iterator
from datetime import UTC, datetime

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import Engine
from sqlalchemy.orm import Session, sessionmaker

from app.auth.router import login_limiter
from app.core.config import get_settings
from app.core.database import Base, create_tables, get_db, make_engine
from app.main import create_app
from app.seed import seed_content
from app.users.models import User

PASSWORD = "correct-horse-battery"


TEST_DATABASE_URL = os.environ.get("TEST_DATABASE_URL")


@pytest.fixture(scope="session")
def server_engine() -> Iterator[Engine]:
    """A shared engine for TEST_DATABASE_URL, with a freshly created schema."""
    assert TEST_DATABASE_URL, "only used when TEST_DATABASE_URL is set"
    engine = make_engine(TEST_DATABASE_URL)
    Base.metadata.drop_all(engine)
    create_tables(engine)
    yield engine
    Base.metadata.drop_all(engine)
    engine.dispose()


@pytest.fixture
def db(request: pytest.FixtureRequest) -> Iterator[Session]:
    content_dir = get_settings().content_dir
    if TEST_DATABASE_URL is None:
        engine = make_engine("sqlite://")
        create_tables(engine)
        factory = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
        with factory() as session:
            seed_content(session, content_dir)
            yield session
        engine.dispose()
        return

    server: Engine = request.getfixturevalue("server_engine")
    with server.connect() as connection:
        transaction = connection.begin()
        # Commits inside the app become savepoints; the outer transaction is rolled back.
        with Session(
            bind=connection,
            autoflush=False,
            expire_on_commit=False,
            join_transaction_mode="create_savepoint",
        ) as session:
            seed_content(session, content_dir)
            yield session
        transaction.rollback()


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


NOW = datetime(2026, 11, 19, 12, 0, tzinfo=UTC)  # a Thursday

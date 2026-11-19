"""SQLAlchemy engine, session factory and declarative base."""

from collections.abc import Iterator
from datetime import datetime
from pathlib import Path
from typing import Any

from sqlalchemy import Connection, Engine, create_engine, event, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import get_settings
from app.core.types import UTCDateTime


class Base(DeclarativeBase):
    # Every `Mapped[datetime]` column is a timezone-aware UTC timestamp.
    type_annotation_map = {datetime: UTCDateTime}  # noqa: RUF012


def normalize_database_url(url: str) -> str:
    """Points PostgreSQL URLs at the psycopg 3 driver.

    Neon, Render and Heroku-style URLs (`postgres://` or `postgresql://`, often with
    `?sslmode=require`) would otherwise select psycopg2, which is not installed.
    Query parameters such as `sslmode` and `channel_binding` are passed to libpq unchanged.
    """
    for prefix in ("postgres://", "postgresql://"):
        if url.startswith(prefix):
            return "postgresql+psycopg://" + url.removeprefix(prefix)
    return url


def make_engine(url: str) -> Engine:
    url = normalize_database_url(url)
    if make_url(url).get_backend_name() == "sqlite":
        return _make_sqlite_engine(url)
    return create_engine(
        url,
        # A small, serverless Postgres (Neon) suspends idle computes and drops their
        # connections: test each connection before use and recycle them every 5 minutes.
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=5,
        max_overflow=5,
        pool_timeout=10,
        # No server-side prepared statements, so a transaction-mode pooler such as
        # Neon's "-pooler" endpoint (PgBouncer) works too.
        connect_args={"prepare_threshold": None},
    )


def _make_sqlite_engine(url: str) -> Engine:
    is_memory = url in ("sqlite://", "sqlite:///:memory:")
    if url.startswith("sqlite:///") and not is_memory:
        Path(url.removeprefix("sqlite:///")).parent.mkdir(parents=True, exist_ok=True)
    engine = create_engine(
        url,
        connect_args={"check_same_thread": False},
        # An in-memory database only exists inside one connection, so share it.
        poolclass=StaticPool if is_memory else None,
    )

    @event.listens_for(engine, "connect")
    def enable_foreign_keys(dbapi_connection: Any, _record: Any) -> None:
        # SQLite ignores ON DELETE CASCADE unless this pragma is on.
        dbapi_connection.execute("PRAGMA foreign_keys=ON")

    return engine


engine = make_engine(get_settings().database_url)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def get_db() -> Iterator[Session]:
    """FastAPI dependency: one database session per request."""
    with SessionLocal() as session:
        yield session


# Arbitrary application-wide key for PostgreSQL advisory locks taken at startup.
STARTUP_LOCK_KEY = 7_201_644


def lock_for_startup(connection: Connection) -> None:
    """Serialises schema creation and seeding across processes (PostgreSQL only).

    The lock is released when the surrounding transaction ends.
    """
    if connection.dialect.name == "postgresql":
        connection.execute(text("SELECT pg_advisory_xact_lock(:key)"), {"key": STARTUP_LOCK_KEY})


def create_tables(bind: Engine) -> None:
    """Creates missing tables (existing ones are left as they are)."""
    # Import every model module so its tables are registered on Base.metadata.
    from app import models  # noqa: F401

    with bind.begin() as connection:
        lock_for_startup(connection)
        Base.metadata.create_all(connection)

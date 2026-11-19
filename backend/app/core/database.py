"""SQLAlchemy engine, session factory and declarative base."""

from collections.abc import Iterator
from pathlib import Path
from typing import Any

from sqlalchemy import Engine, create_engine, event
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import get_settings


class Base(DeclarativeBase):
    pass


def make_engine(url: str) -> Engine:
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


def create_tables(bind: Engine) -> None:
    # Import every model module so its tables are registered on Base.metadata.
    from app import models  # noqa: F401

    Base.metadata.create_all(bind)

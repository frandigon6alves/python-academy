"""Column types that behave the same on SQLite and PostgreSQL."""

from datetime import UTC, datetime
from typing import Any

from sqlalchemy import DateTime, Dialect
from sqlalchemy.types import TypeDecorator


class UTCDateTime(TypeDecorator[datetime]):
    """A timestamp that is always a timezone-aware UTC datetime in Python.

    PostgreSQL stores it as `timestamp with time zone`. SQLite has no timezone
    support, so the value is stored as naive UTC there and marked as UTC again
    when read. Naive datetimes passed in are assumed to already be UTC.
    """

    impl = DateTime(timezone=True)
    cache_ok = True

    def process_bind_param(self, value: datetime | None, dialect: Dialect) -> datetime | None:
        if value is None:
            return None
        value = value.replace(tzinfo=UTC) if value.tzinfo is None else value.astimezone(UTC)
        return value.replace(tzinfo=None) if dialect.name == "sqlite" else value

    def process_result_value(self, value: Any, dialect: Dialect) -> datetime | None:
        if value is None:
            return None
        assert isinstance(value, datetime)
        return value.replace(tzinfo=UTC) if value.tzinfo is None else value.astimezone(UTC)

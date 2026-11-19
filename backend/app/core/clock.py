"""A single place to read the current time, so tests can freeze it."""

from datetime import UTC, datetime


def utcnow() -> datetime:
    # Naive UTC datetimes: SQLite does not store timezone information.
    return datetime.now(UTC).replace(tzinfo=None)

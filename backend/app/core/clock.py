"""A single place to read the current time, so tests can freeze it."""

from datetime import UTC, datetime


def utcnow() -> datetime:
    """The current time as a timezone-aware UTC datetime."""
    return datetime.now(UTC)

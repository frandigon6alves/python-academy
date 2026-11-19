"""Calendar helpers for streaks and quest periods. All times are naive UTC."""

from datetime import date, datetime, timedelta


def period_start(period: str, now: datetime) -> datetime:
    midnight = datetime.combine(now.date(), datetime.min.time())
    if period == "daily":
        return midnight
    return midnight - timedelta(days=now.weekday())  # Monday of this ISO week


def period_key(period: str, now: datetime) -> str:
    if period == "daily":
        return now.date().isoformat()
    year, week, _ = now.isocalendar()
    return f"{year}-W{week:02d}"


def streak_length(active_days: set[date], today: date) -> int:
    """Consecutive active days ending today (or yesterday, so a streak survives until midnight)."""
    day = today if today in active_days else today - timedelta(days=1)
    streak = 0
    while day in active_days:
        streak += 1
        day -= timedelta(days=1)
    return streak

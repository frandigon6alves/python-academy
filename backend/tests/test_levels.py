from datetime import date

import pytest

from app.gamification.levels import level_for_xp, level_progress, xp_for_level
from app.gamification.periods import period_key, streak_length
from tests.conftest import NOW


@pytest.mark.parametrize(
    ("xp", "level"),
    [(0, 1), (99, 1), (100, 2), (249, 2), (250, 3), (3199, 9), (3200, 10), (4000, 11)],
)
def test_level_for_xp(xp: int, level: int) -> None:
    assert level_for_xp(xp) == level


def test_levels_beyond_the_table_keep_growing() -> None:
    assert xp_for_level(12) - xp_for_level(11) == 800


def test_level_progress_percent() -> None:
    progress = level_progress(175)
    assert (progress.level, progress.level_start_xp, progress.next_level_xp) == (2, 100, 250)
    assert progress.percent == 50


def test_period_keys() -> None:
    assert period_key("daily", NOW) == "2026-11-19"
    assert period_key("weekly", NOW) == "2026-W47"


def test_streak_counts_consecutive_days_ending_today_or_yesterday() -> None:
    days = {date(2026, 11, 17), date(2026, 11, 18), date(2026, 11, 19), date(2026, 11, 14)}
    assert streak_length(days, date(2026, 11, 19)) == 3
    assert streak_length(days, date(2026, 11, 20)) == 3  # not broken until a full day is missed
    assert streak_length(days, date(2026, 11, 21)) == 0

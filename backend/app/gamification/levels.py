"""XP amounts and the level curve. Pure functions, no database."""

from dataclasses import dataclass

XP_LESSON_COMPLETED = 20
XP_PER_CORRECT_ANSWER = 5
XP_PERFECT_QUIZ_BONUS = 10
XP_EXAM_PASSED = 100

# Minimum XP for levels 1..10. Beyond level 10 every level costs XP_PER_LEVEL_AFTER_TABLE.
LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200]
XP_PER_LEVEL_AFTER_TABLE = 800


def xp_for_level(level: int) -> int:
    """Minimum total XP needed to reach `level` (levels start at 1)."""
    if level <= len(LEVEL_THRESHOLDS):
        return LEVEL_THRESHOLDS[max(level, 1) - 1]
    extra_levels = level - len(LEVEL_THRESHOLDS)
    return LEVEL_THRESHOLDS[-1] + extra_levels * XP_PER_LEVEL_AFTER_TABLE


def level_for_xp(xp: int) -> int:
    level = 1
    while xp >= xp_for_level(level + 1):
        level += 1
    return level


@dataclass(frozen=True)
class LevelProgress:
    level: int
    xp: int
    level_start_xp: int
    next_level_xp: int

    @property
    def percent(self) -> int:
        span = self.next_level_xp - self.level_start_xp
        return int(100 * (self.xp - self.level_start_xp) / span)


def level_progress(xp: int) -> LevelProgress:
    level = level_for_xp(xp)
    return LevelProgress(level, xp, xp_for_level(level), xp_for_level(level + 1))

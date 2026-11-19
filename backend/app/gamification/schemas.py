from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class LevelOut(BaseModel):
    level: int
    xp: int
    level_start_xp: int
    next_level_xp: int
    percent: int


class BadgeOut(BaseModel):
    code: str
    icon: str
    name: str
    description: str
    earned: bool
    awarded_at: datetime | None = None


class QuestOut(BaseModel):
    code: str
    period: Literal["daily", "weekly"]
    name: str
    progress: int
    target: int
    xp_reward: int
    completed: bool


class Rewards(BaseModel):
    """What an action earned; returned after quizzes and exams so the UI can celebrate."""

    xp_gained: int
    level: LevelOut
    leveled_up: bool
    new_badges: list[BadgeOut]
    completed_quests: list[QuestOut]


class GamificationSummary(BaseModel):
    level: LevelOut
    streak_days: int
    badges: list[BadgeOut]
    quests: list[QuestOut]


class LeaderboardEntry(BaseModel):
    rank: int
    display_name: str
    xp: int
    level: int
    is_you: bool


class Leaderboard(BaseModel):
    period: Literal["weekly", "all_time"]
    entries: list[LeaderboardEntry]

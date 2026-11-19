from datetime import datetime

from sqlalchemy import JSON, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.core.clock import utcnow
from app.core.database import Base

USER_FK = "users.id"


class ActivityEvent(Base):
    """Append-only log of learning activity.

    It is the single source for XP totals, leaderboards, streaks, quest
    progress and badge rules. `kind` is a metric name such as
    "lessons_completed"; `quantity` is how much that metric grew.
    """

    __tablename__ = "activity_events"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey(USER_FK, ondelete="CASCADE"), index=True)
    kind: Mapped[str] = mapped_column(String(40))
    quantity: Mapped[int] = mapped_column(default=1)
    xp: Mapped[int] = mapped_column(default=0)
    created_at: Mapped[datetime] = mapped_column(default=utcnow, index=True)


class Badge(Base):
    __tablename__ = "badges"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(40), unique=True)
    icon: Mapped[str] = mapped_column(String(8))
    name: Mapped[dict[str, str]] = mapped_column(JSON)
    description: Mapped[dict[str, str]] = mapped_column(JSON)
    metric: Mapped[str] = mapped_column(String(40))
    threshold: Mapped[int]


class UserBadge(Base):
    __tablename__ = "user_badges"
    __table_args__ = (UniqueConstraint("user_id", "badge_code"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey(USER_FK, ondelete="CASCADE"), index=True)
    badge_code: Mapped[str] = mapped_column(String(40))
    awarded_at: Mapped[datetime] = mapped_column(default=utcnow)


class Quest(Base):
    __tablename__ = "quests"

    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(40), unique=True)
    period: Mapped[str] = mapped_column(String(10))  # daily | weekly
    name: Mapped[dict[str, str]] = mapped_column(JSON)
    metric: Mapped[str] = mapped_column(String(40))
    target: Mapped[int]
    xp_reward: Mapped[int]


class QuestCompletion(Base):
    __tablename__ = "quest_completions"
    __table_args__ = (UniqueConstraint("user_id", "quest_code", "period_key"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey(USER_FK, ondelete="CASCADE"), index=True)
    quest_code: Mapped[str] = mapped_column(String(40))
    # "2026-11-19" for daily quests, "2026-W47" for weekly ones.
    period_key: Mapped[str] = mapped_column(String(10))
    completed_at: Mapped[datetime] = mapped_column(default=utcnow)

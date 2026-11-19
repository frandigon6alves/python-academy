"""XP, levels, streaks, badges, quests and leaderboards.

Other domains call `record_activity` for what a learner did, then
`collect_rewards` to award any badges and quests that became due.
"""

from datetime import UTC, datetime

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.i18n import Lang, pick
from app.gamification.levels import level_for_xp, level_progress
from app.gamification.models import ActivityEvent, Badge, Quest, QuestCompletion, UserBadge
from app.gamification.periods import period_key, period_start, streak_length
from app.gamification.schemas import (
    BadgeOut,
    GamificationSummary,
    Leaderboard,
    LeaderboardEntry,
    LevelOut,
    QuestOut,
    Rewards,
)
from app.users.models import User

QUEST_REWARD = "quest_reward"
LEADERBOARD_SIZE = 20


def record_activity(
    db: Session, user_id: int, kind: str, now: datetime, quantity: int = 1, xp: int = 0
) -> None:
    db.add(ActivityEvent(user_id=user_id, kind=kind, quantity=quantity, xp=xp, created_at=now))
    db.flush()


# --- Metrics -----------------------------------------------------------------


def total_xp(db: Session, user_id: int) -> int:
    return metric_value(db, user_id, "total_xp", now=datetime.min.replace(tzinfo=UTC))


def streak_days(db: Session, user_id: int, now: datetime) -> int:
    timestamps = db.scalars(
        select(ActivityEvent.created_at).where(
            ActivityEvent.user_id == user_id, ActivityEvent.kind != QUEST_REWARD
        )
    )
    return streak_length({ts.date() for ts in timestamps}, now.date())


def metric_value(
    db: Session, user_id: int, metric: str, now: datetime, since: datetime | None = None
) -> int:
    """Value of a badge/quest metric, optionally counting only events since `since`."""
    if metric == "streak_days":
        return streak_days(db, user_id, now)
    if metric == "total_xp":
        query = select(func.sum(ActivityEvent.xp))
    elif metric == "xp_earned":  # XP from learning only, so quest rewards don't feed quests
        query = select(func.sum(ActivityEvent.xp)).where(ActivityEvent.kind != QUEST_REWARD)
    else:
        query = select(func.sum(ActivityEvent.quantity)).where(ActivityEvent.kind == metric)
    query = query.where(ActivityEvent.user_id == user_id)
    if since is not None:
        query = query.where(ActivityEvent.created_at >= since)
    return int(db.scalar(query) or 0)


# --- Badges and quests -------------------------------------------------------


def badge_out(badge: Badge, lang: Lang, awarded: UserBadge | None) -> BadgeOut:
    return BadgeOut(
        code=badge.code,
        icon=badge.icon,
        name=pick(badge.name, lang),
        description=pick(badge.description, lang),
        earned=awarded is not None,
        awarded_at=awarded.awarded_at if awarded else None,
    )


def quest_out(db: Session, quest: Quest, user_id: int, lang: Lang, now: datetime) -> QuestOut:
    progress = metric_value(db, user_id, quest.metric, now, period_start(quest.period, now))
    completed = db.scalar(
        select(QuestCompletion).where(
            QuestCompletion.user_id == user_id,
            QuestCompletion.quest_code == quest.code,
            QuestCompletion.period_key == period_key(quest.period, now),
        )
    )
    return QuestOut(
        code=quest.code,
        period="daily" if quest.period == "daily" else "weekly",
        name=pick(quest.name, lang),
        progress=min(progress, quest.target),
        target=quest.target,
        xp_reward=quest.xp_reward,
        completed=completed is not None,
    )


def award_due_quests(db: Session, user_id: int, lang: Lang, now: datetime) -> list[QuestOut]:
    completed: list[QuestOut] = []
    for quest in db.scalars(select(Quest).order_by(Quest.id)):
        status = quest_out(db, quest, user_id, lang, now)
        if status.completed or status.progress < quest.target:
            continue
        db.add(
            QuestCompletion(
                user_id=user_id,
                quest_code=quest.code,
                period_key=period_key(quest.period, now),
                completed_at=now,
            )
        )
        record_activity(db, user_id, QUEST_REWARD, now, xp=quest.xp_reward)
        completed.append(status.model_copy(update={"completed": True}))
    return completed


def award_due_badges(db: Session, user_id: int, lang: Lang, now: datetime) -> list[BadgeOut]:
    owned = set(db.scalars(select(UserBadge.badge_code).where(UserBadge.user_id == user_id)))
    awarded: list[BadgeOut] = []
    for badge in db.scalars(select(Badge).order_by(Badge.id)):
        if badge.code in owned or metric_value(db, user_id, badge.metric, now) < badge.threshold:
            continue
        user_badge = UserBadge(user_id=user_id, badge_code=badge.code, awarded_at=now)
        db.add(user_badge)
        awarded.append(badge_out(badge, lang, user_badge))
    return awarded


def collect_rewards(
    db: Session, user_id: int, xp_before: int, lang: Lang, now: datetime
) -> Rewards:
    """Awards due quests, then badges (quest XP can unlock XP badges), and commits."""
    quests = award_due_quests(db, user_id, lang, now)
    badges = award_due_badges(db, user_id, lang, now)
    db.commit()
    xp_after = total_xp(db, user_id)
    return Rewards(
        xp_gained=xp_after - xp_before,
        level=level_out(xp_after),
        leveled_up=level_for_xp(xp_after) > level_for_xp(xp_before),
        new_badges=badges,
        completed_quests=quests,
    )


# --- Read models -------------------------------------------------------------


def level_out(xp: int) -> LevelOut:
    progress = level_progress(xp)
    return LevelOut(**progress.__dict__, percent=progress.percent)


def summary(db: Session, user_id: int, lang: Lang, now: datetime) -> GamificationSummary:
    awarded = {
        ub.badge_code: ub
        for ub in db.scalars(select(UserBadge).where(UserBadge.user_id == user_id))
    }
    badges = [
        badge_out(b, lang, awarded.get(b.code))
        for b in db.scalars(select(Badge).order_by(Badge.id))
    ]
    quests = [
        quest_out(db, q, user_id, lang, now) for q in db.scalars(select(Quest).order_by(Quest.id))
    ]
    return GamificationSummary(
        level=level_out(total_xp(db, user_id)),
        streak_days=streak_days(db, user_id, now),
        badges=badges,
        quests=quests,
    )


def leaderboard(db: Session, period: str, viewer_id: int | None, now: datetime) -> Leaderboard:
    xp_sum = func.sum(ActivityEvent.xp).label("xp")
    query = (
        select(User.id, User.display_name, xp_sum)
        .join(ActivityEvent, ActivityEvent.user_id == User.id)
        .group_by(User.id)
        .having(xp_sum > 0)
        .order_by(xp_sum.desc(), User.id)
        .limit(LEADERBOARD_SIZE)
    )
    if period == "weekly":
        query = query.where(ActivityEvent.created_at >= period_start("weekly", now))
    entries = [
        LeaderboardEntry(
            rank=rank,
            display_name=name,
            xp=int(xp),
            # Levels always reflect all-time XP, even on the weekly board.
            level=level_for_xp(xp if period == "all_time" else total_xp(db, user_id)),
            is_you=user_id == viewer_id,
        )
        for rank, (user_id, name, xp) in enumerate(db.execute(query).all(), start=1)
    ]
    return Leaderboard(period="weekly" if period == "weekly" else "all_time", entries=entries)

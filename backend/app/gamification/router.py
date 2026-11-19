from typing import Literal

from fastapi import APIRouter

from app.auth.dependencies import CurrentUser, DbSession, OptionalUser
from app.core.clock import utcnow
from app.core.i18n import Lang
from app.gamification import service
from app.gamification.schemas import GamificationSummary, Leaderboard

router = APIRouter(prefix="/gamification", tags=["gamification"])


@router.get("/me")
def my_summary(user: CurrentUser, db: DbSession, lang: Lang = "en") -> GamificationSummary:
    return service.summary(db, user.id, lang, utcnow())


@router.get("/leaderboard")
def leaderboard(
    db: DbSession, viewer: OptionalUser, period: Literal["weekly", "all_time"] = "weekly"
) -> Leaderboard:
    return service.leaderboard(db, period, viewer.id if viewer else None, utcnow())

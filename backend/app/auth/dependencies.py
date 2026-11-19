"""FastAPI dependencies that resolve the signed-in user from the session cookie."""

from typing import Annotated

from fastapi import Depends, Request
from sqlalchemy.orm import Session

from app.auth.service import user_for_token
from app.core.config import get_settings
from app.core.database import get_db
from app.core.errors import ProblemError
from app.users.models import User

DbSession = Annotated[Session, Depends(get_db)]


def session_token(request: Request) -> str | None:
    return request.cookies.get(get_settings().session_cookie_name)


def optional_user(request: Request, db: DbSession) -> User | None:
    token = session_token(request)
    return user_for_token(db, token) if token else None


def current_user(user: Annotated[User | None, Depends(optional_user)]) -> User:
    if user is None:
        raise ProblemError(401, "You need to sign in.", "not-authenticated")
    return user


CurrentUser = Annotated[User, Depends(current_user)]
OptionalUser = Annotated[User | None, Depends(optional_user)]

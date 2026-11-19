from fastapi import APIRouter, Request, Response, status

from app.auth import service
from app.auth.dependencies import DbSession, OptionalUser, session_token
from app.auth.schemas import LoginIn, SignupIn
from app.auth.security import LoginRateLimiter
from app.core.client_ip import client_ip
from app.core.config import get_settings
from app.core.errors import ProblemError
from app.users.schemas import UserOut

router = APIRouter(prefix="/auth", tags=["auth"])

settings = get_settings()
login_limiter = LoginRateLimiter(settings.login_max_attempts, settings.login_window_seconds)


def set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        settings.session_cookie_name,
        token,
        max_age=settings.session_days * 24 * 3600,
        httponly=True,
        samesite="lax",
        secure=settings.cookie_secure,
        path="/",
    )


@router.post("/signup", status_code=status.HTTP_201_CREATED)
def sign_up(data: SignupIn, response: Response, db: DbSession) -> UserOut:
    user = service.sign_up(db, data)
    set_session_cookie(response, service.create_session(db, user, settings.session_days))
    return UserOut.model_validate(user)


@router.post("/login")
def log_in(data: LoginIn, request: Request, response: Response, db: DbSession) -> UserOut:
    key = f"{client_ip(request)}:{service.normalize_email(data.email)}"
    if login_limiter.is_blocked(key):
        raise ProblemError(429, "Too many attempts. Try again in a few minutes.", "rate-limited")
    try:
        user = service.authenticate(db, data)
    except ProblemError:
        login_limiter.record_failure(key)
        raise
    login_limiter.reset(key)
    set_session_cookie(response, service.create_session(db, user, settings.session_days))
    return UserOut.model_validate(user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def log_out(request: Request, response: Response, db: DbSession) -> None:
    token = session_token(request)
    if token:
        service.end_session(db, token)
    response.delete_cookie(settings.session_cookie_name, path="/")


@router.get("/me")
def who_am_i(user: OptionalUser) -> UserOut | None:
    """The signed-in user, or null for visitors.

    Visitors are an expected state here, not an error, so this answers 200 instead of 401
    (which would log an error in the browser console on every public page). Endpoints that
    need an account still answer 401.
    """
    return UserOut.model_validate(user) if user else None

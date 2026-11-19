from fastapi import APIRouter, Request, Response, status

from app.auth import service
from app.auth.dependencies import CurrentUser, DbSession, session_token
from app.auth.schemas import LoginIn, SignupIn
from app.auth.security import LoginRateLimiter
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
    client = request.client.host if request.client else "unknown"
    key = f"{client}:{service.normalize_email(data.email)}"
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
def who_am_i(user: CurrentUser) -> UserOut:
    return UserOut.model_validate(user)

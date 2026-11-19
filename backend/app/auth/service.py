from datetime import timedelta

from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.auth.models import UserSession
from app.auth.schemas import LoginIn, SignupIn
from app.auth.security import hash_password, hash_token, new_session_token, verify_password
from app.core.clock import utcnow
from app.core.errors import ProblemError
from app.users.models import User

INVALID_CREDENTIALS = "Invalid email or password."


def normalize_email(email: str) -> str:
    return email.strip().lower()


def sign_up(db: Session, data: SignupIn) -> User:
    email = normalize_email(data.email)
    if db.scalar(select(User).where(User.email == email)):
        raise ProblemError(409, "An account with this email already exists.", "email-taken")
    user = User(
        email=email,
        display_name=data.display_name.strip(),
        password_hash=hash_password(data.password),
        language=data.language,
        theme=data.theme,
    )
    db.add(user)
    db.commit()
    return user


def authenticate(db: Session, data: LoginIn) -> User:
    user = db.scalar(select(User).where(User.email == normalize_email(data.email)))
    is_valid = verify_password(user.password_hash if user else None, data.password)
    if user is None or not is_valid:
        raise ProblemError(401, INVALID_CREDENTIALS, "invalid-credentials")
    return user


def create_session(db: Session, user: User, days: int) -> str:
    """Stores a new session and returns the raw token for the cookie."""
    token = new_session_token()
    db.add(
        UserSession(
            token_hash=hash_token(token),
            user_id=user.id,
            expires_at=utcnow() + timedelta(days=days),
        )
    )
    db.commit()
    return token


def user_for_token(db: Session, token: str) -> User | None:
    session = db.scalar(select(UserSession).where(UserSession.token_hash == hash_token(token)))
    if session is None or session.expires_at < utcnow():
        return None
    return db.get(User, session.user_id)


def end_session(db: Session, token: str) -> None:
    db.execute(delete(UserSession).where(UserSession.token_hash == hash_token(token)))
    db.commit()


def end_other_sessions(db: Session, user_id: int, keep_token: str | None) -> None:
    query = delete(UserSession).where(UserSession.user_id == user_id)
    if keep_token:
        query = query.where(UserSession.token_hash != hash_token(keep_token))
    db.execute(query)
    db.commit()

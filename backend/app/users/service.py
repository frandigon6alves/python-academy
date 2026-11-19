from sqlalchemy.orm import Session

from app.auth.security import hash_password, verify_password
from app.core.errors import ProblemError
from app.users.models import User
from app.users.schemas import SettingsUpdate


def update_settings(db: Session, user: User, changes: SettingsUpdate) -> User:
    for field, value in changes.model_dump(exclude_none=True).items():
        setattr(user, field, value.strip() if isinstance(value, str) else value)
    db.commit()
    return user


def require_password(user: User, password: str) -> None:
    if not verify_password(user.password_hash, password):
        raise ProblemError(403, "The password is not correct.", "wrong-password")


def change_password(db: Session, user: User, current: str, new: str) -> None:
    require_password(user, current)
    user.password_hash = hash_password(new)
    db.commit()


def delete_account(db: Session, user: User, password: str) -> None:
    """Deletes the user; ON DELETE CASCADE removes sessions, progress and badges."""
    require_password(user, password)
    db.delete(user)
    db.commit()

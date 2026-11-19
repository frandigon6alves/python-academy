from fastapi import APIRouter, Request, Response, status

from app.auth.dependencies import CurrentUser, DbSession, session_token
from app.auth.service import end_other_sessions
from app.core.config import get_settings
from app.users import service
from app.users.schemas import AccountDeletion, PasswordChange, SettingsUpdate, UserOut

router = APIRouter(prefix="/users/me", tags=["users"])


@router.get("")
def read_profile(user: CurrentUser) -> UserOut:
    return UserOut.model_validate(user)


@router.patch("")
def update_settings(changes: SettingsUpdate, user: CurrentUser, db: DbSession) -> UserOut:
    return UserOut.model_validate(service.update_settings(db, user, changes))


@router.post("/password", status_code=status.HTTP_204_NO_CONTENT)
def change_password(
    data: PasswordChange, request: Request, user: CurrentUser, db: DbSession
) -> None:
    service.change_password(db, user, data.current_password, data.new_password)
    # Other devices must sign in again with the new password.
    end_other_sessions(db, user.id, keep_token=session_token(request))


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    data: AccountDeletion, response: Response, user: CurrentUser, db: DbSession
) -> None:
    service.delete_account(db, user, data.password)
    response.delete_cookie(get_settings().session_cookie_name, path="/")

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

from app.core.i18n import Lang

Theme = Literal["system", "light", "dark"]


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    display_name: str
    language: Lang
    theme: Theme


class SettingsUpdate(BaseModel):
    """Partial update: omitted fields stay as they are."""

    display_name: str | None = Field(default=None, min_length=2, max_length=40)
    language: Lang | None = None
    theme: Theme | None = None


class PasswordChange(BaseModel):
    current_password: str = Field(min_length=1, max_length=128)
    new_password: str = Field(min_length=8, max_length=128)


class AccountDeletion(BaseModel):
    password: str = Field(min_length=1, max_length=128)
    # The user must type DELETE to confirm, which guards against accidental clicks.
    confirmation: Literal["DELETE"]

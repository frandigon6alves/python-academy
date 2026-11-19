from pydantic import BaseModel, EmailStr, Field

from app.core.i18n import Lang
from app.users.schemas import Theme

PASSWORD_FIELD = Field(min_length=8, max_length=128)


class SignupIn(BaseModel):
    email: EmailStr
    display_name: str = Field(min_length=2, max_length=40)
    password: str = PASSWORD_FIELD
    language: Lang = "en"
    theme: Theme = "system"


class LoginIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)

"""Application settings, read from environment variables (prefix ACADEMY_)."""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="ACADEMY_", env_file=".env", extra="ignore")

    database_url: str = f"sqlite:///{BACKEND_DIR / 'data' / 'academy.sqlite'}"
    content_dir: Path = BACKEND_DIR / "content"
    session_cookie_name: str = "academy_session"
    session_days: int = 30
    # Set to true when the site is served over HTTPS.
    cookie_secure: bool = False
    login_max_attempts: int = 5
    login_window_seconds: int = 300


@lru_cache
def get_settings() -> Settings:
    return Settings()

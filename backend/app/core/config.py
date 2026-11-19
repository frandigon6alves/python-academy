"""Application settings, read from environment variables (prefix ACADEMY_)."""

from functools import lru_cache
from pathlib import Path

from pydantic import AliasChoices, Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parents[2]
API_PREFIX = "/api/v1"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="ACADEMY_", env_file=".env", extra="ignore")

    # Hosting platforms (Render, Neon, ...) hand out a plain DATABASE_URL, so it is accepted
    # too. Without either, a local SQLite file is used.
    database_url: str = Field(
        default=f"sqlite:///{BACKEND_DIR / 'data' / 'academy.sqlite'}",
        validation_alias=AliasChoices("ACADEMY_DATABASE_URL", "DATABASE_URL"),
    )
    content_dir: Path = BACKEND_DIR / "content"
    session_cookie_name: str = "academy_session"
    session_days: int = 30
    # Set to true when the site is served over HTTPS.
    cookie_secure: bool = False
    login_max_attempts: int = 5
    login_window_seconds: int = 300
    # Shared secret between the Next.js proxy and this API. When set, the client IP used for
    # login rate limiting is only taken from the proxy's header if the request carries this
    # secret; see app/core/client_ip.py.
    proxy_secret: str = ""


@lru_cache
def get_settings() -> Settings:
    return Settings()

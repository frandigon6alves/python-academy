"""FastAPI application factory: wires middleware, error handlers and domain routers."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import APIRouter, FastAPI

from app.auth.router import router as auth_router
from app.core.csrf import require_csrf_header
from app.core.database import create_tables, engine
from app.core.errors import register_error_handlers
from app.courses.router import router as courses_router
from app.gamification.router import router as gamification_router
from app.progress.router import router as progress_router
from app.users.router import router as users_router

API_PREFIX = "/api/v1"


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    create_tables(engine)
    yield


def create_app(*, create_db: bool = True) -> FastAPI:
    app = FastAPI(
        title="Python Academy API",
        version="1.0.0",
        description="Courses, progress tracking and gamification for Python Academy.",
        docs_url="/docs",
        openapi_url=f"{API_PREFIX}/openapi.json",
        lifespan=lifespan if create_db else None,
    )
    app.middleware("http")(require_csrf_header)
    register_error_handlers(app)

    api = APIRouter(prefix=API_PREFIX)
    for router in (auth_router, users_router, courses_router, progress_router, gamification_router):
        api.include_router(router)

    @api.get("/health", tags=["health"])
    def health() -> dict[str, str]:
        return {"status": "ok"}

    app.include_router(api)
    return app


app = create_app()

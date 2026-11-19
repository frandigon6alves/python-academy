"""Errors are returned as RFC 9457 problem details (application/problem+json)."""

from http import HTTPStatus

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

PROBLEM_JSON = "application/problem+json"


class ProblemError(Exception):
    """Raise from services to return a problem+json response."""

    def __init__(self, status: int, detail: str, code: str | None = None) -> None:
        super().__init__(detail)
        self.status = status
        self.detail = detail
        self.code = code or HTTPStatus(status).phrase.lower().replace(" ", "-")


def problem_response(
    status: int, detail: str, code: str, extra: dict[str, object] | None = None
) -> JSONResponse:
    body: dict[str, object] = {
        "type": f"/problems/{code}",
        "title": HTTPStatus(status).phrase,
        "status": status,
        "detail": detail,
        **(extra or {}),
    }
    return JSONResponse(body, status_code=status, media_type=PROBLEM_JSON)


async def handle_problem(_request: Request, exc: Exception) -> JSONResponse:
    assert isinstance(exc, ProblemError)
    return problem_response(exc.status, exc.detail, exc.code)


async def handle_http(_request: Request, exc: Exception) -> JSONResponse:
    assert isinstance(exc, StarletteHTTPException)
    code = HTTPStatus(exc.status_code).phrase.lower().replace(" ", "-")
    return problem_response(exc.status_code, str(exc.detail), code)


async def handle_validation(_request: Request, exc: Exception) -> JSONResponse:
    assert isinstance(exc, RequestValidationError)
    errors = [
        {"field": ".".join(str(part) for part in err["loc"][1:]), "message": err["msg"]}
        for err in exc.errors()
    ]
    return problem_response(
        422, "The request body is not valid.", "validation-error", {"errors": errors}
    )


def register_error_handlers(app: FastAPI) -> None:
    app.add_exception_handler(ProblemError, handle_problem)
    app.add_exception_handler(StarletteHTTPException, handle_http)
    app.add_exception_handler(RequestValidationError, handle_validation)

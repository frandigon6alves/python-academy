"""Cross-site request forgery guard.

Session cookies are SameSite=Lax, and on top of that every state-changing
request must carry a custom header. Browsers cannot add custom headers to
cross-site form posts, and cross-origin fetches with them need a CORS
preflight that this API never approves.
"""

from collections.abc import Awaitable, Callable

from fastapi import Request, Response

from app.core.errors import problem_response

CSRF_HEADER = "x-requested-with"
SAFE_METHODS = {"GET", "HEAD", "OPTIONS"}


async def require_csrf_header(
    request: Request, call_next: Callable[[Request], Awaitable[Response]]
) -> Response:
    if request.method not in SAFE_METHODS and not request.headers.get(CSRF_HEADER):
        return problem_response(403, "Missing X-Requested-With header.", "csrf")
    return await call_next(request)

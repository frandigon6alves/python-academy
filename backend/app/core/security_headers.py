"""Security headers for every API response.

The web app sets its own headers in next.config.ts, but those do not reach
responses that Next.js rewrites from this API, so the API adds the ones that
matter for JSON: no MIME sniffing, no framing, no referrer, and no caching of
anything tied to a user.
"""

from collections.abc import Awaitable, Callable

from fastapi import Request, Response

from app.core.config import API_PREFIX

SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
}

# Same content for every visitor, so shared caches may keep it.
PUBLIC_PREFIXES = tuple(
    f"{API_PREFIX}{path}" for path in ("/courses", "/glossary", "/demo-quiz", "/health")
)


def is_public(path: str) -> bool:
    return path.startswith(PUBLIC_PREFIXES)


async def add_security_headers(
    request: Request, call_next: Callable[[Request], Awaitable[Response]]
) -> Response:
    response = await call_next(request)
    for name, value in SECURITY_HEADERS.items():
        response.headers.setdefault(name, value)
    if not is_public(request.url.path) or "set-cookie" in response.headers:
        response.headers["Cache-Control"] = "no-store"
    return response

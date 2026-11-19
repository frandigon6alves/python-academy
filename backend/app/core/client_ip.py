"""Which client IP address to use for login rate limiting.

In production the request chain is: browser -> Vercel (Next.js proxy) -> Render's load
balancer -> uvicorn. `X-Forwarded-For` cannot be trusted on its own: the Render URL is
public, so anyone can call it directly with a forged header.

Instead the Next.js proxy (frontend/src/proxy.ts) sends two headers of its own:
`X-Academy-Client-IP`, the address Vercel saw (Vercel overwrites `X-Forwarded-For` and
`X-Real-IP` itself, so browsers cannot forge it), and `X-Academy-Proxy-Secret`, a secret
shared with this API through `ACADEMY_PROXY_SECRET`.

- Secret configured and matching: the proxy's client IP is used.
- Secret configured but missing or wrong (someone calling the API directly): every such
  request shares one bucket, so forging addresses cannot get around the limiter, and it
  cannot lock out people who sign in through the website either.
- No secret configured (local development, Docker Compose): the socket peer address.
"""

import hmac

from fastapi import Request

from app.core.config import get_settings

CLIENT_IP_HEADER = "x-academy-client-ip"
PROXY_SECRET_HEADER = "x-academy-proxy-secret"
UNTRUSTED = "untrusted"


def client_ip(request: Request) -> str:
    secret = get_settings().proxy_secret
    if not secret:
        return request.client.host if request.client else "unknown"
    sent = request.headers.get(PROXY_SECRET_HEADER, "")
    if not hmac.compare_digest(sent.encode(), secret.encode()):
        return UNTRUSTED
    return request.headers.get(CLIENT_IP_HEADER, "").strip() or UNTRUSTED

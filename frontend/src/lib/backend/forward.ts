/**
 * Forwarding of /api/* requests to the FastAPI backend.
 *
 * The browser only talks to this Next.js app; /api/* is passed on to BACKEND_URL so the
 * session cookie stays first-party. When PROXY_SECRET is set (on Vercel), the request is
 * rewritten here and tagged with the client's IP address and the shared secret, so the
 * backend can rate-limit logins per client without trusting forgeable X-Forwarded-For
 * values (see backend/app/core/client_ip.py). Without a secret, the plain rewrite in
 * next.config.ts does the forwarding.
 */

export const CLIENT_IP_HEADER = "x-academy-client-ip";
export const PROXY_SECRET_HEADER = "x-academy-proxy-secret";

export const DEFAULT_BACKEND_URL = "http://127.0.0.1:8000";

/**
 * The client's IP address as seen by the edge. Vercel sets X-Real-IP and overwrites
 * X-Forwarded-For with the address it received the request from, so neither can be forged
 * by the browser there. Only rely on this behind such a proxy.
 */
export function clientIp(headers: Headers): string | null {
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || null;
}

/** Request headers for the backend: never pass on the browser's own x-academy-* values. */
export function backendHeaders(incoming: Headers, secret: string | undefined): Headers {
  const headers = new Headers(incoming);
  headers.delete(CLIENT_IP_HEADER);
  headers.delete(PROXY_SECRET_HEADER);
  if (secret) {
    headers.set(PROXY_SECRET_HEADER, secret);
    const ip = clientIp(incoming);
    if (ip) headers.set(CLIENT_IP_HEADER, ip);
  }
  return headers;
}

/**
 * Absolute backend URL for a /api/... path and query string. A path in `base` is kept
 * (the same as the rewrite in next.config.ts), so the path is appended relative to it.
 */
export function backendUrl(base: string, pathname: string, search: string): URL {
  const root = base.endsWith("/") ? base : `${base}/`;
  return new URL(`${pathname.replace(/^\/+/, "")}${search}`, root);
}

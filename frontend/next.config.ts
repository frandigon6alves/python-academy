import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// The browser only ever talks to this Next.js server; /api/* is forwarded to
// FastAPI so session cookies stay same-origin. On Vercel (PROXY_SECRET set) src/proxy.ts
// forwards /api/* itself and adds the client IP; this rewrite covers every other setup.
// Rewrites are resolved at build time: redeploy after changing BACKEND_URL.
const backendUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

const isDev = process.env.NODE_ENV === "development";
// Vercel preview deployments inject the feedback toolbar from vercel.live.
const isVercelPreview = process.env.VERCEL_ENV === "preview";

function sources(...values: (string | false)[]): string {
  return values.filter(Boolean).join(" ");
}

/**
 * Everything is served from this origin. Inline scripts stay allowed because Next.js
 * streams its data in inline <script> tags and the theme script must run before the first
 * paint; per-request nonces would make every page dynamic. Lesson Markdown never renders
 * raw HTML, so the policy is defence in depth: no third-party scripts, frames or plugins,
 * no <base> or form hijacking, and no framing of the site.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src ${sources("'self'", "'unsafe-inline'", isDev && "'unsafe-eval'", isVercelPreview && "https://vercel.live")}`,
  `style-src ${sources("'self'", "'unsafe-inline'", isVercelPreview && "https://vercel.live")}`,
  `img-src ${sources("'self'", "data:", "blob:", isVercelPreview && "https://vercel.live https://vercel.com")}`,
  `font-src ${sources("'self'", isVercelPreview && "https://vercel.live https://assets.vercel.com")}`,
  `connect-src ${sources("'self'", isDev && "ws:", isVercelPreview && "https://vercel.live wss://ws-us3.pusher.com")}`,
  `frame-src ${sources("'self'", isVercelPreview && "https://vercel.live")}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  // Browsers ignore this over plain HTTP, so local `next start` is unaffected.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // The Docker image runs the self-contained server; local `next start` does not need it.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backendUrl}/api/:path*` }];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withNextIntl(nextConfig);

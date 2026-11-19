import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// The browser only ever talks to this Next.js server; /api/* is forwarded to
// FastAPI so session cookies stay same-origin.
const backendUrl = process.env.BACKEND_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  // The Docker image runs the self-contained server; local `next start` does not need it.
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backendUrl}/api/:path*` }];
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withNextIntl(nextConfig);

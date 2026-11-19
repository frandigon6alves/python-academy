import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { backendHeaders, backendUrl, DEFAULT_BACKEND_URL } from "./lib/backend/forward";

// Redirects "/" to "/en" (or the browser's language) and keeps the locale in the URL.
const handleLocale = createMiddleware(routing);

export default function proxy(request: NextRequest): Response {
  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/api/")) {
    const secret = process.env.PROXY_SECRET;
    const headers = backendHeaders(request.headers, secret);
    if (!secret) return NextResponse.next({ request: { headers } });
    const target = backendUrl(process.env.BACKEND_URL ?? DEFAULT_BACKEND_URL, pathname, search);
    return NextResponse.rewrite(target, { request: { headers } });
  }
  return handleLocale(request);
}

export const config = {
  // API calls, plus pages: skip Next.js internals and files with an extension.
  matcher: ["/api/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};

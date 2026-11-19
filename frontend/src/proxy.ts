import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Redirects "/" to "/en" (or the browser's language) and keeps the locale in the URL.
export default createMiddleware(routing);

export const config = {
  // Skip API calls, Next.js internals and files with an extension.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

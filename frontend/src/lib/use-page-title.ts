import { useEffect } from "react";

const SITE_NAME = "Python Academy";

/**
 * Sets the tab title for pages whose title comes from API data (a course or a lesson).
 * Static pages use Next.js metadata instead.
 */
export function usePageTitle(title: string | undefined) {
  useEffect(() => {
    if (title) document.title = `${title} · ${SITE_NAME}`;
  }, [title]);
}

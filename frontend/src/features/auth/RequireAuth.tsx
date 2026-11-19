"use client";

import { useEffect, type ReactNode } from "react";
import { ErrorState, Loading } from "@/components/ui/QueryState";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useMe } from "@/lib/api/hooks/auth";
import { authHref } from "./next-path";

/** Renders children only for signed-in users; visitors are sent to log in and brought back. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { data: me, isError, error, refetch } = useMe();
  const router = useRouter();
  const pathname = usePathname();
  const isVisitor = me === null;

  useEffect(() => {
    if (isVisitor) router.replace(authHref("/login", pathname));
  }, [isVisitor, router, pathname]);

  if (me) return <>{children}</>;
  // A failed session check is not proof of being signed out: offer a retry instead.
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />;
  return <Loading />;
}

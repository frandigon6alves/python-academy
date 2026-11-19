"use client";

import { useEffect, type ReactNode } from "react";
import { Loading } from "@/components/ui/QueryState";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useMe } from "@/lib/api/hooks/auth";
import { authHref } from "./next-path";

/** Renders children only for signed-in users; visitors are sent to log in and brought back. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { data: me, isPending } = useMe();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isPending && !me) router.replace(authHref("/login", pathname));
  }, [isPending, me, router, pathname]);

  return me ? <>{children}</> : <Loading />;
}

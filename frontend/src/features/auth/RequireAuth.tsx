"use client";

import { useEffect, type ReactNode } from "react";
import { Loading } from "@/components/ui/QueryState";
import { useRouter } from "@/i18n/navigation";
import { useMe } from "@/lib/api/hooks/auth";

/** Renders children only for signed-in users; visitors are sent to the login page. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { data: me, isPending } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !me) router.replace("/login");
  }, [isPending, me, router]);

  return me ? <>{children}</> : <Loading />;
}

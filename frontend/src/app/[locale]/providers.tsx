"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMe } from "@/lib/api/hooks/auth";
import { ThemeProvider, useTheme } from "@/theme/ThemeProvider";

/** Applies the signed-in user's saved theme once per sign-in. */
function SyncUserTheme() {
  const { data: me } = useMe();
  const { setPreference } = useTheme();
  const syncedUserId = useRef<number | null>(null);

  useEffect(() => {
    if (!me || syncedUserId.current === me.id) return;
    syncedUserId.current = me.id;
    setPreference(me.theme);
  }, [me, setPreference]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 } },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SyncUserTheme />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

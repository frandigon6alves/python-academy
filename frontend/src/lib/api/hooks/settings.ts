import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../client";
import { queryKeys } from "../query-keys";
import type { Locale, Theme, User } from "../types";

export interface SettingsChanges {
  display_name?: string;
  language?: Locale;
  theme?: Theme;
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (changes: SettingsChanges) => api<User>("/users/me", { method: "PATCH", body: changes }),
    onSuccess: (user) => {
      const previous = queryClient.getQueryData<User | null>(queryKeys.me);
      queryClient.setQueryData(queryKeys.me, user);
      // Leaderboards list display names.
      if (previous?.display_name !== user.display_name) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.leaderboards });
      }
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (body: { current_password: string; new_password: string }) =>
      api<void>("/users/me/password", { method: "POST", body }),
  });
}

/** Callers reload the page afterwards (see reloadSignedOut), which also resets the cache. */
export function useDeleteAccount() {
  return useMutation({
    mutationFn: (body: { password: string; confirmation: string }) =>
      api<void>("/users/me", { method: "DELETE", body }),
  });
}

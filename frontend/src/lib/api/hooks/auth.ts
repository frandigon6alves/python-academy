import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../client";
import { queryKeys } from "../query-keys";
import type { Locale, Theme, User } from "../types";

/** The signed-in user, or null for visitors (the API answers 200 with null, not 401). */
export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => api<User | null>("/auth/me"),
    staleTime: 5 * 60_000,
  });
}

function useSessionChange() {
  const queryClient = useQueryClient();
  return (user: User | null) => {
    queryClient.setQueryData(queryKeys.me, user);
    queryClient.removeQueries({ queryKey: queryKeys.learner });
  };
}

export function useLogin() {
  const onSessionChange = useSessionChange();
  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      api<User>("/auth/login", { method: "POST", body }),
    onSuccess: onSessionChange,
  });
}

export function useSignup() {
  const onSessionChange = useSessionChange();
  return useMutation({
    mutationFn: (body: {
      email: string;
      display_name: string;
      password: string;
      language: Locale;
      theme: Theme;
    }) => api<User>("/auth/signup", { method: "POST", body }),
    onSuccess: onSessionChange,
  });
}

export function useLogout() {
  const onSessionChange = useSessionChange();
  return useMutation({
    mutationFn: () => api<void>("/auth/logout", { method: "POST" }),
    onSuccess: () => onSessionChange(null),
  });
}

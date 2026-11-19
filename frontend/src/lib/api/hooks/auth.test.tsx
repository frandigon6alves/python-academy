import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { mockFetch } from "@/test/render";
import { useMe } from "./auth";

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe("useMe", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("resolves to null for visitors without treating it as an error", async () => {
    mockFetch({ "GET /api/v1/auth/me": null });
    const { result } = renderHook(() => useMe(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeNull();
  });

  it("returns the signed-in user", async () => {
    const user = { id: 1, email: "ada@example.com", display_name: "Ada", language: "en", theme: "dark" };
    mockFetch({ "GET /api/v1/auth/me": user });
    const { result } = renderHook(() => useMe(), { wrapper });
    await waitFor(() => expect(result.current.data).toEqual(user));
  });
});

import { screen } from "@testing-library/react";
import { mockFetch, renderWithProviders } from "@/test/render";
import { RequireAuth } from "./RequireAuth";

const replace = vi.fn();
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/hub",
  useRouter: () => ({ replace }),
}));

describe("RequireAuth", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    replace.mockReset();
  });

  it("sends visitors to log in and back", async () => {
    mockFetch({ "GET /api/v1/auth/me": null });
    renderWithProviders(<RequireAuth>secret</RequireAuth>);
    await vi.waitFor(() => expect(replace).toHaveBeenCalledWith("/login?next=%2Fhub"));
    expect(screen.queryByText("secret")).not.toBeInTheDocument();
  });

  it("renders the page for signed-in learners", async () => {
    mockFetch({
      "GET /api/v1/auth/me": { id: 1, email: "a@b.c", display_name: "Ada", language: "en", theme: "system" },
    });
    renderWithProviders(<RequireAuth>secret</RequireAuth>);
    expect(await screen.findByText("secret")).toBeInTheDocument();
  });

  it("offers a retry instead of redirecting when the session check fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("Bad gateway", { status: 502 })),
    );
    renderWithProviders(<RequireAuth>secret</RequireAuth>);
    expect(await screen.findByRole("button", { name: "Try again" })).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });
});

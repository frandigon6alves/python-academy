import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockFetch, renderWithProviders } from "@/test/render";
import { LocaleSwitcher } from "./LocaleSwitcher";

const replace = vi.fn();
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/login",
  useRouter: () => ({ replace }),
}));

describe("LocaleSwitcher", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    replace.mockReset();
    window.history.replaceState(null, "", "/");
  });

  it("switches the locale and keeps the query string", async () => {
    mockFetch({ "GET /api/v1/auth/me": null });
    window.history.replaceState(null, "", "/en/login?next=%2Fcourses%2Fpython-basics");
    renderWithProviders(<LocaleSwitcher />);

    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Language" }), "es");

    expect(replace).toHaveBeenCalledWith("/login?next=%2Fcourses%2Fpython-basics", { locale: "es" });
  });

  it("saves the language of signed-in learners", async () => {
    const ada = { id: 1, email: "ada@example.com", display_name: "Ada", language: "en", theme: "system" };
    const fetchMock = mockFetch({
      "GET /api/v1/auth/me": ada,
      "PATCH /api/v1/users/me": { ...ada, language: "es" },
    });
    renderWithProviders(<LocaleSwitcher />);
    await vi.waitFor(() => expect(fetchMock).toHaveBeenCalled());

    await userEvent.selectOptions(screen.getByRole("combobox", { name: "Language" }), "es");

    await vi.waitFor(() => {
      const patch = fetchMock.mock.calls.find(([, init]) => init?.method === "PATCH");
      expect(JSON.parse(String(patch?.[1]?.body))).toEqual({ language: "es" });
    });
    expect(replace).toHaveBeenCalledWith("/login", { locale: "es" });
  });
});

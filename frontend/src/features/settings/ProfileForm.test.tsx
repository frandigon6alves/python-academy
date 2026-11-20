import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { User } from "@/lib/api/types";
import { mockFetch, renderWithProviders } from "@/test/render";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { ProfileForm } from "./ProfileForm";

const replace = vi.fn();
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/settings",
  useRouter: () => ({ replace }),
}));

const ada: User = { id: 1, email: "ada@example.com", display_name: "Ada", language: "en", theme: "light" };

function form(user: User) {
  return (
    <ThemeProvider>
      <ProfileForm user={user} />
    </ThemeProvider>
  );
}

/** The JSON body of the PATCH request the form sent. */
function patchBody(fetchMock: ReturnType<typeof mockFetch>): unknown {
  const call = fetchMock.mock.calls.find(([, init]) => init?.method === "PATCH");
  return JSON.parse(String(call?.[1]?.body));
}

describe("ProfileForm", () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }) as unknown as typeof window.matchMedia;
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    replace.mockReset();
  });

  it("saves only what changed", async () => {
    const fetchMock = mockFetch({ "PATCH /api/v1/users/me": { ...ada, display_name: "Ada L." } });
    renderWithProviders(form(ada));
    const save = screen.getByRole("button", { name: "Save changes" });
    expect(save).toBeDisabled();

    const name = screen.getByLabelText("Display name");
    await userEvent.clear(name);
    await userEvent.type(name, "Ada L.");
    await userEvent.click(save);

    expect(await screen.findByText("Changes saved.")).toBeInTheDocument();
    expect(patchBody(fetchMock)).toEqual({ display_name: "Ada L." });
    expect(replace).not.toHaveBeenCalled();
  });

  it("follows a preference changed elsewhere instead of overwriting it", async () => {
    const fetchMock = mockFetch({
      "PATCH /api/v1/users/me": { ...ada, theme: "dark", display_name: "Ada L." },
    });
    const { rerender } = renderWithProviders(form(ada));
    // The theme switcher in the header saved "dark" while this form was open.
    rerender(form({ ...ada, theme: "dark" }));
    expect(screen.getByLabelText("Theme")).toHaveValue("dark");

    const name = screen.getByLabelText("Display name");
    await userEvent.clear(name);
    await userEvent.type(name, "Ada L.");
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(await screen.findByText("Changes saved.")).toBeInTheDocument();
    expect(patchBody(fetchMock)).toEqual({ display_name: "Ada L." });
  });

  it("moves to the chosen language once it is saved", async () => {
    mockFetch({ "PATCH /api/v1/users/me": { ...ada, language: "es" } });
    renderWithProviders(form(ada));
    await userEvent.selectOptions(screen.getByLabelText("Language"), "es");
    await userEvent.click(screen.getByRole("button", { name: "Save changes" }));

    await vi.waitFor(() => expect(replace).toHaveBeenCalledWith("/settings", { locale: "es" }));
  });
});

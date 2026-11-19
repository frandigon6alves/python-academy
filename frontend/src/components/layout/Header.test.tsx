import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockFetch, renderWithProviders } from "@/test/render";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { Header } from "./Header";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  usePathname: () => "/glossary",
  useRouter: () => ({ replace: vi.fn() }),
}));

function renderHeader() {
  return renderWithProviders(
    <ThemeProvider>
      <Header />
      <a href="#elsewhere">Outside link</a>
    </ThemeProvider>,
  );
}

describe("Header menu", () => {
  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }) as unknown as typeof window.matchMedia;
    mockFetch({ "GET /api/v1/auth/me": null });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("discloses the menu and reports its state", async () => {
    renderHeader();
    const button = screen.getByRole("button", { name: "Menu" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", "site-menu");

    await userEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("site-menu")).toHaveAttribute("data-open", "true");
  });

  it("closes on Escape and gives focus back to the button", async () => {
    renderHeader();
    const button = screen.getByRole("button", { name: "Menu" });
    await userEvent.click(button);
    await userEvent.tab();
    expect(button).not.toHaveFocus();

    await userEvent.keyboard("{Escape}");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveFocus();
  });

  it("closes when focus leaves the header", async () => {
    renderHeader();
    const button = screen.getByRole("button", { name: "Menu" });
    await userEvent.click(button);
    act(() => screen.getByRole("link", { name: "Outside link" }).focus());
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("holds the language and theme switchers and the account links for visitors", async () => {
    renderHeader();
    expect(screen.getByRole("combobox", { name: "Language" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Theme" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("link", { name: "Log in" })).toBeInTheDocument());
    expect(screen.getByRole("link", { name: "Sign up" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Glossary" })).toHaveAttribute("aria-current", "page");
    expect(screen.queryByRole("link", { name: "My hub" })).not.toBeInTheDocument();
  });
});

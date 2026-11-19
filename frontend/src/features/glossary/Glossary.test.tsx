import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockFetch, renderWithProviders } from "@/test/render";
import { Glossary } from "./Glossary";
import { GlossaryTeaser } from "./GlossaryTeaser";

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const terms = [
  { term: "Argument", definition: "A value passed to a function." },
  { term: "Boolean", definition: "True or False." },
  { term: "Dictionary", definition: "Maps keys to values." },
  { term: "Function", definition: "A reusable block of code." },
  { term: "List", definition: "An ordered, mutable sequence." },
  { term: "String", definition: "A sequence of characters." },
  { term: "Tuple", definition: "An ordered, immutable sequence." },
  { term: "Variable", definition: "A name that refers to a value." },
];

describe("Glossary page", () => {
  beforeEach(() => {
    mockFetch({ "GET /api/v1/glossary": terms });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("lists every term under an A–Z index where only used letters are links", async () => {
    renderWithProviders(<Glossary />);
    expect(await screen.findByText("8 terms")).toBeInTheDocument();
    const index = screen.getByRole("navigation", { name: "Jump to letter" });
    expect(within(index).getByRole("link", { name: "A" })).toHaveAttribute("href", "#glossary-A");
    expect(within(index).queryByRole("link", { name: "C" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "T" })).toBeInTheDocument();
  });

  it("starts from the search in the URL and can clear it", async () => {
    renderWithProviders(<Glossary initialQuery="immutable" />);
    expect(await screen.findByText("1 term")).toBeInTheDocument();
    expect(screen.getByText("Tuple")).toBeInTheDocument();

    await userEvent.clear(screen.getByRole("searchbox", { name: "Search terms" }));
    await userEvent.type(screen.getByRole("searchbox", { name: "Search terms" }), "zzz");
    expect(screen.getByText("No terms match “zzz”.")).toBeInTheDocument();
    expect(window.location.search).toBe("?q=zzz");

    await userEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(screen.getByText("8 terms")).toBeInTheDocument();
  });
});

describe("Glossary teaser", () => {
  beforeEach(() => {
    mockFetch({ "GET /api/v1/glossary": terms });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("shows a few terms, a search that opens the glossary page and a link to all terms", async () => {
    renderWithProviders(<GlossaryTeaser />);
    expect(await screen.findByRole("link", { name: "See all 8 terms" })).toHaveAttribute("href", "/glossary");
    expect(screen.getAllByRole("term")).toHaveLength(6);
    const form = screen.getByRole("search");
    expect(form).toHaveAttribute("action", "/en/glossary");
    expect(within(form).getByRole("searchbox")).toHaveAttribute("name", "q");
  });
});

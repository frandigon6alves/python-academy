import { resolveTheme, THEME_STORAGE_KEY, themeInitScript } from "./theme";

function runInitScript(prefersDark: boolean) {
  window.matchMedia = vi
    .fn()
    .mockReturnValue({ matches: prefersDark }) as unknown as typeof window.matchMedia;
  new Function(themeInitScript)();
  return document.documentElement.dataset.theme;
}

describe("theme", () => {
  afterEach(() => localStorage.clear());

  it("resolves the system preference", () => {
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("light", true)).toBe("light");
  });

  it("init script follows the OS when no choice is stored", () => {
    expect(runInitScript(true)).toBe("dark");
    expect(runInitScript(false)).toBe("light");
  });

  it("init script honours a stored manual choice", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "dark");
    expect(runInitScript(false)).toBe("dark");
  });
});

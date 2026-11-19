import type { Theme } from "@/lib/api/types";

export const THEME_STORAGE_KEY = "academy-theme";
export const THEMES: Theme[] = ["system", "light", "dark"];

export function isTheme(value: unknown): value is Theme {
  return typeof value === "string" && (THEMES as string[]).includes(value);
}

export function resolveTheme(preference: Theme, prefersDark: boolean): "light" | "dark" {
  if (preference === "system") return prefersDark ? "dark" : "light";
  return preference;
}

/**
 * Runs inline in <head> before the first paint, so the page never flashes
 * the wrong theme. Kept tiny and dependency-free on purpose.
 */
export const themeInitScript = `(function () {
  try {
    var pref = localStorage.getItem("${THEME_STORAGE_KEY}") || "system";
    var dark = pref === "dark" || (pref !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  } catch (e) {
    document.documentElement.dataset.theme = "light";
  }
})();`;

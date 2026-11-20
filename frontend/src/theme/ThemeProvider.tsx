"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Theme } from "@/lib/api/types";
import { isTheme, resolveTheme, THEME_STORAGE_KEY } from "./theme";

interface ThemeContextValue {
  preference: Theme;
  setPreference: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const CHANGE_EVENT = "academy-theme-change";

// When localStorage cannot be written (private mode, blocked storage), the choice lives
// here for the lifetime of the page so the selects still reflect it.
let unsavedPreference: Theme | null = null;

// The stored preference is an external store: localStorage plus a change event.
function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readPreference(): Theme {
  if (unsavedPreference) return unsavedPreference;
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

function applyTheme(preference: Theme) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  // Swap every colour at once (see .theme-switching in globals.css).
  root.classList.add("theme-switching");
  root.dataset.theme = resolveTheme(preference, prefersDark);
  void getComputedStyle(root).color; // flush styles while transitions are off
  requestAnimationFrame(() => root.classList.remove("theme-switching"));
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const preference = useSyncExternalStore(subscribe, readPreference, () => "system" as const);

  // Apply the theme, and follow OS changes while the preference is "system".
  useEffect(() => {
    applyTheme(preference);
    if (preference !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [preference]);

  const setPreference = useCallback((theme: Theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      unsavedPreference = null;
    } catch {
      unsavedPreference = theme;
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return <ThemeContext.Provider value={{ preference, setPreference }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>");
  return context;
}

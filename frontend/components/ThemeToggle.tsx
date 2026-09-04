"use client";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";
const STORAGE_KEY = "lenspire-theme";
const THEME_EVENT = "lenspire-theme-change";

const readStored = (): Theme | null => {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return null;
};

const apply = (theme: Theme) => {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = readStored() ?? "dark";
    setTheme(initial);
    apply(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, theme);
    apply(theme);
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
  }, [theme, mounted]);

  return <>{children}</>;
}

export function useTheme(): { theme: Theme; setTheme: (next: Theme) => void; toggle: () => void } {
  const [theme, setThemeState] = useState<Theme>("dark");
  useEffect(() => {
    const sync = (event: Event) => {
      const next = (event as CustomEvent<Theme>).detail;
      if (next) setThemeState(next);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && (event.newValue === "light" || event.newValue === "dark")) {
        setThemeState(event.newValue);
      }
    };
    const stored = readStored();
    if (stored) setThemeState(stored);
    window.addEventListener(THEME_EVENT, sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(THEME_EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  return {
    theme,
    setTheme: (next) => {
      setThemeState(next);
      apply(next);
      window.localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: next }));
    },
    toggle: () => {
      const next: Theme = (readStored() ?? theme) === "light" ? "dark" : "light";
      setThemeState(next);
      apply(next);
      window.localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: next }));
    },
  };
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const isDark = theme !== "light";
  return (
    <button
      type="button"
      className={`themeToggle ${className ?? ""}`.trim()}
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={isDark ? "true" : "false"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      data-theme-state={isDark ? "dark" : "light"}
    >
      <span className="themeToggleIcon" aria-hidden="true">
        {isDark ? "☀" : "☾"}
      </span>
      <span className="themeToggleLabel">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}

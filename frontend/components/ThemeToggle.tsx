"use client";
import { useEffect, useState } from "react";

type Theme = "dark" | "light" | "blush" | "neon";
const STORAGE_KEY = "lenspire-theme";
const THEME_EVENT = "lenspire-theme-change";
const themes: Theme[] = ["dark", "light", "blush", "neon"];

const readStored = (): Theme | null => {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "blush" || stored === "neon") return stored;
  return null;
};

const apply = (theme: Theme) => {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === "light" || theme === "blush" ? "light" : "dark";
};

const activeTheme = (): Theme | null => {
  if (typeof document === "undefined") return null;
  const current = document.documentElement.dataset.theme;
  return current === "light" || current === "dark" || current === "blush" || current === "neon" ? current : null;
};

const preferredTheme = (): Theme => {
  const stored = readStored();
  if (stored) return stored;
  const current = activeTheme();
  if (current) return current;
  return typeof window !== "undefined" && window.location.hostname === "crm.lenspireai.com" ? "light" : "dark";
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const host = window.location.hostname;
    const initial = (stored === "light" || stored === "dark" || stored === "blush" || stored === "neon") ? stored : (host === "crm.lenspireai.com" ? "light" : "dark");
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
  const [theme, setThemeState] = useState<Theme>(preferredTheme);
  useEffect(() => {
    setThemeState(preferredTheme());
    const sync = (event: Event) => {
      const next = (event as CustomEvent<Theme>).detail;
      if (next) setThemeState(next);
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && (event.newValue === "light" || event.newValue === "dark" || event.newValue === "blush" || event.newValue === "neon")) {
        setThemeState(event.newValue);
      }
    };
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
      const current = activeTheme() ?? readStored() ?? theme;
      const next = themes[(themes.indexOf(current) + 1) % themes.length];
      setThemeState(next);
      apply(next);
      window.localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: next }));
    },
  };
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const themeDetails: Record<Theme, { icon: string; label: string; next: string }> = {
    dark: { icon: "☀", label: "Light", next: "light" },
    light: { icon: "◌", label: "Blush", next: "blush" },
    blush: { icon: "✦", label: "Neon", next: "neon" },
    neon: { icon: "☾", label: "Dark", next: "dark" },
  };
  const detail = themeDetails[theme];
  return (
    <button
      type="button"
      className={`themeToggle ${className ?? ""}`.trim()}
      onClick={toggle}
      aria-label={`Switch to ${detail.next} theme`}
      aria-pressed={theme !== "dark" ? "true" : "false"}
      title={`Switch to ${detail.next} theme`}
      data-theme-state={theme}
    >
      <span className="themeToggleIcon" aria-hidden="true">
        {detail.icon}
      </span>
      <span className="themeToggleLabel">{detail.label}</span>
    </button>
  );
}

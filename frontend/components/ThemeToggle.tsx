"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";
type ThemeMode = Theme | "system";
type Accent = "champagne" | "blush" | "violet" | "sapphire" | "emerald" | "sunset";

const MODE_STORAGE_KEY = "lenspire-theme-mode";
const ACCENT_STORAGE_KEY = "lenspire-theme-accent";
const LEGACY_STORAGE_KEY = "lenspire-theme";
const THEME_EVENT = "lenspire-theme-change";
const accents: Record<Accent, { label: string; description: string; color: string; hover: string; soft: string }> = {
  champagne: { label: "Champagne Gold", description: "Timeless wedding luxury", color: "#d4af37", hover: "#b99120", soft: "#fbf2d6" },
  blush: { label: "Blush Rose Gold", description: "Romantic warmth", color: "#e07a5f", hover: "#c86349", soft: "#fde8e2" },
  violet: { label: "Royal Violet", description: "Signature AI intelligence", color: "#8b5cf6", hover: "#7441de", soft: "#ede7ff" },
  sapphire: { label: "Cyber Sapphire", description: "High-speed precision", color: "#3b82f6", hover: "#2563d9", soft: "#e1efff" },
  emerald: { label: "Tuscan Emerald", description: "Botanical garden elegance", color: "#10b981", hover: "#059669", soft: "#d9f7eb" },
  sunset: { label: "Sunset Glow", description: "Golden hour radiance", color: "#f59e0b", hover: "#d97706", soft: "#fff0d3" },
};
const isMode = (value: string | null): value is ThemeMode => value === "light" || value === "dark" || value === "system";
const isAccent = (value: string | null): value is Accent => Boolean(value && value in accents);
const systemTheme = (): Theme => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const resolvedTheme = (mode: ThemeMode): Theme => mode === "system" ? systemTheme() : mode;
const storedMode = (): ThemeMode => {
  const mode = localStorage.getItem(MODE_STORAGE_KEY);
  if (isMode(mode)) return mode;
  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
  return legacy === "dark" || legacy === "neon" ? "dark" : "light";
};
const storedAccent = (): Accent => {
  const accent = localStorage.getItem(ACCENT_STORAGE_KEY);
  return isAccent(accent) ? accent : "violet";
};
const apply = (mode: ThemeMode, accent: Accent) => {
  const theme = resolvedTheme(mode);
  const palette = accents[accent];
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.dataset.themeMode = mode;
  root.dataset.accent = accent;
  root.style.colorScheme = theme;
  root.style.setProperty("--brand", palette.color);
  root.style.setProperty("--brand-hover", palette.hover);
  root.style.setProperty("--secondary", palette.color);
  root.style.setProperty("--accent", palette.color);
  root.style.setProperty("--brand-soft", palette.soft);
  root.style.setProperty("--focus-ring", `0 0 0 3px ${palette.color}33`);
  window.dispatchEvent(new CustomEvent(THEME_EVENT));
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<{ mode: ThemeMode; accent: Accent } | null>(null);
  useEffect(() => setSettings({ mode: storedMode(), accent: storedAccent() }), []);
  useEffect(() => {
    if (!settings) return;
    localStorage.setItem(MODE_STORAGE_KEY, settings.mode);
    localStorage.setItem(ACCENT_STORAGE_KEY, settings.accent);
    apply(settings.mode, settings.accent);
  }, [settings]);
  useEffect(() => {
    if (!settings || settings.mode !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => apply("system", settings.accent);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [settings]);
  return <>{children}</>;
}

export function useTheme(): { theme: Theme; mode: ThemeMode; accent: Accent; setMode: (mode: ThemeMode) => void; setAccent: (accent: Accent) => void } {
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [accent, setAccentState] = useState<Accent>("violet");
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const sync = () => { const nextMode = storedMode(); setModeState(nextMode); setAccentState(storedAccent()); setTheme(resolvedTheme(nextMode)); };
    sync(); window.addEventListener(THEME_EVENT, sync); window.addEventListener("storage", sync);
    return () => { window.removeEventListener(THEME_EVENT, sync); window.removeEventListener("storage", sync); };
  }, []);
  const update = (nextMode: ThemeMode, nextAccent: Accent) => {
    setModeState(nextMode); setAccentState(nextAccent); setTheme(resolvedTheme(nextMode));
    localStorage.setItem(MODE_STORAGE_KEY, nextMode); localStorage.setItem(ACCENT_STORAGE_KEY, nextAccent); apply(nextMode, nextAccent);
  };
  return { theme, mode, accent, setMode: (next) => update(next, accent), setAccent: (next) => update(mode, next) };
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, mode, accent, setMode, setAccent } = useTheme();
  const [open, setOpen] = useState(false);
  return <div className={`themeSettings ${className ?? ""}`.trim()}>
    <button type="button" className="themeToggle" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="theme-settings-drawer" title="Settings"><span className="themeToggleIcon" aria-hidden="true">⚙</span><span className="themeToggleLabel">Settings</span></button>
    {open && <section id="theme-settings-drawer" className="themeDrawer" aria-label="Appearance settings">
      <div className="themeDrawerHead"><div><b>Appearance</b><span>{theme === "dark" ? "Luxury darkroom" : "Editorial light"}</span></div><button type="button" onClick={() => setOpen(false)} aria-label="Close settings">×</button></div>
      <div className="themeDrawerSection"><span>Theme mode</span><div className="themeModeOptions">{(["light", "dark", "system"] as ThemeMode[]).map((item) => <button type="button" key={item} className={mode === item ? "selected" : ""} onClick={() => setMode(item)}>{item === "system" ? "System" : item[0].toUpperCase() + item.slice(1)}</button>)}</div></div>
      <div className="themeDrawerSection"><span>Accent colour</span><div className="accentOptions">{(Object.entries(accents) as [Accent, typeof accents[Accent]][]).map(([key, item]) => <button type="button" key={key} className={accent === key ? "selected" : ""} onClick={() => setAccent(key)} aria-pressed={accent === key}><i style={{ background: item.color }} /><strong>{item.label}</strong><small>{item.description}</small></button>)}</div></div>
    </section>}
  </div>;
}

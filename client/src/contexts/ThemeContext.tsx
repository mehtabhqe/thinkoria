import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: ResolvedTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ResolvedTheme;
  switchable?: boolean;
}

function systemTheme(): ResolvedTheme {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children, defaultTheme = "light", switchable = false }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (!switchable || typeof window === "undefined") return defaultTheme;
    const stored = window.localStorage.getItem("theme-mode") as ThemeMode | null;
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  });
  const [systemResolved, setSystemResolved] = useState<ResolvedTheme>(systemTheme);
  const theme: ResolvedTheme = mode === "system" ? systemResolved : mode;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemResolved(media.matches ? "dark" : "light");
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.dataset.themeMode = mode;
    if (switchable) window.localStorage.setItem("theme-mode", mode);
  }, [mode, theme, switchable]);

  const value = useMemo<ThemeContextType>(() => ({
    theme,
    mode,
    setMode,
    toggleTheme: () => setMode((current) => current === "light" ? "dark" : current === "dark" ? "system" : "light"),
    switchable,
  }), [mode, setMode, switchable, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, mode, toggleTheme } = useTheme();
  const nextMode = mode === "light" ? "dark" : mode === "dark" ? "system" : "light";
  const label = mode === "system" ? `System preference (${theme})` : mode === "dark" ? "Dark mode" : "Light mode";
  const nextLabel = nextMode === "system" ? "system preference" : `${nextMode} mode`;
  return (
    <button type="button" onClick={toggleTheme} aria-label={`${label}. Switch to ${nextLabel}`} title={`${label}. Switch to ${nextLabel}`} className="theme-toggle" data-theme-mode={mode}>
      {mode === "system" ? <Laptop size={15} /> : mode === "dark" ? <Sun size={15} /> : <Moon size={15} />}
      <span className="sr-only">{label}. Switch to {nextLabel}</span>
    </button>
  );
}

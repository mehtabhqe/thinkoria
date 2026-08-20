import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  if (!toggleTheme) return null;

  const nextTheme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      className="theme-toggle"
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
      <span className="sr-only">Switch to {nextTheme} mode</span>
    </button>
  );
}

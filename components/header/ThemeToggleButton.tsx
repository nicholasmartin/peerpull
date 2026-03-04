"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => toggleTheme()}
      className="flex items-center justify-center text-dark-text-muted transition-colors bg-dark-card border border-dark-border rounded-md hover:text-dark-text h-11 w-11 hover:bg-dark-surface"
      title={`Theme: ${isDark ? "Dark" : "Light"}. Click to switch.`}
      aria-label={`Current theme: ${isDark ? "Dark" : "Light"}. Click to switch.`}
    >
      {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}

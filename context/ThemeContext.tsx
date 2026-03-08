"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import Script from "next/script";

type ThemeType = "light" | "dark";

type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: (newTheme?: ThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeType;
  isProtected?: boolean;
};

// Injected as a script before React hydrates to prevent flash of wrong theme
const themeScript = (_isProtected: boolean) => {
  const scriptContent = `
    (function() {
      try {
        var storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'light') {
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.classList.add('dark');
          if (!storedTheme) localStorage.setItem('theme', 'dark');
        }
      } catch (e) {
        console.error('Error in theme script:', e);
      }
    })();
  `;
  return scriptContent;
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme,
  isProtected = false,
}) => {
  const [theme, setTheme] = useState<ThemeType>(defaultTheme || "dark");
  const [mounted, setMounted] = useState(false);

  // Sync React state from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    }
  }, []);

  const toggleTheme = (newTheme?: ThemeType) => {
    if (!mounted) return;

    if (!newTheme) {
      newTheme = theme === "dark" ? "light" : "dark";
    }

    setTheme(newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <>
      <Script id="theme-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript(isProtected) }} />
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

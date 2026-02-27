"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import Script from "next/script";

type ThemeType = "light" | "dark" | "system";

type ThemeContextType = {
  theme: ThemeType;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeType;
  isProtected?: boolean;
};

// This function will be injected as a script in the page head to avoid hydration mismatch
const themeScript = (isProtected: boolean) => {
  const scriptContent = `
    (function() {
      try {
        // Check if stored theme first
        const storedTheme = localStorage.getItem('theme');
        
        // Check if this is a protected route
        const isProtectedRoute = ${isProtected} || window.location.pathname.startsWith('/dashboard');
        
        // Apply theme based on stored preference or route type
        if (storedTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (storedTheme === 'light') {
          document.documentElement.classList.remove('dark');
        } else if (storedTheme === 'system') {
          // Check system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } else {
          // No stored theme — default to dark
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
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

  // Only after mounting, we can use client-side code
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = (newTheme?: ThemeType) => {
    if (!mounted) return;
    
    // If no theme specified, cycle through light -> dark -> system
    if (!newTheme) {
      if (theme === "light") newTheme = "dark";
      else if (theme === "dark") newTheme = "system";
      else newTheme = "light";
    }
    
    setTheme(newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else if (newTheme === "system") {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", "system");
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

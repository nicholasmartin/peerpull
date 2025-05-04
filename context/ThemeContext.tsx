"use client";

import type React from "react";
import { createContext, useContext, useEffect } from "react";

type ThemeContextType = {
  theme: "light";
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    // Ensure dark mode is removed on client side
    document.documentElement.classList.remove("dark");
    // Store light theme in localStorage
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "light" }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

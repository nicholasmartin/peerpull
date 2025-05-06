"use client";

import { useEffect, useState } from "react";

export default function ThemeDebug() {
  const [isDarkClass, setIsDarkClass] = useState(false);
  const [localStorageTheme, setLocalStorageTheme] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkDark = () => {
      setIsDarkClass(document.documentElement.classList.contains("dark"));
      setLocalStorageTheme(localStorage.getItem("theme") || "");
    };
    
    checkDark();
    
    // Check again after a short delay to catch any changes
    const timer = setTimeout(checkDark, 500);
    
    // Set up an observer to monitor class changes on html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDark();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg text-sm">
      <div>
        <strong>Dark class on HTML:</strong> {isDarkClass ? "Yes" : "No"}
      </div>
      <div>
        <strong>localStorage theme:</strong> {localStorageTheme}
      </div>
      <div>
        <strong>Path:</strong> {window.location.pathname}
      </div>
      <div>
        <strong>Protected route:</strong> {window.location.pathname.startsWith("/dashboard") ? "Yes" : "No"}
      </div>
      <button 
        onClick={() => document.documentElement.classList.toggle("dark")}
        className="mt-2 px-2 py-1 bg-blue-500 text-white rounded"
      >
        Toggle Dark Class
      </button>
    </div>
  );
}

import type { Config } from "tailwindcss";

const config = {
  // Theme toggling via .dark class on <html> — managed by ThemeContext
  darkMode: 'class',
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    fontFamily: {
      inter: ['var(--font-inter)'],
      montserrat: ['var(--font-montserrat)'],
    },
    extend: {
      colors: {
        // Legacy tokens kept for compatibility
        stroke: "#E2E8F0",
        dark: "#0F172A",
        black: "#000000",
        "black-2": "#1C2434",
        "body-color": "#64748B",
        body: "#64748B",
        bodydark: "#AEB7C0",
        bodydark1: "#DEE4EE",
        bodydark2: "#8A99AF",
        boxdark: "#24303F",
        "boxdark-2": "#1A222C",
        strokedark: "#2E3A47",
        "form-strokedark": "#3D4D60",
        success: "#219653",
        danger: "#D34053",
        warning: "#FFA70B",
        // Theme-aware tokens — values swap via CSS custom properties in globals.css
        // Names kept as dark-* for zero-diff in components (they're semantic, not literal)
        "dark-bg": "rgb(var(--color-bg) / <alpha-value>)",
        "dark-card": "rgb(var(--color-card) / <alpha-value>)",
        "dark-surface": "rgb(var(--color-surface) / <alpha-value>)",
        "dark-border": "rgb(var(--color-border) / <alpha-value>)",
        "dark-text": "rgb(var(--color-text) / <alpha-value>)",
        "dark-text-muted": "rgb(var(--color-text-muted) / <alpha-value>)",
        // Public page tokens (warm gold palette)
        "blue-primary": "#d4a853",
        "blue-secondary": "#c49b38",
        "teal-accent": "#e8c778",
        "gradient-start": "#d4a853",
        "gradient-end": "#e8c778",
        "glass-highlight": "rgba(255, 255, 255, 0.06)",
        "glass-border": "rgba(255, 255, 255, 0.08)",
        // Single accent
        primary: {
          DEFAULT: "#d4a853",
          muted: "#b8912e",
          subtle: "rgba(212,168,83,0.08)",
        },
        background: "rgb(var(--color-bg) / <alpha-value>)",
        foreground: "rgb(var(--color-text) / <alpha-value>)",
        muted: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          foreground: "rgb(var(--color-text-muted) / <alpha-value>)",
        },
        border: "rgb(var(--color-border) / <alpha-value>)",
      },
      borderRadius: {},
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontSize: {
        'title-xxs': ['0.625rem', '0.875rem'],
        'title-xs': ['0.75rem', '1rem'],
        'title-sm': ['0.875rem', '1.25rem'],
        'title-md': ['1rem', '1.5rem'],
        'title-lg': ['1.125rem', '1.75rem'],
        'title-xl': ['1.25rem', '1.75rem'],
        'title-2xl': ['1.5rem', '2rem'],
        'title-3xl': ['1.875rem', '2.25rem'],
        'title-4xl': ['2.25rem', '2.5rem'],
        'theme-xs': ['0.75rem', '1rem'],
        'theme-sm': ['0.875rem', '1.25rem'],
        'theme-base': ['1rem', '1.5rem'],
        'theme-lg': ['1.125rem', '1.75rem'],
        'theme-xl': ['1.25rem', '1.75rem'],
        'theme-2xl': ['1.5rem', '2rem'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;

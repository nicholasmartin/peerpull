import type { Config } from "tailwindcss";

const config = {
  // Using dark mode by default - no toggle needed
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
        // TailAdmin colors
        stroke: "#E2E8F0",
        dark: "#0F172A",
        black: "#000000",
        "black-2": "#1C2434",
        "body-color": "#64748B",
        body: "#64748B",  // Added for text-body class
        bodydark: "#AEB7C0",
        bodydark1: "#DEE4EE",
        bodydark2: "#8A99AF",
        boxdark: "#24303F",
        "boxdark-2": "#1A222C",
        strokedark: "#2E3A47",
        "form-strokedark": "#3D4D60",
        "meta-1": "#DC3545",
        "meta-2": "#EFF2F7",
        "meta-3": "#10B981",
        "meta-4": "#313D4A",
        "meta-5": "#259AE6",
        "meta-6": "#FFBA00",
        "meta-7": "#FF6766",
        "meta-8": "#F0950C",
        "meta-9": "#E5E7EB",
        success: "#219653",
        danger: "#D34053",
        warning: "#FFA70B",
        blue: {
          500: "#3b82f6",
        },
        gray: {
          100: "#f3f4f6",
          400: "#9ca3af",
          600: "#4b5563",
        },
        // Premium Dark Mode Theme
        "dark-bg": "#121212",
        "dark-card": "#1e1e1e",
        "dark-surface": "#252525",
        "dark-border": "#333333",
        "dark-text": "#f5f5f5",
        "dark-text-muted": "#a0a0a0",
        "blue-primary": "#0ea5e9",
        "blue-secondary": "#06b6d4",
        "teal-accent": "#2dd4bf",
        "gradient-start": "#0ea5e9",
        "gradient-end": "#2dd4bf",
        "glass-highlight": "rgba(255, 255, 255, 0.05)",
        "glass-border": "rgba(255, 255, 255, 0.1)",
        primary: "#0ea5e9", // blue primary
        secondary: "#2dd4bf", // teal accent
        accent: "#06b6d4", // blue secondary
        background: "#121212", // dark bg
        foreground: "#f5f5f5", // dark text
        muted: {
          DEFAULT: "#252525", // dark surface
          foreground: "#a0a0a0", // dark text muted
        },
        border: "#333333" // dark border
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
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

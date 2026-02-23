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
        // Dark theme palette
        "dark-bg": "#0a0a0b",
        "dark-card": "#141416",
        "dark-surface": "#1c1c1f",
        "dark-border": "#27272a",
        "dark-text": "#fafafa",
        "dark-text-muted": "#71717a",
        // Single accent
        primary: {
          DEFAULT: "#3b82f6",
          muted: "#1d4ed8",
          subtle: "rgba(59,130,246,0.08)",
        },
        background: "#0a0a0b",
        foreground: "#fafafa",
        muted: {
          DEFAULT: "#1c1c1f",
          foreground: "#71717a",
        },
        border: "#27272a",
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

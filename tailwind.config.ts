import type { Config } from "tailwindcss";

const config = {
  // Enable dark mode via class strategy
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
        // Custom color palette
        "barn-red": "#780000",
        "fire-brick": "#C1121F",
        "papaya-whip": "#FDF0D5",
        "prussian-blue": "#003049",
        "air-blue": "#669BBC",
        primary: "#003049", // prussian-blue as primary
        secondary: "#669BBC", // air-superiority-blue as secondary
        accent: "#C1121F", // fire-brick as accent
        background: "#FDF0D5", // papaya-whip as background
        foreground: "#003049", // prussian-blue as foreground text
        muted: {
          DEFAULT: "#E6D7B3", // lighter papaya-whip
          foreground: "#003049", // prussian-blue
        },
        border: "#C1121F", // fire-brick as border
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

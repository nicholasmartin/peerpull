import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./entrypoints/**/*.{ts,tsx,html}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-bg": "rgb(var(--color-bg) / <alpha-value>)",
        "dark-card": "rgb(var(--color-card) / <alpha-value>)",
        "dark-surface": "rgb(var(--color-surface) / <alpha-value>)",
        "dark-border": "rgb(var(--color-border) / <alpha-value>)",
        "dark-text": "rgb(var(--color-text) / <alpha-value>)",
        "dark-text-muted": "rgb(var(--color-text-muted) / <alpha-value>)",
        primary: {
          DEFAULT: "#d4a853",
          muted: "#b8912e",
          subtle: "rgba(212,168,83,0.08)",
        },
        success: "#219653",
        danger: "#D34053",
        warning: "#FFA70B",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["'IBM Plex Sans'", "'Noto Sans Devanagari'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        sans: ["'Inter'", "'Noto Sans Devanagari'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'JetBrains Mono'", "'IBM Plex Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        background: "#090C10",
        foreground: "#F8FAFC",
        obsidian: {
          DEFAULT: "#090C10",
          950: "#06080B",
          900: "#090C10",
          850: "#0D1117",
          800: "#10161F",
          700: "#16202C",
          border: "rgba(255, 255, 255, 0.10)",
        },
        charcoal: {
          DEFAULT: "#090C10",
          950: "#06080B",
          900: "#090C10",
          card: "#10161F",
          elevated: "#16202C",
          border: "rgba(255, 255, 255, 0.10)",
        },
        sand: {
          DEFAULT: "#F8FAFC",
          bright: "#FFFFFF",
          muted: "#94A3B8",
          dim: "#64748B",
          faint: "rgba(255, 255, 255, 0.08)",
        },
        electric: {
          DEFAULT: "#06B6D4",
          hover: "#38BDF8",
          active: "#0891B2",
          tinted: "#0E2433",
          dim: "rgba(6, 182, 212, 0.14)",
        },
        suraksha: {
          950: "#090C10",
          900: "#0D1117",
          850: "#10161F",
          800: "#16202C",
          750: "#1E293B",
          700: "#334155",
          600: "#475569",
          500: "#64748B",
          400: "#94A3B8",
          300: "#CBD5E1",
          200: "#E2E8F0",
          100: "#F8FAFC",
        },
        cyan: {
          DEFAULT: "#06B6D4",
          500: "#06B6D4",
          400: "#38BDF8",
          glow: "#06B6D4",
        },
        teal: {
          DEFAULT: "#14B8A6",
          500: "#14B8A6",
          400: "#2DD4BF",
        },
      },
      borderRadius: {
        pill: "9999px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;

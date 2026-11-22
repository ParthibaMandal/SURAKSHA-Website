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
        background: "#000000",
        foreground: "#FFFFFF",
        obsidian: {
          DEFAULT: "#000000",
          950: "#000000",
          900: "#050505",
          850: "#0A0A0A",
          800: "#121212",
          700: "#1A1A1A",
          border: "rgba(255, 255, 255, 0.10)",
        },
        charcoal: {
          DEFAULT: "#000000",
          950: "#000000",
          900: "#050505",
          card: "#0A0A0A",
          elevated: "#121212",
          border: "rgba(255, 255, 255, 0.10)",
        },
        sand: {
          DEFAULT: "#FFFFFF",
          bright: "#FFFFFF",
          muted: "#A1A1AA",
          dim: "#71717A",
          faint: "rgba(255, 255, 255, 0.08)",
        },
        electric: {
          DEFAULT: "#FFFFFF",
          hover: "#E4E4E7",
          active: "#D4D4D8",
          tinted: "#18181B",
          dim: "rgba(255, 255, 255, 0.10)",
        },
        suraksha: {
          950: "#000000",
          900: "#080808",
          850: "#0E0E0E",
          800: "#161616",
          750: "#222222",
          700: "#333333",
          600: "#52525B",
          500: "#71717A",
          400: "#A1A1AA",
          300: "#D4D4D8",
          200: "#E4E4E7",
          100: "#FFFFFF",
        },
        cyan: {
          DEFAULT: "#FFFFFF",
          500: "#FFFFFF",
          400: "#E4E4E7",
          glow: "rgba(255, 255, 255, 0.2)",
        },
        teal: {
          DEFAULT: "#FFFFFF",
          500: "#FFFFFF",
          400: "#E4E4E7",
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

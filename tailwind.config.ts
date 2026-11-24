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
        background: "#040B14",
        foreground: "#F0F9FF",
        hydro: {
          DEFAULT: "#0EA5E9",
          primary: "#0EA5E9",
          ice: "#F0F9FF",
          sky: "#38BDF8",
          aqua: "#7DD3FC",
          deep: "#0284C7",
          marine: "#1E3A5F",
          dark: "#040B14",
          surface: "#081424",
          elevated: "#0D1F36",
        },
        obsidian: {
          DEFAULT: "#040B14",
          950: "#040B14",
          900: "#06101D",
          850: "#081424",
          800: "#0D1F36",
          700: "#152C4A",
          border: "rgba(56, 189, 248, 0.25)",
        },
        charcoal: {
          DEFAULT: "#040B14",
          950: "#040B14",
          900: "#06101D",
          card: "#081424",
          elevated: "#0D1F36",
          border: "rgba(56, 189, 248, 0.25)",
        },
        sand: {
          DEFAULT: "#F0F9FF",
          bright: "#F0F9FF",
          muted: "#BAE6FD",
          dim: "#38BDF8",
          faint: "rgba(56, 189, 248, 0.12)",
        },
        electric: {
          DEFAULT: "#0EA5E9",
          hover: "#38BDF8",
          active: "#0284C7",
          tinted: "#0D1F36",
          dim: "rgba(14, 165, 233, 0.16)",
        },
        suraksha: {
          950: "#040B14",
          900: "#06101D",
          850: "#081424",
          800: "#0D1F36",
          750: "#152C4A",
          700: "#0284C7",
          600: "#0369A1",
          500: "#0EA5E9",
          400: "#38BDF8",
          300: "#7DD3FC",
          200: "#BAE6FD",
          100: "#F0F9FF",
        },
        cyan: {
          DEFAULT: "#0EA5E9",
          500: "#0EA5E9",
          400: "#38BDF8",
          glow: "rgba(14, 165, 233, 0.28)",
        },
        teal: {
          DEFAULT: "#0EA5E9",
          500: "#0EA5E9",
          400: "#38BDF8",
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

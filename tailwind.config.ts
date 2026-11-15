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
        heading: ["'IBM Plex Sans'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        sans: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        charcoal: {
          DEFAULT: "#1E1E1C",
          950: "#171715",
          900: "#1E1E1C",
          card: "#292925",
          elevated: "#33332E",
          border: "#3A3832",
        },
        sand: {
          DEFAULT: "#D8CBB3",
          bright: "#EDE4D3",
          muted: "#A69B88",
          dim: "#7D7465",
          faint: "rgba(216, 203, 179, 0.14)",
        },
        electric: {
          DEFAULT: "#2F6BFF",
          hover: "#4B80FF",
          active: "#1D55E5",
          tinted: "#212B3E",
          dim: "rgba(47, 107, 255, 0.14)",
        },
        suraksha: {
          950: "#1E1E1C",
          900: "#242421",
          850: "#292925",
          800: "#33332E",
          750: "#3A3832",
          700: "#47443D",
          600: "#5C584F",
          500: "#7D7465",
          400: "#A69B88",
          300: "#C4B79E",
          200: "#D8CBB3",
          100: "#EDE4D3",
        },
        cyan: {
          DEFAULT: "#2F6BFF",
          500: "#2F6BFF",
          400: "#4B80FF",
          glow: "#2F6BFF",
          dim: "rgba(47, 107, 255, 0.14)",
        },
        sky: {
          DEFAULT: "#2F6BFF",
          glow: "#608DFF",
          dim: "rgba(47, 107, 255, 0.14)",
        },
        amber: {
          DEFAULT: "#F59E0B",
          glow: "#FBBF24",
          dim: "rgba(245, 158, 11, 0.14)",
        },
        danger: {
          DEFAULT: "#EF4444",
          glow: "#F87171",
          dim: "rgba(239, 68, 68, 0.14)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "sonar-ping": {
          "0%": { transform: "scale(1)", opacity: "0.7" },
          "100%": { transform: "scale(2.3)", opacity: "0" },
        },
        "water-pulse": {
          "0%, 100%": { opacity: "0.65" },
          "50%": { opacity: "0.95" },
        },
      },
      animation: {
        "sonar-ping": "sonar-ping 2.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        "water-pulse": "water-pulse 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

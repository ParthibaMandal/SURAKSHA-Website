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
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        suraksha: {
          950: "#03090c",
          900: "#061014",
          850: "#0a171d",
          800: "#0f222b",
          750: "#142d38",
          700: "#1d3d4b",
          600: "#274f60",
          500: "#34667a",
          400: "#50879e",
          300: "#7daec3",
          200: "#b4d5e3",
          100: "#e0eef5",
        },
        cyan: {
          DEFAULT: "#2dd4bf",
          glow: "#5eead4",
          dim: "rgba(45, 212, 191, 0.12)",
        },
        sky: {
          DEFAULT: "#38bdf8",
          glow: "#7dd3fc",
          dim: "rgba(56, 189, 248, 0.12)",
        },
        amber: {
          DEFAULT: "#fbbf24",
          glow: "#f59e0b",
          dim: "rgba(251, 191, 36, 0.12)",
        },
        danger: {
          DEFAULT: "#ef4444",
          glow: "#f87171",
          dim: "rgba(239, 68, 68, 0.12)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "sonar-ping": {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        "water-pulse": {
          "0%, 100%": { opacity: "0.6" },
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


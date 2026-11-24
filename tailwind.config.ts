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
        background: "#110805",
        foreground: "#F5F5DC",
        sienna: {
          DEFAULT: "#E35336",
          burnt: "#E35336",
          beige: "#F5F5DC",
          sandy: "#F4A460",
          deep: "#A0522D",
          dark: "#110805",
          surface: "#1A0D09",
          elevated: "#24120C",
        },
        obsidian: {
          DEFAULT: "#110805",
          950: "#110805",
          900: "#160A07",
          850: "#1A0D09",
          800: "#24120C",
          700: "#321911",
          border: "rgba(160, 82, 45, 0.35)",
        },
        charcoal: {
          DEFAULT: "#110805",
          950: "#110805",
          900: "#160A07",
          card: "#1A0D09",
          elevated: "#24120C",
          border: "rgba(160, 82, 45, 0.35)",
        },
        sand: {
          DEFAULT: "#F5F5DC",
          bright: "#F5F5DC",
          muted: "#D9C3B0",
          dim: "#A0522D",
          faint: "rgba(244, 164, 96, 0.12)",
        },
        electric: {
          DEFAULT: "#E35336",
          hover: "#F4A460",
          active: "#A0522D",
          tinted: "#24120C",
          dim: "rgba(227, 83, 54, 0.16)",
        },
        suraksha: {
          950: "#110805",
          900: "#160A07",
          850: "#1A0D09",
          800: "#24120C",
          750: "#321911",
          700: "#A0522D",
          600: "#B8653A",
          500: "#E35336",
          400: "#F4A460",
          300: "#F7C394",
          200: "#EFE6C8",
          100: "#F5F5DC",
        },
        cyan: {
          DEFAULT: "#E35336",
          500: "#E35336",
          400: "#F4A460",
          glow: "rgba(227, 83, 54, 0.25)",
        },
        teal: {
          DEFAULT: "#E35336",
          500: "#E35336",
          400: "#F4A460",
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

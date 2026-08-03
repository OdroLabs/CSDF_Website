import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#4fc3f7",
          500: "#0096e6",
          600: "#0077b6",
          700: "#005f8f",
          800: "#004a70",
          900: "#023e5c",
          950: "#062a3f",
        },
        navy: {
          700: "#123b63",
          800: "#0d2b4a",
          900: "#081f38",
          950: "#051225",
        },
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 16px)",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(15, 23, 42, 0.04)",
        soft: "0 1px 2px rgba(15, 23, 42, 0.03), 0 2px 8px -2px rgba(15, 23, 42, 0.06)",
        card: "0 1px 1px rgba(15, 23, 42, 0.02), 0 8px 24px -12px rgba(15, 23, 42, 0.10)",
        "card-hover":
          "0 2px 4px rgba(15, 23, 42, 0.04), 0 16px 32px -12px rgba(15, 23, 42, 0.16)",
        pop: "0 20px 48px -16px rgba(15, 23, 42, 0.22)",
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px -24px rgba(0, 0, 0, 0.45)",
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      maxWidth: {
        "8xl": "88rem",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
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
        "fade-up": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
        "line-grow": {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.9s ease both",
        "bounce-soft": "bounce-soft 1.6s ease-in-out infinite",
        "line-grow": "line-grow 1.4s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

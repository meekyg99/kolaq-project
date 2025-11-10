import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0B0B0B",
          white: "#FFFFFF",
          grey: "#EDEDED",
          accent: "#4ADE80",
        },
      },
      fontFamily: {
        display: ["var(--font-poppins)"],
        body: ["var(--font-inter)"],
      },
      backgroundImage: {
        "hero-gradient": "radial-gradient(circle at top, rgba(255,255,255,0.12), transparent 60%)",
      },
      boxShadow: {
        glow: "0 0 40px rgba(74, 222, 128, 0.35)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
      },
    },
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1200px",
      },
    },
  },
  plugins: [],
};

export default config;

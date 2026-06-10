import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#090b13",
        panel: "#111421",
        lime: "#c7ff47",
        violet: "#8b5cf6",
      },
      boxShadow: { glow: "0 0 50px rgba(199,255,71,.12)" },
    },
  },
  plugins: [],
} satisfies Config;

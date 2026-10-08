/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 950: "#050B1A", 900: "#0A1530", 800: "#0F1F45", 700: "#17306A" },
        brand: { 400: "#22D3EE", 500: "#06B6D4" },
        gold: { 400: "#FBBF24", 500: "#F59E0B" },
      },
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        head: ["var(--font-head)", "sans-serif"],
      },
      boxShadow: { glow: "0 0 32px rgba(34,211,238,.35)" },
    },
  },
  plugins: [],
};

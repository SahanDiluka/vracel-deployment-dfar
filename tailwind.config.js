/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-gray': '#E2E0E0',
      },
      fontFamily: {
        sans:    ["Noto Sans",         "sans-serif"],
        sinhala: ["Noto Sans Sinhala", "sans-serif"],
        tamil:   ["Noto Sans Tamil",   "sans-serif"],
      },
    },
  },
  plugins: [],
}
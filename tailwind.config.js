/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#1C76D5",
      },
      boxShadow: {
        general: "0 4px 8px 4px rgba(224, 228, 229, 0.35)",
      },
    },
  },
  plugins: [],
};
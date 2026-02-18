/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf6ea",
          100: "#fae2bd",
          500: "#e67a24",
          700: "#8c3f0d"
        }
      },
      boxShadow: {
        card: "0 20px 40px -28px rgba(30, 18, 8, 0.55)"
      }
    }
  },
  plugins: []
};

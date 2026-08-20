/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        maroon: {
          50: "#fff1f4",
          100: "#ffe0e7",
          200: "#ffc2d0",
          300: "#ff94ad",
          400: "#f85d80",
          500: "#df315b",
          600: "#c51f48",
          700: "#a6193d",
          800: "#871837",
          900: "#741a35",
        },

        blush: "#fff5f7",
        roseGold: "#d4a373",
      },

      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },

      boxShadow: {
        luxury:
          "0 20px 60px rgba(116, 26, 53, 0.15)",
      },

      keyframes: {
        float: {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-12px)",
          },
        },

        fadeUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        shimmer: {
          "0%": {
            backgroundPosition: "-1000px 0",
          },
          "100%": {
            backgroundPosition: "1000px 0",
          },
        },
      },

      animation: {
        float: "float 4s ease-in-out infinite",
        fadeUp: "fadeUp .8s ease forwards",
        shimmer: "shimmer 2s linear infinite",
      },
    },
  },

  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F4F1EA",
        paper: "#FFFDF8",
        ink: "#282821",
        muted: "#77766D",
        line: "#E5DFD4",
        accent: "#53694F",
        "accent-deep": "#354334",
        "accent-soft": "#E9EEE5",
        brass: "#AA8B5F",
      },
      fontFamily: {
        sans: ["Inter", "Aptos", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        rise: "rise .45s cubic-bezier(.22,1,.36,1) both",
      },
    },
  },
  plugins: [],
};

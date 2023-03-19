/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Playfair Display", "serif"],
        "sans-serif": ["Roboto", "sans-serif"],
      },
      colors: {
        primary: "#F05123",
        secondary: "#FEFCF3",
        "secondary-dark": "#F5F1E2",
        "neutral-black": "#575656",
      },
    },
  },
  plugins: [],
};

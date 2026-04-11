/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        cairo: ["Cairo_400Regular", "Cairo_700Bold"], // Added later via Google Fonts
      },
      colors: {
        primary: "#1a3c34", // Deep Green
        accent: "#fbbf24",  // Gold/Amber
        secondary: "#f8fdfc", // Subtle greenish background
      },
    },
  },
  plugins: [],
};

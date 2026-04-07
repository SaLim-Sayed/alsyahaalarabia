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
        primary: "#14532d", // Dark Green (Arab Tourism theme)
        accent: "#ca8a04", // Gold/Yellow
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
              modalBackground: 'rgba(53, 65, 84, 0.7)',
      card: '#FFFFFF',

      },
      fontFamily: {
        'paris': ["Paris2024", "sans-serif"],
      },
    },
  },
  plugins: [],
};

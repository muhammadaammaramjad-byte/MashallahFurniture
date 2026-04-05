/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{html,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Space Grotesk', 'system-ui', 'sans-serif'],
        'accent': ['Cormorant Garamond', 'serif'],
      },
      colors: {
        primary: '#111',
        'primary-light': '#333',
        'bg-light': '#f7f7f7',
        'text-dark': '#1f1f1f',
        'text-muted': '#6f6f6f',
        accent: '#00796b',
        border: '#e0e0e0',
      }
    },
  },
  plugins: [],
}
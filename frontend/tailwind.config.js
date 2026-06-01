/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        'bg-base': '#0B0F19',
        'bg-card': '#111827',
        'accent': '#76B900',
        'positive': '#3FCF8E',
        'negative': '#E5534B',
        'text-2': '#8A8F98',
      }
    },
  },
  plugins: [],
}

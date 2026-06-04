/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        // New premium dark fintech palette
        'bg-base': '#0B0F14',
        'bg-card': '#111827',
        'bg-elevated': '#1F2937',
        'border': '#2D3748',
        'accent-neon': '#8CFF3F',  // NVIDIA neon green
        'positive': '#10B981',
        'negative': '#EF4444',
        'text-primary': '#F9FAFB',
        'text-secondary': '#9CA3AF',
        'chart-sma20': '#EAB308',
        'chart-sma50': '#3B82F6',
        'chart-sma200': '#8B5CF6',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(140, 255, 63, 0.1)',
        'glow-accent': '0 0 30px rgba(140, 255, 63, 0.15)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}

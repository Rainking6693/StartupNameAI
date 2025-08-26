/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          50: '#f0f9ff',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7'
        },
        amber: {
          50: '#fffbeb',
          300: '#fcd34d',
          400: '#f59e0b',
          500: '#d97706'
        },
        slate: {
          50: '#f8fafc',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b'
        }
      },
      backdropBlur: {
        'sm': '4px'
      }
    },
  },
  plugins: [],
}
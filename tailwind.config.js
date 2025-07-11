/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#EF3A47',
        'text-dark': '#4B3B39',
        'text-light': '#6B7280',
        status: {
          annual: '#F87171',
          half: '#FACC15',
          duty: '#F97316',
          meeting: '#60A5FA',
          business: '#A855F7',
          weekly: '#9333EA',
          monthly: '#0891B2'
        }
      },
      maxWidth: {
        'dashboard': '1280px'
      }
    },
  },
  plugins: [],
} 
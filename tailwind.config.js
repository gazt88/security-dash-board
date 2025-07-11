/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#EF3A47',
        accent: '#F5A623',
        'text-dark': '#4B3B39',
        'status-annual': '#F87171',
        'status-half': '#FACC15',
        'status-duty': '#F97316',
        'status-meeting': '#60A5FA',
        'status-business': '#A855F7',
        'status-weekly': '#9333EA',
        'status-monthly': '#0891B2'
      },
      maxWidth: {
        'dashboard': '1280px'
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'Pretendard', 'sans-serif']
      }
    },
  },
  plugins: [],
} 
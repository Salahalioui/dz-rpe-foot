/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dz: {
          green: '#006233', // Algerian flag green
          red: '#D21034',   // Algerian flag red
          gold: '#D4AF37',
          dark: '#0f172a',
          card: '#1e293b',
          lightBg: '#f8fafc',
          lightCard: '#ffffff'
        },
        rpe: {
          rest: '#10b981',    // 0-1
          easy: '#34d399',    // 2
          mod: '#facc15',     // 3-4
          hard: '#fb923c',    // 5-6
          vhard: '#ef4444',   // 7-8
          max: '#a855f7'      // 9-10
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Segoe UI', 'Tahoma', 'sans-serif']
      }
    },
  },
  plugins: [],
}

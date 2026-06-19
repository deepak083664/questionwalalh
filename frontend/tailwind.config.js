/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // We keep class config but lock app to light mode
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebedff',
          200: '#dbe0ff',
          305: '#c2cbff',
          400: '#a1acff',
          500: '#6366f1', // Indigo 500
          600: '#4f46e5', // Deep Indigo 600 (Primary)
          700: '#4338ca', // Royal Blue/Indigo 700
          800: '#3730a3',
          900: '#312e81',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#a855f7',
          600: '#9333ea', // Purple Accent (Secondary)
          700: '#7e22ce',
        },
        neutral: {
          50: '#f8fafc',  // Very light gray backdrop
          100: '#f1f5f9', // Slate 100
          200: '#e2e8f0', // Border lines
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b', // Slate Gray text
          600: '#475569',
          700: '#334155',
          800: '#1e293b', // Deep Slate text/headers
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02), 0 0 0 1px rgba(0, 0, 0, 0.03)',
        hoverCard: '0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -4px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}

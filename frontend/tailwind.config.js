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
        'indigo-650': '#6366f1',
        primary: {
          50: '#f5f6ff',
          100: '#eef2ff',
          200: '#e0e7ff',
          305: '#c2cbff',
          400: '#a1acff',
          500: '#6366f1', // Indigo 500 (Primary)
          600: '#6366f1', // Vibrant Primary
          700: '#4f46e5',
          800: '#4338ca',
          900: '#3730a3',
        },
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#8b5cf6', // Violet 500 (Secondary)
          600: '#8b5cf6',
          700: '#7c3aed',
        },
        accent: {
          500: '#06b6d4', // Cyan (Accent)
          600: '#0891b2',
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

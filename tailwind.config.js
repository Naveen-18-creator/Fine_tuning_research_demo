/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#090a0f',
          800: '#0e1117',
          700: '#161b26',
          600: '#1f293d',
          500: '#2d374d',
        },
        brand: {
          blue: '#3b82f6',
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          indigo: '#6366f1',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.2), 0 0 20px rgba(59, 130, 246, 0.1)' },
          '100%': { boxShadow: '0 0 15px rgba(139, 92, 246, 0.4), 0 0 30px rgba(139, 92, 246, 0.2)' },
        },
      },
    },
  },
  plugins: [],
};

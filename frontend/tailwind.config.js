/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cozy: {
          linen: '#fbf8f3',
          cream: '#f5efe6',
          sand: '#e8dfd5',
          amber: '#f59e0b',
          copper: '#ea580c',
          terracotta: '#d97706',
          espresso: '#161311',
          mocha: '#221c18',
          cocoa: '#2c241f',
          border: '#342a23',
        },
        brand: {
          50: '#fef3c7',
          100: '#fde68a',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          900: '#78350f',
        },
        xp: {
          gold: '#f59e0b',
          glow: '#fbbf24',
        },
        health: {
          green: '#10b981',
          yellow: '#f59e0b',
          red: '#ef4444',
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.6))' },
          '50%': { opacity: 0.7, filter: 'drop-shadow(0 0 2px rgba(245, 158, 11, 0.2))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}

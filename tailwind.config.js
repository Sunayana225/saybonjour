/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',

  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        primary: {
          50: '#fdf2f2',
          100: '#fce7e7',
          200: '#f9d2d2',
          300: '#f5b0b0',
          400: '#ee8080',
          500: '#e55555',
          600: '#b91c1c',
          700: '#991b1b',
          800: '#7f1d1d',
          900: '#651818',
        },
        burgundy: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#800020',
          700: '#660019',
          800: '#4d0013',
          900: '#33000d',
        },
        cream: {
          50: '#fffcef',
          100: '#fffcef',
          200: '#fffaeb',
          300: '#fff7e6',
          400: '#fff4e1',
          500: '#fff1dc',
          600: '#f5f2e5',
          700: '#ebe8db',
          800: '#e1ded1',
          900: '#d7d4c7',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        french: {
          blue: '#002654',
          white: '#ffffff',
          red: '#ce1126',
        },
        gray: {
          750: '#374151',
        },
        'dark-warm': {
          50: '#3A3A3A',
          100: '#2C2C2C',
          200: '#2B1B1B',
          300: '#1A1A1A',
          400: '#151515',
          500: '#0F0F0F',
        },
        'beige-muted': {
          100: '#C8BFA5',
          200: '#AFA88E',
          300: '#9B9478',
        },
        'burgundy-vibrant': {
          400: '#D64545',
          500: '#B22222',
          600: '#A52A2A',
          700: '#8B1A1A',
        }
      },
      fontFamily: {
        'serif': ['Georgia', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

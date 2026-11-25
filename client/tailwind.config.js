/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif']
      },
      colors: {
        pine: {
          950: '#081410',
          900: '#0D1F1A',
          800: '#142E27'
        },
        parchment: {
          50: '#FAF8F4',
          100: '#F7F4EE',
          200: '#ECE5D8'
        },
        gold: {
          400: '#DEC08A',
          500: '#C9A66B',
          600: '#A68348'
        },
        burgundy: {
          700: '#822434',
          800: '#6B1D2A',
          900: '#4F131D'
        }
      }
    }
  },
  plugins: []
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6eeff',
          100: '#c4d5ff',
          200: '#9eb7ff',
          300: '#7899ff',
          400: '#5276ff',
          500: '#2b53ff',
          600: '#0a2463',
          700: '#001e5c',
          800: '#1e293b', // 🔄 Overridden
          900: '#000c32',
        },
        secondary: {
          50: '#fef8e7',
          100: '#fcefc4',
          200: '#f9e59c',
          300: '#f5d86f',
          400: '#f0c94d',
          500: '#f59e0b', // 🔄 Overridden
          600: '#d18e13',
          700: '#a76810',
          800: '#7d4e0f',
          900: '#5c390e',
        },
        neutral: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#0a0a0a',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],

      },
      spacing: {
        '128': '32rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'property': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};

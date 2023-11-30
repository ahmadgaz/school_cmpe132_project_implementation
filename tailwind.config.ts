import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#E5A941FF',
          800: '#E5A941CC',
          700: '#E5A941B3',
          600: '#E5A94199',
          500: '#E5A94180',
          400: '#E5A94166',
          300: '#E5A9414D',
          200: '#E5A94133',
          100: '#E5A9411A',
        },
        text: {
          black: '#302F37',
          gray: '#97979B',
        },
        background: {
          light: '#FFFFFF',
        },
        input: {
          light: '#F5F5F5',
        },
        accent: {
          light: '#E5E5E5',
        },
        danger: {
          light: '#FF374B',
        },
      },
      keyframes: {
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
export default config;

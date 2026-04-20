import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1a3a2a',
          mid: '#2d5a42',
          light: '#3d7a59',
        },
        gold: {
          DEFAULT: '#b8974a',
          light: '#d4b06a',
          pale: '#f5ead0',
        },
        rose: {
          DEFAULT: '#8b3a52',
          light: '#c4617a',
        },
        cream: {
          DEFAULT: '#f7f3ec',
          dark: '#ede6d8',
        },
        charcoal: '#2c2c2a',
        'gray-text': '#6b6b67',
        'gray-light-text': '#9a9a96',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '14px',
        sm: '8px',
        lg: '20px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(26,58,42,0.10)',
        'card-md': '0 4px 20px rgba(26,58,42,0.16)',
        'card-lg': '0 8px 32px rgba(26,58,42,0.22)',
      },
    },
  },
  plugins: [],
};

export default config;

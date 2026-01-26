import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Bleu marine/navy - couleur principale
        primary: {
          50: '#e6f0f5',
          100: '#cce1eb',
          200: '#99c3d7',
          300: '#66a5c3',
          400: '#3387af',
          500: '#1a5f7a',
          600: '#164e65',
          700: '#133d50',
          800: '#0f2d3b',
          900: '#0c1c26',
          950: '#0a1620',
        },
        // Bleu clair pour les fonds
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#d4eef9',
          300: '#b8e4f4',
          400: '#7dd3fc',
          500: '#38bdf8',
        },
        // Couleur accent dorée/jaune
        accent: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        // Teal/turquoise pour certains boutons
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
        },
        // Navy foncé pour le header/footer
        navy: {
          700: '#1e3a5f',
          800: '#172e4d',
          900: '#0f1f33',
          950: '#0a1420',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;

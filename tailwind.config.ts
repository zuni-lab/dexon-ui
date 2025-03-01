import type { Config } from 'tailwindcss';
import * as defaultTheme from 'tailwindcss/defaultTheme';
import { fontSize } from 'tailwindcss/defaultTheme';

const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  darkMode: ['class'],
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwindcss-animate')
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        primary: '#251D46'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    },
    fontSize: {
      ...fontSize,
      b1: '18px',
      b2: '16px',
      b3: '14px',
      b4: '10px',
      b5: '8px',
      h1: '64px',
      h2: '58px',
      h3: '36px',
      h4: '32px',
      h5: '24px',
      h6: '20px',
      xxs: '0.625rem'
    },
    fontWeight: {
      ...defaultTheme.fontWeight,
      bold: '700',
      extrabold: '800',
      medium: '500',
      semibold: '600'
    },
    screens: {
      ...defaultTheme.screens,
      desktop: '1210px',
      mobile: '500px',
      pc: '1664px',
      tablet: '720px'
    }
  }
} satisfies Config;

export default config;

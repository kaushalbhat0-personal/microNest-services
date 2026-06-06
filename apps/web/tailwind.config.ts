import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#f5f1ec',
        charcoal: '#111111',
        'ink-muted': '#626260',
        'ink-subtle': '#7b7b78',
        'ink-tertiary': '#9c9fa5',
        'hairline-cream': '#d3cec6',
        'hairline-soft': '#ebe7e1',
        lavender: '#5e6ad2',
        'lavender-hover': '#828fff',
        'surface-dark': '#0f1011',
        'canvas-dark': '#010102',
      },
      fontFamily: {
        display: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['72px', { lineHeight: '1.05', letterSpacing: '-2px', fontWeight: '500' }],
        'display-lg': ['56px', { lineHeight: '1.10', letterSpacing: '-1.4px', fontWeight: '500' }],
        'display-md': ['40px', { lineHeight: '1.15', letterSpacing: '-0.8px', fontWeight: '500' }],
      },
      borderRadius: {
        'card': '12px',
        'card-lg': '16px',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.4' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.25s ease-out',
        'fadeIn-slow': 'fadeIn 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config

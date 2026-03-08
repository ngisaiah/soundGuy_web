/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        surface: {
          0: '#0a0a0f',
          1: '#111118',
          2: '#18181f',
          3: '#1e1e28',
          4: '#252530',
        },
        border: {
          subtle: 'rgba(255,255,255,0.06)',
          soft: 'rgba(255,255,255,0.10)',
          medium: 'rgba(255,255,255,0.16)',
        },
        accent: {
          DEFAULT: '#7c6fff',
          dim: '#5b51cc',
          glow: 'rgba(124,111,255,0.25)',
          subtle: 'rgba(124,111,255,0.10)',
        },
        text: {
          primary: '#f0f0f5',
          secondary: '#9898ac',
          muted: '#5a5a6e',
        },
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(124,111,255,0.15)',
        'glow-md': '0 0 40px rgba(124,111,255,0.20)',
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)',
        'card-hover': '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.10)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Base "Tech Noir" surfaces
        noir: {
          950: '#070A12', // deepest background
          900: '#0B0F19', // base background
          850: '#10162400'.slice(0, 7), // fallback safety (unused)
          800: '#121827', // card / panel base
          700: '#1A2233', // raised panel
          600: '#293248', // borders
        },
        // Neon accent family
        cyan: {
          400: '#22D3EE',
          500: '#06E0E0',
        },
        violet: {
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        emerald: {
          400: '#34D399',
          500: '#10E29C',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(167, 139, 250, 0.35)',
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.35)',
        'glow-emerald': '0 0 20px rgba(52, 211, 153, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

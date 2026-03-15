// tailwind.config.mjs — Lịch Vạn Niên AI Design System
// Màu chủ đạo: Đỏ truyền thống + Vàng + Xanh cát tường

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',

  content: [
    './src/**/*.{astro,html,js,ts,jsx,tsx}',
    './public/**/*.html',
  ],

  theme: {
    extend: {
      colors: {
        // ── Brand chính ──────────────────────────────────────
        do: {
          DEFAULT: '#C0392B',
          '50':    '#FDF2F1',
          '100':   '#FBE0DD',
          '200':   '#F7C0BA',
          '300':   '#F19080',
          '400':   '#E85E4A',
          '500':   '#C0392B',   // ← màu chính
          '600':   '#A52F22',
          '700':   '#86251B',
          '800':   '#671C14',
          '900':   '#4D130E',
          '950':   '#300B08',
        },

        // ── Vàng gold ────────────────────────────────────────
        vang: {
          DEFAULT: '#F1C40F',
          '50':    '#FEFCE8',
          '100':   '#FEF9C3',
          '200':   '#FEF08A',
          '300':   '#FDE047',
          '400':   '#FACC15',
          '500':   '#F1C40F',   // ← màu chính
          '600':   '#CA8A04',
          '700':   '#A16207',
          '800':   '#854D0E',
          '900':   '#713F12',
          '950':   '#422006',
        },

        // ── Xanh cát tường (teal) ────────────────────────────
        xanh: {
          DEFAULT: '#1D9E75',
          '50':    '#ECFDF5',
          '100':   '#D1FAE5',
          '200':   '#A7F3D0',
          '300':   '#6EE7B7',
          '400':   '#34D399',
          '500':   '#1D9E75',   // ← màu chính
          '600':   '#059669',
          '700':   '#047857',
          '800':   '#065F46',
          '900':   '#064E3B',
          '950':   '#022C22',
        },

        // ── Nền & surface ─────────────────────────────────────
        nen: {
          sang:     '#FFFDF9',   // light bg
          mat:      '#F7F2EA',   // light surface
          the:      '#FFFFFF',   // card
          toi:      '#120806',   // dark bg
          toi2:     '#1E0F0A',   // dark surface
          toi3:     '#251208',   // dark card
        },
      },

      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },

      fontSize: {
        'xxs': ['0.65rem', { lineHeight: '1rem' }],
      },

      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.25rem',
        'xl4': '1.5rem',
      },

      boxShadow: {
        'card':    '0 1px 4px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)',
        'float':   '0 4px 20px rgba(0,0,0,0.12)',
        'do':      '0 4px 16px rgba(192,57,43,0.35)',
        'vang':    '0 4px 16px rgba(241,196,15,0.35)',
        'xanh':    '0 4px 16px rgba(29,158,117,0.35)',
      },

      animation: {
        'fade-in':    'fadeIn 0.3s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':  'spin 4s linear infinite',
      },

      keyframes: {
        fadeIn:  { from:{opacity:'0'}, to:{opacity:'1'} },
        slideUp: { from:{opacity:'0',transform:'translateY(8px)'}, to:{opacity:'1',transform:'translateY(0)'} },
      },

      spacing: {
        'safe-b': 'env(safe-area-inset-bottom, 0px)',
      },

      screens: {
        'xs': '375px',
      },
    },
  },

  plugins: [],
};

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#5fe3bf',
          500: '#37d7ac', // Abu Kartona iconic green
          600: '#2cb38f',
          700: '#047857',
          800: '#064e3b',
          900: '#022c22',
          950: '#011713',
          // Legacy aliases
          green:    "#37d7ac",   // primary accent
          "green-5":  "rgba(55,215,172,0.05)",
          "green-10": "rgba(55,215,172,0.10)",
          "green-20": "rgba(55,215,172,0.20)",
          "green-40": "rgba(55,215,172,0.40)",
        },
        // Semantic status colors - mapped to Abu Kartona brand
        success: {
          DEFAULT: '#37d7ac', // Abu Kartona green
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#5fe3bf',
          500: '#37d7ac',
          600: '#2cb38f',
          700: '#047857',
          800: '#064e3b',
          900: '#022c22',
          dark: '#2cb38f',
        },
        warning: {
          DEFAULT: '#f59e0b',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          dark: '#b45309',
        },
        danger: {
          DEFAULT: '#ef4444', // Clean red
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          dark: '#b91c1c',
        },
        info: {
          DEFAULT: '#3b82f6',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          dark: '#1d4ed8',
        },
        secondary: {
          DEFAULT: '#6366f1',
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        surface: {
          // Abu Kartona surface colors - matching CSS variables exactly
          DEFAULT: "#FFFFFF", // Pure white - matches --color-surface
          secondary: "#F3F4F6", // Light gray - matches --color-surface-secondary
          tertiary: "#E5E7EB", // matches --color-surface-tertiary
          card: "#FFFFFF", // matches --color-surface-card
          dark: "#0A0A0A", // Deep black from logo background - matches --color-surface-dark
          "dark-secondary": "#1A1A1A", // matches --color-surface-dark-secondary
          "dark-tertiary": "#222222", // matches --color-surface-dark-tertiary
        },
        text: {
          primary: "#121212", // Deep charcoal
          secondary: "#5f6368", 
          muted: "#9aa0a6",
          "dark-primary": "#fafaf9", // Pure/Off-white for contrast
          "dark-secondary": "#e8eaed",
          "dark-muted": "#9aa0a6",
        },
        border: {
          DEFAULT: "#e8eaed",
          light: "rgba(232, 234, 237, 0.5)",
          dark: "rgba(255, 255, 255, 0.08)",
        },
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
      },
      fontSize: {
        caption: '0.75rem',
        overline: ['0.7rem', { letterSpacing: '0.1em' }],
      },
      borderRadius: {
        card: "14px",
        btn:  "8px",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      boxShadow: {
        'btn': '0 4px 14px 0 rgba(55, 215, 172, 0.15)',
        'btn-hover': '0 6px 20px 0 rgba(55, 215, 172, 0.25)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'input-focus': '0 0 0 3px rgba(55, 215, 172, 0.1)',
        'glow-sm': '0 0 20px rgba(55, 215, 172, 0.2)',
        'glow-md': '0 0 30px rgba(55, 215, 172, 0.3)',
        'glow-lg': '0 0 40px rgba(55, 215, 172, 0.4)',
        'elevated-light': '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'elevated-dark': '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      },
      keyframes: {
        /* Defined here so Tailwind generates the class */
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        gridPulse: {
          "0%,100%": { opacity: "0.5" },
          "50%":     { opacity: "1.0" },
        },
        orbFloat: {
          "0%,100%": { transform: "translate(0,0) scale(1)" },
          "33%":     { transform: "translate(28px,-18px) scale(1.04)" },
          "66%":     { transform: "translate(-16px,12px) scale(0.97)" },
        },
        bannerSlide: {
          from: { transform: "translateX(110%)", opacity: "0" },
          to:   { transform: "translateX(0)",   opacity: "1" },
        },
        bannerPulse: {
          "0%,100%": { boxShadow: "-8px 0 32px rgba(55,215,172,0.18)" },
          "50%":     { boxShadow: "-8px 0 52px rgba(55,215,172,0.42)" },
        },
        btnPulse: {
          "0%,100%": { boxShadow: "0 0 0 0   rgba(55,215,172,0.35)" },
          "50%":     { boxShadow: "0 0 0 10px rgba(55,215,172,0)" },
        },
        cartShake: {
          "0%,100%":{ transform: "rotate(0deg)"  },
          "15%":    { transform: "rotate(-10deg)" },
          "35%":    { transform: "rotate(10deg)"  },
          "55%":    { transform: "rotate(-8deg)"  },
          "75%":    { transform: "rotate(8deg)"   },
          "90%":    { transform: "rotate(-4deg)"  },
        },
        shimmer: {
          "0%":  { backgroundPosition: "200% 0" },
          "100%":{ backgroundPosition: "-200% 0"},
        },
        toastIn: {
          from: { transform: "translateY(20px)", opacity: "0" },
          to:   { transform: "translateY(0)",    opacity: "1" },
        },
        ripple: {
          to: { transform: "scale(2.5)", opacity: "0" },
        },
      },
      animation: {
        "fade-up":      "fadeUp 0.55s cubic-bezier(0.22,1,0.36,1) forwards",
        "grid-pulse":   "gridPulse 7s ease-in-out infinite",
        "orb-float-1":  "orbFloat 14s ease-in-out infinite",
        "orb-float-2":  "orbFloat 18s ease-in-out infinite reverse",
        "orb-float-3":  "orbFloat 11s ease-in-out 3s infinite",
        "banner-slide": "bannerSlide 0.6s cubic-bezier(0.22,1,0.36,1) 2s forwards",
        "banner-pulse": "bannerPulse 3s ease-in-out 2.7s infinite",
        "btn-pulse":    "btnPulse 2.8s ease-in-out infinite",
        "cart-shake":   "cartShake 0.6s ease",
        shimmer:        "shimmer 1.5s ease-in-out infinite",
        "toast-in":     "toastIn 0.4s cubic-bezier(0.22,1,0.36,1) forwards",
        ripple:         "ripple 0.55s linear forwards",
      },
    },
  },
  plugins: [],
};

export default config;

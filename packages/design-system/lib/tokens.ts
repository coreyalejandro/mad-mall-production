/**
 * MADMall Design Tokens — Replicated from ZMUX_MAD_MALL.html
 *
 * Source of truth: /ZMUX_MAD_MALL.html (The Sanctuary prototype)
 * Aesthetic: Vellum Clinical — luxury warmth, Southern hospitality,
 * precision wellness meets the warmth of a parlor.
 *
 * Governed by TLC Article I (Right to Accessibility) and Article II (Execution Law).
 */

// ─── Core ZMUX Palette ───────────────────────────────────────────
export const zmux = {
  vellum: '#fcfaf2',
  vellumTrans: 'rgba(252, 250, 242, 0.75)',
  ink: '#141414',
  soulGold: '#b38b4d',
  terracotta: '#a65d45',
  clinicalTeal: '#4b6a6d',
  bodyBg: '#e5e0d5',
} as const

// ─── Extended Brand Palette ──────────────────────────────────────
export const brand = {
  terracotta: {
    50: '#fdf2ed',
    100: '#fbe2d4',
    200: '#f6c3a8',
    300: '#e89b7a',
    400: '#d47a5a',
    500: '#a65d45',
    600: '#8c4e3a',
    700: '#723f30',
    800: '#5a3226',
    900: '#44261d',
  },
  gold: {
    50: '#faf6ed',
    100: '#f2ebd4',
    200: '#e5d6a8',
    300: '#d4bc79',
    400: '#c4a35c',
    500: '#b38b4d',
    600: '#96743f',
    700: '#785d33',
    800: '#5c4728',
    900: '#44351e',
  },
  teal: {
    50: '#eef3f3',
    100: '#d5e0e1',
    200: '#afc3c5',
    300: '#89a5a9',
    400: '#6a8a8e',
    500: '#4b6a6d',
    600: '#3e585a',
    700: '#324748',
    800: '#273738',
    900: '#1d292a',
  },
  vellum: {
    50: '#fefdfb',
    100: '#fcfaf2',
    200: '#f7f3e6',
    300: '#f0ebd6',
    400: '#e5e0d5',
    500: '#d4cfc3',
    600: '#b8b3a7',
    700: '#9a958a',
    800: '#7c776e',
    900: '#5e5a53',
  },
} as const

// ─── ZMUX Typography ────────────────────────────────────────────
export const typography = {
  fontFamily: {
    heading: '"Space Grotesk", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    body: '"Space Grotesk", system-ui, sans-serif',
  },
  fontSize: {
    xs: '0.7rem',
    sm: '0.8rem',
    base: '0.9rem',
    lg: '1.1rem',
    xl: '1.5rem',
    '2xl': '1.8rem',
    '3xl': '2rem',
    '4xl': 'clamp(3rem, 8vw, 6rem)',
    display: 'clamp(3rem, 8vw, 6rem)',
  },
  letterSpacing: {
    label: '0.3em',
    nav: '0.2em',
    button: '0.1em',
    normal: '0',
  },
} as const

// ─── ZMUX Effects ───────────────────────────────────────────────
export const effects = {
  diffusionBlur: '18px',
  monolithicShadow: '20px 20px 60px rgba(0, 0, 0, 0.08), -10px -10px 40px rgba(255, 255, 255, 0.8)',
  conciergeGlow: '0 40px 100px rgba(0, 0, 0, 0.3)',
  vellumDiffusion: {
    gold: 'radial-gradient(circle at 20% 30%, rgba(179, 139, 77, 0.05), transparent)',
    teal: 'radial-gradient(circle at 80% 70%, rgba(75, 106, 109, 0.05), transparent)',
  },
  cardHover: 'translateY(-5px)',
} as const

// ─── ZMUX Radii (Monolithic) ────────────────────────────────────
export const radius = {
  sm: '3px',
  md: '15px',
  lg: '30px',
  xl: '40px',
  pill: '100px',
  monolithic: '60px',
} as const

// ─── Construction Theme (Under Construction Identity) ────────────
export const construction = {
  yellow: '#FFD700',
  yellowMuted: '#E6C200',
  black: '#1a1a1a',
  stripe: 'repeating-linear-gradient(45deg, #FFD700, #FFD700 10px, #1a1a1a 10px, #1a1a1a 20px)',
  blueprintBg: '#1e3a5f',
  blueprintLine: 'rgba(255, 255, 255, 0.08)',
} as const

// ─── Semantic Colors ─────────────────────────────────────────────
export const semantic = {
  success: brand.teal[500],
  warning: brand.gold[500],
  error: brand.terracotta[500],
  info: brand.teal[600],
  safety: brand.teal[700],
  dignity: brand.gold[500],
  truth: brand.teal[800],
  live: brand.terracotta[500],
  hot: brand.terracotta[500],
} as const

// ─── Spacing (8px grid) ─────────────────────────────────────────
export const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const

/**
 * ═══════════════════════════════════════════════════════════
 *  ACADEMIC COMMAND CENTER — 3D Spatial Design System
 *  Virtual Light Source: Top-Left, 135° angle
 *  Change LIGHT_ANGLE_* vars here to re-theme globally.
 * ═══════════════════════════════════════════════════════════
 */
import { Platform } from 'react-native';

// ── Virtual Light Source ─────────────────────────────────────
// Highlight edges are top-left; shadow edges are bottom-right
export const LIGHT = {
  highlightBorder: 'rgba(255,255,255,0.14)',
  highlightBorderStrong: 'rgba(255,255,255,0.22)',
  shadowBorder: 'rgba(0,0,0,0.55)',
  innerHighlight: 'rgba(255,255,255,0.05)',
  innerShadow: 'rgba(0,0,0,0.35)',
} as const;

// ── Color Palette ─────────────────────────────────────────────
export const COLORS = {
  // Deep space backgrounds
  void:        '#060818',
  surface:     '#0b0e20',
  card:        '#101427',
  cardMid:     '#151c33',
  cardHigh:    '#1c2340',

  // Neon subject accents
  physics:     '#00d4ff',
  physicsGlow: 'rgba(0,212,255,0.45)',
  physicsDim:  '#008fac',

  chemistry:   '#00e5a0',
  chemGlow:    'rgba(0,229,160,0.4)',
  chemDim:     '#009e6e',

  math:        '#6c63ff',
  mathGlow:    'rgba(108,99,255,0.5)',
  mathDim:     '#4a43cc',

  english:     '#ffb347',
  englishGlow: 'rgba(255,179,71,0.4)',

  hindi:       '#ff6b9d',
  hindiGlow:   'rgba(255,107,157,0.4)',

  // Primary action (purple)
  primary:     '#6c63ff',
  primaryGlow: 'rgba(108,99,255,0.55)',
  primaryDark: '#4338c0',

  // Status
  success:     '#00e5a0',
  successGlow: 'rgba(0,229,160,0.45)',
  error:       '#ff4d6d',
  errorGlow:   'rgba(255,77,109,0.45)',
  warning:     '#FFB400',
  warningGlow: 'rgba(255,180,0,0.4)',

  // Text
  textPrimary:   '#ffffff',
  textSecondary: 'rgba(255,255,255,0.65)',
  textMuted:     'rgba(255,255,255,0.38)',
  textDim:       'rgba(255,255,255,0.18)',

  // Borders
  borderSubtle:    'rgba(255,255,255,0.07)',
  borderHighlight: LIGHT.highlightBorder,
  borderShadow:    LIGHT.shadowBorder,
} as const;

// ── Subject Map ───────────────────────────────────────────────
export type SubjectColorKey = 'physics'|'chemistry'|'math'|'english'|'hindi';

export const SUBJECT_THEME: Record<SubjectColorKey, { color: string; glow: string; dim: string; grad: readonly [string, string] }> = {
  physics:   { color: COLORS.physics,   glow: COLORS.physicsGlow, dim: COLORS.physicsDim,  grad: ['#1a3d48', '#0b1f29'] },
  chemistry: { color: COLORS.chemistry, glow: COLORS.chemGlow,    dim: COLORS.chemDim,     grad: ['#0e3326', '#071a14'] },
  math:      { color: COLORS.math,      glow: COLORS.mathGlow,    dim: COLORS.mathDim,     grad: ['#201c4a', '#100e2a'] },
  english:   { color: COLORS.english,   glow: COLORS.englishGlow, dim: '#b07820',           grad: ['#3a2d14', '#1d1609'] },
  hindi:     { color: COLORS.hindi,     glow: COLORS.hindiGlow,   dim: '#b04870',           grad: ['#3a1a2a', '#1d0d16'] },
};

// ── Gradients ─────────────────────────────────────────────────
// Light hits top-left → bottom-right is darker
export const GRADIENTS = {
  // Card surfaces
  card:         ['#192040', '#0d1225'] as const,
  cardElevated: ['#1e2848', '#111828'] as const,
  cardDeep:     ['#0d1124', '#070a18'] as const,

  // Header / nav bar
  header:       ['#12182e', '#090d1e'] as const,

  // Bevel borders (outer gradient wrapper trick)
  bevelBorder:  ['rgba(255,255,255,0.16)', 'rgba(255,255,255,0.04)', 'rgba(0,0,0,0.25)'] as const,
  bevelBorderStrong: ['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.06)', 'rgba(0,0,0,0.35)'] as const,

  // Button surfaces
  primaryBtn:        ['#9490ff', '#5a52e0'] as const,
  primaryBtnPressed: ['#5045c8', '#3a30a8'] as const,
  successBtn:        ['#2efbbf', '#00c28a'] as const,
  errorBtn:          ['#ff7088', '#cc2840'] as const,
  ghostBtn:          ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)'] as const,

  // Progress tracks
  trackBg:      ['#080c1e', '#0d1124'] as const,

  // Subject button gradients
  physicsBtn:   ['#33deff', '#0099bb'] as const,
  chemBtn:      ['#2efbbf', '#009e6e'] as const,
  mathBtn:      ['#9490ff', '#5a52e0'] as const,
} as const;

// ── Shadows ───────────────────────────────────────────────────
// iOS uses shadowColor/shadowOffset; Android uses elevation; Web uses boxShadow
export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 24,
    elevation: 16,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 8,
  },
  extrude: {
    shadowColor: '#000',
    shadowOffset: { width: 3, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 14,
    elevation: 12,
  },
  pressed: {
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  glow: (color: string, size = 18) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: size,
    elevation: 14,
  }),
} as const;

// ── Web-specific Box Shadows ───────────────────────────────────
export const BOX_SHADOW = {
  card:    '4px 10px 24px rgba(0,0,0,0.7), -1px -2px 4px rgba(255,255,255,0.04)',
  sm:      '2px 4px 10px rgba(0,0,0,0.55), -1px -1px 2px rgba(255,255,255,0.03)',
  extrude: '3px 6px 14px rgba(0,0,0,0.6), -1px -2px 3px rgba(255,255,255,0.05)',
  pressed: '1px 2px 4px rgba(0,0,0,0.4), inset 0 1px 3px rgba(0,0,0,0.5)',
  glow: (color: string, size = 18) =>
    `0 0 ${size}px ${color}, 0 0 ${size * 2}px ${color}55, 3px 6px 14px rgba(0,0,0,0.6)`,
  inset:   'inset 2px 4px 8px rgba(0,0,0,0.55), inset -1px -1px 2px rgba(255,255,255,0.04)',
} as const;

// ── Radius ────────────────────────────────────────────────────
export const RADIUS = {
  xs:   6,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  26,
  pill: 999,
} as const;

// ── Spacing ───────────────────────────────────────────────────
export const SPACING = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 24,
  '3xl': 32,
  '4xl': 40,
} as const;

// ── Typography ────────────────────────────────────────────────
export const TYPE = {
  display: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.5, fontFamily: 'Inter_700Bold' },
  h1:      { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.3, fontFamily: 'Inter_700Bold' },
  h2:      { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.2, fontFamily: 'Inter_700Bold' },
  h3:      { fontSize: 16, fontWeight: '600' as const, letterSpacing: -0.1, fontFamily: 'Inter_600SemiBold' },
  body:    { fontSize: 14, fontWeight: '400' as const, fontFamily: 'Inter_400Regular' },
  bodyMed: { fontSize: 14, fontWeight: '500' as const, fontFamily: 'Inter_500Medium' },
  sm:      { fontSize: 12, fontWeight: '400' as const, fontFamily: 'Inter_400Regular' },
  smMed:   { fontSize: 12, fontWeight: '500' as const, fontFamily: 'Inter_500Medium' },
  smBold:  { fontSize: 12, fontWeight: '600' as const, fontFamily: 'Inter_600SemiBold' },
  xs:      { fontSize: 10, fontWeight: '600' as const, letterSpacing: 0.6, fontFamily: 'Inter_600SemiBold' },
  label:   { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.8, textTransform: 'uppercase' as const, fontFamily: 'Inter_600SemiBold' },
} as const;

// ── Platform helper ───────────────────────────────────────────
export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';

/** Merge native shadow + web boxShadow into a single style object */
export function shadow(
  native: Record<string, unknown>,
  webValue: string,
): Record<string, unknown> {
  if (isWeb) return { boxShadow: webValue } as Record<string, unknown>;
  return native;
}

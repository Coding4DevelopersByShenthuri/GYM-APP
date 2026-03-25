export const Colors = {
  // Backgrounds
  black: '#050508',
  darkBg: '#0A0B14',
  surfaceBase: '#0F1020',
  surfaceElevated: '#141528',
  cardBg: 'rgba(255, 255, 255, 0.06)',
  cardBgHover: 'rgba(255, 255, 255, 0.10)',

  // Neon Accents
  accentPrimary: '#00E5FF',    // Cyan
  accentSecondary: '#B24BF3',  // Violet
  accentGreen: '#00FF9E',      // Neon Green
  accentOrange: '#FF6B35',     // Energy Orange
  accentGold: '#FFD700',       // Achievement Gold

  // Gradients (as array for LinearGradient)
  gradientCyan: ['#00E5FF', '#0077B6'],
  gradientViolet: ['#B24BF3', '#6A0DAD'],
  gradientGreen: ['#00FF9E', '#00836B'],
  gradientDark: ['#0F1020', '#050508'],
  gradientCard: ['rgba(0, 229, 255, 0.12)', 'rgba(178, 75, 243, 0.08)'],

  // Text
  textPrimary: '#F0F4FF',
  textSecondary: '#8892B0',
  textMuted: '#4A5568',
  textOnAccent: '#000000',

  // Borders
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassBorderActive: 'rgba(0, 229, 255, 0.4)',
  borderSubtle: 'rgba(255, 255, 255, 0.06)',

  // Status
  danger: '#FF4D6D',
  warning: '#FFB347',
  success: '#00FF9E',
  info: '#00E5FF',
};

export const Typography = {
  display: { fontSize: 34, fontWeight: '800' as const },
  h1: { fontSize: 28, fontWeight: '700' as const },
  h2: { fontSize: 22, fontWeight: '700' as const },
  h3: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
  label: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 1.2 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radii = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};

export const Shadows = {
  glowCyan: {
    shadowColor: Colors.accentPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  glowViolet: {
    shadowColor: Colors.accentSecondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  glowGreen: {
    shadowColor: Colors.accentGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const GlassStyles = {
  container: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    overflow: 'hidden' as const,
  },
};

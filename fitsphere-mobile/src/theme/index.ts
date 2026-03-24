export const Colors = {
  black: '#000000',
  darkBg: '#0A0A0A',
  cardBg: 'rgba(255, 255, 255, 0.08)',
  accentPrimary: '#00D2FF', // Electric Blue
  accentSecondary: '#9D50BB', // Vibrant Purple
  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  glassBorder: 'rgba(255, 255, 255, 0.15)',
  danger: '#FF4D4D',
};

export const Shadows = {
  glowBlue: {
    shadowColor: Colors.accentPrimary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  neonPurple: {
    shadowColor: Colors.accentSecondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
};

export const GlassStyles = {
  container: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.glassBorder,
    padding: 16,
    backdropFilter: 'blur(10px)', // Note: Only works on some platforms/libraries
  },
};

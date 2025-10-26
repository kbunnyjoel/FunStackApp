export const palette = {
  midnight: '#05060E',
  deepSpace: '#10152A',
  electricViolet: '#6C63FF',
  hotPink: '#FF4F8B',
  aqua: '#4DE4FF',
  cyan: '#2BC0E4',
  mint: '#56E39F',
  slate: '#1D223B',
  white: '#FFFFFF',
  gray: '#8A94B0',
  danger: '#FF6B6B',
  warning: '#FFB347',
};

export const colors = {
  primary: palette.electricViolet,
  primaryAlt: palette.hotPink,
  accent: palette.mint,
  background: palette.midnight,
  surface: palette.deepSpace,
  surfaceAlt: palette.slate,
  cardBorder: 'rgba(255,255,255,0.08)',
  mutedText: palette.gray,
  text: palette.white,
  danger: palette.danger,
  warning: palette.warning,
  success: palette.mint,
};

export const gradients = {
  hero: [palette.electricViolet, palette.hotPink],
  aqua: [palette.cyan, palette.mint],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 10,
  md: 18,
  lg: 28,
  pill: 999,
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
};

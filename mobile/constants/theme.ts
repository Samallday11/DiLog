import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#e0f4f0',
    background: '#050d12',
    tint: '#00e5c4',
    icon: 'rgba(0, 200, 160, 0.5)',
    tabIconDefault: 'rgba(0, 200, 160, 0.48)',
    tabIconSelected: '#00e5c4',
    surface: 'rgba(10, 28, 36, 0.7)',
    surfaceStrong: 'rgba(6, 18, 24, 0.92)',
    border: 'rgba(0, 229, 196, 0.18)',
    borderStrong: 'rgba(0, 229, 196, 0.42)',
    secondary: '#0d9488',
    accentBlue: 'rgba(0, 180, 220, 0.7)',
    muted: 'rgba(0, 200, 160, 0.5)',
    danger: '#ff5f7a',
  },
  dark: {
    text: '#e0f4f0',
    background: '#050d12',
    tint: '#00e5c4',
    icon: 'rgba(0, 200, 160, 0.5)',
    tabIconDefault: 'rgba(0, 200, 160, 0.48)',
    tabIconSelected: '#00e5c4',
    surface: 'rgba(10, 28, 36, 0.7)',
    surfaceStrong: 'rgba(6, 18, 24, 0.92)',
    border: 'rgba(0, 229, 196, 0.18)',
    borderStrong: 'rgba(0, 229, 196, 0.42)',
    secondary: '#0d9488',
    accentBlue: 'rgba(0, 180, 220, 0.7)',
    muted: 'rgba(0, 200, 160, 0.5)',
    danger: '#ff5f7a',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'Rajdhani',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'Orbitron',
  },
  default: {
    sans: 'Rajdhani',
    serif: 'serif',
    rounded: 'Rajdhani',
    mono: 'Orbitron',
  },
  web: {
    sans: "'Rajdhani', 'Trebuchet MS', system-ui, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'Rajdhani', 'Trebuchet MS', system-ui, sans-serif",
    mono: "'Orbitron', 'Aldrich', 'Eurostile', 'Trebuchet MS', monospace",
  },
});

export const FuturisticTheme = {
  colors: Colors.dark,
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 14,
    md: 20,
    lg: 28,
    pill: 999,
  },
  shadow: Platform.select({
    web: {
      boxShadow: '0 18px 50px rgba(0, 0, 0, 0.35)',
    },
    default: {
      shadowColor: '#00e5c4',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.18,
      shadowRadius: 24,
      elevation: 10,
    },
  }),
};

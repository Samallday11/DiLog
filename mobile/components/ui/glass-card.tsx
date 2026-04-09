import { PropsWithChildren } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { FuturisticTheme } from '@/constants/theme';

type GlassCardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export function GlassCard({ children, style }: GlassCardProps) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cornerTopLeft} />
      <View style={styles.cornerTopRight} />
      <View style={styles.cornerBottomLeft} />
      <View style={styles.cornerBottomRight} />
      {children}
    </View>
  );
}

const bracket = {
  position: 'absolute' as const,
  width: 16,
  height: 16,
  borderColor: 'rgba(0, 229, 196, 0.55)',
};

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: FuturisticTheme.colors.surface,
    borderRadius: FuturisticTheme.radius.md,
    borderWidth: 1,
    borderColor: FuturisticTheme.colors.border,
    padding: FuturisticTheme.spacing.lg,
    ...FuturisticTheme.shadow,
  },
  cornerTopLeft: {
    ...bracket,
    pointerEvents: 'none',
    top: 10,
    left: 10,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  cornerTopRight: {
    ...bracket,
    pointerEvents: 'none',
    top: 10,
    right: 10,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  cornerBottomLeft: {
    ...bracket,
    pointerEvents: 'none',
    bottom: 10,
    left: 10,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  cornerBottomRight: {
    ...bracket,
    pointerEvents: 'none',
    bottom: 10,
    right: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
});

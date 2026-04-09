import { PropsWithChildren, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { FuturisticTheme } from '@/constants/theme';

type FuturisticScreenProps = PropsWithChildren<{
  scrollable?: boolean;
  contentContainerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
}>;

const PARTICLES = [
  { left: '8%', top: '10%', size: 3, duration: 7000, delay: 0 },
  { left: '82%', top: '20%', size: 5, duration: 9200, delay: 800 },
  { left: '28%', top: '42%', size: 4, duration: 7600, delay: 300 },
  { left: '68%', top: '58%', size: 2, duration: 8300, delay: 1200 },
  { left: '12%', top: '78%', size: 4, duration: 7100, delay: 600 },
  { left: '88%', top: '82%', size: 3, duration: 9800, delay: 1000 },
] as const;

function Particle({
  left,
  top,
  size,
  duration,
  delay,
}: {
  left: `${number}%`;
  top: `${number}%`;
  size: number;
  duration: number;
  delay: number;
}) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.18)).current;

  useEffect(() => {
    const motion = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -18,
            duration,
            delay,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.75,
            duration: duration / 2,
            delay,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.18,
            duration: duration / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    motion.start();
    return () => motion.stop();
  }, [delay, duration, opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left,
          top,
          width: size,
          height: size,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    />
  );
}

export function FuturisticScreen({
  children,
  scrollable,
  contentContainerStyle,
  style,
}: FuturisticScreenProps) {
  const translateY = useRef(new Animated.Value(18)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scanlineY = useRef(new Animated.Value(-160)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 520,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 520,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(scanlineY, {
        toValue: 900,
        duration: 5800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    scanlineY.setValue(-160);
    animation.start();
    return () => animation.stop();
  }, [scanlineY]);

  const content = useMemo(
    () => (
      <Animated.View
        style={[
          styles.content,
          style,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        {children}
      </Animated.View>
    ),
    [children, opacity, style, translateY]
  );

  return (
    <View style={styles.root}>
      <View style={styles.background}>
        <View style={styles.gridVertical} />
        <View style={styles.gridHorizontal} />
        {PARTICLES.map((particle, index) => (
          <Particle key={index} {...particle} />
        ))}
        <Animated.View
          style={[
            styles.scanline,
            {
              transform: [{ translateY: scanlineY }],
            },
          ]}
        />
      </View>
      {scrollable ? (
        <ScrollView
          style={styles.fill}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        <View style={[styles.fill, contentContainerStyle]}>{content}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: FuturisticTheme.colors.background,
  },
  fill: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    pointerEvents: 'none',
  },
  gridVertical: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.12,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web'
      ? {
          backgroundImage:
            'linear-gradient(to right, rgba(0,229,196,0.12) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }
      : {}),
  },
  gridHorizontal: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web'
      ? {
          backgroundImage:
            'linear-gradient(to bottom, rgba(0,180,220,0.12) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }
      : {}),
  },
  particle: {
    position: 'absolute',
    pointerEvents: 'none',
    borderRadius: 999,
    backgroundColor: '#00e5c4',
    shadowColor: '#00e5c4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
  },
  scanline: {
    position: 'absolute',
    pointerEvents: 'none',
    left: 0,
    right: 0,
    height: 160,
    backgroundColor: 'rgba(0, 229, 196, 0.06)',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 229, 196, 0.1)',
  },
});

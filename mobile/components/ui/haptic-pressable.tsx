import { PropsWithChildren, useRef } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Platform,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';

type HapticPressableProps = PropsWithChildren<
  PressableProps & {
    style?: StyleProp<ViewStyle>;
    hoverStyle?: StyleProp<ViewStyle>;
    hapticStyle?: Haptics.ImpactFeedbackStyle;
  }
>;

export function HapticPressable({
  children,
  onPressIn,
  onPressOut,
  style,
  hoverStyle,
  hapticStyle = Haptics.ImpactFeedbackStyle.Light,
  ...props
}: HapticPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const hoverLift = useRef(new Animated.Value(0)).current;
  const glow = useRef(new Animated.Value(0)).current;

  const handlePressIn = (event: GestureResponderEvent) => {
    Haptics.impactAsync(hapticStyle).catch(() => null);
    Animated.spring(scale, {
      toValue: 0.97,
      friction: 7,
      tension: 220,
      useNativeDriver: true,
    }).start();
    onPressIn?.(event);
  };

  const handlePressOut = (event: GestureResponderEvent) => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 7,
      tension: 220,
      useNativeDriver: true,
    }).start();
    onPressOut?.(event);
  };

  const handleHover = (hovered: boolean) => {
    if (Platform.OS !== 'web') return;

    Animated.parallel([
      Animated.spring(hoverLift, {
        toValue: hovered ? -4 : 0,
        friction: 7,
        tension: 140,
        useNativeDriver: true,
      }),
      Animated.timing(glow, {
        toValue: hovered ? 1 : 0,
        duration: 180,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={[
        style,
        hoverStyle,
        {
          transform: [{ translateY: hoverLift }, { scale }],
          shadowColor: '#00e5c4',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: glow.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.3],
          }),
          shadowRadius: glow.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 20],
          }),
        },
      ]}
    >
      <Pressable
        {...props}
        onHoverIn={() => handleHover(true)}
        onHoverOut={() => handleHover(false)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

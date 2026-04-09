import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FuturisticTheme, Fonts } from '@/constants/theme';
import { HapticPressable } from '@/components/ui/haptic-pressable';

const TAB_ICONS: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  home: 'home',
  log: 'edit-note',
  'ai-chat': 'chat',
  profile: 'person',
};

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const width = Dimensions.get('window').width - 32;
  const tabWidth = width / state.routes.length;
  const indicatorX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(indicatorX, {
      toValue: state.index * tabWidth,
      friction: 8,
      tension: 110,
      useNativeDriver: true,
    }).start();
  }, [indicatorX, state.index, tabWidth]);

  const labelStyles = useMemo(
    () => ({
      active: [styles.label, styles.labelActive],
      inactive: styles.label,
    }),
    []
  );

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.shell}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            {
              width: tabWidth - 12,
              transform: [{ translateX: indicatorX }],
            },
          ]}
        />
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title || route.name;

          return (
            <HapticPressable
              key={route.key}
              style={styles.tab}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              }}
            >
              <View style={styles.tabInner}>
                <MaterialIcons
                  name={TAB_ICONS[route.name] || 'radio-button-unchecked'}
                  size={24}
                  color={
                    isFocused
                      ? FuturisticTheme.colors.tabIconSelected
                      : FuturisticTheme.colors.tabIconDefault
                  }
                />
                <Text style={isFocused ? labelStyles.active : labelStyles.inactive}>{label}</Text>
              </View>
            </HapticPressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  shell: {
    position: 'relative',
    flexDirection: 'row',
    padding: 6,
    borderRadius: 26,
    backgroundColor: 'rgba(6, 18, 24, 0.94)',
    borderWidth: 1,
    borderColor: 'rgba(0,229,196,0.18)',
  },
  indicator: {
    position: 'absolute',
    top: 6,
    bottom: 6,
    left: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0,229,196,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(0,229,196,0.24)',
    shadowColor: '#00e5c4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.24,
    shadowRadius: 14,
  },
  tab: {
    flex: 1,
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
  },
  label: {
    color: FuturisticTheme.colors.tabIconDefault,
    fontFamily: Fonts.sans,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  labelActive: {
    color: FuturisticTheme.colors.tabIconSelected,
  },
});

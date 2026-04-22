import { useState, useEffect } from 'react';
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { useAuthStore } from '@/store/authStore';
import { Fonts, FuturisticTheme } from '@/constants/theme';
import { FuturisticScreen } from '@/components/ui/futuristic-screen';
import { GlassCard } from '@/components/ui/glass-card';
import { HapticPressable } from '@/components/ui/haptic-pressable';
import { PulseHalo } from '@/components/ui/animated-metrics';
import { getUserDisplayName } from '@/lib/userDisplay';

interface ThemeStore {
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const useThemeStore = create<ThemeStore>((set) => ({
  isDarkMode: false,
  setDarkMode: (value) => set({ isDarkMode: value }),
}));

export default function ProfileScreen() {
  const router = useRouter();
  const { isDarkMode, setDarkMode } = useThemeStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { user, logout } = useAuthStore();
  const displayName = getUserDisplayName(user);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const stored = await AsyncStorage.getItem('@darkMode');
        if (stored !== null) {
          setDarkMode(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load theme:', e);
      }
    };
    loadTheme();
  }, [setDarkMode]);

  const handleDarkModeToggle = async (value: boolean) => {
    setDarkMode(value);
    try {
      await AsyncStorage.setItem('@darkMode', JSON.stringify(value));
    } catch (e) {
      console.error('Failed to save theme:', e);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/Auth/login');
        },
      },
    ]);
  };

  return (
    <FuturisticScreen scrollable contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <GlassCard style={styles.card}>
        <View style={styles.avatarContainer}>
          <PulseHalo style={styles.avatarHalo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color="#031217" />
            </View>
          </PulseHalo>
        </View>
        <Text style={styles.userName}>{displayName}</Text>
        {user?.email ? <Text style={styles.userEmail}>{user.email}</Text> : null}
      </GlassCard>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <GlassCard style={styles.sectionCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Ionicons name="moon" size={18} color={FuturisticTheme.colors.tint} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  {isDarkMode ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={handleDarkModeToggle}
              trackColor={{ false: 'rgba(0, 229, 196, 0.2)', true: FuturisticTheme.colors.tint }}
              thumbColor="#031217"
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIcon}>
                <Ionicons name="notifications" size={18} color={FuturisticTheme.colors.tint} />
              </View>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  {notificationsEnabled ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: 'rgba(0, 229, 196, 0.2)', true: FuturisticTheme.colors.tint }}
              thumbColor="#031217"
            />
          </View>
        </GlassCard>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <GlassCard style={styles.sectionCard}>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>App Version</Text>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </GlassCard>
      </View>

      <HapticPressable onPress={handleLogout}>
        <GlassCard style={styles.logoutButton}>
          <Ionicons name="log-out" size={18} color="#ff7b8d" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </GlassCard>
      </HapticPressable>
    </FuturisticScreen>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 18,
  },
  headerTitle: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.mono,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  card: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarHalo: {
    borderRadius: 999,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: FuturisticTheme.colors.tint,
  },
  userName: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.mono,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 4,
  },
  userEmail: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 2.1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  sectionCard: {
    paddingVertical: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 229, 196, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  settingDescription: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  versionText: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 14,
    letterSpacing: 1.3,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 229, 196, 0.08)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 95, 122, 0.12)',
    borderColor: 'rgba(255, 95, 122, 0.28)',
  },
  logoutButtonText: {
    color: '#ff7b8d',
    fontFamily: Fonts.mono,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
});

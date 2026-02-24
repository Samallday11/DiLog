import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  useColorScheme,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/store/authStore';
import { create } from 'zustand';

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
  const systemColorScheme = useColorScheme();
  const { isDarkMode, setDarkMode } = useThemeStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { user, logout } = useAuthStore();
  const colorScheme = isDarkMode ? 'dark' : systemColorScheme;

  const theme = {
    light: {
      background: '#FFFFFF',
      text: '#1F2937',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      card: '#F9FAFB',
      teal: '#0D9488',
    },
    dark: {
      background: '#111827',
      text: '#F3F4F6',
      textSecondary: '#D1D5DB',
      border: '#374151',
      card: '#1F2937',
      teal: '#14B8A6',
    },
  }[colorScheme || 'light'];

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
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
      </View>

      {/* User Info Card */}
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: theme.teal }]}>
            <Ionicons name="person" size={32} color="#FFFFFF" />
          </View>
        </View>
        <Text style={[styles.userName, { color: theme.text }]}>{user?.fullName || 'User'}</Text>
        <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user?.email || 'email@example.com'}</Text>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Settings</Text>

        {/* Dark Mode Toggle */}
        <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon" size={20} color={theme.teal} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                {isDarkMode ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={handleDarkModeToggle}
            trackColor={{ false: '#ccc', true: theme.teal }}
          />
        </View>

        {/* Notifications Toggle */}
        <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications" size={20} color={theme.teal} />
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Notifications</Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                {notificationsEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#ccc', true: theme.teal }}
          />
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
        <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}>
          <Text style={[styles.settingLabel, { color: theme.text }]}>App Version</Text>
          <Text style={[styles.versionText, { color: theme.textSecondary }]}>1.0.0</Text>
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: '#EF4444' }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out" size={18} color="#FFFFFF" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
  },
  versionText: {
    fontSize: 14,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});


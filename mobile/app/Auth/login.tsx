import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { API_BASE_URL } from '@/lib/api';

const colors = {
  light: {
    background: '#FFFFFF',
    text: '#1F2937',
    border: '#E5E7EB',
    error: '#EF4444',
    errorBg: '#FEE2E2',
    teal: '#0D9488',
    tealLight: '#D1FAE5',
  },
  dark: {
    background: '#111827',
    text: '#F3F4F6',
    border: '#374151',
    error: '#EF4444',
    errorBg: '#7F1D1D',
    teal: '#14B8A6',
    tealLight: '#0D9488',
  },
};

export default function LoginScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const theme = colors[colorScheme];

  const { login, isLoading, error } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setValidationError('Please enter a valid email');
      return false;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const success = await login(email, password);
    if (!success) {
      setValidationError(error || 'Login failed');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialIcons name="health-and-safety" size={48} color={theme.teal} />
          <Text style={[styles.title, { color: theme.text }]}>DiLog</Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>Health Management</Text>
        </View>

        {validationError && (
          <View style={[styles.errorBox, { backgroundColor: theme.errorBg }]}>
            <MaterialIcons name="error-outline" size={20} color={theme.error} />
            <Text style={[styles.errorText, { color: theme.error }]}>{validationError}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Email</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.border, color: theme.text }]}
              placeholder="demo@dilog.com"
              placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#D1D5DB'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Password</Text>
            <View style={[styles.passwordInput, { borderColor: theme.border }]}>
              <TextInput
                style={[styles.input, { flex: 1, color: theme.text, borderWidth: 0 }]}
                placeholder="password123"
                placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#D1D5DB'}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name={showPassword ? 'visibility' : 'visibility-off'}
                  size={20}
                  color={theme.text}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: theme.teal }]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <View style={styles.buttonContent}>
            {isLoading && <ActivityIndicator color="#FFFFFF" style={styles.spinner} />}
            <MaterialIcons name="login" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.text }]}>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/Auth/register')}>
            <Text style={[styles.linkText, { color: theme.teal }]}>Sign up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.demoInfo}>
          <MaterialIcons name="info" size={16} color={theme.teal} />
          <Text style={[styles.demoText, { color: theme.text }]}>
            Backend URL: {API_BASE_URL}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingRight: 12,
  },
  loginButton: {
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spinner: {
    marginRight: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginBottom: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  demoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(13, 148, 136, 0.1)',
  },
  demoText: {
    fontSize: 13,
    fontWeight: '500',
  },
});

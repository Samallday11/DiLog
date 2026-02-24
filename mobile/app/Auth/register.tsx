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

const colors = {
  light: {
    background: '#FFFFFF',
    text: '#1F2937',
    border: '#E5E7EB',
    error: '#EF4444',
    errorBg: '#FEE2E2',
    teal: '#0D9488',
  },
  dark: {
    background: '#111827',
    text: '#F3F4F6',
    border: '#374151',
    error: '#EF4444',
    errorBg: '#7F1D1D',
    teal: '#14B8A6',
  },
};

export default function RegisterScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const theme = colors[colorScheme];

  const { register, isLoading, error } = useAuthStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/Auth/onboarding');
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    if (!fullName.trim()) {
      setValidationError('Full name is required');
      return false;
    }
    if (fullName.trim().length < 2) {
      setValidationError('Full name must be at least 2 characters');
      return false;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setValidationError('Please enter a valid email');
      return false;
    }
    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    const success = await register(fullName, email, password);
    if (!success) {
      setValidationError(error || 'Registration failed');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>Join the DiLog community</Text>
        </View>

        {validationError && (
          <View style={[styles.errorBox, { backgroundColor: theme.errorBg }]}>
            <MaterialIcons name="error-outline" size={20} color={theme.error} />
            <Text style={[styles.errorText, { color: theme.error }]}>{validationError}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.border, color: theme.text }]}
              placeholder="John Doe"
              placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#D1D5DB'}
              value={fullName}
              onChangeText={setFullName}
              editable={!isLoading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Email</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.border, color: theme.text }]}
              placeholder="john@example.com"
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
                placeholder="Enter password"
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

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Confirm Password</Text>
            <View style={[styles.passwordInput, { borderColor: theme.border }]}>
              <TextInput
                style={[styles.input, { flex: 1, color: theme.text, borderWidth: 0 }]}
                placeholder="Confirm password"
                placeholderTextColor={colorScheme === 'dark' ? '#9CA3AF' : '#D1D5DB'}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.registerButton, { backgroundColor: theme.teal }]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <View style={styles.buttonContent}>
            {isLoading && <ActivityIndicator color="#FFFFFF" style={styles.spinner} />}
            <MaterialIcons name="person-add" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>{isLoading ? 'Creating...' : 'Create Account'}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.text }]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/Auth/login')}>
            <Text style={[styles.linkText, { color: theme.teal }]}>Login</Text>
          </TouchableOpacity>
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
    paddingTop: 40,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
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
  registerButton: {
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

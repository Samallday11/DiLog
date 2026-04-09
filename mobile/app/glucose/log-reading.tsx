import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { createGlucoseEntry } from '@/lib/healthApi';
import { useAuthStore } from '@/store/authStore';
import { Fonts, FuturisticTheme } from '@/constants/theme';
import { FuturisticScreen } from '@/components/ui/futuristic-screen';
import { GlassCard } from '@/components/ui/glass-card';
import { HapticPressable } from '@/components/ui/haptic-pressable';

export default function LogGlucose() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [value, setValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSave = async () => {
    const numericValue = Number(value);
    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to save a reading.');
      return;
    }

    if (!Number.isFinite(numericValue) || numericValue < 20 || numericValue > 600) {
      Alert.alert('Invalid Reading', 'Enter a glucose value between 20 and 600.');
      return;
    }

    try {
      setIsSaving(true);
      await createGlucoseEntry(user.id, numericValue);
      Alert.alert('Saved', 'Glucose reading logged successfully.', [
        { text: 'OK', onPress: () => router.replace('/glucose/history') },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save reading';
      Alert.alert('Error', message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FuturisticScreen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <HapticPressable onPress={() => router.back()} disabled={isSaving}>
          <View style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={FuturisticTheme.colors.text} />
          </View>
        </HapticPressable>
        <Text style={styles.headerTitle}>Log Glucose</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Blood glucose reading</Text>
        <GlassCard style={[styles.inputCard, isFocused && styles.inputCardFocused]}>
          <TextInput
            style={styles.input}
            placeholder="110"
            placeholderTextColor={FuturisticTheme.colors.muted}
            keyboardType="number-pad"
            value={value}
            onChangeText={setValue}
            editable={!isSaving}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <Text style={styles.unit}>mg/dL</Text>
        </GlassCard>

        <View style={styles.rangeBar}>
          <View style={[styles.rangeFill, { width: `${Math.min((Number(value) || 110) / 2, 100)}%` }]} />
        </View>

        <Text style={styles.helper}>
          Log your latest reading to update your glucose history.
        </Text>

        <HapticPressable
          style={styles.saveButtonWrap}
          onPress={handleSave}
          disabled={isSaving}
        >
          <View style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}>
            {isSaving ? (
              <ActivityIndicator color="#031217" />
            ) : (
              <Text style={styles.saveButtonText}>Save Reading</Text>
            )}
          </View>
        </HapticPressable>
      </View>
    </FuturisticScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: FuturisticTheme.colors.surface,
    borderWidth: 1,
    borderColor: FuturisticTheme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.mono,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  headerSpacer: {
    width: 42,
  },
  content: {
    flex: 1,
  },
  label: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  inputCardFocused: {
    borderColor: FuturisticTheme.colors.borderStrong,
    shadowOpacity: 0.28,
  },
  input: {
    flex: 1,
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.mono,
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: 2,
  },
  unit: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 18,
  },
  rangeBar: {
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 229, 196, 0.1)',
    overflow: 'hidden',
    marginTop: 18,
  },
  rangeFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: FuturisticTheme.colors.tint,
  },
  helper: {
    marginTop: 16,
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 21,
  },
  saveButtonWrap: {
    marginTop: 28,
    borderRadius: 999,
  },
  saveButton: {
    backgroundColor: FuturisticTheme.colors.tint,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00e5c4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.32,
    shadowRadius: 18,
  },
  saveButtonDisabled: {
    opacity: 0.78,
  },
  saveButtonText: {
    color: '#031217',
    fontFamily: Fonts.mono,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
});

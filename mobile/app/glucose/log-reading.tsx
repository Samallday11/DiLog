import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { createGlucoseEntry } from '@/lib/healthApi';
import { useAuthStore } from '@/store/authStore';

export default function LogGlucose() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [value, setValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Log Glucose</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Blood glucose reading</Text>
        <View style={styles.inputCard}>
          <TextInput
            style={styles.input}
            placeholder="110"
            keyboardType="number-pad"
            value={value}
            onChangeText={setValue}
            editable={!isSaving}
          />
          <Text style={styles.unit}>mg/dL</Text>
        </View>

        <Text style={styles.helper}>
          Log your latest reading to update your glucose history.
        </Text>

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Reading</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  input: {
    flex: 1,
    fontSize: 42,
    fontWeight: '800',
    color: '#0F172A',
  },
  unit: {
    fontSize: 18,
    color: '#64748B',
  },
  helper: {
    marginTop: 16,
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  saveButton: {
    marginTop: 32,
    backgroundColor: '#0D9488',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

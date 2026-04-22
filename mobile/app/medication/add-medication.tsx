import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

import {
  createMedicationEntry,
  fetchMedicationEntries,
  MedicationEntry,
} from '@/lib/healthApi';
import { useAuthStore } from '@/store/authStore';
import { Fonts, FuturisticTheme } from '@/constants/theme';
import { FuturisticScreen } from '@/components/ui/futuristic-screen';
import { GlassCard } from '@/components/ui/glass-card';
import { HapticPressable } from '@/components/ui/haptic-pressable';

function formatDateTimeLocal(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatMedicationTime(value: string) {
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function AddMedication() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const user = useAuthStore((state) => state.user);
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [timeTaken, setTimeTaken] = useState(formatDateTimeLocal(new Date()));
  const [route, setRoute] = useState('');
  const [notes, setNotes] = useState('');
  const [medications, setMedications] = useState<MedicationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState('');

  const loadMedications = async (userId: number, refreshing = false) => {
    try {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setLoadError('');
      const data = await fetchMedicationEntries(userId);
      setMedications(data);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load medications');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      setMedications([]);
      setLoadError('');
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    if (isFocused) {
      loadMedications(user.id);
    }
  }, [isFocused, user?.id]);

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to save medication.');
      return;
    }

    if (!medicationName.trim() || !dosage.trim() || !timeTaken.trim()) {
      Alert.alert('Missing Information', 'Medication name, dosage, and time taken are required.');
      return;
    }

    const parsedTime = new Date(timeTaken);
    if (Number.isNaN(parsedTime.getTime())) {
      Alert.alert('Invalid Time', 'Enter time as YYYY-MM-DDTHH:mm.');
      return;
    }

    try {
      setIsSaving(true);
      const createdEntry = await createMedicationEntry(user.id, {
        medicationName: medicationName.trim(),
        dosage: dosage.trim(),
        timeTaken: parsedTime.toISOString(),
        route: route.trim(),
        notes: notes.trim(),
      });

      setMedications((current) => [createdEntry, ...current].slice(0, 30));
      setMedicationName('');
      setDosage('');
      setTimeTaken(formatDateTimeLocal(new Date()));
      setRoute('');
      setNotes('');
      Alert.alert('Saved', 'Medication logged successfully.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save medication';
      Alert.alert('Error', message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <FuturisticScreen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <HapticPressable onPress={() => router.back()} disabled={isSaving}>
          <View style={styles.iconButton}>
            <Ionicons name="arrow-back" size={20} color={FuturisticTheme.colors.text} />
          </View>
        </HapticPressable>
        <Text style={styles.headerTitle}>Add Medication</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => user?.id && loadMedications(user.id, true)}
            tintColor={FuturisticTheme.colors.tint}
          />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medication Details</Text>
          <GlassCard style={styles.formCard}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Medication Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Metformin"
                placeholderTextColor={FuturisticTheme.colors.muted}
                value={medicationName}
                onChangeText={setMedicationName}
                editable={!isSaving}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Dosage</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., 500 mg"
                placeholderTextColor={FuturisticTheme.colors.muted}
                value={dosage}
                onChangeText={setDosage}
                editable={!isSaving}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Time Taken</Text>
              <TextInput
                style={styles.textInput}
                placeholder="YYYY-MM-DDTHH:mm"
                placeholderTextColor={FuturisticTheme.colors.muted}
                value={timeTaken}
                onChangeText={setTimeTaken}
                autoCapitalize="none"
                editable={!isSaving}
              />
              <Text style={styles.helperText}>Use local time in `YYYY-MM-DDTHH:mm` format.</Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Route</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Oral, Injection"
                placeholderTextColor={FuturisticTheme.colors.muted}
                value={route}
                onChangeText={setRoute}
                editable={!isSaving}
              />
            </View>

            <View style={styles.fieldGroupLast}>
              <Text style={styles.fieldLabel}>Notes</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Optional notes about symptoms, meal timing, or side effects"
                placeholderTextColor={FuturisticTheme.colors.muted}
                value={notes}
                onChangeText={setNotes}
                editable={!isSaving}
                multiline
                maxLength={500}
              />
              <Text style={styles.characterCount}>{notes.length}/500</Text>
            </View>
          </GlassCard>
        </View>

        <HapticPressable
          style={styles.saveButtonWrap}
          onPress={handleSave}
          disabled={isSaving}
        >
          <View style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}>
            {isSaving ? (
              <ActivityIndicator color="#031217" />
            ) : (
              <>
                <Ionicons name="medical" size={18} color="#031217" />
                <Text style={styles.saveButtonText}>Log Medication</Text>
              </>
            )}
          </View>
        </HapticPressable>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Entries</Text>
            <Text style={styles.sectionMeta}>{medications.length} saved</Text>
          </View>

          {isLoading ? (
            <GlassCard style={styles.stateCard}>
              <ActivityIndicator color={FuturisticTheme.colors.tint} />
            </GlassCard>
          ) : loadError ? (
            <GlassCard style={styles.stateCard}>
              <Ionicons name="alert-circle-outline" size={22} color={FuturisticTheme.colors.danger} />
              <Text style={styles.stateText}>{loadError}</Text>
            </GlassCard>
          ) : medications.length === 0 ? (
            <GlassCard style={styles.stateCard}>
              <Ionicons name="medical-outline" size={22} color={FuturisticTheme.colors.tint} />
              <Text style={styles.stateText}>No medication entries yet. Your saved logs will appear here.</Text>
            </GlassCard>
          ) : (
            medications.map((item) => (
              <GlassCard key={item.id} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <View style={styles.entryCopy}>
                    <Text style={styles.entryName}>{item.medicationName}</Text>
                    <Text style={styles.entryDose}>{item.dosage}</Text>
                  </View>
                  <View style={styles.timeBadge}>
                    <Ionicons name="time-outline" size={14} color={FuturisticTheme.colors.tint} />
                    <Text style={styles.timeBadgeText}>{formatMedicationTime(item.timeTaken)}</Text>
                  </View>
                </View>

                {(item.route || item.notes) && (
                  <View style={styles.entryMeta}>
                    {item.route ? (
                      <View style={styles.metaChip}>
                        <Ionicons name="navigate-outline" size={14} color={FuturisticTheme.colors.tint} />
                        <Text style={styles.metaChipText}>{item.route}</Text>
                      </View>
                    ) : null}
                    {item.notes ? <Text style={styles.entryNotes}>{item.notes}</Text> : null}
                  </View>
                )}
              </GlassCard>
            ))
          )}
        </View>
      </ScrollView>
    </FuturisticScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: FuturisticTheme.colors.surface,
    borderWidth: 1,
    borderColor: FuturisticTheme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
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
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  sectionMeta: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  formCard: {
    gap: 16,
  },
  fieldGroup: {
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 229, 196, 0.08)',
  },
  fieldGroupLast: {
    paddingBottom: 0,
  },
  fieldLabel: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  textInput: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 16,
    minHeight: 24,
  },
  helperText: {
    marginTop: 6,
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
  notesInput: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 15,
    minHeight: 88,
    textAlignVertical: 'top',
  },
  characterCount: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 12,
    textAlign: 'right',
    marginTop: 6,
  },
  saveButtonWrap: {
    marginBottom: 26,
    borderRadius: 999,
  },
  saveButton: {
    backgroundColor: FuturisticTheme.colors.tint,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.8,
  },
  saveButtonText: {
    color: '#031217',
    fontFamily: Fonts.mono,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  stateCard: {
    alignItems: 'center',
    gap: 10,
  },
  stateText: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  entryCard: {
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  entryCopy: {
    flex: 1,
  },
  entryName: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  entryDose: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,229,196,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0,229,196,0.16)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  timeBadgeText: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  entryMeta: {
    marginTop: 12,
    gap: 10,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaChipText: {
    color: FuturisticTheme.colors.tint,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  entryNotes: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
});

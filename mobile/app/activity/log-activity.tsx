import { useEffect, useMemo, useState } from 'react';
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
  ActivityEntry,
  createActivityEntry,
  fetchActivityEntries,
} from '@/lib/healthApi';
import { useAuthStore } from '@/store/authStore';
import { Fonts, FuturisticTheme } from '@/constants/theme';
import { FuturisticScreen } from '@/components/ui/futuristic-screen';
import { GlassCard } from '@/components/ui/glass-card';
import { HapticPressable } from '@/components/ui/haptic-pressable';

const PRESET_ACTIVITIES = [
  { id: 'walking', label: 'Walking', icon: 'walk' },
  { id: 'running', label: 'Running', icon: 'fitness' },
  { id: 'eating', label: 'Eating', icon: 'restaurant' },
  { id: 'sleeping', label: 'Sleeping', icon: 'moon' },
  { id: 'cycling', label: 'Cycling', icon: 'bicycle' },
  { id: 'custom', label: 'Custom', icon: 'create-outline' },
] as const;

function formatLoggedAt(value: string) {
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatCategoryLabel(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function LogActivity() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const user = useAuthStore((state) => state.user);
  const [selectedActivity, setSelectedActivity] = useState<(typeof PRESET_ACTIVITIES)[number]['id']>('walking');
  const [customActivity, setCustomActivity] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState('');

  const selectedPreset = PRESET_ACTIVITIES.find((item) => item.id === selectedActivity) ?? PRESET_ACTIVITIES[0];
  const effectiveActivityName = useMemo(() => {
    if (selectedActivity === 'custom') {
      return customActivity.trim();
    }
    return customActivity.trim() || selectedPreset.label;
  }, [customActivity, selectedActivity, selectedPreset.label]);

  const loadActivities = async (userId: number, refreshing = false) => {
    try {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setLoadError('');
      const data = await fetchActivityEntries(userId);
      setActivities(data);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : 'Failed to load activities');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      setActivities([]);
      setLoadError('');
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    if (isFocused) {
      loadActivities(user.id);
    }
  }, [isFocused, user?.id]);

  const handlePresetSelect = (presetId: (typeof PRESET_ACTIVITIES)[number]['id']) => {
    setSelectedActivity(presetId);
    setIsDropdownOpen(false);
    if (presetId !== 'custom') {
      setCustomActivity('');
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to save an activity.');
      return;
    }

    if (!effectiveActivityName) {
      Alert.alert('Missing Activity', 'Choose an activity or enter a custom one.');
      return;
    }

    try {
      setIsSaving(true);
      const createdEntry = await createActivityEntry(user.id, {
        category: selectedActivity,
        activityName: effectiveActivityName,
      });
      setActivities((current) => [createdEntry, ...current].slice(0, 30));
      if (selectedActivity === 'custom') {
        setCustomActivity('');
      }
      Alert.alert('Saved', 'Activity logged successfully.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save activity';
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
        <Text style={styles.headerTitle}>Log Activity</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => user?.id && loadActivities(user.id, true)}
            tintColor={FuturisticTheme.colors.tint}
          />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Log</Text>
          <GlassCard style={styles.formCard}>
            <Text style={styles.helperLead}>Current timestamp</Text>
            <Text style={styles.timestampText}>{formatLoggedAt(new Date().toISOString())}</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Activity Type</Text>
              <HapticPressable onPress={() => setIsDropdownOpen((current) => !current)} disabled={isSaving}>
                <View style={styles.dropdownTrigger}>
                  <View style={styles.dropdownSelection}>
                    <Ionicons name={selectedPreset.icon as any} size={18} color={FuturisticTheme.colors.tint} />
                    <Text style={styles.dropdownText}>{selectedPreset.label}</Text>
                  </View>
                  <Ionicons
                    name={isDropdownOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={FuturisticTheme.colors.muted}
                  />
                </View>
              </HapticPressable>

              {isDropdownOpen ? (
                <View style={styles.dropdownMenu}>
                  {PRESET_ACTIVITIES.map((item) => (
                    <HapticPressable
                      key={item.id}
                      onPress={() => handlePresetSelect(item.id)}
                      disabled={isSaving}
                    >
                      <View
                        style={[
                          styles.dropdownOption,
                          selectedActivity === item.id && styles.dropdownOptionSelected,
                        ]}
                      >
                        <View style={styles.dropdownSelection}>
                          <Ionicons
                            name={item.icon as any}
                            size={18}
                            color={selectedActivity === item.id ? '#031217' : FuturisticTheme.colors.tint}
                          />
                          <Text
                            style={[
                              styles.dropdownOptionText,
                              selectedActivity === item.id && styles.dropdownOptionTextSelected,
                            ]}
                          >
                            {item.label}
                          </Text>
                        </View>
                      </View>
                    </HapticPressable>
                  ))}
                </View>
              ) : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Custom Activity</Text>
              <TextInput
                style={styles.textInput}
                placeholder={selectedActivity === 'custom' ? 'Type a custom activity' : 'Optional override, e.g. Brisk walking'}
                placeholderTextColor={FuturisticTheme.colors.muted}
                value={customActivity}
                onChangeText={setCustomActivity}
                editable={!isSaving}
              />
            </View>

            <View style={styles.quickRow}>
              {PRESET_ACTIVITIES.slice(0, 4).map((item) => (
                <HapticPressable
                  key={item.id}
                  onPress={() => handlePresetSelect(item.id)}
                  disabled={isSaving}
                >
                  <View
                    style={[
                      styles.quickChip,
                      selectedActivity === item.id && styles.quickChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.quickChipText,
                        selectedActivity === item.id && styles.quickChipTextSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                </HapticPressable>
              ))}
            </View>
          </GlassCard>
        </View>

        <HapticPressable style={styles.saveButtonWrap} onPress={handleSave} disabled={isSaving}>
          <View style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}>
            {isSaving ? (
              <ActivityIndicator color="#031217" />
            ) : (
              <>
                <Ionicons name="flash" size={18} color="#031217" />
                <Text style={styles.saveButtonText}>Save Now</Text>
              </>
            )}
          </View>
        </HapticPressable>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activity History</Text>
            <Text style={styles.sectionMeta}>{activities.length} saved</Text>
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
          ) : activities.length === 0 ? (
            <GlassCard style={styles.stateCard}>
              <Ionicons name="fitness-outline" size={22} color={FuturisticTheme.colors.tint} />
              <Text style={styles.stateText}>No activities logged yet. Your recent activity will appear here.</Text>
            </GlassCard>
          ) : (
            activities.map((item) => (
              <GlassCard key={item.id} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <View style={styles.entryCopy}>
                    <Text style={styles.entryName}>{item.activityName}</Text>
                    <Text style={styles.entryCategory}>{formatCategoryLabel(item.category)}</Text>
                  </View>
                  <View style={styles.timeBadge}>
                    <Ionicons name="time-outline" size={14} color={FuturisticTheme.colors.tint} />
                    <Text style={styles.timeBadgeText}>{formatLoggedAt(item.loggedAt)}</Text>
                  </View>
                </View>
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
  helperLead: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  timestampText: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '700',
  },
  fieldGroup: {
    paddingTop: 2,
  },
  fieldLabel: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: FuturisticTheme.colors.border,
    backgroundColor: 'rgba(0, 229, 196, 0.05)',
    borderRadius: FuturisticTheme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  dropdownSelection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dropdownText: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
  },
  dropdownMenu: {
    marginTop: 10,
    borderRadius: FuturisticTheme.radius.md,
    borderWidth: 1,
    borderColor: FuturisticTheme.colors.border,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: FuturisticTheme.colors.surfaceStrong,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 229, 196, 0.08)',
  },
  dropdownOptionSelected: {
    backgroundColor: FuturisticTheme.colors.tint,
  },
  dropdownOptionText: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
  },
  dropdownOptionTextSelected: {
    color: '#031217',
  },
  textInput: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 16,
    borderWidth: 1,
    borderColor: FuturisticTheme.colors.border,
    backgroundColor: 'rgba(0, 229, 196, 0.05)',
    borderRadius: FuturisticTheme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickChip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: FuturisticTheme.colors.border,
    backgroundColor: FuturisticTheme.colors.surface,
  },
  quickChipSelected: {
    backgroundColor: FuturisticTheme.colors.tint,
    borderColor: FuturisticTheme.colors.tint,
  },
  quickChipText: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  quickChipTextSelected: {
    color: '#031217',
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
  entryCategory: {
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
});

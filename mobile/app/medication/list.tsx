import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

import { Fonts, FuturisticTheme } from '@/constants/theme';
import { FuturisticScreen } from '@/components/ui/futuristic-screen';
import { GlassCard } from '@/components/ui/glass-card';
import { HapticPressable } from '@/components/ui/haptic-pressable';
import { CountUpText } from '@/components/ui/animated-metrics';
import { fetchMedicationEntries, MedicationEntry } from '@/lib/healthApi';
import { useAuthStore } from '@/store/authStore';

function formatMedicationTime(value: string) {
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatDayKey(value: string) {
  const date = new Date(value);
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export default function MedicationListScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const user = useAuthStore((state) => state.user);
  const [medications, setMedications] = useState<MedicationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMedications = async () => {
      if (!user?.id || !isFocused) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        const data = await fetchMedicationEntries(user.id);
        setMedications(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load medications');
      } finally {
        setIsLoading(false);
      }
    };

    loadMedications();
  }, [isFocused, user?.id]);

  const stats = useMemo(() => {
    const todayKey = formatDayKey(new Date().toISOString());
    const takenToday = medications.filter((item) => formatDayKey(item.timeTaken) === todayKey).length;
    const daysWithLogs = new Set(medications.map((item) => formatDayKey(item.timeTaken))).size;
    const adherence = daysWithLogs === 0 ? 0 : Math.min(100, Math.round((takenToday / Math.max(1, daysWithLogs)) * 100));

    return { takenToday, adherence };
  }, [medications]);

  const renderMedication = ({ item }: { item: MedicationEntry }) => (
    <HapticPressable style={styles.medCardWrap} onPress={() => router.push('/medication/add-medication')}>
      <GlassCard style={styles.medCard}>
        <View style={styles.medHeader}>
          <View style={styles.medInfo}>
            <Text style={styles.medName}>{item.medicationName}</Text>
            <Text style={styles.medDosage}>{item.dosage}</Text>
          </View>
          <View style={styles.timePill}>
            <Ionicons name="time-outline" size={14} color={FuturisticTheme.colors.tint} />
            <Text style={styles.timePillText}>{formatMedicationTime(item.timeTaken)}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          {item.route ? (
            <View style={styles.metaChip}>
              <Ionicons name="navigate-outline" size={14} color={FuturisticTheme.colors.tint} />
              <Text style={styles.metaChipText}>{item.route}</Text>
            </View>
          ) : (
            <View style={styles.metaChip}>
              <Ionicons name="medical-outline" size={14} color={FuturisticTheme.colors.tint} />
              <Text style={styles.metaChipText}>Logged</Text>
            </View>
          )}
        </View>

        {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
      </GlassCard>
    </HapticPressable>
  );

  return (
    <FuturisticScreen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <HapticPressable onPress={() => router.back()}>
          <View style={styles.iconButton}>
            <Ionicons name="arrow-back" size={20} color={FuturisticTheme.colors.text} />
          </View>
        </HapticPressable>
        <Text style={styles.headerTitle}>Medications</Text>
        <HapticPressable onPress={() => router.push('/medication/add-medication')}>
          <View style={styles.iconButton}>
            <Ionicons name="add" size={20} color={FuturisticTheme.colors.text} />
          </View>
        </HapticPressable>
      </View>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color={FuturisticTheme.colors.tint} size="large" />
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Text style={styles.stateText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={medications}
          renderItem={renderMedication}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <GlassCard style={styles.stats}>
              <View style={styles.statItem}>
                <CountUpText value={stats.takenToday} style={styles.statValue} />
                <Text style={styles.statLabel}>Logged Today</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <CountUpText value={stats.adherence} suffix="%" style={styles.statValue} />
                <Text style={styles.statLabel}>Daily Coverage</Text>
              </View>
            </GlassCard>
          }
          ListEmptyComponent={
            <GlassCard style={styles.emptyCard}>
              <Ionicons name="medical-outline" size={26} color={FuturisticTheme.colors.tint} />
              <Text style={styles.emptyTitle}>No medication logs yet</Text>
              <Text style={styles.stateText}>Create your first medication entry to start tracking.</Text>
            </GlassCard>
          }
        />
      )}

      <HapticPressable
        style={styles.fabWrap}
        onPress={() => router.push('/medication/add-medication')}
      >
        <View style={styles.fab}>
          <Ionicons name="add" size={28} color="#031217" />
        </View>
      </HapticPressable>
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
  list: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: FuturisticTheme.colors.tint,
    fontFamily: Fonts.mono,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(0,229,196,0.12)',
    marginHorizontal: 20,
  },
  medCardWrap: {
    marginBottom: 12,
  },
  medCard: {},
  medHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  medInfo: {
    flex: 1,
  },
  medName: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  medDosage: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,229,196,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,229,196,0.12)',
  },
  timePillText: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaChipText: {
    color: FuturisticTheme.colors.tint,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  notes: {
    marginTop: 10,
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  emptyCard: {
    alignItems: 'center',
    gap: 10,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.mono,
    fontSize: 16,
    fontWeight: '700',
  },
  stateText: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  fabWrap: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    borderRadius: 999,
  },
  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: FuturisticTheme.colors.tint,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00e5c4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.32,
    shadowRadius: 18,
  },
});

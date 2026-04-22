import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

import { fetchGlucoseEntries, GlucoseEntry } from '@/lib/healthApi';
import { useAuthStore } from '@/store/authStore';
import { Fonts, FuturisticTheme } from '@/constants/theme';
import { FuturisticScreen } from '@/components/ui/futuristic-screen';
import { GlassCard } from '@/components/ui/glass-card';
import { HapticPressable } from '@/components/ui/haptic-pressable';

type FilterKey = 'all' | '7d' | '30d' | 'today';

const FILTER_OPTIONS: { id: FilterKey; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: '30d', label: '30D' },
  { id: '7d', label: '7D' },
  { id: 'today', label: 'Today' },
];

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function isWithinFilter(value: string, filter: FilterKey) {
  const entryDate = new Date(value);
  const now = new Date();

  if (filter === 'all') {
    return true;
  }

  if (filter === 'today') {
    return (
      entryDate.getFullYear() === now.getFullYear() &&
      entryDate.getMonth() === now.getMonth() &&
      entryDate.getDate() === now.getDate()
    );
  }

  const days = filter === '7d' ? 7 : 30;
  const cutoff = new Date(now);
  cutoff.setDate(now.getDate() - days);
  return entryDate >= cutoff;
}

function getStatusStyle(status: string) {
  if (status === 'High') {
    return styles.badgeHigh;
  }
  if (status === 'Low') {
    return styles.badgeLow;
  }
  return styles.badgeNormal;
}

export default function GlucoseHistory() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const user = useAuthStore((state) => state.user);
  const [entries, setEntries] = useState<GlucoseEntry[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterKey>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadEntries = async (userId: number, refreshing = false) => {
    try {
      if (refreshing) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError('');
      const data = await fetchGlucoseEntries(userId);
      setEntries(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Failed to load glucose history');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!user?.id) {
      setEntries([]);
      setError('');
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    if (isFocused) {
      loadEntries(user.id);
    }
  }, [isFocused, user?.id]);

  const filteredEntries = useMemo(
    () => entries.filter((entry) => isWithinFilter(entry.timestamp, selectedFilter)),
    [entries, selectedFilter]
  );

  const latest = filteredEntries[0] ?? entries[0];

  const chartEntries = useMemo(
    () => filteredEntries.slice(0, 7).reverse(),
    [filteredEntries]
  );

  const chartMax = useMemo(() => {
    const values = chartEntries.map((entry) => entry.value);
    return values.length ? Math.max(...values, 180) : 180;
  }, [chartEntries]);

  return (
    <FuturisticScreen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <HapticPressable onPress={() => router.back()}>
          <View style={styles.iconButton}>
            <Ionicons name="arrow-back" size={20} color={FuturisticTheme.colors.text} />
          </View>
        </HapticPressable>
        <Text style={styles.headerTitle}>Glucose History</Text>
        <HapticPressable onPress={() => router.push('/glucose/log-reading')}>
          <View style={styles.iconButton}>
            <Ionicons name="add" size={20} color={FuturisticTheme.colors.text} />
          </View>
        </HapticPressable>
      </View>

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => String(item.id)}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => user?.id && loadEntries(user.id, true)}
            tintColor={FuturisticTheme.colors.tint}
          />
        }
        ListHeaderComponent={
          <>
            {latest ? (
              <GlassCard style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Text style={styles.summaryLabel}>Latest Reading</Text>
                  <View style={[styles.badge, getStatusStyle(latest.status)]}>
                    <Text style={styles.badgeText}>{latest.status}</Text>
                  </View>
                </View>
                <View style={styles.summaryValueRow}>
                  <Text style={styles.summaryValue}>{Math.round(latest.value)}</Text>
                  <Text style={styles.summaryUnit}>mg/dL</Text>
                </View>
                <Text style={styles.summaryTimestamp}>{formatTimestamp(latest.timestamp)}</Text>

                {chartEntries.length > 0 ? (
                  <View style={styles.chartSection}>
                    <Text style={styles.chartTitle}>Recent Trend</Text>
                    <View style={styles.chart}>
                      {chartEntries.map((entry) => (
                        <View key={entry.id} style={styles.chartColumn}>
                          <View
                            style={[
                              styles.chartBar,
                              {
                                height: `${Math.max((entry.value / chartMax) * 100, 12)}%`,
                                backgroundColor:
                                  entry.id === latest.id
                                    ? FuturisticTheme.colors.tint
                                    : 'rgba(0, 229, 196, 0.24)',
                              },
                            ]}
                          />
                          <Text style={styles.chartValue}>{Math.round(entry.value)}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}
              </GlassCard>
            ) : null}

            <View style={styles.filterRow}>
              {FILTER_OPTIONS.map((option) => (
                <HapticPressable key={option.id} onPress={() => setSelectedFilter(option.id)}>
                  <View
                    style={[
                      styles.filterChip,
                      selectedFilter === option.id && styles.filterChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedFilter === option.id && styles.filterChipTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </View>
                </HapticPressable>
              ))}
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Entries</Text>
              <Text style={styles.sectionMeta}>{filteredEntries.length} shown</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.centerState}>
              <ActivityIndicator size="large" color={FuturisticTheme.colors.tint} />
            </View>
          ) : error ? (
            <GlassCard style={styles.emptyCard}>
              <Ionicons name="alert-circle-outline" size={24} color={FuturisticTheme.colors.danger} />
              <Text style={styles.emptyText}>{error}</Text>
            </GlassCard>
          ) : (
            <GlassCard style={styles.emptyCard}>
              <Ionicons name="pulse-outline" size={24} color={FuturisticTheme.colors.tint} />
              <Text style={styles.emptyTitle}>No readings in this range</Text>
              <Text style={styles.emptyText}>Try another filter or log a new glucose reading.</Text>
            </GlassCard>
          )
        }
        renderItem={({ item }) => (
          <GlassCard style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <View>
                <Text style={styles.entryValue}>{Math.round(item.value)} mg/dL</Text>
                <Text style={styles.entryTime}>{formatTimestamp(item.timestamp)}</Text>
              </View>
              <View style={[styles.badge, getStatusStyle(item.status)]}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>
          </GlassCard>
        )}
      />
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
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  summaryCard: {
    marginBottom: 18,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  summaryLabel: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  summaryValueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  summaryValue: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.mono,
    fontSize: 44,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  summaryUnit: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 8,
  },
  summaryTimestamp: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  chartSection: {
    marginTop: 18,
  },
  chartTitle: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  chart: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  chartColumn: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  chartBar: {
    width: '100%',
    borderRadius: 999,
    minHeight: 12,
  },
  chartValue: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 11,
    marginTop: 8,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: FuturisticTheme.colors.surface,
    borderWidth: 1,
    borderColor: FuturisticTheme.colors.border,
  },
  filterChipSelected: {
    backgroundColor: FuturisticTheme.colors.tint,
    borderColor: FuturisticTheme.colors.tint,
  },
  filterChipText: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '700',
  },
  filterChipTextSelected: {
    color: '#031217',
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
  },
  sectionMeta: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  entryCard: {
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  entryValue: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.mono,
    fontSize: 18,
    fontWeight: '700',
  },
  entryTime: {
    marginTop: 4,
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  badgeNormal: {
    backgroundColor: 'rgba(0, 229, 196, 0.18)',
  },
  badgeHigh: {
    backgroundColor: 'rgba(255, 95, 122, 0.18)',
  },
  badgeLow: {
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
  },
  badgeText: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
  },
  centerState: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.mono,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});

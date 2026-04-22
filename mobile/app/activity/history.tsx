import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

import { ActivityEntry, fetchActivityEntries } from '@/lib/healthApi';
import { useAuthStore } from '@/store/authStore';
import { Fonts, FuturisticTheme } from '@/constants/theme';
import { FuturisticScreen } from '@/components/ui/futuristic-screen';
import { GlassCard } from '@/components/ui/glass-card';
import { HapticPressable } from '@/components/ui/haptic-pressable';

function formatLoggedAt(value: string) {
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function ActivityHistory() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const user = useAuthStore((state) => state.user);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadActivities = async () => {
      if (!user?.id || !isFocused) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        const data = await fetchActivityEntries(user.id);
        setActivities(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load activities');
      } finally {
        setIsLoading(false);
      }
    };

    loadActivities();
  }, [isFocused, user?.id]);

  return (
    <FuturisticScreen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <HapticPressable onPress={() => router.back()}>
          <View style={styles.iconButton}>
            <Ionicons name="arrow-back" size={20} color={FuturisticTheme.colors.text} />
          </View>
        </HapticPressable>
        <Text style={styles.headerTitle}>Activity History</Text>
        <HapticPressable onPress={() => router.push('/activity/log-activity')}>
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
          data={activities}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <GlassCard style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryCopy}>
                  <Text style={styles.entryName}>{item.activityName}</Text>
                  <Text style={styles.entryCategory}>{item.category}</Text>
                </View>
                <Text style={styles.timeText}>{formatLoggedAt(item.loggedAt)}</Text>
              </View>
            </GlassCard>
          )}
          ListEmptyComponent={
            <GlassCard style={styles.emptyCard}>
              <Ionicons name="fitness-outline" size={24} color={FuturisticTheme.colors.tint} />
              <Text style={styles.emptyTitle}>No activity logs yet</Text>
              <Text style={styles.stateText}>Use quick log to start tracking activity.</Text>
            </GlassCard>
          }
        />
      )}
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
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  entryCategory: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  timeText: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 13,
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
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  stateText: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});

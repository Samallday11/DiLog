import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

import { Fonts, FuturisticTheme } from '@/constants/theme';
import { FuturisticScreen } from '@/components/ui/futuristic-screen';
import { GlassCard } from '@/components/ui/glass-card';
import { HapticPressable } from '@/components/ui/haptic-pressable';
import {
  fetchActivityEntries,
  fetchGlucoseEntries,
  fetchMedicationEntries,
} from '@/lib/healthApi';
import { useAuthStore } from '@/store/authStore';

type RecentLogItem = {
  id: string;
  type: 'glucose' | 'medication' | 'activity';
  label: string;
  value: string;
  timestamp: string;
};

function formatRelativeTime(value: string) {
  const timestamp = new Date(value).getTime();
  const diffMinutes = Math.max(0, Math.round((Date.now() - timestamp) / 60000));

  if (diffMinutes < 1) {
    return 'Now';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

function getRecentLogStyle(type: RecentLogItem['type']) {
  switch (type) {
    case 'glucose':
      return {
        icon: 'water' as const,
        color: '#00e5c4',
        bgColor: 'rgba(0, 229, 196, 0.14)',
      };
    case 'medication':
      return {
        icon: 'medical' as const,
        color: '#7dd3fc',
        bgColor: 'rgba(0, 180, 220, 0.14)',
      };
    default:
      return {
        icon: 'fitness' as const,
        color: '#c084fc',
        bgColor: 'rgba(192, 132, 252, 0.14)',
      };
  }
}

export default function LogScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const user = useAuthStore((state) => state.user);
  const [recentLogs, setRecentLogs] = useState<RecentLogItem[]>([]);
  const [isLoadingRecentLogs, setIsLoadingRecentLogs] = useState(true);
  const [recentLogsError, setRecentLogsError] = useState('');

  const logOptions = [
    {
      title: 'Glucose',
      subtitle: 'Log blood sugar reading',
      icon: 'water',
      color: '#00e5c4',
      bgColor: 'rgba(0, 229, 196, 0.14)',
      route: '/glucose/log-reading',
    },
    {
      title: 'Meal',
      subtitle: 'Track your food intake',
      icon: 'restaurant',
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.14)',
      route: '/meals/add-meal',
    },
    {
      title: 'Medication',
      subtitle: 'Record medication taken',
      icon: 'medical',
      color: '#7dd3fc',
      bgColor: 'rgba(0, 180, 220, 0.14)',
      route: '/medication/add-medication',
    },
    {
      title: 'Activity',
      subtitle: 'Log exercise or activity',
      icon: 'fitness',
      color: '#c084fc',
      bgColor: 'rgba(192, 132, 252, 0.14)',
      route: '/activity/log-activity',
    },
  ];

  useEffect(() => {
    const loadRecentLogs = async () => {
      if (!user?.id || !isFocused) {
        setRecentLogs([]);
        setRecentLogsError('');
        setIsLoadingRecentLogs(false);
        return;
      }

      try {
        setIsLoadingRecentLogs(true);
        setRecentLogsError('');

        const [glucoseEntries, medicationEntries, activityEntries] = await Promise.all([
          fetchGlucoseEntries(user.id),
          fetchMedicationEntries(user.id),
          fetchActivityEntries(user.id),
        ]);

        const mergedLogs: RecentLogItem[] = [
          ...glucoseEntries.map((entry) => ({
            id: `glucose-${entry.id}`,
            type: 'glucose' as const,
            label: 'Glucose Reading',
            value: `${Math.round(entry.value)} mg/dL`,
            timestamp: entry.timestamp,
          })),
          ...medicationEntries.map((entry) => ({
            id: `medication-${entry.id}`,
            type: 'medication' as const,
            label: 'Medication',
            value: entry.medicationName,
            timestamp: entry.timeTaken,
          })),
          ...activityEntries.map((entry) => ({
            id: `activity-${entry.id}`,
            type: 'activity' as const,
            label: 'Activity',
            value: entry.activityName,
            timestamp: entry.loggedAt,
          })),
        ]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 8);

        setRecentLogs(mergedLogs);
      } catch (error) {
        setRecentLogsError(error instanceof Error ? error.message : 'Failed to load recent logs');
      } finally {
        setIsLoadingRecentLogs(false);
      }
    };

    loadRecentLogs();
  }, [isFocused, user?.id]);

  const recentLogContent = useMemo(() => {
    if (isLoadingRecentLogs) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator color={FuturisticTheme.colors.tint} />
        </View>
      );
    }

    if (recentLogsError) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>{recentLogsError}</Text>
        </View>
      );
    }

    if (recentLogs.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No recent glucose, medication, or activity logs yet.</Text>
        </View>
      );
    }

    return recentLogs.map((item, index) => {
      const logStyle = getRecentLogStyle(item.type);

      return (
        <View key={item.id}>
          <View style={styles.recentItem}>
            <View style={styles.recentLeft}>
              <View style={[styles.recentIcon, { backgroundColor: logStyle.bgColor }]}>
                <Ionicons name={logStyle.icon} size={20} color={logStyle.color} />
              </View>
              <View>
                <Text style={styles.recentLabel}>{item.label}</Text>
                <Text style={styles.recentValue}>{item.value}</Text>
              </View>
            </View>
            <Text style={styles.recentTime}>{formatRelativeTime(item.timestamp)}</Text>
          </View>

          {index < recentLogs.length - 1 ? <View style={styles.divider} /> : null}
        </View>
      );
    });
  }, [isLoadingRecentLogs, recentLogs, recentLogsError]);

  return (
    <FuturisticScreen scrollable contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quick Log</Text>
        <Text style={styles.headerSubtitle}>What would you like to track?</Text>
      </View>

      {logOptions.map((option, index) => (
        <HapticPressable
          key={index}
          style={styles.logCardWrap}
          onPress={() => router.push(option.route as any)}
        >
          <GlassCard style={styles.logCard}>
            <View style={[styles.iconContainer, { backgroundColor: option.bgColor }]}>
              <Ionicons name={option.icon as any} size={30} color={option.color} />
            </View>
            <View style={styles.logInfo}>
              <Text style={styles.logTitle}>{option.title}</Text>
              <Text style={styles.logSubtitle}>{option.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={FuturisticTheme.colors.muted} />
          </GlassCard>
        </HapticPressable>
      ))}

      <View style={styles.recentSection}>
        <Text style={styles.recentTitle}>Recent Logs</Text>

        <GlassCard style={styles.recentCard}>{recentLogContent}</GlassCard>
      </View>
    </FuturisticScreen>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.mono,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  headerSubtitle: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 15,
  },
  logCardWrap: {
    marginBottom: 14,
  },
  logCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logInfo: {
    flex: 1,
  },
  logTitle: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  logSubtitle: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  recentSection: {
    marginTop: 20,
  },
  recentTitle: {
    marginBottom: 12,
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  recentCard: {
    paddingVertical: 8,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  recentIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentLabel: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  recentValue: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
  },
  recentTime: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 229, 196, 0.08)',
    marginLeft: 54,
  },
  emptyState: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});

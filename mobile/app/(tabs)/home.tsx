import { Image, StyleSheet, Text, View } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

import { Fonts, FuturisticTheme } from '@/constants/theme';
import { FuturisticScreen } from '@/components/ui/futuristic-screen';
import { GlassCard } from '@/components/ui/glass-card';
import { HapticPressable } from '@/components/ui/haptic-pressable';
import { BlinkIndicator, CountUpText, PulseHalo } from '@/components/ui/animated-metrics';
import {
  fetchActivityEntries,
  fetchGlucoseEntries,
  fetchMedicationEntries,
} from '@/lib/healthApi';
import { useAuthStore } from '@/store/authStore';
import { getUserDisplayName } from '@/lib/userDisplay';

type NotificationItem = {
  id: string;
  type: 'high_glucose' | 'missed_log' | 'medication';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
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

function getNotificationMeta(type: NotificationItem['type']) {
  switch (type) {
    case 'high_glucose':
      return {
        icon: 'warning-outline' as const,
        color: '#ff5f7a',
        bgColor: 'rgba(255, 95, 122, 0.14)',
      };
    case 'medication':
      return {
        icon: 'medical-outline' as const,
        color: '#7dd3fc',
        bgColor: 'rgba(0, 180, 220, 0.14)',
      };
    default:
      return {
        icon: 'time-outline' as const,
        color: '#fbbf24',
        bgColor: 'rgba(245, 158, 11, 0.14)',
      };
  }
}

export default function HomeScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const user = useAuthStore((state) => state.user);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user?.id || !isFocused) {
        setNotifications([]);
        return;
      }

      const readMap = new Map(readNotificationIds.map((id) => [id, true]));

      try {
        const [glucoseEntries, medicationEntries, activityEntries] = await Promise.all([
          fetchGlucoseEntries(user.id),
          fetchMedicationEntries(user.id),
          fetchActivityEntries(user.id),
        ]);

        const generatedNotifications: NotificationItem[] = [];

        const highReadings = glucoseEntries
          .filter((entry) => entry.status === 'High')
          .slice(0, 2)
          .map((entry) => ({
            id: `high-glucose-${entry.id}`,
            type: 'high_glucose' as const,
            title: 'High glucose alert',
            body: `Reading reached ${Math.round(entry.value)} mg/dL.`,
            timestamp: entry.timestamp,
            read: readMap.get(`high-glucose-${entry.id}`) ?? false,
          }));

        generatedNotifications.push(...highReadings);

        const latestMedication = medicationEntries[0];
        if (!latestMedication || Date.now() - new Date(latestMedication.timeTaken).getTime() > 12 * 60 * 60 * 1000) {
          const medicationTimestamp = latestMedication?.timeTaken ?? new Date().toISOString();
          generatedNotifications.push({
            id: 'missed-medication-log',
            type: 'missed_log',
            title: 'Medication log missing',
            body: 'No medication logged in the last 12 hours.',
            timestamp: medicationTimestamp,
            read: readMap.get('missed-medication-log') ?? false,
          });
        }

        const latestActivity = activityEntries[0];
        if (!latestActivity || Date.now() - new Date(latestActivity.loggedAt).getTime() > 24 * 60 * 60 * 1000) {
          const activityTimestamp = latestActivity?.loggedAt ?? new Date().toISOString();
          generatedNotifications.push({
            id: 'missed-activity-log',
            type: 'missed_log',
            title: 'Activity log reminder',
            body: 'You have not logged any activity in the last 24 hours.',
            timestamp: activityTimestamp,
            read: readMap.get('missed-activity-log') ?? false,
          });
        }

        if (latestMedication) {
          generatedNotifications.push({
            id: `medication-${latestMedication.id}`,
            type: 'medication',
            title: 'Medication recorded',
            body: `${latestMedication.medicationName} was logged successfully.`,
            timestamp: latestMedication.timeTaken,
            read: readMap.get(`medication-${latestMedication.id}`) ?? false,
          });
        }

        setNotifications(
          generatedNotifications
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 6)
        );
      } catch {
        const fallbackNotifications: NotificationItem[] = [
          {
            id: 'fallback-high-glucose',
            type: 'high_glucose',
            title: 'High glucose alert',
            body: 'Your latest reading is above target. Review your trend.',
            timestamp: new Date().toISOString(),
            read: readMap.get('fallback-high-glucose') ?? false,
          },
          {
            id: 'fallback-missed-log',
            type: 'missed_log',
            title: 'Missed log reminder',
            body: 'You have not logged activity recently.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            read: readMap.get('fallback-missed-log') ?? false,
          },
        ];

        setNotifications(fallbackNotifications);
      }
    };

    loadNotifications();
  }, [isFocused, readNotificationIds, user?.id]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );
  const displayName = getUserDisplayName(user);

  const markAsRead = (id: string) => {
    setReadNotificationIds((current) => (current.includes(id) ? current : [...current, id]));
  };

  const markAllAsRead = () => {
    setReadNotificationIds((current) => [
      ...new Set([...current, ...notifications.map((item) => item.id)]),
    ]);
  };

  return (
    <FuturisticScreen scrollable contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <PulseHalo style={styles.avatarHalo}>
            <View style={styles.avatarFrame}>
              <Image
                source={{ uri: 'https://via.placeholder.com/50' }}
                style={styles.avatar}
              />
            </View>
          </PulseHalo>
          <View>
            <Text style={styles.welcomeText}>WELCOME BACK</Text>
            <Text style={styles.userName}>{displayName}</Text>
          </View>
        </View>
        <HapticPressable
          style={styles.notificationOuter}
          onPress={() => setIsNotificationOpen((current) => !current)}
        >
          <View style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={22} color={FuturisticTheme.colors.text} />
            {unreadCount > 0 ? <BlinkIndicator style={styles.notificationDot} /> : null}
          </View>
        </HapticPressable>
      </View>

      {isNotificationOpen ? (
        <GlassCard style={styles.notificationPanel}>
          <View style={styles.notificationPanelHeader}>
            <View>
              <Text style={styles.notificationTitle}>Notifications</Text>
              <Text style={styles.notificationSubtitle}>{unreadCount} unread</Text>
            </View>
            {notifications.length > 0 ? (
              <HapticPressable onPress={markAllAsRead}>
                <Text style={styles.markAllText}>Mark all read</Text>
              </HapticPressable>
            ) : null}
          </View>

          {notifications.length === 0 ? (
            <View style={styles.notificationEmpty}>
              <Text style={styles.notificationEmptyText}>No alerts right now.</Text>
            </View>
          ) : (
            notifications.map((item, index) => {
              const meta = getNotificationMeta(item.type);

              return (
                <View key={item.id}>
                  <HapticPressable onPress={() => markAsRead(item.id)}>
                    <View style={styles.notificationItem}>
                      <View style={[styles.notificationTypeIcon, { backgroundColor: meta.bgColor }]}>
                        <Ionicons name={meta.icon} size={18} color={meta.color} />
                      </View>
                      <View style={styles.notificationCopy}>
                        <View style={styles.notificationItemHeader}>
                          <Text style={styles.notificationItemTitle}>{item.title}</Text>
                          {!item.read ? <View style={styles.unreadBadge} /> : null}
                        </View>
                        <Text style={styles.notificationItemBody}>{item.body}</Text>
                        <Text style={styles.notificationItemTime}>{formatRelativeTime(item.timestamp)}</Text>
                      </View>
                    </View>
                  </HapticPressable>
                  {index < notifications.length - 1 ? <View style={styles.notificationDivider} /> : null}
                </View>
              );
            })
          )}
        </GlassCard>
      ) : null}

      <GlassCard style={styles.heroCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Latest Glucose</Text>
          <View style={styles.statusBadge}>
            <BlinkIndicator style={styles.statusDot} />
            <Text style={styles.statusText}>In Range</Text>
          </View>
        </View>

        <View style={styles.glucoseReading}>
          <CountUpText value={110} style={styles.glucoseValue} />
          <Text style={styles.glucoseUnit}>mg/dL</Text>
        </View>

        <View style={styles.chartShell}>
          <View style={styles.chartGlow} />
          <View style={styles.miniChart}>
            {[60, 75, 70, 85, 90, 100].map((height, index) => (
              <View
                key={index}
                style={[
                  styles.chartBar,
                  {
                    height,
                    backgroundColor:
                      index === 5 ? FuturisticTheme.colors.tint : 'rgba(0, 229, 196, 0.18)',
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.timeStamp}>
            <Ionicons name="time-outline" size={16} color={FuturisticTheme.colors.muted} />
            <Text style={styles.timeText}>6 hours ago</Text>
          </View>
          <HapticPressable onPress={() => router.push('/glucose/history')}>
            <Text style={styles.linkText}>View History</Text>
          </HapticPressable>
        </View>
      </GlassCard>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <HapticPressable style={styles.actionWrap} onPress={() => router.push('/glucose/log-reading')}>
            <GlassCard style={[styles.actionButton, styles.primaryAction]}>
              <Ionicons name="water" size={28} color={FuturisticTheme.colors.text} />
              <Text style={styles.actionTextPrimary}>Log Glucose</Text>
            </GlassCard>
          </HapticPressable>

          <HapticPressable style={styles.actionWrap} onPress={() => router.push('/meals/add-meal')}>
            <GlassCard style={styles.actionButton}>
              <Ionicons name="restaurant-outline" size={28} color={FuturisticTheme.colors.tint} />
              <Text style={styles.actionTextSecondary}>Add Meal</Text>
            </GlassCard>
          </HapticPressable>

          <HapticPressable style={styles.actionWrap} onPress={() => router.push('/medication/list')}>
            <GlassCard style={styles.actionButton}>
              <Ionicons name="medical-outline" size={28} color={FuturisticTheme.colors.tint} />
              <Text style={styles.actionTextSecondary}>Meds</Text>
            </GlassCard>
          </HapticPressable>
        </View>
      </View>

      <HapticPressable onPress={() => router.push('/medication/reminders')}>
        <GlassCard style={styles.reminderCard}>
          <View style={styles.reminderLeft}>
            <View style={styles.reminderIcon}>
              <Ionicons name="notifications" size={24} color="#f59e0b" />
            </View>
            <View>
              <Text style={styles.reminderTitle}>Upcoming Reminder</Text>
              <Text style={styles.reminderText}>Evening Insulin in 15 mins</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={FuturisticTheme.colors.tint} />
        </GlassCard>
      </HapticPressable>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Progress</Text>
        <View style={styles.progressCards}>
          <GlassCard style={styles.progressCard}>
            <View style={styles.progressCircle}>
              <CountUpText value={80} suffix="%" style={styles.progressPercentage} />
            </View>
            <Text style={styles.progressTitle}>Activity</Text>
            <Text style={styles.progressSubtitle}>8k / 10k steps</Text>
          </GlassCard>

          <GlassCard style={styles.progressCard}>
            <View style={[styles.progressCircle, styles.progressCircleBlue]}>
              <CountUpText value={60} suffix="%" style={styles.progressPercentage} />
            </View>
            <Text style={styles.progressTitle}>Hydration</Text>
            <Text style={styles.progressSubtitle}>1.5L / 2.5L</Text>
          </GlassCard>
        </View>
      </View>

      <GlassCard style={styles.aiInsightCard}>
        <View style={styles.aiInsightHeader}>
          <View style={styles.aiIcon}>
            <Ionicons name="sparkles" size={18} color={FuturisticTheme.colors.accentBlue} />
          </View>
          <Text style={styles.aiInsightTitle}>AI Insight</Text>
          <Text style={styles.aiInsightTime}>Just now</Text>
        </View>
        <Text style={styles.aiInsightText}>
          Your glucose levels are <Text style={styles.aiHighlight}>stable</Text> after breakfast.
          Keep up the high-fiber choices.
        </Text>
      </GlassCard>
    </FuturisticScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarHalo: {
    borderRadius: 999,
  },
  avatarFrame: {
    padding: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 180, 220, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 196, 0.4)',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  welcomeText: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  userName: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.mono,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  notificationOuter: {
    borderRadius: 999,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: FuturisticTheme.colors.surface,
    borderWidth: 1,
    borderColor: FuturisticTheme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff5f7a',
  },
  notificationPanel: {
    marginBottom: 18,
    paddingTop: 18,
  },
  notificationPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  notificationTitle: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.mono,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  notificationSubtitle: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 13,
    marginTop: 2,
  },
  markAllText: {
    color: FuturisticTheme.colors.tint,
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  notificationEmpty: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  notificationEmptyText: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  notificationItem: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 12,
  },
  notificationTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationCopy: {
    flex: 1,
  },
  notificationItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  notificationItemTitle: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '700',
  },
  notificationItemBody: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  notificationItemTime: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 12,
    marginTop: 6,
  },
  unreadBadge: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: FuturisticTheme.colors.tint,
  },
  notificationDivider: {
    height: 1,
    backgroundColor: 'rgba(0, 229, 196, 0.08)',
    marginLeft: 52,
  },
  heroCard: {
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 229, 196, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 196, 0.18)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: FuturisticTheme.colors.tint,
  },
  statusText: {
    color: FuturisticTheme.colors.tint,
    fontFamily: Fonts.sans,
    fontWeight: '600',
  },
  glucoseReading: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  glucoseValue: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.mono,
    fontSize: 58,
    fontWeight: '800',
    letterSpacing: 2,
  },
  glucoseUnit: {
    marginLeft: 8,
    marginBottom: 10,
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 18,
  },
  chartShell: {
    marginBottom: 18,
  },
  chartGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 180, 220, 0.06)',
  },
  miniChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 112,
    gap: 10,
  },
  chartBar: {
    flex: 1,
    borderRadius: 999,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeStamp: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
  },
  linkText: {
    color: FuturisticTheme.colors.tint,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 2.2,
    textTransform: 'uppercase',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionWrap: {
    flex: 1,
  },
  actionButton: {
    minHeight: 126,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
  },
  primaryAction: {
    backgroundColor: 'rgba(0, 229, 196, 0.14)',
  },
  actionTextPrimary: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  actionTextSecondary: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  reminderCard: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reminderIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderTitle: {
    color: '#fbbf24',
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  reminderText: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
  },
  progressCards: {
    flexDirection: 'row',
    gap: 12,
  },
  progressCard: {
    flex: 1,
    alignItems: 'center',
  },
  progressCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 8,
    borderColor: 'rgba(0, 229, 196, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 196, 0.06)',
    marginBottom: 14,
  },
  progressCircleBlue: {
    borderColor: FuturisticTheme.colors.accentBlue,
  },
  progressPercentage: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.mono,
    fontSize: 22,
    fontWeight: '800',
  },
  progressTitle: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  progressSubtitle: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 13,
  },
  aiInsightCard: {
    marginBottom: 4,
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 180, 220, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiInsightTitle: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  aiInsightTime: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
  aiInsightText: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
  },
  aiHighlight: {
    color: FuturisticTheme.colors.tint,
    fontWeight: '700',
  },
});

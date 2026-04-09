import { Image, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Fonts, FuturisticTheme } from '@/constants/theme';
import { FuturisticScreen } from '@/components/ui/futuristic-screen';
import { GlassCard } from '@/components/ui/glass-card';
import { HapticPressable } from '@/components/ui/haptic-pressable';
import { BlinkIndicator, CountUpText, PulseHalo } from '@/components/ui/animated-metrics';

export default function HomeScreen() {
  const router = useRouter();

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
            <Text style={styles.userName}>Alex Rivera</Text>
          </View>
        </View>
        <HapticPressable style={styles.notificationOuter}>
          <View style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={22} color={FuturisticTheme.colors.text} />
            <BlinkIndicator style={styles.notificationDot} />
          </View>
        </HapticPressable>
      </View>

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

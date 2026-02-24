import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>Alex Rivera</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Latest Glucose Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>LATEST GLUCOSE</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>In Range</Text>
          </View>
        </View>

        <View style={styles.glucoseReading}>
          <Text style={styles.glucoseValue}>110</Text>
          <Text style={styles.glucoseUnit}>mg/dL</Text>
        </View>

        {/* Mini Chart */}
        <View style={styles.miniChart}>
          {[60, 75, 70, 85, 90, 100].map((height, index) => (
            <View
              key={index}
              style={[
                styles.chartBar,
                {
                  height: height,
                  backgroundColor:
                    index === 5 ? '#0D9488' : 'rgba(13, 148, 136, 0.3)',
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.timeStamp}>
            <Ionicons name="time-outline" size={16} color="#64748B" />
            <Text style={styles.timeText}>6 hours ago</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/glucose/history')}>
            <Text style={styles.linkText}>View History →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryAction]}
            onPress={() => router.push('/glucose/log-reading')}
          >
            <Ionicons name="water" size={28} color="#fff" />
            <Text style={styles.actionTextPrimary}>Log Glucose</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={() => router.push('/meals/add-meal')}
          >
            <Ionicons name="restaurant-outline" size={28} color="#0D9488" />
            <Text style={styles.actionTextSecondary}>Add Meal</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryAction]}
            onPress={() => router.push('/medication/list')}
          >
            <Ionicons name="medical-outline" size={28} color="#0D9488" />
            <Text style={styles.actionTextSecondary}>Meds</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upcoming Reminder */}
      <TouchableOpacity
        style={styles.reminderCard}
        onPress={() => router.push('/medication/reminders')}
      >
        <View style={styles.reminderLeft}>
          <View style={styles.reminderIcon}>
            <Ionicons name="notifications" size={24} color="#F59E0B" />
          </View>
          <View>
            <Text style={styles.reminderTitle}>UPCOMING REMINDER</Text>
            <Text style={styles.reminderText}>Evening Insulin in 15 mins</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#92400E" />
      </TouchableOpacity>

      {/* Daily Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>DAILY PROGRESS</Text>
        <View style={styles.progressCards}>
          <View style={styles.progressCard}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercentage}>80%</Text>
            </View>
            <Text style={styles.progressTitle}>Activity</Text>
            <Text style={styles.progressSubtitle}>8k / 10k steps</Text>
          </View>

          <View style={styles.progressCard}>
            <View style={[styles.progressCircle, styles.progressCircleBlue]}>
              <Text style={styles.progressPercentage}>60%</Text>
            </View>
            <Text style={styles.progressTitle}>Hydration</Text>
            <Text style={styles.progressSubtitle}>1.5L / 2.5L</Text>
          </View>
        </View>
      </View>

      {/* AI Insight */}
      <View style={styles.aiInsightCard}>
        <View style={styles.aiInsightHeader}>
          <View style={styles.aiIcon}>
            <Ionicons name="sparkles" size={20} color="#3B82F6" />
          </View>
          <Text style={styles.aiInsightTitle}>AI INSIGHT</Text>
          <Text style={styles.aiInsightTime}>• Just Now</Text>
        </View>
        <Text style={styles.aiInsightText}>
          Your glucose levels are <Text style={styles.aiHighlight}>stable</Text>{' '}
          after breakfast. Keep up the high-fiber choices!
        </Text>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0D9488',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  userName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#89c7dc',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5c8fd6',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0D9488',
  },
  statusText: {
    color: '#0D9488',
    fontSize: 12,
    fontWeight: '600',
  },
  glucoseReading: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  glucoseValue: {
    fontSize: 56,
    fontWeight: '800',
    color: '#0F172A',
  },
  glucoseUnit: {
    fontSize: 18,
    color: '#64748B',
    marginLeft: 4,
  },
  miniChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    marginBottom: 16,
    gap: 8,
  },
  chartBar: {
    flex: 1,
    borderRadius: 4,
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
    color: '#64748B',
    fontSize: 14,
  },
  linkText: {
    color: '#0D9488',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryAction: {
    backgroundColor: '#0D9488',
  },
  secondaryAction: {
    backgroundColor: '#E0F2F1',
  },
  actionTextPrimary: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  actionTextSecondary: {
    color: '#0D9488',
    fontSize: 14,
    fontWeight: '600',
  },
  reminderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  reminderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reminderIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FDE68A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reminderTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400E',
    letterSpacing: 0.5,
  },
  reminderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#78350F',
    marginTop: 2,
  },
  progressCards: {
    flexDirection: 'row',
    gap: 12,
  },
  progressCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: '#0D9488',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    marginBottom: 12,
  },
  progressCircleBlue: {
    borderColor: '#3B82F6',
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  aiInsightCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  aiInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiInsightTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E40AF',
    letterSpacing: 0.5,
  },
  aiInsightTime: {
    fontSize: 10,
    color: '#60A5FA',
  },
  aiInsightText: {
    fontSize: 14,
    color: '#1E3A8A',
    lineHeight: 20,
  },
  aiHighlight: {
    fontWeight: '700',
    color: '#0D9488',
  },
});
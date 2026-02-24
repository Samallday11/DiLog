import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LogScreen() {
  const router = useRouter();

  const logOptions = [
    {
      title: 'Glucose',
      subtitle: 'Log blood sugar reading',
      icon: 'water',
      color: '#0D9488',
      bgColor: '#E0F2F1',
      route: '/glucose/log-reading',
    },
    {
      title: 'Meal',
      subtitle: 'Track your food intake',
      icon: 'restaurant',
      color: '#F59E0B',
      bgColor: '#FEF3C7',
      route: '/meals/add-meal',
    },
    {
      title: 'Medication',
      subtitle: 'Record medication taken',
      icon: 'medical',
      color: '#8B5CF6',
      bgColor: '#EDE9FE',
      route: '/medication/add-medication',
    },
    {
      title: 'Activity',
      subtitle: 'Log exercise or activity',
      icon: 'fitness',
      color: '#3B82F6',
      bgColor: '#DBEAFE',
      route: '/activity/log-activity',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quick Log</Text>
        <Text style={styles.headerSubtitle}>
          What would you like to track?
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {logOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={styles.logCard}
            onPress={() => router.push(option.route as any)}
          >
            <View
              style={[styles.iconContainer, { backgroundColor: option.bgColor }]}
            >
              <Ionicons
                name={option.icon as any}
                size={32}
                color={option.color}
              />
            </View>
            <View style={styles.logInfo}>
              <Text style={styles.logTitle}>{option.title}</Text>
              <Text style={styles.logSubtitle}>{option.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#CBD5E1" />
          </TouchableOpacity>
        ))}

        {/* Recent Logs */}
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>RECENT LOGS</Text>
          
          <View style={styles.recentCard}>
            <View style={styles.recentItem}>
              <View style={styles.recentLeft}>
                <View style={[styles.recentIcon, { backgroundColor: '#E0F2F1' }]}>
                  <Ionicons name="water" size={20} color="#0D9488" />
                </View>
                <View>
                  <Text style={styles.recentLabel}>Glucose Reading</Text>
                  <Text style={styles.recentValue}>110 mg/dL</Text>
                </View>
              </View>
              <Text style={styles.recentTime}>2h ago</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.recentItem}>
              <View style={styles.recentLeft}>
                <View style={[styles.recentIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="restaurant" size={20} color="#F59E0B" />
                </View>
                <View>
                  <Text style={styles.recentLabel}>Breakfast</Text>
                  <Text style={styles.recentValue}>Oatmeal with berries</Text>
                </View>
              </View>
              <Text style={styles.recentTime}>3h ago</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.recentItem}>
              <View style={styles.recentLeft}>
                <View style={[styles.recentIcon, { backgroundColor: '#EDE9FE' }]}>
                  <Ionicons name="medical" size={20} color="#8B5CF6" />
                </View>
                <View>
                  <Text style={styles.recentLabel}>Medication</Text>
                  <Text style={styles.recentValue}>Morning Insulin</Text>
                </View>
              </View>
              <Text style={styles.recentTime}>5h ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#64748B',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  logCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logInfo: {
    flex: 1,
  },
  logTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 4,
  },
  logSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  recentSection: {
    marginTop: 32,
  },
  recentTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  recentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  recentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  recentIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  recentValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  recentTime: {
    fontSize: 13,
    color: '#94A3B8',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 68,
  },
});
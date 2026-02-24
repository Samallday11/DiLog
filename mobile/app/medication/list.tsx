import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string[];
  nextDose: string;
  taken: boolean;
}

export default function MedicationListScreen() {
  const router = useRouter();

  const medications: Medication[] = [
    {
      id: '1',
      name: 'Insulin (Rapid-acting)',
      dosage: '10 units',
      frequency: 'With meals',
      time: ['8:00 AM', '12:00 PM', '6:00 PM'],
      nextDose: '6:00 PM',
      taken: false,
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      time: ['8:00 AM', '8:00 PM'],
      nextDose: '8:00 PM',
      taken: true,
    },
  ];

  const renderMedication = ({ item }: { item: Medication }) => (
    <View style={styles.medCard}>
      <View style={styles.medHeader}>
        <View style={styles.medInfo}>
          <Text style={styles.medName}>{item.name}</Text>
          <Text style={styles.medDosage}>{item.dosage} • {item.frequency}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkButton, item.taken && styles.checkButtonTaken]}
        >
          <Ionicons
            name={item.taken ? 'checkmark-circle' : 'ellipse-outline'}
            size={28}
            color={item.taken ? '#10B981' : '#CBD5E1'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.timesContainer}>
        {item.time.map((time, idx) => (
          <View key={idx} style={styles.timeChip}>
            <Ionicons name="time-outline" size={14} color="#64748B" />
            <Text style={styles.timeText}>{time}</Text>
          </View>
        ))}
      </View>

      <View style={styles.nextDose}>
        <Ionicons name="notifications-outline" size={16} color="#F59E0B" />
        <Text style={styles.nextDoseText}>Next dose: {item.nextDose}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medications</Text>
        <TouchableOpacity onPress={() => router.push('/medication/reminders')}>
          <Ionicons name="settings-outline" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={medications}
        renderItem={renderMedication}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2/3</Text>
              <Text style={styles.statLabel}>Taken Today</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>95%</Text>
              <Text style={styles.statLabel}>Adherence</Text>
            </View>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/medication/add-medication')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  stats: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: '800', color: '#8B5CF6', marginBottom: 4 },
  statLabel: { fontSize: 13, color: '#64748B' },
  statDivider: { width: 1, backgroundColor: '#E2E8F0', marginHorizontal: 20 },
  list: { padding: 16, paddingBottom: 100 },
  medCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  medHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  medInfo: { flex: 1 },
  medName: { fontSize: 16, fontWeight: '600', color: '#0F172A', marginBottom: 4 },
  medDosage: { fontSize: 14, color: '#64748B' },
  checkButton: { padding: 4 },
  checkButtonTaken: {},
  timesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  timeText: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  nextDose: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  nextDoseText: { fontSize: 13, color: '#92400E', fontWeight: '500' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
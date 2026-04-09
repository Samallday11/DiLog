import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Fonts, FuturisticTheme } from '@/constants/theme';
import { FuturisticScreen } from '@/components/ui/futuristic-screen';
import { GlassCard } from '@/components/ui/glass-card';
import { HapticPressable } from '@/components/ui/haptic-pressable';
import { BlinkIndicator, CountUpText } from '@/components/ui/animated-metrics';

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
    <HapticPressable style={styles.medCardWrap}>
      <GlassCard style={styles.medCard}>
        <View style={styles.medHeader}>
          <View style={styles.medInfo}>
            <Text style={styles.medName}>{item.name}</Text>
            <Text style={styles.medDosage}>
              {item.dosage} | {item.frequency}
            </Text>
          </View>
          <View style={styles.checkButton}>
            {item.taken ? (
              <Ionicons name="checkmark-circle" size={28} color={FuturisticTheme.colors.tint} />
            ) : (
              <BlinkIndicator>
                <Ionicons name="ellipse-outline" size={28} color={FuturisticTheme.colors.muted} />
              </BlinkIndicator>
            )}
          </View>
        </View>

        <View style={styles.timesContainer}>
          {item.time.map((time, idx) => (
            <View key={idx} style={styles.timeChip}>
              <Ionicons name="time-outline" size={14} color={FuturisticTheme.colors.tint} />
              <Text style={styles.timeText}>{time}</Text>
            </View>
          ))}
        </View>

        <View style={styles.nextDose}>
          <Ionicons name="notifications-outline" size={16} color="#f59e0b" />
          <Text style={styles.nextDoseText}>Next dose: {item.nextDose}</Text>
        </View>
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
        <HapticPressable onPress={() => router.push('/medication/reminders')}>
          <View style={styles.iconButton}>
            <Ionicons name="settings-outline" size={20} color={FuturisticTheme.colors.text} />
          </View>
        </HapticPressable>
      </View>

      <FlatList
        data={medications}
        renderItem={renderMedication}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <GlassCard style={styles.stats}>
            <View style={styles.statItem}>
              <CountUpText value={2} style={styles.statValue} />
              <Text style={styles.statLabel}>Taken Today</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <CountUpText value={95} suffix="%" style={styles.statValue} />
              <Text style={styles.statLabel}>Adherence</Text>
            </View>
          </GlassCard>
        }
      />

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
    marginBottom: 12,
  },
  medInfo: {
    flex: 1,
    paddingRight: 12,
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
  checkButton: {
    paddingTop: 2,
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,229,196,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,229,196,0.12)',
  },
  timeText: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
  },
  nextDose: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,229,196,0.08)',
  },
  nextDoseText: {
    color: '#fbbf24',
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
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

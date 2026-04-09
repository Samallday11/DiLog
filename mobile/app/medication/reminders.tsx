import { useState } from 'react';
import { FlatList, StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { Fonts, FuturisticTheme } from '@/constants/theme';
import { FuturisticScreen } from '@/components/ui/futuristic-screen';
import { GlassCard } from '@/components/ui/glass-card';
import { HapticPressable } from '@/components/ui/haptic-pressable';

interface Reminder {
  id: string;
  medicationName: string;
  time: string;
  dosage: string;
  completed: boolean;
  notificationsEnabled: boolean;
}

export default function RemindersScreen() {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      medicationName: 'Insulin (Rapid-acting)',
      time: '8:00 AM',
      dosage: '10 units',
      completed: true,
      notificationsEnabled: true,
    },
    {
      id: '2',
      medicationName: 'Metformin',
      time: '12:00 PM',
      dosage: '500mg',
      completed: false,
      notificationsEnabled: true,
    },
    {
      id: '3',
      medicationName: 'Insulin (Rapid-acting)',
      time: '6:00 PM',
      dosage: '10 units',
      completed: false,
      notificationsEnabled: true,
    },
  ]);

  const toggleReminder = (id: string) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r)));
  };

  const toggleNotifications = (id: string) => {
    setReminders(
      reminders.map((r) =>
        r.id === id ? { ...r, notificationsEnabled: !r.notificationsEnabled } : r
      )
    );
  };

  const renderReminder = ({ item }: { item: Reminder }) => (
    <GlassCard style={styles.reminderCard}>
      <View style={styles.reminderContent}>
        <View style={styles.timeSection}>
          <MaterialIcons name="schedule" size={24} color={FuturisticTheme.colors.tint} />
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <View style={styles.medicationSection}>
          <Text style={styles.medicationName}>{item.medicationName}</Text>
          <Text style={styles.dosage}>{item.dosage}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <HapticPressable onPress={() => toggleReminder(item.id)}>
          <View style={styles.checkButton}>
            <MaterialIcons
              name={item.completed ? 'check-circle' : 'radio-button-unchecked'}
              size={24}
              color={item.completed ? FuturisticTheme.colors.tint : FuturisticTheme.colors.muted}
            />
          </View>
        </HapticPressable>
        <Switch
          value={item.notificationsEnabled}
          onValueChange={() => toggleNotifications(item.id)}
          trackColor={{ false: 'rgba(0,229,196,0.2)', true: FuturisticTheme.colors.tint }}
          thumbColor="#031217"
        />
      </View>
    </GlassCard>
  );

  return (
    <FuturisticScreen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <HapticPressable onPress={() => router.back()}>
          <View style={styles.iconButton}>
            <MaterialIcons name="arrow-back" size={20} color={FuturisticTheme.colors.text} />
          </View>
        </HapticPressable>
        <Text style={styles.headerTitle}>Medication Reminders</Text>
        <View style={styles.headerSpacer} />
      </View>
      <FlatList
        data={reminders}
        renderItem={renderReminder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.mono,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  headerSpacer: {
    width: 42,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  reminderCard: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingRight: 10,
  },
  timeSection: {
    alignItems: 'center',
    gap: 4,
    minWidth: 64,
  },
  time: {
    color: FuturisticTheme.colors.tint,
    fontFamily: Fonts.mono,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  medicationSection: {
    flex: 1,
  },
  medicationName: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '700',
  },
  dosage: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 13,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkButton: {
    padding: 4,
  },
});

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Switch,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

interface Reminder {
  id: string;
  medicationName: string;
  time: string;
  dosage: string;
  completed: boolean;
  notificationsEnabled: boolean;
}

export default function RemindersScreen() {
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
    setReminders(
      reminders.map((r) =>
        r.id === id ? { ...r, completed: !r.completed } : r
      )
    );
  };

  const toggleNotifications = (id: string) => {
    setReminders(
      reminders.map((r) =>
        r.id === id ? { ...r, notificationsEnabled: !r.notificationsEnabled } : r
      )
    );
  };

  const renderReminder = ({ item }: { item: Reminder }) => (
    <View style={styles.reminderCard}>
      <View style={styles.reminderContent}>
        <View style={styles.timeSection}>
          <MaterialIcons name="schedule" size={24} color="#007AFF" />
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <View style={styles.medicationSection}>
          <Text style={styles.medicationName}>{item.medicationName}</Text>
          <Text style={styles.dosage}>{item.dosage}</Text>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => toggleReminder(item.id)}
          style={[
            styles.checkButton,
            item.completed && styles.checkButtonActive,
          ]}
        >
          <MaterialIcons
            name={item.completed ? 'check-circle' : 'radio-button-unchecked'}
            size={24}
            color={item.completed ? '#34C759' : '#999'}
          />
        </TouchableOpacity>
        <Switch
          value={item.notificationsEnabled}
          onValueChange={() => toggleNotifications(item.id)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medication Reminders</Text>
      </View>
      <FlatList
        data={reminders}
        renderItem={renderReminder}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  reminderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
    elevation: 3,
  },
  reminderContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeSection: {
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  medicationSection: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  dosage: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkButton: {
    padding: 4,
  },
  checkButtonActive: {
    opacity: 1,
  },
});

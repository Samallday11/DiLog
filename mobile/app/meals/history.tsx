import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Meal {
  id: string;
  name: string;
  type: string;
  time: string;
  carbs: number;
  tags: string[];
}

export default function MealHistoryScreen() {
  const router = useRouter();

  const meals: Meal[] = [
    {
      id: '1',
      name: 'Oatmeal with berries',
      type: 'Breakfast',
      time: '8:00 AM',
      carbs: 45,
      tags: ['High Fiber', 'Low Sugar'],
    },
    {
      id: '2',
      name: 'Grilled chicken salad',
      type: 'Lunch',
      time: '12:30 PM',
      carbs: 25,
      tags: ['Protein Rich', 'Low Carb'],
    },
    {
      id: '3',
      name: 'Greek yogurt',
      type: 'Snack',
      time: '3:00 PM',
      carbs: 15,
      tags: ['Protein Rich'],
    },
  ];

  const getMealIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'breakfast':
        return 'sunny';
      case 'lunch':
        return 'partly-sunny';
      case 'dinner':
        return 'moon';
      default:
        return 'fast-food';
    }
  };

  const renderMeal = ({ item }: { item: Meal }) => (
    <TouchableOpacity
      style={styles.mealCard}
      onPress={() => router.push('/meals/meal-details')}
    >
      <View style={styles.mealLeft}>
        <View style={styles.mealIcon}>
          <Ionicons
            name={getMealIcon(item.type) as any}
            size={24}
            color="#F59E0B"
          />
        </View>
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{item.name}</Text>
          <Text style={styles.mealTime}>
            {item.type} • {item.time}
          </Text>
          <View style={styles.tags}>
            {item.tags.slice(0, 2).map((tag, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.carbsBadge}>
        <Text style={styles.carbsValue}>{item.carbs}g</Text>
        <Text style={styles.carbsLabel}>carbs</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meal History</Text>
        <TouchableOpacity>
          <Ionicons name="filter-outline" size={24} color="#0F172A" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={meals}
        renderItem={renderMeal}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/meals/add-meal')}
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
  list: { padding: 16, paddingBottom: 100 },
  mealCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mealLeft: { flexDirection: 'row', flex: 1, gap: 12 },
  mealIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealInfo: { flex: 1 },
  mealName: { fontSize: 16, fontWeight: '600', color: '#0F172A', marginBottom: 4 },
  mealTime: { fontSize: 13, color: '#64748B', marginBottom: 8 },
  tags: { flexDirection: 'row', gap: 6 },
  tag: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  carbsBadge: { alignItems: 'center', justifyContent: 'center' },
  carbsValue: { fontSize: 20, fontWeight: '700', color: '#F59E0B' },
  carbsLabel: { fontSize: 11, color: '#94A3B8' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
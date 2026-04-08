import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

import { fetchMeals, MealEntry } from '@/lib/healthApi';
import { useAuthStore } from '@/store/authStore';

function formatMealTime(value: string) {
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function MealHistoryScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const user = useAuthStore((state) => state.user);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadMeals = async () => {
      if (!user?.id || !isFocused) {
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        const data = await fetchMeals(user.id);
        setMeals(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load meals');
      } finally {
        setIsLoading(false);
      }
    };

    loadMeals();
  }, [isFocused, user?.id]);

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meal History</Text>
        <TouchableOpacity onPress={() => router.push('/meals/add-meal')}>
          <Ionicons name="add-circle-outline" size={24} color="#F59E0B" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#F59E0B" />
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Text style={styles.stateText}>{error}</Text>
        </View>
      ) : meals.length === 0 ? (
        <View style={styles.centerState}>
          <Text style={styles.stateTitle}>No meals yet</Text>
          <Text style={styles.stateText}>Log a meal to build your meal history.</Text>
        </View>
      ) : (
        <FlatList
          data={meals}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.mealCard}>
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
                    {item.type} • {formatMealTime(item.loggedAt)}
                  </Text>
                  <View style={styles.tags}>
                    {item.tags.slice(0, 2).map((tag) => (
                      <View key={tag} style={styles.tag}>
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
            </View>
          )}
        />
      )}

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
  tags: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
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
    ...Platform.select({
      web: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
    elevation: 8,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  stateText: {
    textAlign: 'center',
    color: '#64748B',
    lineHeight: 20,
  },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

import { fetchGlucoseEntries, GlucoseEntry } from '@/lib/healthApi';
import { useAuthStore } from '@/store/authStore';

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function GlucoseHistory() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const user = useAuthStore((state) => state.user);
  const [entries, setEntries] = useState<GlucoseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEntries = async () => {
      if (!user?.id || !isFocused) {
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        const data = await fetchGlucoseEntries(user.id);
        setEntries(data);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Failed to load glucose history');
      } finally {
        setIsLoading(false);
      }
    };

    loadEntries();
  }, [isFocused, user?.id]);

  const latest = entries[0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Glucose History</Text>
        <TouchableOpacity onPress={() => router.push('/glucose/log-reading')}>
          <Ionicons name="add-circle-outline" size={24} color="#0D9488" />
        </TouchableOpacity>
      </View>

      {latest && (
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>LATEST READING</Text>
          <Text style={styles.summaryValue}>{latest.value} mg/dL</Text>
          <Text style={styles.summaryStatus}>{latest.status}</Text>
        </View>
      )}

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#0D9488" />
        </View>
      ) : error ? (
        <View style={styles.centerState}>
          <Text style={styles.stateText}>{error}</Text>
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.centerState}>
          <Text style={styles.stateTitle}>No readings yet</Text>
          <Text style={styles.stateText}>Log your first glucose reading to populate history.</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.entryCard}>
              <View>
                <Text style={styles.entryValue}>{item.value} mg/dL</Text>
                <Text style={styles.entryTime}>{formatTimestamp(item.timestamp)}</Text>
              </View>
              <View
                style={[
                  styles.badge,
                  item.status === 'High'
                    ? styles.badgeHigh
                    : item.status === 'Low'
                      ? styles.badgeLow
                      : styles.badgeNormal,
                ]}
              >
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  summaryCard: {
    margin: 16,
    padding: 20,
    backgroundColor: '#E0F2F1',
    borderRadius: 16,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryStatus: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#0D9488',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  entryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  entryTime: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeNormal: {
    backgroundColor: '#D1FAE5',
  },
  badgeHigh: {
    backgroundColor: '#FEE2E2',
  },
  badgeLow: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
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

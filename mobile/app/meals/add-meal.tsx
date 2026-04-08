import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { createMeal } from '@/lib/healthApi';
import { useAuthStore } from '@/store/authStore';

export default function AddMealScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [mealName, setMealName] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [carbs, setCarbs] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const mealTypes = [
    { id: 'Breakfast', label: 'Breakfast', icon: 'sunny' },
    { id: 'Lunch', label: 'Lunch', icon: 'partly-sunny' },
    { id: 'Dinner', label: 'Dinner', icon: 'moon' },
    { id: 'Snack', label: 'Snack', icon: 'fast-food' },
  ];

  const foodTags = [
    'High Fiber',
    'Low Carb',
    'Protein Rich',
    'Vegetarian',
    'Dairy Free',
    'Gluten Free',
  ];

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'You must be logged in to save a meal.');
      return;
    }

    if (!mealName || !selectedMealType) {
      Alert.alert('Error', 'Please enter meal name and select meal type');
      return;
    }

    try {
      setIsSaving(true);
      await createMeal(user.id, {
        name: mealName,
        type: selectedMealType,
        tags: selectedTags,
        carbs: Number(carbs) || 0,
        notes,
      });

      Alert.alert('Success', 'Meal logged successfully', [
        { text: 'OK', onPress: () => router.replace('/meals/history') },
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save meal';
      Alert.alert('Error', message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={isSaving}
        >
          <Ionicons name="close" size={28} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Meal</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What did you eat?</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., Grilled chicken salad"
            value={mealName}
            onChangeText={setMealName}
            editable={!isSaving}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Type</Text>
          <View style={styles.mealTypeGrid}>
            {mealTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.mealTypeButton,
                  selectedMealType === type.id && styles.mealTypeButtonSelected,
                ]}
                onPress={() => setSelectedMealType(type.id)}
                disabled={isSaving}
              >
                <Ionicons
                  name={type.icon as any}
                  size={24}
                  color={selectedMealType === type.id ? '#F59E0B' : '#64748B'}
                />
                <Text
                  style={[
                    styles.mealTypeText,
                    selectedMealType === type.id && styles.mealTypeTextSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Carbs</Text>
          <View style={styles.carbsInput}>
            <TextInput
              style={styles.carbsValue}
              placeholder="0"
              keyboardType="decimal-pad"
              value={carbs}
              onChangeText={setCarbs}
              editable={!isSaving}
            />
            <Text style={styles.carbsUnit}>grams</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food Tags (Optional)</Text>
          <View style={styles.tagsContainer}>
            {foodTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tag,
                  selectedTags.includes(tag) && styles.tagSelected,
                ]}
                onPress={() => handleTagToggle(tag)}
                disabled={isSaving}
              >
                <Text
                  style={[
                    styles.tagText,
                    selectedTags.includes(tag) && styles.tagTextSelected,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add portion sizes, preparation method, how you felt after..."
            value={notes}
            onChangeText={setNotes}
            multiline
            maxLength={300}
            editable={!isSaving}
          />
          <Text style={styles.characterCount}>{notes.length}/300</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!mealName || !selectedMealType || isSaving) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={!mealName || !selectedMealType || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Log Meal</Text>
          )}
        </TouchableOpacity>
      </View>
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    fontSize: 16,
    color: '#0F172A',
  },
  mealTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mealTypeButton: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  mealTypeButtonSelected: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  mealTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  mealTypeTextSelected: {
    color: '#F59E0B',
  },
  carbsInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  carbsValue: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  carbsUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tagSelected: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
  },
  tagTextSelected: {
    color: '#fff',
  },
  notesInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    fontSize: 15,
    color: '#0F172A',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'right',
    marginTop: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  saveButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

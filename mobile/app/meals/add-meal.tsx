import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { createMeal } from '@/lib/healthApi';
import { useAuthStore } from '@/store/authStore';
import { Fonts, FuturisticTheme } from '@/constants/theme';
import { FuturisticScreen } from '@/components/ui/futuristic-screen';
import { GlassCard } from '@/components/ui/glass-card';
import { HapticPressable } from '@/components/ui/haptic-pressable';

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
    <FuturisticScreen contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <HapticPressable onPress={() => router.back()} disabled={isSaving}>
          <View style={styles.backButton}>
            <Ionicons name="close" size={24} color={FuturisticTheme.colors.text} />
          </View>
        </HapticPressable>
        <Text style={styles.headerTitle}>Add Meal</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What did you eat?</Text>
          <GlassCard style={styles.fieldCard}>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Grilled chicken salad"
              placeholderTextColor={FuturisticTheme.colors.muted}
              value={mealName}
              onChangeText={setMealName}
              editable={!isSaving}
            />
          </GlassCard>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Type</Text>
          <View style={styles.mealTypeGrid}>
            {mealTypes.map((type) => (
              <HapticPressable
                key={type.id}
                style={styles.mealTypeButtonWrap}
                onPress={() => setSelectedMealType(type.id)}
                disabled={isSaving}
              >
                <GlassCard
                  style={[
                    styles.mealTypeButton,
                    selectedMealType === type.id && styles.mealTypeButtonSelected,
                  ]}
                >
                  <Ionicons
                    name={type.icon as any}
                    size={24}
                    color={selectedMealType === type.id ? '#031217' : FuturisticTheme.colors.tint}
                  />
                  <Text
                    style={[
                      styles.mealTypeText,
                      selectedMealType === type.id && styles.mealTypeTextSelected,
                    ]}
                  >
                    {type.label}
                  </Text>
                </GlassCard>
              </HapticPressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Carbs</Text>
          <GlassCard style={styles.carbsInput}>
            <TextInput
              style={styles.carbsValue}
              placeholder="0"
              placeholderTextColor={FuturisticTheme.colors.muted}
              keyboardType="decimal-pad"
              value={carbs}
              onChangeText={setCarbs}
              editable={!isSaving}
            />
            <Text style={styles.carbsUnit}>grams</Text>
          </GlassCard>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food Tags (Optional)</Text>
          <View style={styles.tagsContainer}>
            {foodTags.map((tag) => (
              <HapticPressable
                key={tag}
                onPress={() => handleTagToggle(tag)}
                disabled={isSaving}
              >
                <View
                  style={[
                    styles.tag,
                    selectedTags.includes(tag) && styles.tagSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.tagText,
                      selectedTags.includes(tag) && styles.tagTextSelected,
                    ]}
                  >
                    {tag}
                  </Text>
                </View>
              </HapticPressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (Optional)</Text>
          <GlassCard style={styles.fieldCard}>
            <TextInput
              style={styles.notesInput}
              placeholder="Add portion sizes, preparation method, how you felt after..."
              placeholderTextColor={FuturisticTheme.colors.muted}
              value={notes}
              onChangeText={setNotes}
              multiline
              maxLength={300}
              editable={!isSaving}
            />
          </GlassCard>
          <Text style={styles.characterCount}>{notes.length}/300</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <HapticPressable
          style={styles.saveButtonWrap}
          onPress={handleSave}
          disabled={!mealName || !selectedMealType || isSaving}
        >
          <View
            style={[
              styles.saveButton,
              (!mealName || !selectedMealType || isSaving) && styles.saveButtonDisabled,
            ]}
          >
            {isSaving ? (
              <ActivityIndicator color="#031217" />
            ) : (
              <Text style={styles.saveButtonText}>Log Meal</Text>
            )}
          </View>
        </HapticPressable>
      </View>
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
  backButton: {
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
  headerSpacer: {
    width: 42,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 130,
  },
  section: {
    marginBottom: 26,
  },
  sectionTitle: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  fieldCard: {
    paddingVertical: 10,
  },
  textInput: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 16,
  },
  mealTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mealTypeButtonWrap: {
    width: '47%',
  },
  mealTypeButton: {
    alignItems: 'center',
    gap: 10,
    minHeight: 108,
    justifyContent: 'center',
  },
  mealTypeButtonSelected: {
    backgroundColor: FuturisticTheme.colors.tint,
    borderColor: FuturisticTheme.colors.tint,
  },
  mealTypeText: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 14,
    fontWeight: '700',
  },
  mealTypeTextSelected: {
    color: '#031217',
  },
  carbsInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  carbsValue: {
    flex: 1,
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.mono,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  carbsUnit: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 16,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: FuturisticTheme.colors.surface,
    borderWidth: 1,
    borderColor: FuturisticTheme.colors.border,
  },
  tagSelected: {
    backgroundColor: 'rgba(0, 229, 196, 0.18)',
    borderColor: FuturisticTheme.colors.tint,
  },
  tagText: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 13,
    fontWeight: '600',
  },
  tagTextSelected: {
    color: FuturisticTheme.colors.tint,
  },
  notesInput: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  characterCount: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 12,
    textAlign: 'right',
    marginTop: 6,
  },
  footer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 28,
  },
  saveButtonWrap: {
    borderRadius: 999,
  },
  saveButton: {
    backgroundColor: FuturisticTheme.colors.tint,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(0, 229, 196, 0.2)',
  },
  saveButtonText: {
    color: '#031217',
    fontFamily: Fonts.mono,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
});

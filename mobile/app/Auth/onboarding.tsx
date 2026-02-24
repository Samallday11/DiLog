import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const colors = {
  light: {
    background: '#FFFFFF',
    text: '#1F2937',
    accent: '#F3F4F6',
    teal: '#0D9488',
  },
  dark: {
    background: '#111827',
    text: '#F3F4F6',
    accent: '#1F2937',
    teal: '#14B8A6',
  },
};

interface OnboardingStep {
  id: number;
  icon: string;
  title: string;
  description: string;
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    icon: 'health-and-safety',
    title: 'Track Your Health',
    description: 'Monitor blood glucose, medications, and meals in one place',
  },
  {
    id: 2,
    icon: 'bar-chart',
    title: 'View Analytics',
    description: 'Get insights into your health trends and patterns',
  },
  {
    id: 3,
    icon: 'notifications',
    title: 'Smart Reminders',
    description: 'Never miss a medication or health check-up again',
  },
  {
    id: 4,
    icon: 'smart-toy',
    title: 'AI Assistant',
    description: 'Get personalized health recommendations from our AI',
  },
  {
    id: 5,
    icon: 'security',
    title: 'Your Privacy Matters',
    description: 'Your health data is encrypted and secure',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() || 'light';
  const theme = colors[colorScheme];

  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)/home');
  };

  const step = steps[currentStep];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {/* Skip button */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={[styles.skipButton, { color: theme.teal }]}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: theme.accent }]}>
          <MaterialIcons name={step.icon as any} size={64} color={theme.teal} />
        </View>

        {/* Content */}
        <View style={styles.contentSection}>
          <Text style={[styles.stepNumber, { color: theme.teal }]}>
            Step {step.id} of {steps.length}
          </Text>
          <Text style={[styles.title, { color: theme.text }]}>{step.title}</Text>
          <Text style={[styles.description, { color: theme.text }]}>{step.description}</Text>
        </View>

        {/* Progress dots */}
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index <= currentStep ? theme.teal : theme.accent,
                },
              ]}
            />
          ))}
        </View>

        {/* Navigation buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: theme.teal }]}
            onPress={handleBack}
            disabled={currentStep === 0}
          >
            <MaterialIcons name="arrow-back" size={20} color={theme.teal} />
            <Text style={[styles.secondaryButtonText, { color: theme.teal }]}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.teal }]}
            onPress={handleNext}
          >
            <MaterialIcons
              name={currentStep === steps.length - 1 ? 'check' : 'arrow-forward'}
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.primaryButtonText}>
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 20,
    paddingBottom: 40,
    minHeight: '100%',
  },
  header: {
    alignItems: 'flex-end',
    marginBottom: 40,
  },
  skipButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 40,
  },
  contentSection: {
    marginBottom: 60,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 60,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

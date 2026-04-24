import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { BlinkIndicator, PulseHalo } from '@/components/ui/animated-metrics';
import { FuturisticScreen } from '@/components/ui/futuristic-screen';
import { GlassCard } from '@/components/ui/glass-card';
import { HapticPressable } from '@/components/ui/haptic-pressable';
import { Fonts, FuturisticTheme } from '@/constants/theme';
import { fetchAiInsight, sendAiChat } from '@/lib/aiApi';
import {
  fetchActivityEntries,
  fetchGlucoseEntries,
  fetchMedicationEntries,
} from '@/lib/healthApi';
import { useAuthStore } from '@/store/authStore';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface InsightInputSummary {
  glucose?: number;
  activity?: string;
  medication?: string;
}

const DISCLAIMER =
  'AI can make mistakes and is not a medical professional. Always consult a healthcare provider for medical advice.';

async function buildInsightFromLatestData(userId: number) {
  const [glucoseEntries, activityEntries, medicationEntries] = await Promise.all([
    fetchGlucoseEntries(userId),
    fetchActivityEntries(userId),
    fetchMedicationEntries(userId),
  ]);

  const payload = {
    glucose: glucoseEntries[0]?.value,
    activity: activityEntries[0]?.activityName,
    medication: medicationEntries[0]?.medicationName,
  };

  const response = await fetchAiInsight(payload);
  return { payload, insight: response.insight };
}

export default function AIChatScreen() {
  const userId = useAuthStore((state) => state.user?.id);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your local AI assistant. I can chat with you and generate a short insight from your latest logged health data.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [insight, setInsight] = useState('');
  const [insightInputs, setInsightInputs] = useState<InsightInputSummary>({});
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [screenError, setScreenError] = useState<string | null>(null);

  const generateInsight = async (targetUserId = userId) => {
    if (!targetUserId) {
      return;
    }

    setIsInsightLoading(true);
    setScreenError(null);

    try {
      const result = await buildInsightFromLatestData(targetUserId);
      setInsightInputs(result.payload);
      setInsight(result.insight);
    } catch (error) {
      setScreenError(error instanceof Error ? error.message : 'Unable to load AI insight right now.');
    } finally {
      setIsInsightLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      return;
    }

    let isMounted = true;

    const loadInsight = async () => {
      setIsInsightLoading(true);
      setScreenError(null);

      try {
        const result = await buildInsightFromLatestData(userId);
        if (!isMounted) {
          return;
        }
        setInsightInputs(result.payload);
        setInsight(result.insight);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        setScreenError(error instanceof Error ? error.message : 'Unable to load AI insight right now.');
      } finally {
        if (isMounted) {
          setIsInsightLoading(false);
        }
      }
    };

    void loadInsight();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const sendMessage = async () => {
    const trimmedMessage = inputText.trim();
    if (trimmedMessage === '' || isSending) {
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      text: trimmedMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setIsSending(true);
    setScreenError(null);

    try {
      const response = await sendAiChat(trimmedMessage);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.reply,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      setScreenError(error instanceof Error ? error.message : 'Unable to reach the AI service right now.');
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    'Suggest healthy breakfast',
    'Analyze my glucose trends',
    'Snack ideas',
    'Exercise tips',
  ];

  const latestDataSummary = [
    insightInputs.glucose != null ? `${insightInputs.glucose} mg/dL glucose` : 'No glucose logged',
    insightInputs.activity ? `${insightInputs.activity} activity` : 'No activity logged',
    insightInputs.medication ? `${insightInputs.medication} medication` : 'No medication logged',
  ].join(' | ');

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      {!item.isUser && (
        <PulseHalo style={styles.aiAvatarHalo}>
          <View style={styles.aiAvatar}>
            <Ionicons name="sparkles" size={16} color={FuturisticTheme.colors.accentBlue} />
          </View>
        </PulseHalo>
      )}
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.aiBubble,
        ]}
      >
        <Text style={[styles.messageText, item.isUser ? styles.userText : styles.aiText]}>
          {item.text}
        </Text>
        <Text
          style={[
            styles.timestamp,
            item.isUser ? styles.userTimestamp : styles.aiTimestamp,
          ]}
        >
          {item.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    </View>
  );

  return (
    <FuturisticScreen>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <PulseHalo style={styles.headerHalo}>
              <View style={styles.headerIcon}>
                <Ionicons name="sparkles" size={22} color={FuturisticTheme.colors.accentBlue} />
              </View>
            </PulseHalo>
            <View>
              <Text style={styles.headerTitle}>AI Health Assistant</Text>
              <View style={styles.statusIndicator}>
                <BlinkIndicator style={styles.onlineDot} />
                <Text style={styles.statusText}>Local GPT-2</Text>
              </View>
            </View>
          </View>
        </View>

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.topPanels}>
              <GlassCard style={styles.disclaimerCard}>
                <Text style={styles.disclaimerLabel}>Safety Notice</Text>
                <Text style={styles.disclaimerText}>{DISCLAIMER}</Text>
              </GlassCard>

              <GlassCard style={styles.insightCard}>
                <View style={styles.insightHeader}>
                  <View style={styles.insightHeaderText}>
                    <Text style={styles.insightLabel}>AI Insight</Text>
                    <Text style={styles.insightMeta}>{latestDataSummary}</Text>
                  </View>
                  <HapticPressable onPress={() => void generateInsight()} disabled={isInsightLoading}>
                    <View style={styles.refreshButton}>
                      {isInsightLoading ? (
                        <ActivityIndicator size="small" color={FuturisticTheme.colors.tint} />
                      ) : (
                        <Ionicons name="refresh" size={18} color={FuturisticTheme.colors.tint} />
                      )}
                    </View>
                  </HapticPressable>
                </View>

                <Text style={styles.insightText}>
                  {isInsightLoading
                    ? 'Generating a local GPT-2 insight from your latest health logs...'
                    : insight || 'Tap refresh to generate an insight from your latest glucose, activity, and medication entries.'}
                </Text>
              </GlassCard>

              {screenError ? <Text style={styles.errorText}>{screenError}</Text> : null}
            </View>
          }
        />

        {messages.length === 1 && (
          <View style={styles.quickPromptsContainer}>
            <Text style={styles.quickPromptsTitle}>Quick prompts</Text>
            <View style={styles.quickPrompts}>
              {quickPrompts.map((prompt) => (
                <HapticPressable key={prompt} onPress={() => setInputText(prompt)}>
                  <View style={styles.quickPrompt}>
                    <Text style={styles.quickPromptText}>{prompt}</Text>
                  </View>
                </HapticPressable>
              ))}
            </View>
          </View>
        )}

        <View style={styles.inputContainer}>
          <GlassCard style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Ask the local GPT-2 assistant..."
              placeholderTextColor={FuturisticTheme.colors.muted}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <HapticPressable
              style={[
                styles.sendButtonWrap,
                (inputText.trim() === '' || isSending) && styles.sendButtonWrapDisabled,
              ]}
              onPress={() => void sendMessage()}
              disabled={inputText.trim() === '' || isSending}
            >
              <View
                style={[
                  styles.sendButton,
                  (inputText.trim() === '' || isSending) && styles.sendButtonDisabled,
                ]}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color={FuturisticTheme.colors.muted} />
                ) : (
                  <Ionicons
                    name="send"
                    size={18}
                    color={inputText.trim() === '' ? FuturisticTheme.colors.muted : '#02161b'}
                  />
                )}
              </View>
            </HapticPressable>
          </GlassCard>
        </View>
      </KeyboardAvoidingView>
    </FuturisticScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerHalo: {
    borderRadius: 999,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 180, 220, 0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 180, 220, 0.2)',
  },
  headerTitle: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.mono,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 3,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: FuturisticTheme.colors.tint,
  },
  statusText: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 12,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
  },
  topPanels: {
    gap: 12,
    marginBottom: 14,
  },
  disclaimerCard: {
    borderColor: 'rgba(255, 95, 122, 0.2)',
    backgroundColor: 'rgba(36, 10, 16, 0.72)',
  },
  disclaimerLabel: {
    color: '#ff9aaa',
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 1.7,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  disclaimerText: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  insightCard: {
    gap: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  insightHeaderText: {
    flex: 1,
  },
  insightLabel: {
    color: FuturisticTheme.colors.tint,
    fontFamily: Fonts.mono,
    fontSize: 12,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  insightMeta: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.sans,
    fontSize: 13,
    lineHeight: 18,
  },
  refreshButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: FuturisticTheme.colors.border,
    backgroundColor: 'rgba(0, 229, 196, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightText: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
  },
  errorText: {
    color: FuturisticTheme.colors.danger,
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  aiAvatarHalo: {
    marginRight: 8,
    borderRadius: 999,
  },
  aiAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(0, 180, 220, 0.14)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    borderWidth: 1,
  },
  userBubble: {
    backgroundColor: 'rgba(0, 229, 196, 0.16)',
    borderBottomRightRadius: 6,
    borderColor: 'rgba(0, 229, 196, 0.28)',
  },
  aiBubble: {
    backgroundColor: FuturisticTheme.colors.surface,
    borderBottomLeftRadius: 6,
    borderColor: FuturisticTheme.colors.border,
  },
  messageText: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: FuturisticTheme.colors.text,
  },
  aiText: {
    color: FuturisticTheme.colors.text,
  },
  timestamp: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    marginTop: 6,
  },
  userTimestamp: {
    color: FuturisticTheme.colors.muted,
    textAlign: 'right',
  },
  aiTimestamp: {
    color: FuturisticTheme.colors.muted,
  },
  quickPromptsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  quickPromptsTitle: {
    color: FuturisticTheme.colors.muted,
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  quickPrompts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickPrompt: {
    backgroundColor: FuturisticTheme.colors.surface,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: FuturisticTheme.colors.border,
  },
  quickPromptText: {
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 14,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    padding: 12,
  },
  input: {
    flex: 1,
    color: FuturisticTheme.colors.text,
    fontFamily: Fonts.sans,
    fontSize: 15,
    maxHeight: 100,
    minHeight: 42,
  },
  sendButtonWrap: {
    borderRadius: 999,
  },
  sendButtonWrapDisabled: {
    opacity: 0.75,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: FuturisticTheme.colors.tint,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00e5c4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.42,
    shadowRadius: 16,
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(0, 229, 196, 0.18)',
    shadowOpacity: 0,
  },
});

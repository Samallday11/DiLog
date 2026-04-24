import { api } from '@/lib/api';

export interface ChatReply {
  reply: string;
}

export interface InsightReply {
  insight: string;
}

export interface InsightPayload {
  glucose?: number;
  activity?: string;
  medication?: string;
}

export async function sendAiChat(message: string) {
  const response = await api.post<ChatReply>('/ai/chat', { message });
  return response.data;
}

export async function fetchAiInsight(payload: InsightPayload) {
  const response = await api.post<InsightReply>('/ai/insight', payload);
  return response.data;
}

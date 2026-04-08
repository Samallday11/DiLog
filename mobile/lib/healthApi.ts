import { api } from '@/lib/api';

export interface GlucoseEntry {
  id: number;
  value: number;
  status: string;
  timestamp: string;
}

export interface MealEntry {
  id: number;
  name: string;
  type: string;
  carbs: number;
  tags: string[];
  notes: string | null;
  loggedAt: string;
}

export async function fetchGlucoseEntries(userId: number) {
  const response = await api.get<GlucoseEntry[]>(`/users/${userId}/glucose`);
  return response.data;
}

export async function createGlucoseEntry(userId: number, value: number) {
  const response = await api.post<GlucoseEntry>(`/users/${userId}/glucose`, {
    value,
  });
  return response.data;
}

export async function fetchMeals(userId: number) {
  const response = await api.get<MealEntry[]>(`/users/${userId}/meals`);
  return response.data;
}

export async function createMeal(
  userId: number,
  payload: {
    name: string;
    type: string;
    carbs: number;
    tags: string[];
    notes: string;
  }
) {
  const response = await api.post<MealEntry>(`/users/${userId}/meals`, payload);
  return response.data;
}

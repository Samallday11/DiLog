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

export interface MedicationEntry {
  id: number;
  medicationName: string;
  dosage: string;
  timeTaken: string;
  route: string | null;
  notes: string | null;
  createdAt: string;
}

export interface ActivityEntry {
  id: number;
  category: string;
  activityName: string;
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

export async function fetchMedicationEntries(userId: number) {
  const response = await api.get<MedicationEntry[]>(`/users/${userId}/medications`);
  return response.data;
}

export async function createMedicationEntry(
  userId: number,
  payload: {
    medicationName: string;
    dosage: string;
    timeTaken: string;
    route?: string;
    notes?: string;
  }
) {
  const response = await api.post<MedicationEntry>(`/users/${userId}/medications`, payload);
  return response.data;
}

export async function fetchActivityEntries(userId: number) {
  const response = await api.get<ActivityEntry[]>(`/users/${userId}/activities`);
  return response.data;
}

export async function createActivityEntry(
  userId: number,
  payload: {
    category: string;
    activityName: string;
  }
) {
  const response = await api.post<ActivityEntry>(`/users/${userId}/activities`, payload);
  return response.data;
}

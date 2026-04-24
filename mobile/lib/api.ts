import Constants from 'expo-constants';
import axios from 'axios';
import { Platform } from 'react-native';

function getDefaultBaseUrl() {
  if (Platform.OS === 'web') {
    return 'https://dilog-production.up.railway.app/api';
  }

  const hostUri = Constants.expoConfig?.hostUri ?? '';
  const host = hostUri.split(':')[0];

  if (host) {
    return `http://${host}:8080/api`;
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080/api';
  }

  return 'https://dilog-production.up.railway.app/api';
}

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || getDefaultBaseUrl();

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
